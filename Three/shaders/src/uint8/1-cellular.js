import './style.css'
import * as THREE from 'three'
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js'

// init setup
const screen = { w: window.innerWidth, h: window.innerHeight }
const shape = { w: 128, h: Math.round(128 * screen.h / screen.w) }
const state = { frame: 0 }

const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

// randomly create a data texture
const dataA = new Uint8Array(shape.w * shape.h)
const dataB = new Uint8Array(shape.w * shape.h)

for (let i = 0; i < shape.w * shape.h; i++) { dataA[i] = Math.random() < 0.5 ? 0 : 255 }

// create a render target with a given data texture
const renderTargetA = createRenderTarget(dataA, shape.w, shape.h)
const renderTargetB = createRenderTarget(dataB, shape.w, shape.h)

function createRenderTarget(data, w, h) {
    const texture = new THREE.DataTexture(data, w, h)
    texture.internalFormat = 'R8UI'
    texture.format = THREE.RedIntegerFormat
    texture.type = THREE.UnsignedByteType
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter
    texture.needsUpdate = true

    const renderTarget = new THREE.WebGLRenderTarget(w, h)
    renderTarget.texture = texture
    return renderTarget
}

// create a compute shader to write data
const computeShader = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: {
        resolution: { value: new THREE.Vector2() },
        map: { value: null },
    },
    vertexShader: `
        precision highp float;
        precision highp int;

        in vec3 position;
        out vec2 uv;

        void main() {
            gl_Position = vec4(position, 1.0);
            uv = position.xy * 0.5 + 0.5;
        }
    `,
    fragmentShader: `
        precision highp usampler2D;
        precision highp float; 
        precision highp int;

        uniform usampler2D map;
        uniform vec2 resolution;
        out uvec4 fragColor;

        void main() {
            vec2 k = gl_FragCoord.xy + vec2(-1.0, -1.0);
            vec2 l = gl_FragCoord.xy + vec2( 0.0, -1.0);
            vec2 m = gl_FragCoord.xy + vec2(+1.0, -1.0);
            vec2 n = gl_FragCoord.xy + vec2(-1.0,  0.0);
            vec2 o = gl_FragCoord.xy + vec2( 0.0,  0.0);
            vec2 p = gl_FragCoord.xy + vec2(+1.0,  0.0);
            vec2 q = gl_FragCoord.xy + vec2(-1.0, +1.0);
            vec2 r = gl_FragCoord.xy + vec2( 0.0, +1.0);
            vec2 s = gl_FragCoord.xy + vec2(+1.0, +1.0);

            uint vk = texture(map, k / resolution.xy).r;
            uint vl = texture(map, l / resolution.xy).r;
            uint vm = texture(map, m / resolution.xy).r;
            uint vn = texture(map, n / resolution.xy).r;
            uint vo = texture(map, o / resolution.xy).r;
            uint vp = texture(map, p / resolution.xy).r;
            uint vq = texture(map, q / resolution.xy).r;
            uint vr = texture(map, r / resolution.xy).r;
            uint vs = texture(map, s / resolution.xy).r;

            float neighbors = float(vk + vl + vm + vn + vp + vq + vr + vs) / 255.0;
            bool alive = vo > 128u;
            bool survive = false;

            if (alive) {
                if (neighbors > 1.5 && neighbors < 3.5) { survive = true; }
            } else {
                if (neighbors > 2.5 && neighbors < 3.5) { survive = true; }
            }

            fragColor = survive ? uvec4(255u, 0, 0, 0) : uvec4(0);
        }`,
})
const computeRenderer = new FullScreenQuad(computeShader)

// fullScreenPass to render the result on screen
const shaderPass = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: { map: { value: null } },
    vertexShader: `
        precision highp float;
        precision highp int;

        in vec3 position;
        out vec2 uv;

        void main() {
            gl_Position = vec4(position, 1.0);
            uv = position.xy * 0.5 + 0.5;
        }
    `,
    fragmentShader: `
        precision highp usampler2D;
        precision highp float; 
        precision highp int;

        uniform usampler2D map;
        out vec4 fragColor;
        in vec2 uv;

        void main() {
            uint texel = texture(map, uv).r;
            float v = float(texel) / 255.0;
            fragColor = vec4(v, v, v, 1.0);
        }
    `,
})
const fullScreenPass = new FullScreenQuad(shaderPass)

// render the compute result on screen (1st frame)
shaderPass.uniforms.map.value = renderTargetA.texture
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setRenderTarget(null)
fullScreenPass.render(renderer)

// press space key to compute the next frame
document.addEventListener('keypress', (e) => {
    if (e.code === 'Space') {
        // switch render target
        state.frame = 1 - state.frame
        const inputTarget = state.frame ? renderTargetA : renderTargetB
        const outputTarget = state.frame ? renderTargetB : renderTargetA

        // compute the next frame
        computeShader.uniforms.map.value = inputTarget.texture
        computeShader.uniforms.resolution.value.set(shape.w, shape.h)
        // renderer.setSize(shape.w, shape.h) // bottle neck, perhaps dont need this
        renderer.setRenderTarget(outputTarget)
        computeRenderer.render(renderer)

        // render the compute result on screen
        shaderPass.uniforms.map.value = outputTarget.texture
        // renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setRenderTarget(null)
        fullScreenPass.render(renderer)

        // // debugging
        // const readBuffer = outputTarget.texture.image.data
        // renderer.readRenderTargetPixels(outputTarget, 0, 0, shape.w, shape.h, readBuffer)
        // console.log(readBuffer)
    }
})

// If you use R channel only instead of RGBA, readRenderTargetPixels
// can't work properly unless shape.w is a multiple of 8 (it's a trick).
