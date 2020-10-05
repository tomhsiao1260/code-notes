// 瀏覽器物件模型 (BOM, Browser Object Model) 是瀏覽器提供的物件
// 以便可以透過 JavaScript 直接跟 browser 溝通或做操作

// 瀏覽器物件模型其實沒有一個統一標準，但現代瀏覽器都有提供以下的物件:

// window:    存取操作瀏覽器視窗
// screen:    存取使用者的螢幕畫面資訊
// location:  存取操作頁面的網址 (URL)
// history:   操作瀏覽器的上一頁、下一頁
// navigator: 存取瀏覽器資訊
// Popup:     使用瀏覽器內建的彈跳視窗
// Timer:     使用瀏覽器內建的計時器
// cookie:    管理瀏覽器的 cookie

// 取得瀏覽器視窗的可見範圍的寬度和高度，回傳數值，單位是 px
// inner 表示不包含工具列、捲軸
console.log(window.innerWidth);
console.log(window.innerHeight);
// outer 表示包含工具列、捲軸
console.log(window.outerWidth);
console.log(window.outerHeight);