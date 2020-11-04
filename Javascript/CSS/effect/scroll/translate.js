// 設定 items 數目
const num = 10

// 當 DOM 載入後，產生所有的 items，並依序用數字建立 id
window.addEventListener('DOMContentLoaded', () => {
  for (let i = 0; i < num; ++i) {
    const p = document.createElement('p') 
    p.id = i
    p.innerText = `ID ${i}`
    p.addEventListener('click', scrollTop); 
    // p.addEventListener('click', scrollShift); 
    // p.addEventListener('click', scrollElement); 
    document.querySelector('body').appendChild(p)
  }
  // 載入後執行特效
  transition()
})

// 因為 scroll 事件觸發太頻繁會影響效能，所以會搭配一個 setTimeout
// 過一段時間才觸發一次 transition()
let cached = null
window.addEventListener('scroll', event => {
  if (!cached) {
    setTimeout(() => {
      transition()
      // 可用 window.scrollY 取得 scroll 的位置
      console.warn(`It's scrolling THROTTLED! ${window.scrollY} ${window.scrollX}`)
      cached = null
    }, 100)
  }
  cached = event
})

// 判斷哪些 items 要執行特效
function transition() {
  for (let i = 0; i < num; ++i) {
    const item = document.getElementById(`${i}`)
    // 進入視窗的 items 執行特效 (即加上 active 的 class)
    if (isPartiallyVisible(item)) {
      item.classList.add("active");
    } else {
      // item.classList.remove("active");
    }
  }
}

// 判斷 item 是否進入視窗 (部分進入即可)
function isPartiallyVisible(el) {
  const elementBoundary = el.getBoundingClientRect();

  const top = elementBoundary.top;       // item 的上邊到螢幕上邊的距離（可正負）
  const bottom = elementBoundary.bottom; // item 的下邊到螢幕上邊的距離（可正負）
  const left = elementBoundary.left;     // item 的左邊到螢幕左邊的距離（可正負）
  const right = elementBoundary.right;   // item 的右邊到螢幕左邊的距離（可正負）
  const height = elementBoundary.height;

  // innerHeight 為螢幕的高 (不含工具列)
  return ((top + height >= 0) && (height + window.innerHeight >= bottom));
}
 
// 判斷 item 是否進入視窗 (需要全部進入)
function isFullyVisible(el) {
  const elementBoundary = el.getBoundingClientRect();

  const top = elementBoundary.top;
  const bottom = elementBoundary.bottom;

  return ((top >= 0) && (bottom <= window.innerHeight));
}

// Scroll to specific values
function scrollTop() {
  // scrollTo is the same
  window.scroll({
    top: 0, 
    left: 0, 
    behavior: 'smooth'
  });
}

// Scroll certain amounts from current position 
function scrollShift() {
  window.scrollBy({ 
    top: 500, // could be negative value
    left: 0, 
    behavior: 'smooth' 
  });
}

// Scroll to a certain element
function scrollElement() {
  document.getElementById('5').scrollIntoView({ 
    behavior: 'smooth' 
  });
}

