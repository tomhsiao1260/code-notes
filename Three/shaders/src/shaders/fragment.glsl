#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

// ############################################################### //
// ####################   Useful Function   ###################### //
// ############################################################### //

// 亂數，但並非隨機數，每次執行會有相同結果 (參考 book of shader)
float random(vec2 st) { 
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); 
}

// 會將 uv 座標沿著 mid 為中心旋轉 rotation 個弧度單位，最終回傳新的 uv 座標
vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

//  Classic Perlin 2D Noise by Stefan Gustavson
vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

// 用法 cnoise(vUv * 10.0); 也可加入一些函式 sin(cnoise(vUv * 10.0) * 20.0);
float cnoise(vec2 P) {
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}
// 其他經典的常用亂數
// 裡面也有三維的 cnoise，可以將前兩維設為 uv，第三維設為 uTime
// 可以使用不同尺度的 noise 疊加，得到更加混亂寫實的效果
// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83

// ############################################################### //
// ####################   Color & Pattern   ###################### //
// ############################################################### //

// 顏色, 圖案可分開設計，最後在混合再一起
vec3 mixColor() {
    // 圖案：以 strength 表示，值越大表某個位置越亮
    float strength = sin(cnoise(vUv * 10.0) * 20.0);
    // 顏色：以 color 表示，即 rgb 
    vec3 color = vec3(vUv, 1.0);
    // 注意 strength 要先限制在 0~1
    strength = clamp(strength, 0.0, 1.0); 
    // 將圖案配上顏色
    return mix(vec3(0.0), color, strength);  
}

// ############################################################### //
// #####################   Main Function   ####################### //
// ############################################################### //

void main()
{
    vec3 color = vec3(vUv, 1.0);

    color = mixColor();

    gl_FragColor = vec4(color, 1.0);
}