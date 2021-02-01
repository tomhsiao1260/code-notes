import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// 先導入 vertex, fragment 的 glsl 檔，並放進 shader material 內
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const textureLoader = new THREE.TextureLoader()
const gui = new dat.GUI({ closed: true })

// ############################################################### //
// #########################   Shaders   ######################### //
// ############################################################### //

// OpenGL 為一種能夠與 GPU 溝通定渲染出 2D, 3D 圖像的 API
// WebGL 是種讓瀏覽器能與 OpenGL 溝通的 Javascript API
// Three.js 又對 WebGL 進行封裝，讓使用更加容易

// 其中 shader 是 WebGL 一個重要的元素，它是以 GLSL 撰寫並透過 GPU 執行
// GLSL 是種類似 C 的 shader 撰寫語言，全名為 OpenGL Shading Language
// 以 geometry 而言，shader 主要在控制 vertex 位置，以及為每個 fragment 上色
// fragment 是在 render 裡的著色單位，也常常會直接稱為 pixel (但並非螢幕上的 pixel)
// 在 three.js 裡，透過撰寫 shader material 可以控制物體表面的形狀、顏色 ...

// 可傳送資料給 shader，例如：vertex 座標, mesh transform, camera 資訊, 顏色, 光線 ...
// GPU 會針對 shader 的指示平行運算每個 vertex, fragment，並將結果渲染到畫面上
// 因為用 GPU，所以在效能上會非常好，此外除了有較高的掌控度，也能被用在 post-process 上

// 執行上，fragment 間彼此獨立 (blind)，且無法根據前個時間點運算 (memoryless)
// 每個 fragment 只會根據同一個 shader 指示呈現不同的運算結果
// 也因為如此，Shader 常難以被理解，但也是它運算快速的原因

// 有兩種主要的 shader 分別為 Vertex shader 和 Fragment shader
// 前者負責運算每個 vertex 位置，並轉交給後者負責為每個 fragment 上色
// 此外，vertex 點以外的 fragment 顏色無法設定，會自動以 vertex 的端點去混色

// 若外部資料不會隨 vertex 點改變則為 unifrom 參數，可直接傳給這兩種 shader
// 若外部資料會隨 vertex 點改變則為 attribute 參數，只能傳給 vertex shader
// 不過 vertex shader 可以透過 varying 傳資料給 fragment shader 使用

// uniform   : vertex, fragment
// attribute : vertex ---(varying)---> fragment

// three.js 提供 RawShaderMaterial, ShaderMaterial，後者會預先加入一些參數
// 可另外加入 wireframe, side, transparent 屬性
// 但不能加入 map, alphamap, opacity, color 等和 shader 有關的屬性

// ############################################################### //
// #####################   Send Uniforms   ####################### //
// ############################################################### //

const debugObject = { color: '#f7d09c' }

// 透過 ShaderMaterial 的 uniforms 屬性傳入 uniform 參數：
const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms:
    {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(debugObject.color) },
    }
})

// uTime    : { value: 0 }                       -->  uniform float uTime; 
// uMouse   : { value: new THREE.Vector2(1,0) }  -->  uniform vec2 uMouse;
// uColor   : { value: new THREE.Color('red') }  -->  uniform vec3 uColor;
// uTexture : { value: someTexture }             -->  uniform sampler2D uTexture;

// uTime 需定時更新 (看 tick 函式)
// 在 fragment shader 使用材質時，需要 uTexture 材質 (uniform) 和 uv 座標值 (以 varying 傳入)
// gl_FragColor = texture2D(uTexture, vUv);
// 注意 value 都必須放 three 的 instance

// uniform 值可以搭配 GUI 去做視覺化調整 gui.add(material.uniforms.uMouse.value, 'x')
// 顏色或一些非 object 的屬性要加入 GUI 寫法如下 (多自定義個 object 和 onChange 更新內部參數)：
// 更動 THREE.Color 要多使用個 set 語句

