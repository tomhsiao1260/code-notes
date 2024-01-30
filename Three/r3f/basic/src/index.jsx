import './style.css'
import { StrictMode } from 'react'
import { Canvas } from '@react-three/fiber'
import ReactDOM from 'react-dom/client'

import Basic from './Basic'
import { BasicA, DreiC, DebugA, ModelA } from './Basic'

// React Three Fiber 是一種 React 的 Renderer
// 能把 JSX 程式和 data 轉換為 Three.js Scene 的形式呈現

// 作者 Paul Henschel 也被稱為 0xca0a
// 他是 Poimandres (PMNDRS) 的創辦人，裡面集結了許多開發者的開源的函式庫
// Paul: “The idea behind Poimandres is to form a collective where developers can join and help one another. It also serves to fund, highlight and promote projects.”

// 感覺 Bruno 有跟 Paul 深入聊過，他很推 R3F 社群的東西，下面是 Paul 對願景的描述，R3F 的精神在於更多的開源模組化來降低使用門檻
// Paul: “When I started out with WebGL and Three.js years ago, the outlook was bleak. I wanted to do things I saw around, made by agencies that had high-quality output, but they rarely, if ever, shared. As for Stackoverflow, discourse, etc., the information was not nearly enough to touch it remotely. Every project sent me into endless sub-tasks, one harder than the other, especially since I lacked a proper math background. Over time it took the fun out of it, since, even the thought of trying something would scare me. Yet, in generic frontend, it is not at all like this, nobody needs to be an expert in everything. We are used to sharing and we have great means to do it: components. For a web dev, it is trivial to pick any package and use it, or wrap functionality and distribute it so others may benefit. In WebGL and Three.js, other than dispersed special purpose libraries and three/examples, I always felt that was missing. The whole idea of react-three-fiber is to give Three.js better means to share and to pack complex functionality into self-contained units. I hope that the components that have accumulated since then will change the outlook for beginners: Three.js doesn’t have to be daring, even without a formal background, you pick your own battles and learn what interests you while being able to plug your app together with things that others already struggled with, and then shared.”

// R3F with Vite
// 1. npm create vite@latest
// 2. 選擇 React + Javascript
// 3. npm install & npm run dev
// 4. npm install three@0.148 @react-three/fiber@8.9 @react-three/drei@9.88 leva@0.9 r3f-perf@7.1

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <StrictMode>
        <Canvas>
            <ModelA />
        </Canvas>
    </StrictMode>
)

// 開始： https://docs.pmnd.rs/react-three-fiber/getting-started/introduction
// 效能： https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance#instancing
// 資源： https://twitter.com/0xca0a/status/1445409346305892353
// 資源： https://journey.pmnd.rs/


