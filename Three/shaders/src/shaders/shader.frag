//####################################################//

// 加入 preprocessor macros，會在編譯前先執行
#ifdef GL_ES
precision mediump float;
#endif

// GLSL 會提供一些內建與 OpenGL 溝通的參數，例如：
// varible： gl_FragColor, gl_FragCoord
// uniform： u_resolution, u_mouse, u_time

uniform float u_time;

// 以下是 fragment shader 範例
// 每個 fragment 都會獨立同時執行 main()，並在最後被賦予一個顏色
void main() {
  // gl_FragColor 負責顯示逐個 pixel 最終的顏色 RGBA
  // 為 vec4，數值範圍在 0~1，且必須以 float 表示
	gl_FragColor = vec4(abs(sin(u_time)),0.0,1.0,1.0);
}
// 可以將一個 fragment 理解為在某個時間點的某個 pixel
// 只是除了顏色外，具有更多深度、透明度、濾鏡等等的資訊
// 最後會根據 fragment 決定 shade 在 pixel 上的 RGB 數值

//####################################################//

#ifdef GL_ES
precision mediump float;
#endif

// uniform 表示每個 pixel 的數值相同，容許下面幾種 type：
// float, vec2, vec3, vec4, mat2, mat3, mat4, sampler2D, samplerCube

uniform vec2 u_resolution;  // Canvas size (width,height)
uniform vec2 u_mouse;       // mouse position in screen pixels
uniform float u_time;       // Time in seconds since load

// GLSL 也會根據下面的函式進行效能優化
// sin, cos, tan, asin, acos, atan
// pow, exp, log, sqrt, abs, sign
// floor, ceil, fract, mod, min, max, clamp

void main() {
	// gl_FragCoord 位置資訊 (卡式座標，左下角為原點)
  // 為 vec4，分別紀錄 x, y, z, 1/Wc (後兩項跟深度有關)
  // 可用 .xy 取出前兩維，並用 u_resolution 去 normalized
	vec2 st = gl_FragCoord.xy/u_resolution;
	gl_FragColor = vec4(st.x,st.y,0.0,1.0);
}

//####################################################//
//################# Shaping Function #################//
//####################################################//

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// 當接近函數的線回回傳 1，反之回傳 0
// st 為座標值，pct 為函數的回傳值
float plot(vec2 st, float pct){
	// smoothstep(s,t,u) 功能如下：
	// u 從 0 漸進到 1，也就是說 s->t 區間值介於 0->1
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
  // 所以這是個沿著 st.y 軸的 peak，中心在 pct，寬度為 0.04
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;

  // 函數 y=x^3
  float y = pow(st.x,3.0);
  // 根據函數畫出灰階背景色
  vec3 color = vec3(y);
  // 根據函數畫出線 (垂直掃描)
  float pct = plot(st,y);
  // 綠線與背景色融合成為最終顏色
  color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);
  // vec4 內可包一個 vec3 的 color
	gl_FragColor = vec4(color,1.0);
}

// 善用 easing function 做狀態間的轉換
// https://easings.net/
// https://thebookofshaders.com/edit.php#06/easing.frag

//####################################################//

vec4 vector;
// rgba = xyzw = stpq
vector[0] = vector.r = vector.x = vector.s;
vector[1] = vector.g = vector.y = vector.t;
vector[2] = vector.b = vector.z = vector.p;
vector[3] = vector.a = vector.w = vector.q;

vec3 yellow, magenta, green;

yellow.rg = vec2(1.0);  
yellow[2] = 0.0;        // rgb = (1,1,0);

magenta = yellow.rbg;   // rgb = (1,0,1);
green.rgb = yellow.bgb; // rgb = (0,1,0);

int newFunction(in vec4 aVec4,      // read-only
                out vec3 aVec3,     // write-only
                inout int aInt);    // read-write

// inout 類似 by reference，可以更動函數的輸入值

//####################################################//
//####################### Color ######################//
//####################################################//

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.833,0.224);

float plot (vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) -
          smoothstep( pct, pct+0.01, st.y);
}

// HSB 轉 RGB
// https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // 鋪底色
    vec3 color = vec3(0.0);

    vec3 pct = vec3(st.x);

    // pct.r = smoothstep(0.0,1.0, st.x);
    // pct.g = sin(st.x*PI);
    // pct.b = pow(st.x,0.5);

    // 混合兩種顏色，pct 為混合比例，0 表 colorA，1 表 colorB
    // 沿著 x 軸從左到右呈現 colorA 到 colorB 的漸層
    // 開啟上方不同 channel 的 pct 能根據不同 rgb 獨立調整
    color = mix(colorA, colorB, pct);

    // 1. Plot transition lines for each channel
    // 會依序在 y=x 的線上畫上紅、綠、藍線
    // 開啟上方不同 channel 的 pct 能根據不同 rgb 畫出想要的曲線顏色
    color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));
    color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));
    color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));
    
    // 2. 也可使用 HSB 定義顏色，再轉回 RGB 繪出，共三個 channel 分別為：
    // Hue, Saturation, Brightness
    color = hsb2rgb(vec3(st.x,1.0,st.y));

    // 3. 也可改用 polar coordinates
    vec2 toCenter = vec2(0.5)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0;

    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius
    color = hsb2rgb(vec3((angle/TWO_PI)+0.5,radius,1.0));

    // 整體來說，可搭配 shaping function 去改變不同 channel 的顏色分佈
    gl_FragColor = vec4(color,1.0);
}

