Development
------
tutorial : https://webpack.js.org/guides/development/

安裝 : npm install
 
Watch Mode
------
執行 : npm run watch

並開啟 dist 下的 index.html，按按鈕會輸出 console
修改 src 下的 print.js，重新整理看看 console 的變化

webpack-dev-server
------
執行 : npm start

會自動開啟 localhost:8080，按按鈕會輸出 console
修改 src 下的 print.js，不用重新整理看看 console 的變化

webpack-dev-middleware
------
先把 webpack.config.js 裡的 publicPath: '/', 取消註解

執行 : npm run server

開啟 localhost:3000，按按鈕會輸出 console
修改 src 下的 print.js，重新整理看看 console 的變化
測試完記得再把 publicPath: '/' 加回註解

