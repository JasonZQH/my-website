"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const CONFIG = {
  maxDpr: 1.5,
  simScale: 0.4,
  maxVelocity: 0.38,
  positionFollow: 0.16,
  velocityFollow: 0.17,
  ambientFlow: 1,
  cursorForce: 1.35,
  cursorSwirl: 0.52,
  flowWarp: 0.64,
  lensWarp: 0.041,
  glowStrength: 1.08,
  grainStrength: 0.075,
};

type RenderTarget = {
  texture: WebGLTexture;
  framebuffer: WebGLFramebuffer;
  width: number;
  height: number;
};

type Uniforms = Record<string, WebGLUniformLocation | null>;

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = aPosition * .5 + .5;
    gl_Position = vec4(aPosition, 0., 1.);
  }
`;

// The first pass carries a small velocity field forward in time. Pointer force
// is injected into that same field, so the wake and surface remain coupled.
const SIMULATION_SHADER = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPrevious;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec2 uPointerVelocity;
  uniform float uActive;
  uniform float uTime;
  uniform float uDelta;
  uniform float uMaxVelocity;
  uniform float uAmbientFlow;
  uniform float uCursorForce;
  uniform float uCursorSwirl;

  vec2 decodeVelocity(vec4 value) { return (value.rg * 2.0 - 1.0) * uMaxVelocity; }
  vec2 encodeVelocity(vec2 velocity) { return velocity / uMaxVelocity * .5 + .5; }

  vec2 ambientVelocity(vec2 uv, float time) {
    vec2 p = uv - .5;
    float a = sin(p.y * 7. + time * .30) + .55 * sin((p.x + p.y) * 10. - time * .21);
    float b = cos(p.x * 6. - time * .24) + .48 * cos((p.x - p.y) * 9. + time * .17);
    vec2 velocity = vec2(a, b);
    velocity += vec2(-p.y, p.x) * (.28 + .18 * sin(time * .12));
    return velocity * .032 * uAmbientFlow;
  }

  float gaussian(float value, float scale) { return exp(-value * value * scale); }

  void main() {
    vec2 uv = vUv;
    vec2 texel = 1. / uResolution;
    float aspect = uResolution.x / uResolution.y;

    vec2 priorCenter = decodeVelocity(texture2D(uPrevious, uv));
    vec2 backUv = clamp(uv - priorCenter * uDelta * .72, texel, 1. - texel);
    vec4 advected = texture2D(uPrevious, backUv);
    vec2 velocity = decodeVelocity(advected);
    float energy = advected.b;

    vec2 left = decodeVelocity(texture2D(uPrevious, backUv - vec2(texel.x, 0.)));
    vec2 right = decodeVelocity(texture2D(uPrevious, backUv + vec2(texel.x, 0.)));
    vec2 down = decodeVelocity(texture2D(uPrevious, backUv - vec2(0., texel.y)));
    vec2 up = decodeVelocity(texture2D(uPrevious, backUv + vec2(0., texel.y)));
    velocity = mix(velocity, (left + right + down + up) * .25, .105);

    vec2 ambient = ambientVelocity(uv, uTime);
    velocity += (ambient - velocity) * min(1., uDelta * .90);

    vec2 delta = uv - uMouse;
    delta.x *= aspect;
    float speed = clamp(length(uPointerVelocity) / 1.25, 0., 1.);
    vec2 direction = normalize(uPointerVelocity + ambientVelocity(uMouse, uTime) * .75 + vec2(.00001, 0.));
    vec2 perpendicular = vec2(-direction.y, direction.x);
    vec2 local = vec2(dot(delta, direction), dot(delta, perpendicular));

    float roundBrush = gaussian(length(delta), 58.);
    float tail = gaussian(local.y, 360.) * gaussian(local.x + speed * .070, 72.) * smoothstep(.26, -.24, local.x);
    float brush = max(roundBrush * .70, tail * speed) * uActive;

    vec2 radial = normalize(delta + vec2(.00001));
    vec2 tangent = vec2(-radial.y, radial.x);
    float side = dot(tangent, direction);
    velocity += uPointerVelocity * brush * uCursorForce * uDelta * 4.2;
    velocity += tangent * side * brush * (.11 + .16 * speed) * uCursorSwirl * uDelta * 4.2;

    energy = max(energy * exp(-uDelta * 2.05), brush * (.32 + .58 * speed));
    velocity *= exp(-uDelta * .20);
    velocity = clamp(velocity, vec2(-uMaxVelocity), vec2(uMaxVelocity));
    gl_FragColor = vec4(encodeVelocity(velocity), energy, 1.);
  }
`;

