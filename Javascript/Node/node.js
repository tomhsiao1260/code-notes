// Node.js 是個可以在 browser 外運行的跨平台開源環境 Runtime Enviroment

// 每種 browser 都有屬於自己的 JS Engine，把撰寫的 code 轉化成可執行的機器語言
// 正是因為這些引擎的緣故，JS 在不同瀏覽器上可能會有不同的表現

// Node.js 使用了 Google 的 V8 引擎、並嵌入一個 C++ 的程式叫做 Node.exe
// 整個 Node.js就是包含一個 V8 引擎和一些額外的 module，讓 JS 也能執行

// Node.js 的偶數版本有 LTS (long-term support)，奇數則無
// 現在 Web 開發後端開發多以 Node 為主，有逐年增長的趨勢 (Java 搭配 maven 次之)

// Node.js 有一些內建的 module，例如：
// File system、Http、Operation system
// Path、Process、Query String、Stream

// node 內建 API document: 
// https://nodejs.org/dist/latest-v10.x/docs/api/

// path Module 處理與路徑有關
const path = require('path');

__filename; // 檔案名稱 ./path/fileName.js
__dirname;  // 檔案路徑 ./path

path.parse(__filename); // 會回傳一個與路徑有關解析過的物件

// Operation system Module 處理與環境作業系統有關
const os = require('os');
os.totalmem(); // 總記憶體容量
os.freemem();  // 閒置記憶體容量

// File system Module 處理與檔案有關
const fs = require('fs');
fs.readdir('./myFile', function (err, files) {
  if (err) { err; } // error 物件
  else { files; };  // 為矩陣，列出 myFile 下所有檔案名稱
})

// Event Module 處理與事件互動有關
const EventEmitter = require('events');
const emitter = new EventEmitter();
// on 方法表示收到某事件發生後該執行什麼事，on 也可寫成 addListener
emitter.on('eventA', () => console.log('eventA is called'));
// emit 方法可送出以告知某個事件發生了 
emitter.emit('eventA');
// 也可透過 emit 傳入參數
emitter.on('eventB', (e) => console.log(`eventB get id: ${e.id}`));
emitter.emit('eventB', {id: 1});

// 一般會搭配使用 class 語法，以實現模組化
class Logger extends EventEmitter { 
	log(msg) {
		//Send an HTTP request
		console.log(msg);
		// raise the event
		this.emit('eventC', {id: 1});
		// 有個隱藏的建構式，所以這個 this 指向 EventEmitter
	}
}
module.exports = Logger;

// 可在另一個檔案寫下
const myLogger = require('./node.js');
// 利用 new 關鍵字呼叫 Logger class 的建構式 (constructor) 建立新物件
// Logger 中的 extends，使新物件的原型物件指向 EventEmitter
const logger = new myLogger();
logger.on('eventC',  (e) => {
	//也在新物件上註冊事件監聽
	console.log(`eventC get id: ${e.id}`);
})
logger.log('some message'); // 依序顯示 'some message', 'eventC get id: 1'
// 事實上，許多的 module 的源頭都指向 Event Module
// 以便使用 emit, on 這類的方法，例如：HTTP、socket

// HTTP Module
const http = require('http');
const server = http.createServer();
//因為繼承自 Event 模組，可以加上事件監聽
server.on('connection', (socket) => { 
	console.log("New connection...");
});
// 若連上 localhost:3000 會觸發 on 顯示 New connection...
server.listen(3000);
console.log('Listening on port 3000...');

// 一般會用下面寫法取代 server.on 寫法
// 用 req 跟 res 就可以直接監聽網路連線的情形

// const server = http.createServer((req, res) => {
//   if (req.url === '/') {
//     res.write('Hello World!');
//     res.end();
//   }
//   if (req.url == '/api/course') {
//	   res.write(JSON.stringify([1, 2, 3]));
//     res.end();
//   }
// });

// 像上面線性地增加不同的 route 以後會很難維護
// 所以使用 express 這類的框架可以協助後端程式的開發更順暢








