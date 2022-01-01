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
	// 當 u 在 s~t 之間回傳 1，否則為 0
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;

  // 函數 y=x^3
  float y = pow(st.x,3.0);
  // 根據函數畫出灰階背景色
  vec3 color = vec3(y);
  // 根據函數畫出線
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