const SCENE_SHADER = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uFlow;
  uniform sampler2D uNoise;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec2 uPointerVelocity;
  uniform float uActive;
  uniform float uTime;
  uniform float uMaxVelocity;
  uniform float uFlowWarp;
  uniform float uLensWarp;
  uniform float uGlowStrength;
  uniform float uGrainStrength;

  mat2 rot(float angle) { float c = cos(angle), s = sin(angle); return mat2(c, -s, s, c); }
  vec2 decodeVelocity(vec4 value) { return (value.rg * 2. - 1.) * uMaxVelocity; }

  float hash21(vec2 point) {
    point = fract(point * vec2(123.34, 345.45));
    point += dot(point, point + 34.345);
    return fract(point.x * point.y);
  }

  float noise(vec2 point) {
    vec2 cell = floor(point), offset = fract(point);
    offset = offset * offset * (3. - 2. * offset);
    float a = hash21(cell), b = hash21(cell + vec2(1., 0.));
    float c = hash21(cell + vec2(0., 1.)), d = hash21(cell + vec2(1., 1.));
    return mix(mix(a, b, offset.x), mix(c, d, offset.x), offset.y);
  }

  float fbm(vec2 point) {
    float value = 0., amplitude = .52;
    mat2 rotation = rot(.57);
    for (int index = 0; index < 5; index++) {
      value += noise(point) * amplitude;
      point = rotation * point * 2.03 + vec2(11.2, 7.7);
      amplitude *= .5;
    }
    return value;
  }

  float ridged(vec2 point) {
    float value = 0., amplitude = .58;
    mat2 rotation = rot(-.49);
    for (int index = 0; index < 5; index++) {
      float sample = noise(point);
      float ridge = 1. - abs(sample * 2. - 1.);
      value += ridge * ridge * amplitude;
      point = rotation * point * 2.08 + vec2(6.4, -9.1);
      amplitude *= .49;
    }
    return value;
  }

  vec2 ambientVelocity(vec2 uv, float time) {
    vec2 point = uv - .5;
    float a = sin(point.y * 7. + time * .30) + .55 * sin((point.x + point.y) * 10. - time * .21);
    float b = cos(point.x * 6. - time * .24) + .48 * cos((point.x - point.y) * 9. + time * .17);
    vec2 velocity = vec2(a, b);
    velocity += vec2(-point.y, point.x) * (.28 + .18 * sin(time * .12));
    return velocity * .032;
  }

  float surfaceHeight(vec2 uv, vec2 flow, float time) {
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.);
    vec2 point = (uv - .5) * aspect * 2.15;
    point += flow * vec2(2.5, 2.05);
    vec2 warp = vec2(
      fbm(point * .72 + vec2(time * .095, -time * .060)),
      fbm(point * .72 + vec2(5.2, 1.7) + vec2(-time * .070, time * .080))
    );
    vec2 warped = point + (warp - .5) * 1.95;
    warped += vec2(sin(warped.y * 1.35 + time * .21), cos(warped.x * 1.10 - time * .17)) * .16;
    float broad = fbm(warped * .50 + vec2(time * .055, -time * .025));
    float folds = ridged(warped * 1.03 + vec2(-time * .080, time * .042));
    float wisps = ridged((rot(.24) * warped) * 1.92 + vec2(time * .115, time * .020));
    return broad * .40 + folds * .48 + wisps * .12;
  }

  vec3 background(vec2 uv, vec2 flow, float time) {
    float height = surfaceHeight(uv, flow, time);
    float epsilon = .0065;
    float hx = surfaceHeight(uv + vec2(epsilon, 0.), flow, time) - height;
    float hy = surfaceHeight(uv + vec2(0., epsilon), flow, time) - height;
    vec3 normal = normalize(vec3(-hx * 8., -hy * 8., 1.));
    vec3 light = normalize(vec3(-.55, .70, .70));
    float diffuse = max(dot(normal, light), 0.);
    float reverse = pow(max(dot(normal, -light), 0.), 2.);

    float upper = clamp((uv.y - .34) / .66, 0., 1.);
    float body = smoothstep(.23, .83, height + upper * .13);
    float folds = smoothstep(.45, .91, height + diffuse * .17);
    float pearl = smoothstep(.69, .99, height + upper * .31 + diffuse * .10) * smoothstep(.47, .98, uv.y);
    float valley = smoothstep(.18, .62, .70 - height) * (1. - upper * .32);

    // Plum, violet, and steel retain the site's palette without borrowing the
    // reference's exact blue colour treatment.
    vec3 deepPlum = vec3(.010, .004, .026);
    vec3 velvet = vec3(.053, .018, .120);
    vec3 violet = vec3(.235, .075, .560);
    vec3 steel = vec3(.72, .77, .92);

    vec3 color = mix(deepPlum, velvet, body * .88);
    color = mix(color, violet, folds * .62);
    color += violet * diffuse * body * .42;
    color += vec3(.22, .11, .72) * reverse * folds * .20;
    color = mix(color, steel, pearl * .90);
    color *= 1. - valley * .42;

    vec2 lobe = (uv - vec2(.91, .96)) / vec2(.72, .54);
    float topLobe = exp(-dot(lobe, lobe) * 1.40);
    color = mix(color, steel, topLobe * (.16 + .34 * upper));
    return color;
  }

  float ellipse(vec2 point, vec2 radius) {
    vec2 normalized = point / max(radius, vec2(.0001));
    return exp(-dot(normalized, normalized) * 2.15);
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.);
    vec4 flowSample = texture2D(uFlow, uv);
    vec2 flow = decodeVelocity(flowSample);
    float energy = flowSample.b;
    vec2 mouseFlow = decodeVelocity(texture2D(uFlow, uMouse));

    vec2 flowUv = uv + flow * uFlowWarp;
    vec2 flowMouse = uMouse + mouseFlow * uFlowWarp;
    vec2 delta = (flowUv - flowMouse) * aspect;

    vec2 combinedDirection = uPointerVelocity + mouseFlow * .85 + ambientVelocity(uMouse, uTime) * .75;
    float speed = clamp(length(combinedDirection) * 6., 0., 1.);
    vec2 direction = normalize(combinedDirection + vec2(.00001, 0.));
    vec2 perpendicular = vec2(-direction.y, direction.x);
    vec2 local = vec2(dot(delta, direction), dot(delta, perpendicular));

    float lengthRadius = mix(.030, .092, speed);
    float widthRadius = mix(.024, .038, speed);
    vec2 bodyLocal = local + vec2(lengthRadius * .27 * speed, 0.);
    float outer = ellipse(bodyLocal, vec2(lengthRadius, widthRadius));
    float halo = ellipse(bodyLocal, vec2(lengthRadius * 1.70, widthRadius * 2.00));
    vec2 cutLocal = bodyLocal - vec2(lengthRadius * .30, -widthRadius * .04);
    float cut = ellipse(cutLocal, vec2(lengthRadius * .70, widthRadius * .66));
    float crescent = max(outer - cut * .92, 0.);
    float core = ellipse(cutLocal, vec2(lengthRadius * .50, widthRadius * .47));

    vec2 radial = normalize(delta + vec2(.00001));
    vec2 tangent = vec2(-radial.y, radial.x);
    vec2 lens = radial * (outer * .64 + halo * .11) + tangent * crescent * .24 - direction * energy * .08;
    vec2 sampleUv = uv + lens * uLensWarp * uActive;
    vec2 sampleFlow = decodeVelocity(texture2D(uFlow, sampleUv));
    vec3 color = background(sampleUv, sampleFlow, uTime);
    float luminance = dot(color, vec3(.2126, .7152, .0722));

    color += vec3(.30, .18, 1.) * energy * (.20 + .32 * luminance) * uGlowStrength;
    color += vec3(.42, .42, 1.) * (halo * .22 + outer * .50) * uActive * uGlowStrength;
    color *= 1. - core * uActive * .76;
    color += vec3(.86, .48, 1.) * crescent * 2.05 * uActive * uGlowStrength;
    float directional = max(dot(normalize(delta + vec2(.00001)), -direction), 0.);
    color += vec3(.76, .54, 1.) * crescent * directional * .78 * uActive;

    float frame = floor(uTime * 24.);
    vec2 noiseOffset = vec2(mod(frame * 37., 127.), mod(frame * 71., 127.));
    float grain = texture2D(uNoise, (gl_FragCoord.xy + noiseOffset) / 128.).r - .5;
    float grainMask = .38 + smoothstep(.015, .42, luminance) * .74 + (outer + energy) * .28;
    color += grain * uGrainStrength * grainMask * vec3(.78, .70, 1.);

    float edge = length((uv - .5) * vec2(.92, .80));
    color *= mix(.66, 1., 1. - smoothstep(.31, .78, edge));
    color = max(color, 0.);
    color = color / (1. + color * .33);
    color = pow(color, vec3(.91));
    gl_FragColor = vec4(color, 1.);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create background shader.");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || "Unknown shader compilation error.";
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, fragmentSource: string) {
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create background program.");
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) || "Unknown shader linking error.";
    gl.deleteProgram(program);
    throw new Error(message);
  }
  return program;
}

