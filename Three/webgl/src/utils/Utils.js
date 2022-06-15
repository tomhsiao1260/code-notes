// https://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html

export default class Utils {
    constructor(_option) {
        this.gl = _option.gl;
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (success) return shader;

        console.log(this.gl.getShaderInfoLog(shader));
        this.gl.deleteShader(shader);
        return false;
    }

    createProgram(vertex, fragment) {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertex);
        this.gl.attachShader(program, fragment);
        this.gl.linkProgram(program);

        const success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
        if (success) return program;

        console.log(this.gl.getProgramInfoLog(program));
        this.gl.deleteProgram(program);
        return false;
    }

    // https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
    resizeCanvas() {
        // width 為顯示解析度的寬，clientWidth 為在瀏覽器上的寬度
        const { canvas } = this.gl;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          return true;
        }
        return false;
    }
}
