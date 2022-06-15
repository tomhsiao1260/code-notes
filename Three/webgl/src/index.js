import './styles/style.css';
import Application from './javascript/Application';

window.application = new Application({
    $canvas: document.querySelector('.webgl'),
});

// WebGL 本身只是個柵格化引擎 (rasterization engine)，只負責畫出點、線、三角形
// 其餘 3D 視覺效果都是另外透過矩陣運算位置點、或其他 API 實作出來的
// 為了在 GPU 上跑，需要以 GLSL 語言實作 vertex、fragment 這兩種 functions
// 這兩個 function pair 稱為一個 program
// WebGL 大多的工作在負責設定這些 program 的一系列狀態 (gl 提供一系列的方法)
// 並且在最後要渲染時呼叫 gl.drawArrays 或 gl.drawElements

// 所有要提供給這些 functions 的資料都必須先放進 GPU 記憶體空間內，有下面四種資料：
// 1. Buffers   : 存在 GPU 內的 arrays of binary data
// 1. Attributes: 指定要怎麼拿取 Buffers 裡面的資料進 vertex shader
//                例如：幾個項合為一組、讀取的起始點、每組資料間跨幾步
// 2. Uniforms  : 為 program 內的全域變數
// 3. Textures  : 以矩陣為形式的 uniforms 資料 (不見得要是圖形)
// 4. Varyings  : 為 vertex shader 傳資料給 fragment shader 的一種形式
//                資料點會在被渲染時內差運算中間的數值 (interpolated)

// WebGL 只在意兩件事： clip space coordinates、colors
// vertex shader 負責提供前者、fragment shader 負責提供後者
// clip space 為一個 4 維座標且範圍介於 -1 ~ 1 之間，不論 canvas 的大小為何
// clip space 的前兩項控制 x, y，最左下為 (-1, -1)，最右上為 (1, 1)

// 因為輸入的資料形式的不同 (UV, Normal, ...)，並非所有 shader 都能通用在任何幾何上
// 這代表要花更多時間寫 shader，所以有時使用 Three.js、Unity 這類的引擎是不錯的選擇
// 因為它們會根據開發者的設定去自動 generate 對應的 shader 程式碼
