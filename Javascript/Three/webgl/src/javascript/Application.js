import Time from '../utils/Time';
import Utils from '../utils/Utils';
import Rectangle from './Rectangle';
import Texture from './Texture';

import vertexSource from '../shaders/vertex.glsl';
import fragmentSource from '../shaders/fragment.glsl';

export default class Application {
    constructor(_option) {
        this.$canvas = _option.$canvas;

        // 建立 canvas 並產生一個 WebGL 的環境 (WebGLRenderingContext)
        this.gl = this.$canvas.getContext('webgl');
        if (!this.gl) return;

        this.time = new Time();
        this.utils = new Utils({ gl: this.gl });

        this.setup();
        this.render();
    }

    setup() {
        // 創建 shaders 並加入寫好的 source 程式，然後 compile，最後一起 link 成一個 program 放在 GPU 上
        this.vertex = this.utils.createShader(this.gl.VERTEX_SHADER, vertexSource);
        this.fragment = this.utils.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);
        this.program = this.utils.createProgram(this.vertex, this.fragment);

        this.rectangle = new Rectangle({
            time: this.time,
            gl: this.gl,
            program: this.program,
        });

        this.texture = new Texture({
            time: this.time,
            gl: this.gl,
            program: this.program,
        });
    }

    render() {
        this.time.on('ready', () => {
            this.time.on('tick', () => {
                // 讓 canvas 的解析度 (drawingbuffer) 與其長寬一致
                this.utils.resizeCanvas();
                // 並告訴 gl 要把 clip space 要對應到新的 canvas drawingbuffer 長寬
                this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

                // 清空 canvas
                this.gl.clearColor(0, 0, 0, 0);
                this.gl.clear(this.gl.COLOR_BUFFER_BIT);

                this.rectangle.render();
            });
        });
    }
}

// 每多畫一個物體時，就要執行 useProgram 以後的程式，不過可整理些邏輯、效能的優化，如下：
// https://webglfundamentals.org/webgl/lessons/webgl-drawing-multiple-things.html
// 如果是 instancing，可以只用一次 draw call，大大改善效能，方法如下：
// https://webglfundamentals.org/webgl/lessons/webgl-instanced-drawing.html
