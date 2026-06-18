import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Variant 5 — Three.js animated orbs + particles
// Renders with transparent background so FluidNoiseHero shows through as base layer
// Performance fix: mouse position tracked via ref, NOT state — avoids full scene rebuild on every move

interface Orb {
  mesh: THREE.Mesh;
  light: THREE.PointLight;
  velocity: THREE.Vector3;
}

export default function HeroOrbs() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const mouseRef    = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Scene ──────────────────────────────────────────────
    const scene = new THREE.Scene();
    // No scene.background — transparent so WebGL fluid noise shows through
    scene.fog = new THREE.FogExp2(0x050408, 0.0018);

    // ── Camera ─────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    // ── Renderer ───────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,        // transparent canvas — lets HeroCanvas show through
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // fully transparent clear
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // ── Orbs ───────────────────────────────────────────────
    const orbColors = [
      new THREE.Color(0x5b52d4),  // muted indigo
      new THREE.Color(0x7b52c4),  // violet
      new THREE.Color(0xa855a0),  // purple-pink
      new THREE.Color(0x3b5bbf),  // deep blue
      new THREE.Color(0x1e8fb0),  // cyan-dark
    ];

    const orbs: Orb[] = [];
    const orbCount = 7;

    for (let i = 0; i < orbCount; i++) {
      const radius = Math.random() * 2 + 0.8;
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const color = orbColors[i % orbColors.length];

      const material = new THREE.ShaderMaterial({
        uniforms: {
          time:          { value: 0 },
          color:         { value: color },
          glowIntensity: { value: 1.4 },
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 color;
          uniform float glowIntensity;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 glow = color * intensity * glowIntensity;
            float pulse = sin(time * 1.8) * 0.15 + 0.85;
            gl_FragColor = vec4(glow * pulse, intensity * 0.9);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      const angle = (i / orbCount) * Math.PI * 2;
      const dist  = 14 + Math.random() * 10;
      mesh.position.set(
        Math.cos(angle) * dist,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 18 - 8
      );

      const light = new THREE.PointLight(color, 1.5, 45);
      light.position.copy(mesh.position);

      scene.add(mesh);
      scene.add(light);

      orbs.push({
        mesh,
        light,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.018,
          (Math.random() - 0.5) * 0.018,
          (Math.random() - 0.5) * 0.012
        ),
      });
    }

    // ── Particles ──────────────────────────────────────────
    const particleCount = 800;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pCol = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 90;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 90;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 45;
      const c = orbColors[Math.floor(Math.random() * orbColors.length)];
      pCol[i * 3]     = c.r;
      pCol[i * 3 + 1] = c.g;
      pCol[i * 3 + 2] = c.b;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Mouse handler ──────────────────────────────────────
    function onMouse(e: MouseEvent) {
      mouseRef.current = {
        x:  (e.clientX / window.innerWidth)  * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    }
    window.addEventListener('mousemove', onMouse, { passive: true });

    // ── Resize handler ─────────────────────────────────────
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize, { passive: true });

    // ── Animation ──────────────────────────────────────────
    let raf = 0;
    const t0 = performance.now();

    function animate() {
      raf = requestAnimationFrame(animate);
      const t = (performance.now() - t0) / 1000;

      orbs.forEach((orb, i) => {
        orb.mesh.position.add(orb.velocity);
        if (Math.abs(orb.mesh.position.x) > 28) orb.velocity.x *= -1;
        if (Math.abs(orb.mesh.position.y) > 18) orb.velocity.y *= -1;
        if (orb.mesh.position.z > 8 || orb.mesh.position.z < -28) orb.velocity.z *= -1;

        (orb.mesh.material as THREE.ShaderMaterial).uniforms.time.value = t + i;
        orb.light.position.copy(orb.mesh.position);
        orb.light.intensity = 1.5 + Math.sin(t * 2 + i) * 0.4;
      });

      particles.rotation.y = t * 0.04;
      particles.rotation.x = t * 0.025;

      // Smooth camera follow mouse
      camera.position.x += (mouseRef.current.x * 4 - camera.position.x) * 0.04;
      camera.position.y += (mouseRef.current.y * 4 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

    // ── Cleanup ────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize',    onResize);
      orbs.forEach(orb => {
        orb.mesh.geometry.dispose();
        (orb.mesh.material as THREE.Material).dispose();
      });
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, []); // empty deps — mouse tracked via ref, no rerenders

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        display: 'block',
        background: 'transparent',
      }}
      aria-hidden="true"
    />
  );
}
