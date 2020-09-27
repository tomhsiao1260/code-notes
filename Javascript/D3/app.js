// d3.js 是一個可以用 svg 渲染圖案的資料視覺化 JS 函式庫
// svg 是向量檔的一種，清晰度不受圖行縮放影響，檔案大小也比傳統的 jpg, png 小

// 若要搭配 npm 和 webpack 使用可下指令
// npm install d3 --save
// 在腳本上方寫入 import * as d3 from "d3";
// 即可套用下面寫法 
// 注意網路上 5 版以前的寫法不同，以 5 版和以後的版本為主

// 用 select 選取標籤 (只會選到第一個符合的標籤)
// 用 selectAll 可以選取所有符合的標籤
const canvas1 = d3.select('.canva_1');

// 在內部 append 一個 <svg></svg> 的標籤
// 並用 attr 指定屬性值
const svg1 = canvas1.append('svg')
                  .attr('width',100)
                  .attr('height',150);
// 也可以直接在 html 創一個 <svg></svg>
// 然後使用 const svg1 = canvas1.select('svg')

// 圓形
svg1.append('circle').attr('cx',50)
                    .attr('cy',50)           // 圓心座標
                    .attr('r',40)            // 半徑
                    .attr('stroke','yellow') // 邊線顏色
                    .attr('stroke-width',4)  // 邊線寬度
                    .attr('fill','blue');    // 內部填色

// 長方形
svg1.append('rect').attr('width',30)
                  .attr('height',20) // 寬和高
                  .attr('x',35)
                  .attr('y',40)      // 左上角座標
                  .attr('rx',10)
                  .attr('ry',10);    // 角的曲率

// 線
svg1.append('line').attr('x1',50)
                  .attr('y1',10)     // 起始座標
                  .attr('x2',50)
                  .attr('y2',50)     // 終止座標
                  .attr('stroke','yellow');

// 文字
svg1.append('text').text('Hello World') // 文字內容
                  .attr('x',50)         // 文字參考點
                  .attr('y',120)
                  // text-anchor 決定 x,y 的參考點
                  // 有 start, middle, end 三種
                  .attr('text-anchor','middle')
                  .attr('font-size',15); // 字體大小


// 用 data 畫同心圓
var dataArray = [40,30,20,10];

const canvas2 = d3.select('.canva_2');

const svg2 = canvas2.append('svg')
                  .attr('width',100)
                  .attr('height',100);

const circle2 = svg2.selectAll('circle')
                    // data 一個個傳入資料
                    // 每遇到一個值，都會在 html 產生一個 <circle></circle>
                    // 並把該值傳入 circle 以便後續計算
                    .data(dataArray)
                    // enter 告訴 selectAll 當有 append 時記得選擇元素
                    .enter().append('circle')
                    .attr('cx',50)
                    .attr('cy',50)
                    // d, i 分別是 傳入的 值 和 index
                    .attr('r',function(d,i){return d})
                    .attr('fill',function(d){return `rgb(0,0,${d*6})`});

// 用 data 畫長條圖
const canvas3 = d3.select('.canva_3');

// 上面的 dataArray 是比較粗略的寫法
// 一般來說會用 d3 來 fetch 一個檔案 (或 url)，並轉為 json
d3.json('text.json').then(dataArray=>{

const svg3 = canvas3.append('svg')
                    .attr('width',100)
                    .attr('height',100);
  
const circle3 = svg3.selectAll('rect')
                    .data(dataArray)
                    .enter().append('rect')
                    // 也可用 arrow function 取值，只需要 d 可略括號
                    .attr('fill',d=>d.fill)
                    .attr('width', d=>d.width)
                    .attr('height',d=>(d.height*2))
                    .attr('x',(d,i)=>(i*(d.width+1)))
                    .attr('y',d=>(100-(d.height*2)));
});
