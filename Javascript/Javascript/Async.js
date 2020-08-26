// 大部分的程式語言都是 synchronous (同步) 的在執行
// 也就是說，在同一個執行緒裡面的指令是依序的被執行
// 在前面一個指令執行結束之前，下一個指令是被 block 住的

// 有些時候需要非同步(asynchronous)的執行程序
// 讓一些較花時間的指令被呼叫時，可以以 non-blocking 的方式執行
// 也就是說讓程式可以當下就把執行的控制權要回來(以繼續執行下一個指令)
// 並且 branch 出另外的執行緒來執行這個較花時間的指令，
// 而且雙方約定好一個通知的方式 (e.g. callback function)
// 讓對方完成的時候(不管是成功或是失敗)，本來的程式都會立即知道

// JavaScript，如同其他語言，都是同步/blocking 在執行的
// 但它提供了 non-blocking 的非同步 I/O methods
// 以便和瀏覽器的其他引擎、處理器互動
// 非同步 I/O 例如：AJAX, WebSocket, DB access, ‘fs’ module in node.js

function waitThreeSeconds(){
  var ms = 1000 + new Date().getTime();
  while(new Date() < ms) {}
  console.log("finished function");
}

console.log("started execution");
waitThreeSeconds();
setTimeout( () => console.log("timeout"), 50);
console.log("finished execution");

// 會依序打印
// started execution
// finished function
// finished execution
// timeout

// setTimeout、setInterval、fetch、addEventListener 是非同步語法
// 這類方法不會 block，會先繼續執行後面的指令
// 其他幾行為同步的語法，則會依序被執行

// -------------------------------------------------------------

function loginUser(email, callback) {
	setTimeout( () => {
		callback({ userEmail: email });
	}, 100);
}

var user = loginUser("abc@gmail.com", (user) => {
	console.log(user); 
});

// 輸出結果為 {userEmail: 'abc@gmail.com' }
// callback function 是一個被作為參數帶入另一個函式中的「函式」
// 這個被作為參數帶入的函式將在「未來某個時間點」被呼叫和執行，以確保執行的先後順序
// 這是處理非同步事件的一種方式
// 常被 setTimeout、setInterval、fetch、addEventListener 所使用

function getUserVideos(email, callback){
	setTimeout(() => {
		callback(["video1","video2"]);
	}, 100);
}
function videosDetails(video, callback){
	setTimeout(() => {
		callback('title');
	}, 100);
}

var user = loginUser("abc@gmail.com", user => {
	console.log(user); 
	getUserVideos(user.userEmail, videos => {
		console.log(videos);
		videosDetails(videos[0], title => {
			console.log(title);
		})
	})
});

// 依序打印出 {userEmail: 'abc@gmail.com' }, ["video1","video2"], 'title'
// 若想要在非同步的語法能照著順序先後執行，則需要一直 callback 下去
// 這樣會出現 callback hell，是個不一維護、不易懂的結構

// -------------------------------------------------------------

// 用 Promise 取代 callback 為較好的寫法
var promise = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve({user: "Tom"});
		// reject(new Error("not found"));
	}, 100);
})

promise
	.then(user => console.log(user))
	.catch(err => console.log(err));

// 使用 resolve 表示成功，會走 then 輸出 {user: 'Tom'}
// 使用 reject 表示失敗，會走 catch 輸出 not found 的錯誤
// catch 後面還是可以繼續加 then
// Promise 是一個物件，代表著一個尚未完成，但最終會完成的一個動作
// 在一個「非同步處理」的流程中，它只是一個暫存的值（Placeholder)

// 上面的 callback hell 可用 Promise 改寫如下
function loginUser_(email){
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({userEmail: email});
		}, 100);
	})
}
function getUserVideos_(email){
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(["video1","video2"]);
		}, 100);
	})
}
function videosDetails_(video){
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('title');
		}, 100);
	})
}

loginUser_('cba@gmail.com')
	.then(user => getUserVideos_(user.userEmail))
	.then(videos => videosDetails_(videos[0]))
	.then(detail => console.log(detail));

// user 為 {userEmail: cba@gmail.com}
// videos 為 ["video1","video2"]
// detail 為 'title'
// 因為回傳的是 Promise，所以可以一直用 then 的寫法連接，較為簡潔易維護

// -------------------------------------------------------------

// 上面的語法也可用下面的語法糖修飾為更直覺的寫法，但內部的運作都是相同
var user = loginUser_('cba@gmail.com');
var videos = getUserVideos_(user.email);
var detail = videosDetails_(videos[0]);

// user   為 Promise { { userEmail: 'cba@gmail.com' } }
// videos 為 Promise { [ 'video1', 'video2' ] }
// detail 為 Promise { 'title' }

const yt = new Promise(resolve => {
	setTimeout(() => {
		resolve({ videos: [1,2,3,4,5]});
	}, 100)
})
const fb = new Promise(resolve => {
	setTimeout(() => {
		resolve({ user: "Name"});
	}, 200)
})

// Promise.all 語法會等內部的 Promise 全部跑完才會執行
// 輸出 [ { videos: [ 1, 2, 3, 4, 5 ] }, { user: 'Name' } ]
Promise.all([yt, fb]).then(result => console.log(result));

