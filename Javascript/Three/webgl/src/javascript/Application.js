import Utils from '../utils/Utils';
import Matrix from '../utils/Matrix';

import vertexSource from '../shaders/vertex.glsl';
import fragmentSource from '../shaders/fragment.glsl';

export default class Application {
    constructor(_option) {
        this.$canvas = _option.$canvas;

        // 建立 canvas 並產生一個 WebGL 的環境 (WebGLRenderingContext)
        this.gl = this.$canvas.getContext('webgl');
        if (!this.gl) return;

        this.utils = new Utils({ gl: this.gl });
        this.setup();
        this.render();
    }

    setup() {
        // 創建 shaders 並加入寫好的 source 程式，然後 compile，最後一起 link 成一個 program 放在 GPU 上
        this.vertex = this.utils.createShader(this.gl.VERTEX_SHADER, vertexSource);
        this.fragment = this.utils.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);
        this.program = this.utils.createProgram(this.vertex, this.fragment);

        // ######################################## //
        // ############## Attributes ############## //
        // ######################################## //

        // 1. 成立一個 attributes 並取出在 GPU 上的位置
        this.positionAttributeLocation = this.gl.getAttribLocation(this.program, 'a_position');
        // 2. 建立 buffer 並綁定到 gl.ARRAY_BUFFER 這個 bind points
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        // bind points 類似於 WebGL 內的全域變數，只要綁定在這裡的資源，都能被所有的 functions 所引用

        this.rectangle = {};
        this.rectangle.width = 100;
        this.rectangle.height = 50;
        this.rectangle.scale = [1, 1];
        this.rectangle.angleInRadians = 0.25 * Math.PI;
        this.rectangle.translation = [this.$canvas.clientWidth / 2, this.$canvas.clientHeight / 2];

        // 二維位置點 (px)，若想 transform，建議用 uniforms 或 matrix 對 vertex shader 更新，而不是改這些數值
        this.rectangle.positions = [];
        this.rectangle.positions.push(-this.rectangle.width / 2, -this.rectangle.height / 2);
        this.rectangle.positions.push(this.rectangle.width / 2, -this.rectangle.height / 2);
        this.rectangle.positions.push(-this.rectangle.width / 2, this.rectangle.height / 2);
        this.rectangle.positions.push(-this.rectangle.width / 2, this.rectangle.height / 2);
        this.rectangle.positions.push(this.rectangle.width / 2, this.rectangle.height / 2);
        this.rectangle.positions.push(this.rectangle.width / 2, -this.rectangle.height / 2);

        // 3. 將資料透過 bind points 放進指定的 buffer 位置 (即 positionBuffer 在 GPU 上的位置)
        // 必須把陣列轉成 32bit 浮點矩陣的形式，STATIC_DRAW 表示資料本身不會時常更動 (內部優化用)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.rectangle.positions), this.gl.STATIC_DRAW);

        // ######################################## //
        // ############### Uniforms ############### //
        // ######################################## //

        // 如果是 uniforms 只需ㄧ行
        this.resolutionUniformLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
        this.matrixLocation = this.gl.getUniformLocation(this.program, 'u_matrix');
    }

    render() {
        // 讓 canvas 的解析度 (drawingbuffer) 與其長寬一致
        this.utils.resizeCanvas();
        // 並告訴 gl 要把 clip space 要對應到新的 canvas drawingbuffer 長寬
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        // 清空 canvas
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // ######################################## //
        // ############## Attributes ############## //
        // ######################################## //

        // 4. 選擇要使用的 program，並開啟某個 attributes
        this.gl.useProgram(this.program);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

        this.config = {};
        this.config.size = 2; // 每個 vertex 收連續的 2 個資料點 (1 ~ 4)
        this.config.type = this.gl.FLOAT; // 32bit floats 資料
        this.config.normalize = false; // 不需 normalize
        this.config.stride = 0; // 每組資料間跨距為 0
        this.config.offset = 0; // 第一筆資料從 0 開始
        this.config.primitiveType = this.gl.TRIANGLES; // TRIANGLES 表示每產生 3 個 vertices 點 GPU 就會產生一個三角形
        this.config.count = 6; // 要處理的 vetices 數量

        // 5. 告訴 attributes 如何從目前的 bind point (ARRAY_BUFFER) 拿資料，也就是 positionBuffer
        this.gl.vertexAttribPointer(
            this.positionAttributeLocation,
            this.config.size,
            this.config.type,
            this.config.normalize,
            this.config.stride,
            this.config.offse,
        );
        // stride, offset 不為 0 通常是效能上的考量，設定上會較複雜
        // 此後 attributes 即可使用 positionBuffer 資料，不再受 bind points 影響
        // 若 attributes 為 vec4 (預設為: 0, 0, 0, 1)，則此例只會有前 2 項被來自 buffer 的資料取代

        // ######################################## //
        // ############### Uniforms ############### //
        // ######################################## //

        // 將 canvas 的 drawingbuffer size 資訊以 uniforms 傳入 shaders
        this.gl.uniform2f(this.resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);
        // 可參考下面有很多其他 uniforms 的類別
        // https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html

        // 用 matrix 轉換到 clip space 座標
        this.matrix = Matrix.projection(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
        // 平移、旋轉、旋轉 (皆以平移前的原點為基準)
        this.matrix = Matrix.translate(this.matrix, this.rectangle.translation[0], this.rectangle.translation[1]);
        this.matrix = Matrix.rotate(this.matrix, this.rectangle.angleInRadians);
        this.matrix = Matrix.scale(this.matrix, this.rectangle.scale[0], this.rectangle.scale[1]);
        this.gl.uniformMatrix3fv(this.matrixLocation, false, this.matrix);

        // 執行完 program 後畫出圖形
        this.gl.drawArrays(this.config.primitiveType, this.config.offset, this.config.count);

        // 每多畫一個物體時，就要執行 useProgram 以後的程式，不過可整理些邏輯、效能的優化，如下：
        // https://webglfundamentals.org/webgl/lessons/webgl-drawing-multiple-things.html
        // 如果是 instancing，可以只用一次 draw call，大大改善效能，方法如下：
        // https://webglfundamentals.org/webgl/lessons/webgl-instanced-drawing.html
    }
}
