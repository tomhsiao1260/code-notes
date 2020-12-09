// 大部分的程式語言都是 synchronous (同步) 執行
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

// 要讓 callback 易讀可以
// 1. 拆成多個較小的函式 shallow code
// 2. 模組化 modularize
// 3. 例外處理 handle every single error

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
// const sleep = async(ms) => { something... } 也可寫成這樣 

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

// 前後端在傳輸資料必須是字串的形式，所以需要把 JSON 變成字串傳輸再解析為 JSON 的物件
var obj = {id:0, name:'Tom'};
var str = JSON.stringify( obj ); // 轉為字串傳輸
var newObj = JSON.parse(str);    // 解析回物件使用
                                 // newObj.name 為 Tom                               

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
// 它是基於 Promise 語法結構，而且設計足夠低階，有更多彈性
// 語法上會接收了一個 url 作參數，並用 then 接收此次請求的相關資訊
// 成功的話會回傳一個包含 response 的 promise
// 只能在瀏覽器環境執行，在 node 環境要使用外部模塊

fetch('https://www.google.com')
    .then((res) => res.json()) // 將 response 轉為 json 形式
    .then((myJson) => myJson)  // myJson 為 json 形式
    .catch((err) => err);      // 線上的資料傳輸大多為 json 形式
							   // 常用的 parse 方法為 res.json()、res.text()

fetch('https://www.google.com')
   .then((res)=> res.status)  // 顯示狀態碼 200 表示成功，0 表示處理本地檔案
   .catch((err) => err);      // 404 表示失敗

// 狀態碼 status code
// 資訊回應 (Informational responses, 100–199)
// 成功回應 (Successful responses, 200–299)
// 重定向 (Redirects, 300–399)
// 用戶端錯誤 (Client errors, 400–499)
// 伺服器端錯誤 (Server errors, 500–599)

fetch('https://www.google.com').then(res => {
	if (!res.ok) throw new Error(res.statusText)
	// ok 為 true 代表狀態碼在範圍 200-299
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
// 可以要求更客製化的 request，若沒有 object 的項則默認為 GET
fetch(url, {
    method: 'post',
    // 要帶一些 http header 讓 server 端了解目的
    // Authorization: 認證資訊
    // Accept: 能夠接受的回應內容類型 (Content-Type)，屬於內容協商的一環
    headers: {
    	// 接收 純文字 -> Accept: text/plain
	    // 接收 HTML  -> Accept: text/html
	    // 接收 JSON  -> Accept: application/json
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    // HTTP Body: JSON, 純文字，或XML格式
    // 善用一些 node.js 套件，例如：body-parser
    body: JSON.stringify({
        name: 'Hubot',
        login: 'hubot'
    })
});

// method: 可以是 get, post, put, delete
// headers: HTTP request header
// body: JSON.stringify 轉成 JSON 字串

// 使用 fetch 請求外部資源常會遇到同源問題 CORS
// Cross-Origin Resource Sharing
// 同源政策是基於瀏覽器安全性考量所定義的規範
// 規範了哪些資源可以跨源存取，哪些會受到限制，同源為：

// 同網域 Domain
// 同通訊協定 HTTP, HTTPS, FTP
// 同連接埠號 Port

// Fetch API 遵守同源政策，在這個情況下，其實請求已經發出去了，也拿到回應
// 但是基於同源政策，瀏覽器不把拿到的回應做進一步的處理
// 除非使用適當的 CORS 標頭，否則只能請求與應用程式相同網域的 HTTP 資源

// CORS 標頭的使用細節可參考下面文章：
// https://pjchender.github.io/2018/08/20/同源政策與跨來源資源共用（cors）/


}catch{}
// -------------------------------------------------------------
try{
// axios 為 AJAX 的 middleware 使得 fetch 的使用更加的方便
// 使用前需要安裝 yarn add axios

const axios = require('axios');

// 向特定 ID 的 user 提出 request
axios.get('/user?ID=12345')
  .then(function (response) {
    // handle success
  })
  .catch(function (error) {
    // handle error
  })
  .then(function () {
    // always executed
  });

// GET 等價寫法

// axios.get(url)
axios.get('/user?ID=12345')
// axios.get(url, config)
axios.get('/user', { params: { ID: 12345 }})
// axios(config)
axios('/user/12345');

// POST 等價寫法

// axios.post(url, config)
axios.post('/user/12345', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
// axios(config)
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});

// 也可改用 async 語法
const getUser = async () => {
  try {
    const { data } = await axios.get('/user?ID=12345');
    // handle success
  } catch (error) {
  	// handle error
  }
}

// 也可產生新的 axios instance 以共用一些重複的 config
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});
const instanceGet = async () => {
	// url: baseURL + /user?ID=12345
	const { data } = await instance.get('/user?ID=12345');
	return data;
}

// 搭配 Promise.all 使用多個請求
const getUserAccount = () => axios.get('/user/12345');
const getUserPermissions = () => axios.get('/user/12345/permissions');

Promise.all([getUserAccount(), getUserPermissions()])
  .then(function (results) {
    const acct = results[0];
    const perm = results[1];
  });

// 先傳入 request config
// 並獲得 response schema 

// Request Config 可參考 document，下面列出幾個：
const config = {
	// request 使用的 url
	url: '/user',
	// request method, GET 為預設
	method: 'get',
	// 會接在 url 前面作為 prefix
	baseURL: 'https://some-domain.com/api/',
	// 客製化的 headers 資料
	headers: {'X-Requested-With': 'XMLHttpRequest'},
    // url parameters
	params: {
      ID: 12345
	},
	// 以 request body 傳送的資料
	// 只適合在 'PUT', 'POST', 'DELETE , and 'PATCH' 使用
	data: {
      firstName: 'Fred'
    },
    // 字串的寫法
    data: 'Country=Brasil&City=Belo Horizonte',
}

// Response Schema 為回傳的物件
const schema = {
  // 從 server 端傳回的資料
  data: {},
  // Http status code
  status: 200,
  // Http status message
  statusText: 'OK',
  // 資料的 header 描述
  headers: {},
  // 提供給幫助 axios config 的撰寫資訊
  config: {},
  // 產生這個 response 的 request 來源
  // 是一個 XMLHttpRequest instance
  request: {}
}

// 官方教學： https://github.com/axios/axios
}catch{}





