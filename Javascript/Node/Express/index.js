// 前端傳 Url + Verb 給後端作為 request
// 後端傳 Status Code + Message Body 給前端作為 Response

// Express 定義了各種 middlewares 來協助 client 與 server 進行溝通
// 另外 Routing 定義了端點 endpoints (URIs) 並描述如何對 client 端做出回應
// Express 的 app 物件提供了各種對應於 HTTP methods (Verb) 的方法，使用如下：

// express 常數是一個 express 模組回傳的函數
const express = require('express');
// 使用 express 函數會回傳一個 app 物件
const app = express();
// 讀取 process 這個全域變數，若環境變數有預先設定 port 則優先使用
const port = process.env.PORT || 3000;

// 讓 server 監聽特定 port
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

// 此 app 物件有下面幾種方法：
// app.get();    讀取
// app.post();   新增
// app.put();    更新
// app.delete(); 刪除
// 主要是與 http 動詞配合，透過物件來呼叫 http module 的各種方法

// app.all(); 會處理任何的 HTTP methods
// app.use(); 可以指定 middlewares 作為 callback function

// 用 express.static 的 middleware 使用 public 下的資源
// 在這個例子訪問 localhost:3000 可渲染 index.html 到 client 端
app.use(express.static(__dirname + '/public'));

// 可搭配使用 nodemon 開發，可將儲存後的變更即時更新
// 也可使用 curl 用 terminal 的方式快速測試後端 route 相關的語法 (brew install curl)

// GET method route
app.get('/', function (req, res) {
  res.send('GET request to the homepage')
  // 這裡不會被執行，因為被 express.static 優先使用了...
  // curl http://localhost:3000
})

// POST method route
app.post('/', function (req, res) {
  res.send('POST request to the homepage')
  // curl -X POST http://localhost:3000
})

// PUT method route
app.put('/', (req, res) => {
  res.send('PUT request to the homepage')
  // curl -X PUT http://localhost:3000
});

// DELETE method route
app.delete('/', (req, res) => {
  res.send('DELETE request to the homepage')
  // curl -X DELETE http://localhost:3000
});

// 收到 route 為 /api 的 GET method 會執行
app.get('/api', (req, res) => {
  // Request URL: http://localhost:3000/api
  const arr = [1,2,3]
  res.send(`GET ${arr} from the api`);
});

// 下面為接收 client 端 POST 的範例
const messages = {};
// body-parser 解析傳送資料的 body
const bodyParser = require('body-parser');
// 用 uuid 產生唯一的 id
const { v4: uuidv4 } = require('uuid');
app.use(bodyParser.json());
// bodyParser.json() 為 middleware
// 會解析 text 為 json 物件並將結果放到 req.body
// 也可使用 express 裡的方法 app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// bodyParser.urlencoded() 為 middleware
// 會解析 text 為 URL encoded data 並將結果放到 req.body
app.post('/api', function (req, res) {
  // Request URL: http://localhost:3000/api
  const id = uuidv4();
  // req.body 為前端 POST 來的 {name: 'Hubot', login: 'hubot'}
  const message = req.body;
  messages[id] = message;

  console.log(messages)
  res.send(`POST ${JSON. stringify(message)} to the api`)
  // curl -X POST -H "Content-Type:application/json" http://localhost:3000/api -d '{name: 'Hubot', login: 'hubot'}'
})

// 如果 route 重複使用，只會執行程式碼最上面的那個
// 除非使用 next() 語法，換傳給下一個 middleware

// 收到任何 route 為 /secret 的 HTTP methods 都會執行
app.all('/secret', function (req, res, next) {
  // Request URL: http://localhost:3000/secret
  console.log('Accessing the secret section ...')
})

// 此寫法好處在於每個 http 物件都是各自獨立的，可以把 route 做出分類
// 比使用內建的 http module 來寫來的易讀好維護

// Route path 表示法有下面三種：
// 1. string: 一般的字串例如 /about /random.txt
// 2. string pattern: '/ab?cd' 能夠與 /acd, /abcd 的 route 匹配
//                    '/ab+cd' 能夠與 /abcd, /abbcd, /abbbcd 的 route 匹配
//                    '/ab*cd' 能夠與 /abcd, /abxcd, /abxyzcd 的 route 匹配
//                    '/ab(cd)?e' 能夠與 /abe, /abcde 的 route 匹配
// 3. Regex: /a/ 能夠與有 a 在裡面的 route 匹配
//           /.*fly$/ 能夠與有 butterfly 在裡面的 route 匹配 (但不會匹配 butterflyman)