gui.addColor(debugObject, 'color').onChange( () => material.uniforms.uColor.value.set)


// ############################################################### //
// ####################   Send Attrubutes   ###################### //
// ############################################################### //

// 透過 Geometry 的 attributes 屬性傳入 attribute 參數：
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

// 1. 取得 vertex 數量並建立矩陣
// const count = geometry.attributes.position.count
// const color = new Float32Array( count * 3 )

// 2. 將數值寫入矩陣
// for(let i = 0; i < count; i++) { 
//     color[3*i  ] = Math.random()  // red   channel
//     color[3*i+1] = Math.random()  // green channel
//     color[3*i+2] = Math.random()  // blue  channel
// }

// 3. 將資料放進 geometry 的 attributes 屬性內，3 表示連續三個為一筆資料
// geometry.setAttribute('aColor', new THREE.BufferAttribute(color, 3))

// 4. 呼叫參數
// attribute vec3 aColor;   手寫的，三維度資料
// attribute vec3 position; 內建的，每個 vertex 的三維位置資訊
// attribute vec3 normal    內建的，每個 vertex 表面的法向量 (可用來計算光反射)
// attribute vec2 uv;       內建的，每個 vertex 對應到表面的二維座標 (左下0,0，右上1,1)


// ############################################################### //
// ######################   GLSL Script   ######################## //
// ############################################################### //

// ShaderMaterial 不用像 RawShaderMaterial 自己宣告下面參數，都會事先宣告：
// 此外，vertex shader 可透過同名的 varying 傳參數給 fragment shader

// #####################   vertex shader   ####################### //

// uniform mat4 modelMatrix;      // 與 mesh 相關的 transformation (旋轉、移動、縮放)
// uniform mat4 viewMatrix;       // 與 camera 相關的 transformation
// uniform mat4 projectionMatrix; // 將最終的結果投影到 clip space (準備呈現到螢幕上)

// attribute vec3 position;       // 內建的位置 attribute 座標      
// attribute vec3 normal;         // 內建的法向量 attribute 座標
// attribute vec2 uv;             // 內建的表面 attribute 座標
// attribute vec3 color;          // 內建的顏色 attribute 資訊

// varying float vNumber;         // 傳 varying 給 fragment shader (自己宣告)

// 輸出可這樣表示：
// gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

// gl_Position 為內建參數，為經過一系列轉換後在 clip space 上的結果 (4維)   
// 此外 viewMatrix * modelMatrix 也可簡寫為 modelViewMatrix       

// ####################   fragment shader   ###################### //

// precision mediump float;       // 浮點數精準度，有 highp, mediump, lowp
                                  // highp 吃效能且非所有裝置支援，lowp 畫面可能有頓點, bug 

// varying float vNumber;         // 收到來自 vertex shader 的 varying (自己宣告)

// 輸出可這樣表示：
// gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

// gl_FragColor 為內建參數，為每個 vertex 的 rgba 值 (0~1)，數值超過會以 0 或 1 表示
// 若要使用 alpha 記得打開 material 的 transparent: true 屬性
// 此外，vertex 間的顏色會以漸層的混色呈現

// 在 Debug 方面沒有很好的辦法，除了看 console error 外
// 可以試著把資料放進 gl_FragColor 視覺化，方便看出其中的分佈
// 也可使用 GLSLify 等 glsl 模組化寫法 (webpack 需使用 glslify-loader)

// shader 學習資源：
// The Book of Shaders: https://thebookofshaders.com/
// ShaderToy: https://www.shadertoy.com/
// The Art of Code: https://www.youtube.com/channel/UCcAlTqd9zID6aNX3TzwxJXg
// Lewis Lepton: https://www.youtube.com/channel/UC8Wzk_R1GoPkPqLo-obU_kQ

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, - 0.25, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // 更新 uTime 這個 uniform 參數
    material.uniforms.uTime.value = elapsedTime

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()