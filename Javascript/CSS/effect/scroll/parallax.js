// 當 DOM 載入後，執行一次 parallax 特效
window.addEventListener("DOMContentLoaded", parallax);

// scroll 時會觸發，可用 window.scrollY 取得 scroll 的位置
window.addEventListener('scroll', event => {
    console.log(`It's scrolling! ${window.scrollY} ${window.scrollX}`)
    // parallax 特效
    parallax()
})
// 不像 translate 的例子要加一個 setTimout 限制 scroll 的觸發速度 
// parallax 計算上較不耗時 (translate 需判斷每個 items 的條件)
// 另外 parallax 需要快速更新，不然視覺上會卡卡的

// Parallax 特效
const bigYellowCircle = document.querySelector("#bigYellowCircle");
const blueSquare = document.querySelector("#blueSquare");
const greenPentagon = document.querySelector("#greenPentagon");

function parallax() {
  const xScrollPosition = window.scrollX;
  const yScrollPosition = window.scrollY;

  // 分別給予背景物件不同的偏移
  setTranslate(0, yScrollPosition * -0.2, bigYellowCircle);
  setTranslate(0, yScrollPosition * -1.5, blueSquare);
  setTranslate(0, yScrollPosition * .5, greenPentagon);
}

function setTranslate(xPos, yPos, el) {
  // 這裡的設計可以靈活一點
  el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}