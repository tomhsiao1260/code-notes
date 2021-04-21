import minecraft from '../assets/minecraft.png';

export default class Texture {
    constructor(_option) {
        this.time = _option.time;
        this.gl = _option.gl;
        this.program = _option.program;

        this.start();
    }

    async start() {
        await this.loadImage();
        this.setAttributes();
        this.time.trigger('ready');
    }

    loadImage() {
        // 圖檔大小最好是 2 的指數倍 (min mapping)
        return new Promise((resolve) => {
            this.image = new Image();
            this.image.src = minecraft;
            this.image.onload = () => resolve();
        });
    }

    setAttributes() {
        // 建立 texture 需要的座標 (兩個三角形)，(0, 0) 為圖形左上，(1, 1) 為圖形右下
        this.points = [];
        this.points.push(0.0, 0.0);
        this.points.push(1.0, 0.0);
        this.points.push(0.0, 1.0);
        this.points.push(0.0, 1.0);
        this.points.push(1.0, 0.0);
        this.points.push(1.0, 1.0);
        // 注意這個順序要與 rectangle 內的 vertex 順序匹配圖形才不會亂掉 (UV coordinates)

        this.texCoordLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');
        this.texCoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.points), this.gl.STATIC_DRAW);

        this.gl.enableVertexAttribArray(this.texCoordLocation);
        this.gl.vertexAttribPointer(this.texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);

        // 建立 texture
        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

        // 設定下面得參數才能渲染不同尺寸的圖片
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        // 把圖片加入 texture 內
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);
    }
}
