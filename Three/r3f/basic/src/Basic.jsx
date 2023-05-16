import { useRef } from 'react'
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

    return <>
        <mesh>
            <torusKnotGeometry />
            <meshNormalMaterial />
        </mesh>
    </>
}

// 可以覆蓋這些默認的數值，都是跟 Three 文件相互對應，矩陣傳入，好比說
// scale={ [ 1, 1, 1 ] }, scale={ 1 }
// 但有些屬性值有特殊處理，直接簡化傳字串進去即可
// color="orange", scale="1", position-x="1"
// 如果是類的初始化值，則以 args 的矩陣傳入
// args={ [ 1.5, 32, 32 ] }
export function BasicA()
{
    return <>
        <group position={ [ 0, 0, 1 ] } rotation-x={ 0.5 }>
            <mesh scale={ 1 }>
                <boxGeometry />
                <meshBasicMaterial color="red" />
            </mesh>
            <mesh>
                <sphereGeometry args={ [ 1.5, 32, 32 ] } />
                <meshBasicMaterial color="orange" wireframe />
            </mesh>
        </group>
    </>
}

// useFrame 的 hook 會每幀都觸發，可以搭配 useRef 傳入物體
// state 內有許多場景有關的資訊，delta 是與上一幀的 ms 時間差
export function BasicB()
{
    const cubeRef = useRef()

    useFrame((state, delta) =>
    {
        console.log('tick')
        cubeRef.current.rotation.y += delta
    })

    return <>
        <mesh ref={ cubeRef }>
            <torusKnotGeometry />
            <meshNormalMaterial />
        </mesh>
    </>
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