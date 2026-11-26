"use client";

import Image, { getImageProps } from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export interface MorphGalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface MorphGalleryProps {
  images: MorphGalleryImage[];
  /** Autoplay delay in milliseconds. */
  interval?: number;
  className?: string;
}

const TRANSITION_MS = 1400;
const SWIPE_THRESHOLD_PX = 40;
/** Width requested from the Next.js image optimizer for WebGL textures. */
const TEXTURE_WIDTH = 1920;

/* ------------------------------------------------------------------ */
/* Media helpers                                                       */
/* ------------------------------------------------------------------ */

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function useDocumentHidden() {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.hidden,
    () => false,
  );
}

/* ------------------------------------------------------------------ */
/* WebGL noise-dissolve renderer                                       */
/* ------------------------------------------------------------------ */

const VERTEX_SHADER = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 vUv;
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform float uProgress;
uniform float uTime;
uniform float uCanvasAspect;
uniform float uFromAspect;
uniform float uToAspect;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + 17.1;
    amplitude *= 0.5;
  }
  return value;
}

// Object-fit: contain. Returns premultiplied color, transparent outside the image.
vec4 sampleContain(sampler2D tex, vec2 uv, float imageAspect) {
  vec2 scale = imageAspect > uCanvasAspect
    ? vec2(1.0, uCanvasAspect / imageAspect)
    : vec2(imageAspect / uCanvasAspect, 1.0);
  vec2 st = (uv - 0.5) / scale + 0.5;
  float inside = step(0.0, st.x) * step(st.x, 1.0) * step(0.0, st.y) * step(st.y, 1.0);
  vec4 color = texture2D(tex, clamp(st, 0.0, 1.0));
  return vec4(color.rgb * inside, inside);
}