// Promise.race 語法只會執行最先完成的 Promise
// 輸出 { videos: [ 1, 2, 3, 4, 5 ] }
Promise.race([yt, fb]).then(result => console.log(result));

// -------------------------------------------------------------

// Promise 寫法也可用 async function 搭配 await 的語法糖，在寫法上更直觀
async function display(){
	const loggedUser = await loginUser_("eee@gmail.com");
	// loggedUser 為 { userEmail: 'eee@gmail.com' }
	const videos = await getUserVideos_(loggedUser.userEmail);
	// videos 為 [ 'video1', 'video2' ]
	const detail = await videosDetails_(videos[0]);
	// detail 為 'title'
}
// await 語法後也可以接 fetch，因為都是回傳 Promise

display();

// 注意 await 只接受 Promise，但回傳得不是 Promise 而是內部得到的東西
// 在 async function 內寫 try...catch 的語法，就可以做到除錯的功能
// await 也可搭配 Promise.all 語法

// 可用 await 語法在 async 內簡單實作過一段時間後想執行的指令
async function sleep(ms){
	console.log("clock start");
	await new Promise(resolve => setTimeout(resolve, ms));
	console.log(`after ${ms} ms`)
}

sleep(1000);

// Promise 為 ES6 出現的新語法
// Async 和 Await 則為 ES7 出現的新語法 

// -------------------------------------------------------------

// 1 秒後回傳 5 個 5
for( var i = 0; i < 5; i++ ) {
  setTimeout(function() {
    console.log(i);
  }, 1000);
}
// 因為為非同步，所以會一起執行，使用 var 所以 i 最終為 5

// 使用立即被呼叫的函式 IIFE
for( var i = 0; i < 5; i++ ) {
  (function(x){
    setTimeout(function() {
      console.log(x);
    }, 1000 * x);
  })(i);
  // IIFE 為 (function(x){...})(i) 的形式
  // 會將 i 即時傳入函式的 x 中
  // 如此一來會同時開 5 個 timer，分別為 0,1,2,3,4 秒
  // 並依序顯示 0,1,2,3,4
  // IIFE 寫法可減少「全域變數」的產生，同時也避免了變數名稱衝突的機會
}

// 但上方得寫法用 let 更為簡潔
for( let i = 0; i < 5; i++ ) {
  setTimeout(function() {
    console.log(i);
  }, 1000*i);
}
// 因為為非同步，所以會一起執行，使用 let 所以 i 分別為 0,1,2,3,4

// -------------------------------------------------------------

try{
// AJAX
// 為 Asynchronous JavaScript and XML 的簡稱
// 所謂的 AJAX 技術在 JS 中，即是以 XMLHttpRequest 物件 (簡稱為 XHR) 為主要核心的實作
// 它是用於客戶端對伺服器端送出 httpRequest 的物件，使用的資料格式是 XML (但後來多採用 JSON)
// 獲取 JSON 的資料後 parse 之後可以加以運用，是個非同步的過程
// 但因為 API 設計得過於高階(簡單)，彈性太小、除錯不易、命名等問題而漸漸比較少被使用

function reqListener () { console.log(this.responseText); }
var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "http://www.example.org/example.txt");
oReq.send();

// Fetch
// 是近年來號稱要取代 XHR 的新技術標準
// 它是基於 Promise 語法結構的，而且它的設計足夠低階，有更多彈性
// 語法上會接收了一個 url 作參數，並用 then 接收此次請求的相關資訊
// 成功的話會回傳一個包含 response 的 promise
// 只能在瀏覽器環境執行，在 node 環境要使用外部模塊

fetch('https://www.google.com')
    .then((res) => res.json()) // 將 response 轉為 json 形式
    .then((myJson) => myJson)  // myJson 為 json 形式
    .catch((err) => err);      // 線上的資料傳輸大多為 json 形式
							   // 常用的 res.json()、res.text() 的 parse 方法都會回傳 promise

fetch('https://www.google.com')
   .then((res)=> res.status)  // 顯示狀態碼 200 表示成功，0 表示處理本地檔案
   .catch((err) => err);      // 404 表示失敗

// 狀態碼
// 資訊回應 (Informational responses, 100–199)
// 成功回應 (Successful responses, 200–299)
// 重定向 (Redirects, 300–399)
// 用戶端錯誤 (Client errors, 400–499)
// 伺服器端錯誤 (Server errors, 500–599)

fetch('https://www.google.com').then(res => {
	if (!res.ok) throw new Error(res.statusText)
	// ok 代表狀態碼在範圍 200-299
	// statusText 回傳錯誤文字說明
	return res.json()
}).catch(function(err) {
    // Error
})

// 也可寫成下面這樣
function process(res) {
    if (res.status === 200 || res.status === 0) {
        return Promise.resolve(res)
    } else {
        return Promise.reject(new Error(res.statusText))
    }
}
fetch('https://www.google.com')
    .then(process)
    .catch()

// 用 fetch() 送 POST，語法 fetch(url, object)
// 可以要求更客製化的 request
fetch(url, {
    method: 'post',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'Hubot',
        login: 'hubot'
    })
});

// method: 可以是 get, post, put, delete
// headers: HTTP request header
// body: JSON.stringify 轉成 JSON 字串

}catch{}
// -------------------------------------------------------------