function getUniforms(gl: WebGLRenderingContext, program: WebGLProgram, names: string[]) {
  return names.reduce<Uniforms>((uniforms, name) => {
    uniforms[name] = gl.getUniformLocation(program, name);
    return uniforms;
  }, {});
}

/** A texture-flow backdrop modeled on the supplied coupled-flow reference. */
export default function LiquidBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    let simulationProgram: WebGLProgram;
    let sceneProgram: WebGLProgram;
    try {
      simulationProgram = createProgram(gl, SIMULATION_SHADER);
      sceneProgram = createProgram(gl, SCENE_SHADER);
    } catch {
      return;
    }

    const vertices = new Float32Array([-1, -1, 3, -1, -1, 3]);
    const buffer = gl.createBuffer();
    if (!buffer) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const bindGeometry = (program: WebGLProgram) => {
      const location = gl.getAttribLocation(program, "aPosition");
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
    };

    const simulationUniforms = getUniforms(gl, simulationProgram, [
      "uPrevious", "uResolution", "uMouse", "uPointerVelocity", "uActive", "uTime", "uDelta",
      "uMaxVelocity", "uAmbientFlow", "uCursorForce", "uCursorSwirl",
    ]);
    const sceneUniforms = getUniforms(gl, sceneProgram, [
      "uFlow", "uNoise", "uResolution", "uMouse", "uPointerVelocity", "uActive", "uTime",
      "uMaxVelocity", "uFlowWarp", "uLensWarp", "uGlowStrength", "uGrainStrength",
    ]);

    const createNoiseTexture = () => {
      const size = 256;
      const data = new Uint8Array(size * size * 4);
      for (let index = 0; index < data.length; index += 4) {
        const value = Math.floor(Math.random() * 256);
        data[index] = value;
        data[index + 1] = value;
        data[index + 2] = value;
        data[index + 3] = 255;
      }
      const texture = gl.createTexture();
      if (!texture) throw new Error("Unable to create background grain texture.");
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
      return texture;
    };

    const createTarget = (width: number, height: number): RenderTarget => {
      const texture = gl.createTexture();
      const framebuffer = gl.createFramebuffer();
      if (!texture || !framebuffer) throw new Error("Unable to create background flow target.");
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const initial = new Uint8Array(width * height * 4);
      for (let index = 0; index < initial.length; index += 4) {
        initial[index] = 128;
        initial[index + 1] = 128;
        initial[index + 3] = 255;
      }
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, initial);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error("Background flow framebuffer is incomplete.");
      }
      return { texture, framebuffer, width, height };
    };

    let noiseTexture: WebGLTexture;
    try {
      noiseTexture = createNoiseTexture();
    } catch {
      return;
    }

    let targets: RenderTarget[] = [];
    let readIndex = 0;
    let writeIndex = 1;
    let sceneWidth = 1;
    let sceneHeight = 1;
    const destroyTargets = () => {
      targets.forEach((target) => {
        gl.deleteTexture(target.texture);
        gl.deleteFramebuffer(target.framebuffer);
      });
      targets = [];
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDpr);
      const width = Math.max(1, Math.floor(window.innerWidth * dpr));
      const height = Math.max(1, Math.floor(window.innerHeight * dpr));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      sceneWidth = width;
      sceneHeight = height;
      const simulationWidth = Math.max(160, Math.floor(width * CONFIG.simScale));
      const simulationHeight = Math.max(100, Math.floor(height * CONFIG.simScale));
      destroyTargets();
      targets = [createTarget(simulationWidth, simulationHeight), createTarget(simulationWidth, simulationHeight)];
      readIndex = 0;
      writeIndex = 1;
    };

    const pointer = {
      target: [.5, .62],
      current: [.5, .62],
      lastRaw: [.5, .62],
      lastEventTime: performance.now(),
      velocityTarget: [0, 0],
      velocity: [0, 0],
      activeTarget: 0,
      active: 0,
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || reduce) return;
      const now = performance.now();
      const x = event.clientX / window.innerWidth;
      const y = 1 - event.clientY / window.innerHeight;
      const delta = Math.max((now - pointer.lastEventTime) / 1000, 1 / 240);
      let velocityX = (x - pointer.lastRaw[0]) / delta;
      let velocityY = (y - pointer.lastRaw[1]) / delta;
      const magnitude = Math.hypot(velocityX, velocityY);
      if (magnitude > 2.4) {
        velocityX *= 2.4 / magnitude;
        velocityY *= 2.4 / magnitude;
      }
      pointer.velocityTarget[0] = velocityX;
      pointer.velocityTarget[1] = velocityY;
      pointer.lastRaw = [x, y];
      pointer.lastEventTime = now;
      pointer.target = [x, y];
      pointer.activeTarget = 1;
    };
    const onPointerLeave = () => {
      pointer.activeTarget = 0;
      pointer.velocityTarget = [0, 0];
    };

    let animationFrame = 0;
    const start = performance.now();
    let previous = start;
    const render = (now: number) => {
      resize();
      if (targets.length !== 2) return;
      const delta = Math.min((now - previous) / 1000, 1 / 20);
      previous = now;
      pointer.current[0] += (pointer.target[0] - pointer.current[0]) * CONFIG.positionFollow;
      pointer.current[1] += (pointer.target[1] - pointer.current[1]) * CONFIG.positionFollow;
      pointer.velocity[0] += (pointer.velocityTarget[0] - pointer.velocity[0]) * CONFIG.velocityFollow;
      pointer.velocity[1] += (pointer.velocityTarget[1] - pointer.velocity[1]) * CONFIG.velocityFollow;
      pointer.active += (pointer.activeTarget - pointer.active) * .13;
      pointer.velocityTarget[0] *= .76;
      pointer.velocityTarget[1] *= .76;
      const time = (now - start) / 1000;
      const read = targets[readIndex];
      const write = targets[writeIndex];
      gl.disable(gl.BLEND);

      gl.useProgram(simulationProgram);
      bindGeometry(simulationProgram);
      gl.bindFramebuffer(gl.FRAMEBUFFER, write.framebuffer);
      gl.viewport(0, 0, write.width, write.height);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, read.texture);
      gl.uniform1i(simulationUniforms.uPrevious, 0);
      gl.uniform2f(simulationUniforms.uResolution, write.width, write.height);
      gl.uniform2f(simulationUniforms.uMouse, pointer.current[0], pointer.current[1]);
      gl.uniform2f(simulationUniforms.uPointerVelocity, pointer.velocity[0], pointer.velocity[1]);
      gl.uniform1f(simulationUniforms.uActive, pointer.active);
      gl.uniform1f(simulationUniforms.uTime, time);
      gl.uniform1f(simulationUniforms.uDelta, delta);
      gl.uniform1f(simulationUniforms.uMaxVelocity, CONFIG.maxVelocity);
      gl.uniform1f(simulationUniforms.uAmbientFlow, CONFIG.ambientFlow);
      gl.uniform1f(simulationUniforms.uCursorForce, CONFIG.cursorForce);
      gl.uniform1f(simulationUniforms.uCursorSwirl, CONFIG.cursorSwirl);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      gl.useProgram(sceneProgram);
      bindGeometry(sceneProgram);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, sceneWidth, sceneHeight);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, write.texture);
      gl.uniform1i(sceneUniforms.uFlow, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, noiseTexture);
      gl.uniform1i(sceneUniforms.uNoise, 1);
      gl.uniform2f(sceneUniforms.uResolution, sceneWidth, sceneHeight);
      gl.uniform2f(sceneUniforms.uMouse, pointer.current[0], pointer.current[1]);
      gl.uniform2f(sceneUniforms.uPointerVelocity, pointer.velocity[0], pointer.velocity[1]);
      gl.uniform1f(sceneUniforms.uActive, pointer.active);
      gl.uniform1f(sceneUniforms.uTime, time);
      gl.uniform1f(sceneUniforms.uMaxVelocity, CONFIG.maxVelocity);
      gl.uniform1f(sceneUniforms.uFlowWarp, CONFIG.flowWarp);
      gl.uniform1f(sceneUniforms.uLensWarp, CONFIG.lensWarp);
      gl.uniform1f(sceneUniforms.uGlowStrength, CONFIG.glowStrength);
      gl.uniform1f(sceneUniforms.uGrainStrength, CONFIG.grainStrength);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      readIndex = writeIndex;
      writeIndex = 1 - writeIndex;
      if (!reduce) animationFrame = requestAnimationFrame(render);
    };

    resize();
    animationFrame = requestAnimationFrame(render);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      destroyTargets();
      gl.deleteTexture(noiseTexture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(simulationProgram);
      gl.deleteProgram(sceneProgram);
    };
  }, [reduce]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="liquid-canvas absolute inset-0 h-full w-full" />
    </div>
  );
}