void main() {
  vec4 fromColor = sampleContain(uFrom, vUv, uFromAspect);
  vec4 toColor = sampleContain(uTo, vUv, uToAspect);

  // Domain-warped fbm that drifts over time: the shreds move while they burn.
  vec2 p = vUv * vec2(uCanvasAspect, 1.0) * 3.0 + vec2(uTime * 0.18, -uTime * 0.12);
  float n = fbm(p + 1.6 * fbm(p + uTime * 0.25));
  n = clamp((n - 0.2) / 0.6, 0.0, 1.0);

  float width = 0.12;
  float d = mix(-width, 1.0 + width, uProgress) - n;
  float reveal = smoothstep(-width * 0.5, width * 0.5, d);

  vec4 color = mix(fromColor, toColor, reveal);

  // Ember glow along the burning front.
  float coverage = max(fromColor.a, toColor.a);
  float burn = exp(-pow(d / width * 2.2, 2.0)) * sin(uProgress * 3.14159) * coverage;
  color.rgb += vec3(1.0, 0.55, 0.15) * burn * 1.4;
  color.a = max(color.a, clamp(burn, 0.0, 1.0));

  gl_FragColor = color;
}
`;

interface MorphRenderer {
  goTo: (index: number) => void;
  destroy: () => void;
}

interface Slide {
  texture: WebGLTexture | null;
  aspect: number;
  ready: boolean;
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Creates the dissolve renderer on `canvas`. Returns null when WebGL is
 * unavailable, so the caller keeps the CSS cross-fade fallback.
 */
function createMorphRenderer(
  canvas: HTMLCanvasElement,
  urls: string[],
  initialIndex: number,
  onReady: () => void,
  onFailure: () => void,
): MorphRenderer | null {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: true,
  });
  if (!gl || gl.isContextLost()) return null;

  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!vertexShader || !fragmentShader || !program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const uProgress = uniform("uProgress");
  const uTime = uniform("uTime");
  const uCanvasAspect = uniform("uCanvasAspect");
  const uFromAspect = uniform("uFromAspect");
  const uToAspect = uniform("uToAspect");
  gl.uniform1i(uniform("uFrom"), 0);
  gl.uniform1i(uniform("uTo"), 1);

  const slides: Slide[] = urls.map(() => ({ texture: null, aspect: 1, ready: false }));
  let shown = initialIndex;
  let from = initialIndex;
  let to = initialIndex;
  let pending: number | null = null;
  let ready = false;
  let disposed = false;
  let raf = 0;
  let start = 0;
  let lastProgress = 1;
  let lastTime = 0;

  function draw(progress: number, time: number) {
    lastProgress = progress;
    lastTime = time;
    const a = slides[from];
    const b = slides[to].ready ? slides[to] : a;
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.clearColor(0, 0, 0, 0);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, a.texture);
    gl!.activeTexture(gl!.TEXTURE1);
    gl!.bindTexture(gl!.TEXTURE_2D, b.texture);
    gl!.uniform1f(uProgress, progress);
    gl!.uniform1f(uTime, time);
    gl!.uniform1f(uCanvasAspect, canvas.width / Math.max(canvas.height, 1));
    gl!.uniform1f(uFromAspect, a.aspect);
    gl!.uniform1f(uToAspect, b.aspect);
    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
  }

  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

  function tick(now: number) {
    const elapsed = now - start;
    const t = Math.min(1, elapsed / TRANSITION_MS);
    draw(ease(t), elapsed / 1000);
    if (t < 1) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
      shown = to;
      from = to;
    }
  }

  function begin() {
    start = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function tryBecomeReady() {
    if (ready || !slides[to].ready) return;
    ready = true;
    shown = to;
    from = to;
    draw(1, 0);
    onReady();
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width === width && canvas.height === height) return;
    canvas.width = width;
    canvas.height = height;
    if (ready && !raf) draw(lastProgress, lastTime);
  }

  function fail() {
    if (disposed) return;
    cancelAnimationFrame(raf);
    raf = 0;
    disposed = true;
    onFailure();
  }

  const handleContextLost = () => fail();
  canvas.addEventListener("webglcontextlost", handleContextLost);

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  const loaders = urls.map((url, i) => {
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => {
      if (disposed || gl.isContextLost()) return;
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      slides[i] = {
        texture,
        aspect: img.naturalWidth / Math.max(img.naturalHeight, 1),
        ready: true,
      };
      tryBecomeReady();
      if (pending === i) {
        pending = null;
        begin();
      }
    };
    // A missing texture would freeze the canvas on a stale photo: use the fallback.
    img.onerror = fail;
    img.src = url;
    return img;
  });

  return {
    goTo(index) {
      if (disposed || index === to) return;
      if (!ready) {
        shown = from = to = index;
        tryBecomeReady();
        return;
      }
      // A new target during a transition: continue from the previous target.
      from = raf ? to : shown;
      to = index;
      cancelAnimationFrame(raf);
      raf = 0;
      if (slides[to].ready) {
        begin();
      } else {
        pending = to;
        draw(0, 0);
      }
    },
    destroy() {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      for (const img of loaders) {
        img.onload = null;
        img.onerror = null;
      }
      // Do not call WEBGL_lose_context: React Strict Mode mounts the same canvas again.
      if (!gl.isContextLost()) {
        for (const slide of slides) gl.deleteTexture(slide.texture);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
      }
    },
  };
}

/** Optimized (resized, modern format) URL from the Next.js image loader. */
function textureUrl(src: string) {
  return getImageProps({ src, alt: "", width: TEXTURE_WIDTH / 2, height: TEXTURE_WIDTH / 2 })
    .props.src;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function MorphGallery({ images, interval = 6000, className }: MorphGalleryProps) {
  const count = images.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [glActive, setGlActive] = useState(false);
  const [glFailed, setGlFailed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const documentHidden = useDocumentHidden();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<MorphRenderer | null>(null);
  const indexRef = useRef(index);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const srcKey = images.map((image) => image.src).join("\n");
  const useWebGl = !reducedMotion && !glFailed && count > 1;

  useEffect(() => {
    indexRef.current = index;
    rendererRef.current?.goTo(index);
  }, [index]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!useWebGl || !canvas) return;
    const renderer = createMorphRenderer(
      canvas,
      srcKey.split("\n").map(textureUrl),
      indexRef.current,
      () => setGlActive(true),
      () => {
        setGlActive(false);
        setGlFailed(true);
      },
    );
    if (!renderer) {
      setGlFailed(true);
      return;
    }
    rendererRef.current = renderer;
    return () => {
      renderer.destroy();
      rendererRef.current = null;
      setGlActive(false);
    };
  }, [useWebGl, srcKey]);

  const go = useCallback(
    (step: number) => setIndex((current) => (current + step + count) % count),
    [count],
  );

  const autoplay = count > 1 && !paused && !reducedMotion;
  const autoplayRunning = autoplay && !hovered && !focused && !documentHidden;

  useEffect(() => {
    if (!autoplayRunning) return;
    const id = window.setTimeout(() => go(1), interval);
    return () => window.clearTimeout(id);
  }, [autoplayRunning, index, interval, go]);

  if (count === 0) return null;

  const current = images[index];

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const startPoint = pointerStart.current;
    pointerStart.current = null;
    if (!startPoint) return;
    const dx = event.clientX - startPoint.x;
    const dy = event.clientY - startPoint.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Фотогалерея"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      className={cn(
        "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 dark:focus-visible:ring-offset-black",
        className,
      )}
    >
      <div
        className="relative aspect-[4/3] w-full touch-pan-y overflow-hidden bg-body-color/5 select-none md:aspect-[16/10] dark:bg-white/5"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerStart.current = null;
        }}
      >
        {/* Image layer: SSR, alt text, and the fallback when WebGL is off. */}
        <div className={cn("absolute inset-0", glActive && "opacity-0")}>
          {images.map((image, i) => (
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              fill
              draggable={false}
              sizes="(max-width: 768px) 100vw, 1100px"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              aria-hidden={i !== index}
              className={cn(
                "object-contain",
                !reducedMotion && "transition-opacity duration-700",
                i === index ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </div>

        {useWebGl && (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={cn("absolute inset-0 h-full w-full", !glActive && "opacity-0")}
          />
        )}

        {/* Caption and counter. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/30 to-transparent px-5 pt-16 pb-5 md:px-8 md:pb-7">
          <div aria-live={autoplayRunning ? "off" : "polite"} aria-atomic="true">
            <p className="text-sm font-medium tracking-widest text-white/70">
              {index + 1} / {count}
            </p>
            {current.caption && (
              <p className="mt-1 max-w-3xl text-base font-semibold text-white md:text-xl">
                {current.caption}
              </p>
            )}
          </div>
        </div>

        {count > 1 && (
          <div className="absolute top-4 right-4 flex gap-2">
            {!reducedMotion ? (
              <ControlButton
                label={paused ? "Запустити автопрогравання" : "Зупинити автопрогравання"}
                onClick={() => setPaused((value) => !value)}
              >
                {paused ? (
                  <path d="M8 5v14l11-7z" />
                ) : (
                  <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
                )}
              </ControlButton>
            ) : null}
            <ControlButton label="Попереднє фото" onClick={() => go(-1)}>
              <path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4L10.8 12z" />
            </ControlButton>
            <ControlButton label="Наступне фото" onClick={() => go(1)}>
              <path d="M8.6 16.6 10 18l6-6-6-6-1.4 1.4 4.6 4.6z" />
            </ControlButton>
          </div>
        )}
      </div>

      {count > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Фото ${i + 1}: ${image.caption ?? image.alt}`}
              aria-current={i === index ? "true" : undefined}
              className={cn(
                "relative h-14 w-20 shrink-0 overflow-hidden transition md:h-16 md:w-24",
                "ring-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-primary dark:ring-offset-black",
                i === index ? "opacity-100 ring-2 ring-primary" : "opacity-60 hover:opacity-100",
              )}
            >
              <Image
                src={image.src}
                alt=""
                width={96}
                height={64}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      onPointerDown={(event) => event.stopPropagation()}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        {children}
      </svg>
    </button>
  );
}