// Route parameters 可以儲存 Route path 裡的參數，使用如下：
app.get('/api/:year/:month',(req, res) => {
  // 若 Request URL 輸入 /api/2020/9
  // 則 req.params 物件為 {"year":"2020","month":"9"}
  res.send(req.params);
});

// 也可以搭配 - 或 . 使用，若搭配 Regex 要外加 ()

// Route path:  /:from-:to
// Request URL: /LAX-SFO
// req.params: { "from": "LAX", "to": "SFO" }

// Route path:  /:genus.:species
// Request URL: /Prunus.persica
// req.params: { "genus": "Prunus", "species": "persica" }

// Route path: /user/:userId(\d+)
// Request URL: /user/42
// req.params: {"userId": "42"}

const courses = [
  {id:1, name:'course1'},
  {id:2, name:'course2'},
  {id:3, name:'course3'}
];

app.get('/courses/:id',(req, res) => {
  // 若輸入 /courses/2，則回傳
  // {id:2, name:'course2'}
  let course = courses.find(
    courses => courses.id === parseInt(req.params.id)
  );
  // 錯誤處理可以用 res.status()
  if (!course) {
    res.status(404).send('404 not found');
    return ;
  }
  res.send(course);
});

// query 會儲存回傳 ? 後的字串成為 key/value pairs
app.get('/query',(req, res) => {
  res.send(req.query);
  // 若 Request URL 輸入 /query?key1=value1&key2=value2
  // 則 req.query 為 {"key1":"value1", "key2":"value2"}
});

// Route handlers

// 可以使用 next() 來處理多個 callback 來達到類似 middleware 的效果
app.get('/handlers/1', function (req, res, next) {
  console.log('the response will be sent by the next function ...')
  // 使用前記得要引入 next 參數
  next()
}, function (req, res) {
  // 如果沒有 next(), 則執行完就會結束這個 request-response cycle
  res.send('get from /handlers/1')
})

// 也可以使用 array 放入 callback
// 下面例子會依序執行 h0, h1, h2
var h0 = function (req, res, next) {
  console.log('h0')
  next()
}
var h1 = function (req, res, next) {
  console.log('h1')
  next()
}
var h2 = function (req, res) {
  res.send('get from handlers/2')
}
app.get('/handlers/2', [h0, h1, h2])

// array 也可和 function 混著使用
app.get('/handlers/3', [h0, h1], function (req, res, next) {
  console.log('the response will be sent by the next function ...')
  next()
}, function (req, res) {
  res.send('get from /handlers/3')
})

// Response methods
// res.download()   提示下載檔案
// res.end()        表示 response process 的結束
// res.json()       發布 JSON response
// res.send()       發布各式種類的 response
// res.sendFile()   發布資料夾
// res.status()     設定 response 的 status code

// res.sendStatus() 
// 設定 status code 並把訊息以字串的形式放在 response body
// res.sendStatus(200) 等效於 res.status(200).send('OK')
// res.sendStatus(403) 等效於 res.status(403).send('Forbidden')
// res.sendStatus(404) 等效於 res.status(404).send('Not Found')
// res.sendStatus(500) 等效於 res.status(500).send('Internal Server Error')

// 可使用 app.route 統一管理相同 Route path 下的 HTTP methods
app.route('/book')
  .get(function (req, res) {
    res.send('Get a random book')
  })
  .post(function (req, res) {
    res.send('Add a book')
  })
  .put(function (req, res) {
    res.send('Update the book')
  })

// 可以使用 express.Router 把 router 模組化
// 例如在 bird.js 寫下：
// const express = require('express');
const router = express.Router();
router.get('/myroute', function (req, res) {
  res.send(`Hello Bird`)
})
// module.exports = router
// 並在另一個 js 檔匯入模塊
// const birds = require('./birds');
// const express = require('express');
// const app = express();
// app.use('/birds', birds);
// 即可使用 /birds/myroute 訪問

// middleware
// middleware 函數接收三個輸入參數： request、response、next
var myLogger = function (req, res, next) {
  // 將時間寫入 req 的 requestTime 屬性
  req.requestTime = Date.now();
  next()
}
// 使用 app.use 載入 middleware
app.use(myLogger);
app.use(function (req, res, next) {
  console.log(`time ${Date.now()}`)
  next()
})
// 可設定在某些特定的 route 才使用此 middleware
app.use('/user/:id', function (req, res, next) {
  console.log('Request Type:', req.method)
  next()
})
// 在 app.use 後方所執行的所有 app method
// 使用前都會先依序執行上方的 middleware 的函數
app.get('/mid/1', function (req, res) {
  // 被 request 到會執行 myLogger() 然後 cosole.log() 出時間
  // 最後在 res.send 出結果給 client
  res.send(`time ${req.requestTime}`)
})
app.get('/user/:id', function (req, res) {
  // 同上，但會多 console.log() 出 req.method
  res.send(`GET from user ${req.params.id}`)
})

