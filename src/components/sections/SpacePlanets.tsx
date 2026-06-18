import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Three.js space scene: dense starfield + glowing planets
// Supports dark and light theme — palette swaps via uniforms + material blending.

export default function SpacePlanets() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const mouseRef    = useRef({ x: 0, y: 0 });
  const targetMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Skip heavy Three.js on mobile / touch devices
    if (window.matchMedia('(max-width: 767px), (pointer: coarse)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    const getIsLight = () => document.documentElement.dataset.theme === 'light';

    // ── Scene ──────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    // ── Camera ─────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(70, W() / H(), 0.1, 1000);
    camera.position.z = 35;

    // ── Renderer ───────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(W(), H());
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    // ── Ambient light ──────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x0a0820, 2.0));

    // ── Theme background colours ───────────────────────────────────
    const BG_DARK  = 0x03030a;
    // Medium violet — enough contrast for dark star specks to be visible
    const BG_LIGHT = 0xc4b5fd;

    function applySceneBg(isLight: boolean) {
      const bg = isLight ? BG_LIGHT : BG_DARK;
      scene.background = new THREE.Color(bg);
      scene.fog         = new THREE.FogExp2(bg, 0.0012);
    }
    applySceneBg(getIsLight());

    // ── Starfield ──────────────────────────────────────────────────
    const starCount = 3500;
    const starGeo   = new THREE.BufferGeometry();
    const starPos   = new Float32Array(starCount * 3);
    const starCol   = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const r     = 80 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      starPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
      const t = Math.random();
      starCol[i * 3]     = 0.7 + t * 0.3;
      starCol[i * 3 + 1] = 0.7 + t * 0.25;
      starCol[i * 3 + 2] = 0.85 + t * 0.15;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color',    new THREE.BufferAttribute(starCol, 3));

    // Two star materials — swap on theme change
    const darkStarMat = new THREE.PointsMaterial({
      size: 0.22, vertexColors: true, transparent: true,
      opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    // Light mode: dark indigo specks — contrast against medium violet bg (0xc4b5fd)
    // White stars on lavender are invisible; dark dots create a "twilight" star effect
    const lightStarMat = new THREE.PointsMaterial({
      size: 0.18, color: 0x3730a3, transparent: true,
      opacity: 0.42, blending: THREE.NormalBlending, depthWrite: false,
    });

    const stars = new THREE.Points(starGeo, getIsLight() ? lightStarMat : darkStarMat);
    scene.add(stars);

    // Bright foreground stars
    const fgCount = 120;
    const fgGeo   = new THREE.BufferGeometry();
    const fgPos   = new Float32Array(fgCount * 3);
    for (let i = 0; i < fgCount; i++) {
      fgPos[i * 3]     = (Math.random() - 0.5) * 100;
      fgPos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      fgPos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 20;
    }
    fgGeo.setAttribute('position', new THREE.BufferAttribute(fgPos, 3));

    const darkFgMat = new THREE.PointsMaterial({
      size: 0.5, color: 0xffffff, transparent: true,
      opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    // Larger foreground "stars" — deeper violet for more presence
    const lightFgMat = new THREE.PointsMaterial({
      size: 0.38, color: 0x4c1d95, transparent: true,
      opacity: 0.35, blending: THREE.NormalBlending, depthWrite: false,
    });

    const fgStars = new THREE.Points(fgGeo, getIsLight() ? lightFgMat : darkFgMat);
    scene.add(fgStars);

    // ── Planet shader ──────────────────────────────────────────────
    const planetVert = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal   = normalize(normalMatrix * normal);
        vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // u_isLight: 0.0 = dark (AdditiveBlending on black),
    //            1.0 = light (NormalBlending on lavender bg)
    const planetFrag = `
      uniform vec3  uColor;
      uniform float uTime;
      uniform float uGlow;
      uniform float uIsLight;

      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        /* Fresnel rim */
        float fresnel = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
        float rim     = pow(fresnel, 1.6);
        float surface = pow(fresnel, 4.0);

        /* Surface shimmer */
        float shimmer = sin(vPosition.x * 2.5 + uTime * 0.5) *
                        cos(vPosition.y * 2.0 + uTime * 0.35) * 0.5 + 0.5;

        /* Dark mode: dim fill + prominent additive rim glow */
        vec3 darkCol  = uColor * (0.3 + shimmer * 0.15);
        darkCol      += uColor * rim * uGlow * 1.4;
        darkCol      += uColor * surface * 0.5;

        /* Light mode: richer fill + strong rim, visible sphere body */
        vec3 lightCol  = uColor * (0.55 + shimmer * 0.15);
        lightCol      += uColor * rim * 2.2;
        lightCol      += uColor * surface * 0.85;

        vec3 col = mix(darkCol, lightCol, uIsLight);

        float pulse = sin(uTime * 0.9) * 0.06 + 0.94;

        /* Dark: nearly empty center (glowing rim only)
           Light: visible planet body with soft edge */
        float darkAlpha  = rim * 0.95 + surface * 0.30 + 0.04;
        float lightAlpha = rim * 0.92 + surface * 0.80 + 0.14;
        float alpha = clamp(mix(darkAlpha, lightAlpha, uIsLight), 0.0, 1.0);

        gl_FragColor = vec4(col * pulse, alpha);
      }
    `;

    interface Planet {
      mesh:       THREE.Mesh;
      light:      THREE.PointLight;
      orbit:      { speed: number; radius: number; angle: number; yOffset: number; zBase: number };
      basePos:    THREE.Vector3;
      colorDark:  number;
      colorLight: number;
    }

    // Planets spread across 4 quadrants.
    // colorDark  = vibrant, works with additive blending on black
    // colorLight = deeper/saturated, works with normal blending on lavender
    const planetDefs = [
      // Top-left
      { colorDark: 0x7c5be8, colorLight: 0x5535c8, radius: 5.0, glow: 2.4,
        orbit: { speed: 0.16, radius: 20, angle: Math.PI,         yOffset:  9, zBase: -8  } },
      // Top-right
      { colorDark: 0x3070e0, colorLight: 0x1848c8, radius: 3.4, glow: 2.8,
        orbit: { speed: 0.24, radius: 18, angle: 0.1,             yOffset:  7, zBase: -14 } },
      // Bottom-left
      { colorDark: 0x18a898, colorLight: 0x0a7a6a, radius: 2.4, glow: 3.0,
        orbit: { speed: 0.32, radius: 22, angle: Math.PI + 0.4,   yOffset: -9, zBase: -10 } },
      // Bottom-right
      { colorDark: 0xaa44e0, colorLight: 0x8020c8, radius: 4.0, glow: 2.2,
        orbit: { speed: 0.13, radius: 17, angle: -0.3,             yOffset: -7, zBase: -18 } },
    ];

    const isLightInit = getIsLight();

    const planets: Planet[] = planetDefs.map(def => {
      const geo = new THREE.SphereGeometry(def.radius, 48, 48);
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uColor:   { value: new THREE.Color(isLightInit ? def.colorLight : def.colorDark) },
          uTime:    { value: 0 },
          uGlow:    { value: def.glow },
          uIsLight: { value: isLightInit ? 1.0 : 0.0 },
        },
        vertexShader:   planetVert,
        fragmentShader: planetFrag,
        transparent: true,
        blending:    isLightInit ? THREE.NormalBlending : THREE.AdditiveBlending,
        depthWrite:  false,
        side: THREE.FrontSide,
      });

      const mesh = new THREE.Mesh(geo, mat);
      const basePos = new THREE.Vector3(
        Math.cos(def.orbit.angle) * def.orbit.radius,
        def.orbit.yOffset,
        def.orbit.zBase
      );
      mesh.position.copy(basePos);

      const light = new THREE.PointLight(new THREE.Color(def.colorDark), 4.0, 80);
      light.position.copy(basePos);

      scene.add(mesh);
      scene.add(light);

      return { mesh, light, orbit: { ...def.orbit }, basePos,
               colorDark: def.colorDark, colorLight: def.colorLight };
    });

    // ── Theme observer ─────────────────────────────────────────────
    function applyTheme() {
      const isLight = getIsLight();

      // Scene background + fog
      applySceneBg(isLight);

      // Star materials
      stars.material   = isLight ? lightStarMat : darkStarMat;
      fgStars.material = isLight ? lightFgMat   : darkFgMat;

      // Planet uniforms + blending
      planets.forEach(p => {
        const mat = p.mesh.material as THREE.ShaderMaterial;
        mat.uniforms.uColor.value.set(isLight ? p.colorLight : p.colorDark);
        mat.uniforms.uIsLight.value = isLight ? 1.0 : 0.0;
        mat.blending    = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
        mat.needsUpdate = true; // required when blending changes
      });

      // Tone mapping
      renderer.toneMappingExposure = isLight ? 1.1 : 1.4;
    }

    const themeObs = new MutationObserver(applyTheme);
    themeObs.observe(document.documentElement, {
      attributes: true, attributeFilter: ['data-theme'],
    });

    // ── Mouse handler ──────────────────────────────────────────────
    function onMouse(e: MouseEvent) {
      targetMouse.current = {
        x:  (e.clientX / window.innerWidth)  * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    }
    window.addEventListener('mousemove', onMouse, { passive: true });

    // ── Resize ─────────────────────────────────────────────────────
    function onResize() {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H());
    }
    window.addEventListener('resize', onResize, { passive: true });

    // ── Animation loop ─────────────────────────────────────────────
    let raf = 0;
    let isVisible = false; // controlled by IntersectionObserver
    const t0 = performance.now();

    function animate() {
      raf = requestAnimationFrame(animate);
      const t = (performance.now() - t0) / 1000;

      // Smooth mouse
      mouseRef.current.x += (targetMouse.current.x - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (targetMouse.current.y - mouseRef.current.y) * 0.04;

      // Starfield slow drift
      stars.rotation.y = t * 0.012;
      stars.rotation.x = t * 0.006;

      // Planet orbits + mouse parallax
      planets.forEach((p, i) => {
        p.orbit.angle += p.orbit.speed * 0.008;

        const ox = Math.cos(p.orbit.angle) * p.orbit.radius;
        const oz = p.orbit.zBase + Math.sin(p.orbit.angle) * p.orbit.radius * 0.15;

        const depth = 1.0 + i * 0.6;
        const px = ox + mouseRef.current.x * depth * 1.8;
        const py = p.orbit.yOffset + mouseRef.current.y * depth * 1.2;

        p.mesh.position.set(px, py, oz);
        p.light.position.copy(p.mesh.position);
        p.light.intensity = 2.5 + Math.sin(t * 1.5 + i) * 0.6;

        (p.mesh.material as THREE.ShaderMaterial).uniforms.uTime.value = t + i * 1.3;
      });

      // Camera gentle parallax
      camera.position.x += (mouseRef.current.x * 2.5 - camera.position.x) * 0.03;
      camera.position.y += (mouseRef.current.y * 2.0 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    // ── IntersectionObserver — pause RAF when off-screen ──────────
    const visObs = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !raf) {
          animate(); // resume
        } else if (!isVisible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;   // pause
        }
      },
      { threshold: 0.01 } // 1% visible = active
    );
    visObs.observe(canvas);
    // Start only if already in view (client:visible may already check this,
    // but be explicit so IntersectionObserver is the sole gatekeeper)
    if (document.getElementById('project-cta')?.checkVisibility?.() !== false) {
      animate();
    }

    // ── Cleanup ────────────────────────────────────────────────────
    return () => {
      visObs.disconnect();
      themeObs.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize',    onResize);
      planets.forEach(p => {
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
      });
      starGeo.dispose();  darkStarMat.dispose();  lightStarMat.dispose();
      fgGeo.dispose();    darkFgMat.dispose();     lightFgMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'absolute',
        inset:         0,
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',
        display:       'block',
      }}
      aria-hidden="true"
    />
  );
}
