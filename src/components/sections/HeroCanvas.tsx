import { useEffect, useRef, useState } from 'react';

// FluidNoiseHero: OpenSimplex noise + domain warping
// Supports dark AND light theme via colour uniforms — no shader recompile needed.

const VERT = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAG = `
  precision highp float;
  uniform vec2  u_resolution;
  uniform float u_time;
  uniform vec2  u_mouse;

  /* Theme-switchable palette */
  uniform vec3  u_cBase;
  uniform vec3  u_cA;
  uniform vec3  u_cB;
  uniform vec3  u_cC;
  uniform vec3  u_spot;      /* spotlight colour add */
  uniform float u_exposure;
  uniform float u_vigStr;    /* vignette strength */

  /* OpenSimplex-style noise (Ashima Arts) */
  vec3 mod289_3(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289_2(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289_3(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1  = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy  -= i1;
    i = mod289_2(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m*m*m;
    vec3 x  = 2.0 * fract(p * C.www) - 1.0;
    vec3 h  = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x   + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float value = 0.0, amplitude = 0.5, frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value     += amplitude * snoise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p  = uv * 2.0 - 1.0;
    p.x    *= u_resolution.x / u_resolution.y;

    /* Reduced from *2.0 → *0.45 so mouse barely nudges the fluid */
    vec2 mi = (u_mouse - vec2(0.5)) * 0.45;
    float t = u_time * 0.15;

    /* Domain warping — two layers, mouse shifts the warp */
    vec2 q = vec2(
      fbm(p + vec2(t * 0.3,  t * 0.2) + mi * 0.3),
      fbm(p + vec2(t * 0.4, -t * 0.3) - mi * 0.2)
    );
    vec2 r = vec2(
      fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.15 + mi * 0.4),
      fbm(p + 4.0 * q + vec2(8.3, 2.8) - t * 0.12 - mi * 0.3)
    );
    float f = fbm(p + 3.0 * r + mi * 0.5);

    /* Colour blending */
    vec3 color = mix(u_cBase, u_cA, smoothstep(-0.2, 0.8, f));
    color       = mix(color,  u_cB, smoothstep( 0.0, 1.0, q.x));
    color       = mix(color,  u_cC, smoothstep( 0.0, 1.0, r.y));

    /* Mouse — barely-visible glow, no hard ring */
    float mDist    = length(uv - u_mouse);
    float spotlight = exp(-mDist * mDist * 1.8) * 0.22;
    color          += u_spot * spotlight;

    /* Vignette */
    float vig = 1.0 - length(uv - 0.5) * u_vigStr;
    color    *= vig;

    /* Exposure boost */
    color *= u_exposure;

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;

// ─── Theme palettes ──────────────────────────────────────────────────────────

interface Palette {
  cBase:      [number, number, number];
  cA:         [number, number, number];
  cB:         [number, number, number];
  cC:         [number, number, number];
  spot:       [number, number, number];
  exposure:   number;
  vigStr:     number;
  clearColor: [number, number, number, number];
  canvasBg:   string;
}

const DARK_PALETTE: Palette = {
  // Deep black with richer, more vivid indigo/violet fluid swirls
  cBase:      [0.010, 0.008, 0.020],
  cA:         [0.130, 0.080, 0.240],  // vivid indigo bloom
  cB:         [0.190, 0.125, 0.320],  // bright violet streak
  cC:         [0.075, 0.048, 0.190],  // deep purple midtone
  // Prominent indigo spotlight under cursor
  spot:       [0.100, 0.055, 0.300],
  exposure:   1.55,
  vigStr:     0.65,
  clearColor: [0.010, 0.008, 0.020, 1.0],
  canvasBg:   '#020206',
};

const LIGHT_PALETTE: Palette = {
  // Airy lavender with clearly visible purple-indigo fluid swirls
  cBase:      [0.965, 0.960, 1.000],  // bright lavender base
  cA:         [0.880, 0.848, 0.985],  // medium lavender bloom — visibly different from base
  cB:         [0.808, 0.758, 0.972],  // deep lavender-violet streak — the most visible band
  cC:         [0.930, 0.908, 0.998],  // soft midtone
  // More prominent indigo cursor halo
  spot:       [0.055, 0.025, 0.220],
  exposure:   1.06,
  vigStr:     0.42,
  clearColor: [0.965, 0.960, 1.000, 1.0],
  canvasBg:   '#f6f4ff',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function HeroCanvas() {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  // Smooth mouse: targetMouseRef is updated immediately on mousemove,
  // mouseRef is lerped toward it each frame — prevents the sudden warp
  // jump that occurred when u_mouse jumped from (0.5, 0.5) to the real
  // cursor position on the first mousemove event.
  const mouseRef       = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  // Start invisible; reveal smoothly after WebGL renders its first frame so
  // the user never sees the canvas "pop" from blank/static to animated.
  const [canvasVisible, setCanvasVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl')
    ) as WebGLRenderingContext | null;
    if (!gl) return;

    // ── Shader compilation ───────────────────────────────────
    function mkShader(type: number, src: string): WebGLShader | null {
      const s = gl!.createShader(type);
      if (!s) return null;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error('Shader error:', gl!.getShaderInfoLog(s));
        gl!.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = mkShader(gl.VERTEX_SHADER,   VERT);
    const fs = mkShader(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Link error:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // ── Vertex buffer ────────────────────────────────────────
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // ── Uniform locations ────────────────────────────────────
    const uRes   = gl.getUniformLocation(prog, 'u_resolution');
    const uTime  = gl.getUniformLocation(prog, 'u_time');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uCBase = gl.getUniformLocation(prog, 'u_cBase');
    const uCA    = gl.getUniformLocation(prog, 'u_cA');
    const uCB    = gl.getUniformLocation(prog, 'u_cB');
    const uCC    = gl.getUniformLocation(prog, 'u_cC');
    const uSpot  = gl.getUniformLocation(prog, 'u_spot');
    const uExp   = gl.getUniformLocation(prog, 'u_exposure');
    const uVig   = gl.getUniformLocation(prog, 'u_vigStr');

    // ── Palette application ──────────────────────────────────
    let currentPalette: Palette = DARK_PALETTE;

    function applyPalette(p: Palette) {
      currentPalette = p;
      gl!.uniform3fv(uCBase, p.cBase);
      gl!.uniform3fv(uCA,    p.cA);
      gl!.uniform3fv(uCB,    p.cB);
      gl!.uniform3fv(uCC,    p.cC);
      gl!.uniform3fv(uSpot,  p.spot);
      gl!.uniform1f(uExp,    p.exposure);
      gl!.uniform1f(uVig,    p.vigStr);
      canvas!.style.background = p.canvasBg;
    }

    // Set initial palette from current theme
    const initTheme = document.documentElement.dataset.theme ?? 'dark';
    applyPalette(initTheme === 'light' ? LIGHT_PALETTE : DARK_PALETTE);

    // Watch for theme toggle
    const themeObs = new MutationObserver(() => {
      const theme = document.documentElement.dataset.theme ?? 'dark';
      applyPalette(theme === 'light' ? LIGHT_PALETTE : DARK_PALETTE);
    });
    themeObs.observe(document.documentElement, {
      attributes:      true,
      attributeFilter: ['data-theme'],
    });

    // ── Resize ───────────────────────────────────────────────
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Use CSS layout size (offsetWidth/Height), not window.innerWidth which
      // includes scrollbars and can exceed the CSS viewport on some browsers.
      const w = canvas!.offsetWidth  || window.innerWidth;
      const h = canvas!.offsetHeight || window.innerHeight;
      canvas!.width  = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }

    // ── Mouse ────────────────────────────────────────────────
    function onMouse(e: MouseEvent) {
      // Only update the TARGET — the actual uniform is lerped in render()
      // so the shader glides smoothly instead of jumping on first move.
      targetMouseRef.current = {
        x:  e.clientX / window.innerWidth,
        y:  1.0 - e.clientY / window.innerHeight,
      };
    }

    // ── Render loop ──────────────────────────────────────────
    const t0 = performance.now();
    let raf = 0;
    // Guards against a double-start: Safari can fire IntersectionObserver's
    // initial callback synchronously inside .observe(), which would otherwise
    // race with the explicit render() call below and spin up two competing
    // rAF loops (visible as the shader appearing to restart on load).
    let started = false;

    function render() {
      const cc = currentPalette.clearColor;
      gl!.clearColor(cc[0], cc[1], cc[2], cc[3]);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      const time = (performance.now() - t0) / 1000;
      // Lerp mouse toward target — factor 0.06 gives a smooth, buttery follow
      // with ~1 s settling time, eliminating the visible domain-warp jump that
      // happened when the cursor snapped from (0.5, 0.5) to its real position.
      const LERP = 0.06;
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * LERP;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * LERP;
      gl!.uniform2f(uRes,   canvas!.width, canvas!.height);
      gl!.uniform1f(uTime,  time);
      gl!.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    }

    resize();
    window.addEventListener('resize',    resize,  { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });

    function startRender() {
      if (started) return;
      started = true;
      render();
    }
    function stopRender() {
      cancelAnimationFrame(raf);
      raf = 0;
      started = false;
    }

    // ── IntersectionObserver — pause shader when hero off-screen ──
    // Hero is above-fold so it starts rendered, but pauses when user
    // scrolls down past it — saves ~16ms/frame of GPU work while idle.
    const visObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startRender(); // resume
        else stopRender(); // pause
      },
      { threshold: 0.01 }
    );
    visObs.observe(canvas);
    startRender(); // start immediately (hero is above fold) — no-op if the observer already did

    // After WebGL has painted its first frame, fade the canvas in so there's
    // no sudden jump from the section's static background colour to the shader.
    const fadeTimer = window.setTimeout(() => setCanvasVisible(true), 120);

    return () => {
      window.clearTimeout(fadeTimer);
      visObs.disconnect();
      themeObs.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('resize',    resize);
      window.removeEventListener('mousemove', onMouse);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
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
        zIndex:        0,
        display:       'block',
        background:    '#020206', // matches DARK_PALETTE.canvasBg; overridden by applyPalette
        // Fade in after the first WebGL frame — prevents the static-to-animated jump.
        opacity:    canvasVisible ? 1 : 0,
        transition: canvasVisible ? 'opacity 0.6s ease' : 'none',
      }}
      aria-hidden="true"
    />
  );
}