app.get('/apple/:id', function (req, res, next) {
  // next('route') 會跳過後面的 middleware
  // 所以若為 /apple/0 則會直接到 res.send('special')
  if (req.params.id === '0') next('route')
  // 使用 next() 送給下一個 middleware 即 res.send('regular')
  else next()
}, function (req, res, next) {
  // 不為 /apple/0 會送出的 response
  res.send('regular')
})
app.get('/apple/:id', function (req, res, next) {
  // /apple/0 會送出的 response
  res.send('special')
})

// 若要搭配 const router = express.Router(); 使用
// 只要把上面 middleware 寫法裡的 app 改為 router 即可

// middleware 有模組化的寫法
// 在 my-middleware.js 寫下
// module.exports = function (options) {
//   return function (req, res, next) {
//     console.log('use my-middleware')
//     next()
//   }
// }
// 在另一個檔案寫下
// var mw = require('./my-middleware.js')
// app.use(mw({ option1: '1', option2: '2' }))

// 內建的 middleware
// express.static：提供靜態資源例如： HTML、圖檔 ...等
// express.json： 使用 JSON payloads 解析傳入的請求
// express.urlencoded： 使用 URL-encoded payloads 解析傳入的請求

// express.static 使用如下： 
// 若 public 資料夾下有 image.jpg 則可以用
// http://localhost:3000/image.jpg 獲取該資源
app.use(express.static('public'));
// 此外，express.static 可使用不只一次，以提供多個資料夾下的資料
app.use(express.static('files'));
// 也可建立虛擬路徑字首如下
// http://localhost:3000/static/image.jpg 獲取該資源
app.use('/static', express.static('public'));
// 不過此上方的路徑都是相對於此 node 啟動的目錄
// 建議寫為下方的絕對路徑比較保險
app.use('/static', express.static(__dirname + '/public'));
// 若 request URL 重複則會優先使用最上面的，下面的不會執行

// Restful API 
// 透過 HTTP 這個傳輸協定所提出了一個溝通的「風格」
// 符合 REST 設計風格的 Web API 稱為 RESTful API
// 資源是由 URI(名詞) 指定，對資源的操作(動詞)包括：
// 獲取、創建、修改、刪除，即 GET、POST、PUT、DELETE
// 為正確的 HTTP status code

// CRUD Operations
// 為 http 協定下四個對資料的動作的縮寫：
// Create、Read、Update、Delete
// 分別對應 HTTP 動詞的 Post、Get、Put、Delete 

// HTTP 動詞
// 取得資源清單       -> GET  /resources
// 新增資源          -> POST /resources
// 取得單一資源       -> GET  /resources/:id
// 修改單一資源       -> PUT  /resources/:id
// 刪除單一資源       -> DELETE /resources/:id
// 更新部份內容       -> PATCH /resources
// 只回傳HTTP header -> HEAD /resources/:id

// URI 原則
// 由 prefix + API endpoint 組成
// Prefix 可有可無，例如/api或/api/v1，API endpoint的設計，幾個重要原則：
// 一般資源用複數名詞，例如 /books 或 /books/123
// 唯一資源用單數名詞（即對client而言只有一份的資源），例如 /user
// 資源的層級架構，可以適當反應在 API endpoint 設計上，例如 /books/123/chapters/2
// URI component 都用小寫

// client 端要傳給 server 端 http header 讓 server 端了解目的，其中
// Authorization: 認證資訊
// Accept: 能夠接受的回應內容類型 (Content-Type)，屬於內容協商的一環，有下面幾種
// 接收 純文字 -> Accept: text/plain
// 接收 HTML  -> Accept: text/html
// 接收 JSON  -> Accept: application/json

// API 回傳的結果，應使用適當的 HTTP status code
// 1xx -> 訊息
// 2xx -> 成功
// 3xx -> 重導向
// 4xx -> 用戶端錯誤
// 5xx -> 伺服器端錯誤

// 常見的 status code
// 200 OK
// --
// 301 Moved Permanently
// 302 Found
// 304 Not Modified
// --
// 400 Bad Request
// 401 Unauthorized
// 403 Forbidden
// 404 Not Found
// 405 Method Not Allowed
// 408 Request Timeout
// --
// 500 Internal Server Error
// 502 Bad Gateway

// URL 結構大致如下：
// 以 http://localhost:3000/about?test=1#history 為例，其中
// http 為協定
// localhost 為主機名稱 ( www.bing.com 也是)
// :3000 為連接阜
// about 為路徑 (route)
// ?test=1 為查詢字串
// #history 為片段
// 


