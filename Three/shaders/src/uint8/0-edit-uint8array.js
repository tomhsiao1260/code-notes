import './style.css'
import * as THREE from 'three'
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js'

// setup canvas, renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

// create a data texture
const shape = { w: 8, h: 3 }
const data = new Uint8Array(shape.w * shape.h)
const texture = new THREE.DataTexture(data, shape.w, shape.h)

// create a render target with that texture
const renderTarget = new THREE.WebGLRenderTarget(shape.w, shape.h)
renderTarget.texture = texture
renderTarget.texture.internalFormat = 'R8UI'
renderTarget.texture.format = THREE.RedIntegerFormat
renderTarget.texture.type = THREE.UnsignedByteType
renderTarget.texture.minFilter = THREE.NearestFilter
renderTarget.texture.magFilter = THREE.NearestFilter
renderTarget.texture.needsUpdate = true

// create a full screen pass (write data into r channel)
const shaderPass = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
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
        precision highp float; 
        precision highp int;

        out uvec4 fragColor;
        in vec2 uv;

        void main() {
            float v = (uv.x + uv.y) / 2.0;
            fragColor = uvec4(v * 255.0, 0, 0, 0);
        }
    `,
})
const fullScreenPass = new FullScreenQuad(shaderPass)

// render fullScreenPass result on that render target
renderer.setRenderTarget(renderTarget)
fullScreenPass.render(renderer)

// read the data (seems it can only accept 4 channels)
renderer.setRenderTarget(renderTarget)
renderer.readRenderTargetPixels(renderTarget, 0, 0, shape.w, shape.h, data)
console.log(data)

// optional: render the texture result to screen 
renderTextureToScreen(texture)

function renderTextureToScreen(texture) {
    const shaderPass = new THREE.RawShaderMaterial({
        glslVersion: THREE.GLSL3,
        uniforms: { map: { value: texture } },
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

    renderer.setRenderTarget(null)
    fullScreenPass.render(renderer)
}

// If you use R channel only instead of RGBA, readRenderTargetPixels
// can't work properly unless shape.w is a multiple of 8 (it's a trick).
