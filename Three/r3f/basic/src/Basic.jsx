import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { useEffect, useRef, useMemo, useState } from 'react'
import { useThree, extend, useFrame } from '@react-three/fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// React 本來就會把子 component 加到 children
// 所以這裡的 mesh 很自然會被加進 scene graph
// 但 geometry, material 等 r3f 則會以屬性的方式加到父物件上 (mesh)
// 其實就是自動幫你加入 attach="geometry" 或 attach="material" 的標籤
// 然後再把一些幾何、材質參數做默認的初始設定，相機、渲染器也都架設好了
export default function Basic()
{
    // const mesh = new THREE.Mesh()
    // mesh.geometry = new THREE.BoxGeometry(1, 1, 1)
    // mesh.material = new THREE.MeshBasicMaterial({ color: 'red' })
    // scene.add(mesh)

    return <mesh>
        <torusKnotGeometry />
        <meshNormalMaterial />
    </mesh>
}

// 可以覆蓋這些默認的數值，都是跟 Three 文件相互對應，矩陣傳入，好比說
// scale={ [ 1, 1, 1 ] }, scale={ 1 }
// 但有些屬性值有特殊處理，直接簡化傳字串進去即可
// color="orange", scale="1", position-x="1"
// 如果是類的初始化值，則以 args 的矩陣傳入
// args={ [ 1.5, 32, 32 ] }
export function BasicA()
{
    return <group position={ [ 0, 0, 1 ] } rotation-x={ 0.5 }>
        <mesh scale={ 1 }>
            <boxGeometry />
            <meshBasicMaterial color="red" />
        </mesh>
        <mesh>
            <sphereGeometry args={ [ 1.5, 32, 32 ] } />
            <meshBasicMaterial color="orange" wireframe />
        </mesh>
    </group>
}

// useFrame 的 hook 會每幀都觸發，可以搭配 useRef 傳入物體
// state 內有許多場景有關的資訊，delta 是與上一幀的 ms 時間差
export function BasicB()
{
    const cubeRef = useRef()

    // 相機跟物體剛好在同個相位旋轉，所以看起來靜止
    useFrame((state, delta) =>
    {
        console.log('tick')
        cubeRef.current.rotation.y += delta * 1

        const angle = state.clock.elapsedTime
        state.camera.position.x = Math.sin(angle) * 8
        state.camera.position.z = Math.cos(angle) * 8
        state.camera.lookAt(0, 0, 0)
    })

    return <mesh ref={ cubeRef }>
        <torusKnotGeometry />
        <meshNormalMaterial />
    </mesh>
}

// extend 會產生一個繼承該類的 component，要自訂名稱可改成 ({ myName: OrbitControls })
extend({ OrbitControls })
// useThree 的 hook 會回傳許多場景有關的資訊
export function BasicC()
{
    const { camera, gl } = useThree()

    return <>
        <orbitControls args={ [ camera, gl.domElement ] } />
        <ambientLight intensity={ 0.1 } />
        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 0.5 } />
        <mesh>
            <torusKnotGeometry />
            <meshStandardMaterial />
        </mesh>
    </>
}

// 客製化幾何形狀
export function BasicD()
{
    const geometryRef = useRef()
    const verticesCount = 10 * 3
    // 繁重計算用 useMemo，依賴矩陣是空的，只會在第一次渲染時計算，並存在 cache
    const positions = useMemo(() =>
    {
        const positions = new Float32Array(verticesCount * 3)
        for(let i=0; i<verticesCount*3; i++) { positions[i] = (Math.random() - 0.5) * 3 }

        return positions
    }, [])
    // 用 useEffect 計算 normal，依賴矩陣是空的，也只會渲染一次。因為在渲染後才執行，所以要得到 useRef 的值
    useEffect(() => { geometryRef.current.computeVertexNormals() }, [])
    // 這裡渲染指的是 DOM 程式的生成，而不是 Three.js 引擎的繪製

    // 用到了 attach，這是 React 語法，會把子物件以屬性的方式加入，即 geometry.attributes.position
    return <mesh>
        <bufferGeometry ref={ geometryRef }>
            <bufferAttribute
                attach="attributes-position"
                count={ verticesCount }
                itemSize={ 3 }
                array={ positions }
            />
        </bufferGeometry>
        <meshBasicMaterial color="red" side={ THREE.DoubleSide } />
    </mesh>
}

// camera 或 renderer 可以到 canvas 上面設定
export function BasicE(props)
{
    const cameraSettings = { fov: 45, zoom: 100, near: 0.1, far: 200, position: [ 0, 0, 1 ] }

    return <>
        <Canvas
            orthographic
            dpr={ 1 }
            gl={ {
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                outputEncoding: THREE.sRGBEncoding
            } }
            camera={ cameraSettings }
        >
            {props.children}
        </Canvas>
    </>
}