//####################################################//
//####################### Shape ######################//
//####################################################//

//####################################################//
//###################### Random ######################//
//####################################################//

// 下面的都是 random deterministic，又稱 pseudo-random
// 也就是只要輸入值相同，輸出就會是同一個

// 要產生這類的隨機數，一種主流的方式是用 fract (取小數)
// 想想看 fract(sin(x)) 長什麼樣子

// 當有一個均勻的隨機分佈函數，可使用一些手法去操控這些分佈
// 注意下面連結使用 Math.random()，而不是 pseudo-random
// https://pixelero.wordpress.com/2008/04/24/various-functions-and-various-distributions-with-mathrandom/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

// 為了產生 2D 隨機變數，可把座標跟任一向量內積，作為 fract(sin(x)) 的輸入
// 下面的參數需特別挑選才能達到視覺上的隨機
float random (vec2 st) {
    vec2 t = vec2(12.9898,78.233);
    return fract(sin(dot(st.xy,t))*43758.5453123);
}

float random2 (vec2 st) {
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)));
    return -1.0+2.0*fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

// 另一種常用的 random 為 hash
float hash(vec2 st) {
    vec2 t  = 50.0*fract( st*0.3183099 + vec2(0.71,0.113));
    return -1.0+2.0*fract( t.x*t.y*(t.x+t.y) );
}

// 3 維雜湊，輸入任一正整數 (e.g. uint(3.1) , 3u)，輸出介於 0~1 的三維雜湊
vec3 hash3( uint n ) {
    // integer hash copied from Hugo Elias
    n = (n << 13U) ^ n;
    n = n * (n * n * 15731U + 789221U) + 1376312589U;
    uvec3 k = n * uvec3(n,n*16807U,n*48271U);
    return vec3( k & uvec3(0x7fffffffU))/float(0x7fffffff);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    // 1. 產生二為亂數
    float rnd1 = random( st );

    // 2. 產生 10*10 亂數網格
    st *= 10.0;
    vec2 i = floor(st); // integer
    vec2 f = fract(st); // fraction

    float rnd2 = random( i );
    // 可用 f 作為每個網格的 uv 座標
    // 這麼一來就可產生既規律卻又隨機的各種網格圖案

    gl_FragColor = vec4(vec3(rnd1),1.0);
    //gl_FragColor = vec4(vec3(rnd2),1.0);
}

// 其實這類的亂數還有很多的變化，最經典的就是 Ryoji Ikeda
// 可以他的作品並作 book of shader 提到的練習

//####################################################//
//###################### Noise #######################//
//####################################################//

// 前一章提到的都不太像大自然的亂數，例如：下雨、山脈、股市波動
// 原因是自然通常有在空間上還是有一定的 correlation

// 這正是 Ken Perlin 當時在思考的，可看下面進一步了解他的思路
// 這讓 Random 本身帶有 Organic 的感覺

// float i = floor(x);  // integer
// float f = fract(x);  // fraction

// y = rand(i);
// y = mix(rand(i), rand(i + 1.0), f);
// y = mix(rand(i), rand(i + 1.0), smoothstep(0.,1.,f));

// 其實不一定要用 rand，可以是任何函數例如調變 sin(1.7x) + sin(2.3x)

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

float random2 (vec2 st) {
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)));
    return -1.0+2.0*fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

vec2 random3 (vec2 st) {
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0+2.0*fract(sin(st)*43758.5453123);
}

// 如果套用到 2D 就是對某參考點周圍 4 點的值去運算，所以又稱 value noise
float vnoise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random2(i);
    float b = random2(i + vec2(1.0, 0.0));
    float c = random2(i + vec2(0.0, 1.0));
    float d = random2(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve. Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// 上面方法因為是從 random value 疊加出來的，所以又稱 Value Noise
// 缺點是雜訊本身會看起來一塊塊的，因此 Ken Perlin 改良出 Gradient Noise
// 疊加的對象從某些特定的 Value 改為漸進式的 Gradient 值
float gnoise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = dot(random3(i), f);
    float b = dot(random3(i + vec2(1.0, 0.0)), f - vec2(1.0,0.0));
    float c = dot(random3(i + vec2(0.0, 1.0)), f - vec2(0.0,1.0));
    float d = dot(random3(i + vec2(1.0, 1.0)), f - vec2(1.0,1.0));

    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    // 5*5 grid noise
    vec2 pos = vec2(st*5.0);
    float n = vnoise(pos);
    //float n = gnoise(pos);

    gl_FragColor = vec4(vec3(n), 1.0);
}

// Inigo 有實作這兩種 noise 的差異以及對 fbm 的影響
// vnoise: https://www.shadertoy.com/view/lsf3WH
// gnoise: https://www.shadertoy.com/view/XdXGW8

// 1. 其實可以更活用，好比說把 noise 加在 position 上，就可給單調的平行線木頭的質感
// 2. 或是加在 distance field 上產生噴濺的效果
// 3. 也可以拿來調變線條本身
// https://thebookofshaders.com/edit.php#11/wood.frag
// https://thebookofshaders.com/edit.php#11/splatter.frag
// https://thebookofshaders.com/edit.php#11/circleWave-noise.frag

// 試試看畫出大自然的東西，e.g. 大理石, 岩漿, 水流
// 或是調變形狀, 物體運動, 生成藝術

// 看到 Improved Noise
