import Matrix from '../utils/Matrix';

export default class Rectangle {
    constructor(_option) {
        this.time = _option.time;
        this.gl = _option.gl;
        this.program = _option.program;

        this.setParameters();
        this.setUniforms();
        this.setAttributes();
    }

    setParameters() {
        this.rectangle = {};
        this.rectangle.width = 150;
        this.rectangle.height = 150;
        this.rectangle.scale = [1, 1];
        this.rectangle.angleInRadians = 0 * Math.PI;
        this.rectangle.translation = [this.gl.canvas.clientWidth / 2, this.gl.canvas.clientHeight / 2];

        // 二維位置點 (px)，若想 transform，建議用 uniforms 或 matrix 更新，而不是改這些 attributes 數值
        this.rectangle.positions = [];
        this.rectangle.positions.push(-this.rectangle.width / 2, -this.rectangle.height / 2);
        this.rectangle.positions.push(this.rectangle.width / 2, -this.rectangle.height / 2);
        this.rectangle.positions.push(-this.rectangle.width / 2, this.rectangle.height / 2);
        this.rectangle.positions.push(-this.rectangle.width / 2, this.rectangle.height / 2);
        this.rectangle.positions.push(this.rectangle.width / 2, -this.rectangle.height / 2);
        this.rectangle.positions.push(this.rectangle.width / 2, this.rectangle.height / 2);

        this.config = {};
        this.config.size = 2; // 每個 vertex 收連續的 2 個資料點 (1 ~ 4)
        this.config.type = this.gl.FLOAT; // 32bit floats 資料
        this.config.normalize = false; // 不需 normalize
        this.config.stride = 0; // 每組資料間跨距為 0
        this.config.offset = 0; // 第一筆資料從 0 開始
        this.config.primitiveType = this.gl.TRIANGLES; // TRIANGLES 表示每產生 3 個 vertices 點 GPU 就會產生一個三角形
        this.config.count = 6; // 要處理的 vetices 數量
    }

    setUniforms() {
        // 成立 uniforms 並取出在 GPU 上的位置
        this.resolutionUniformLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
        this.matrixLocation = this.gl.getUniformLocation(this.program, 'u_matrix');
    }

    setAttributes() {
        // 1. 成立一個 attributes 並取出在 GPU 上的位置
        this.positionAttributeLocation = this.gl.getAttribLocation(this.program, 'a_position');
        // 2. 建立 buffer 
        this.positionBuffer = this.gl.createBuffer();
        // 3. 綁定到 gl.ARRAY_BUFFER 這個 bind points
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        // bind points 類似於 WebGL 內的全域變數，只要綁定在這裡的資源，都能被所有的 functions 所引用

        // 4. 將資料透過 bind points 放進指定的 buffer 位置 (即 positionBuffer 在 GPU 上的位置)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.rectangle.positions), this.gl.STATIC_DRAW);
        // 必須把陣列轉成 32bit 浮點矩陣的形式，STATIC_DRAW 表示資料本身不會時常更動 (內部優化用)
    }

    render() {
        this.speed = this.time.elapsed * 0.001;
        this.cycle = (1 + Math.sin(this.speed)) / 2;

        // 加入動畫
        this.rectangle.angleInRadians = this.cycle * Math.PI;
        this.rectangle.scale[0] = 1 - 0.5 * this.cycle;
        this.rectangle.scale[1] = 1 - 0.5 * this.cycle;
        this.rectangle.translation = [this.gl.canvas.clientWidth / 2, this.gl.canvas.clientHeight / 2];

        // 選擇要使用的 program
        this.gl.useProgram(this.program);

        this.renderUniforms();
        this.renderAttributes();

        // 執行完 program 後畫出圖形
        this.gl.drawArrays(this.config.primitiveType, this.config.offset, this.config.count);
    }

    renderUniforms() {
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
    }

    renderAttributes() {
        // 1. 開啟某個 attributes
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        // 2. 有可能前一次 bind 的位置不同，所以使用前記得 bind
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        // 3. 告訴 attributes 如何從目前的 bind point (ARRAY_BUFFER) 拿資料，也就是 positionBuffer
        this.gl.vertexAttribPointer(
            this.positionAttributeLocation,
            this.config.size,
            this.config.type,
            this.config.normalize,
            this.config.stride,
            this.config.offset,
        );
        // stride, offset 不為 0 通常是效能上的考量，設定上會較複雜
        // 此後 attributes 即可使用 positionBuffer 資料，不再受 bind points 影響
        // 若 attributes 為 vec4 (預設為: 0, 0, 0, 1)，則此例只會有前 2 項被來自 buffer 的資料取代
    }
}
