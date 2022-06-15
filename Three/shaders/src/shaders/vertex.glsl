#define PI 3.1415926535897932384626433832795

uniform float uTime;
varying vec2 vUv;

void main()
{
    // 將轉換矩陣拆開來乘，就能夠對內部做一些變化

    // 可以透過改變其 xyz，去逐個改變每個 vertex 點的空間位置
    vec3 newPosition = position;
    // newPosition.z += sin(newPosition.x * 10.0 - uTime) * 0.1;
    // newPosition.z += sin(newPosition.y * 10.0 - uTime) * 0.1;

    // 因為 postion 為 attribute，無法變更，所以新增 newPostion
    // mesh 的一些 transforms 全部會作用在 modelMatrix 上
    // 所以在 vertices 的一些 tricks 盡量寫在 modelMatrix 作用之前

    // 1. modelPosition 為 mesh transform 後的座標
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);  
    // 2. viewPosition 為 camera transform 後的座標
    vec4 viewPosition = viewMatrix * modelPosition;
    // 3. projectedPosition 為 project 到 clip space 後的座標
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // 4. gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    gl_Position = projectedPosition;

    // 將內建的 uv 指派給 varying
    vUv = uv;
}

void syntx()
{
    // 下面是 GLSL 的基本語法

    // 沒有 Log 顯示 (因為平行運算，顯示某個點意義不大)
    // 末端要加 semicolon ;
    // 浮點數要加 . 且為強型別，不能型別轉換

    int v1 = 123;                            // 整數
    float v2 = 0.123;                        // 浮點數
    bool v3 = false;                         // 布林值
    float v4 = v2 * float(v1);               // 都要同型別
    vec2 v5 = vec2(1.0, 2.0);                // 二維向量
    vec3 v6 = vec3(1.0, 2.0, 3.0);           // 三維向量
    vec4 v7 = vec4(1.0, 2.0, 3.0, 4.0);      // 四維向量
    vec4 v8 = v7.xyzw;                       // (1.0, 2.0, 3.0, 4.0)
    vec4 v9 = v7.rgba;                       // (1.0, 2.0, 3.0, 4.0)
    vec2 v10 = v7.yx;                        // (2.0, 1.0)
    v7.x = 5.0;                              // 第一維改為 5.0
    v7 *= 2.0;                               // 每維都乘上 2
    vec2 v11 = vec2(0.0);                    // (0.0, 0.0)
    vec3 v12 = vec3(v11, 3.0);               // (0.0, 0.0, 3.0)
    vec4 v13 = vec4(v11.xy, vec2(5.0, 6.0)); // (0.0, 0.0, 5.0, 6.0)

    // 另外還有 mat2, mat3, mat4, sampler2D
    // 盡量不要在 GLSL 內寫 if 判斷式子，會降低效能，建議用一些 step 函式取代
    // 但可以使用迴圈 for(float i=1.0; i<=3; i++){ ... }

    // GLSL 有內建一些函式，使用方法可參考連結：
    // sin, cos, max, min, pow, exp, mod, clamp
    // cross, dot, mix, step, smoothstep, length
    // distance, reflect, refract, normalize

    mod(2.2, 1.0);        // 取餘數即 0.2，圖形會是一段段的漸層色
    step(0.5, 2.0);       // 此例基準為 0.5，小於此值回傳 0.0，大於則 1.0，會是一段段的分明線條
    abs(-1.0);            // 取絕對值，圖形常常左右對稱
    min(1.0, 2.0);        // 最小值，也就是會呈現兩張圖較暗處的疊圖，最大值則用 max (較亮處疊圖)
    floor(5.3);           // 回傳 5.0，即去尾數，圖型類似低解析度的馬賽克
    ceil(5.3);            // 回傳 6.0，直接進位，圖型類似低解析度的馬賽克
    length(2.3);          // 求某向量長度
    distance(1.0, 2.0);   // 可求兩向量間的距離
    atan(2.0, 1.0);       // 回傳 y=2, x=1 時的 atan 弧度
    clamp(3.0, 0.0, 1.0); // (x, min, max) 給一個 x，若超過範圍則只回傳 min, max 的值
    mix(1.0, 2.0, 0.3);   // (a, b, r) 回傳 (1-r)a + rb，常被用在混色

    // 上面函式若以向量傳入則會逐項運算並回傳向量，下面是參考資料：
    // https://www.shaderific.com/glsl-functions
    // https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/indexflat.php
    // https://thebookofshaders.com/glossary/
}

float f1( float a, float b ) { return a + b; } // 函式，回傳 float
void f2() { float a = 1.0; float b = 2.0; }    // 函式，不回傳

// 注意，GLSL 的 function 沒有 Hoisting 的功能，也不能寫在另一個函式內