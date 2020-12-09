frontend 
為 react 專案，架在 port 3000，要先載 axios

backend
為 node 專案，架在 port 5000，要先載 express, nodemon, cors, body-parser
此外，在 npm script 裡增添 type="module"，即可使用 import 語句

前端透過 axios 和後端使用 express 進行溝通
開始前要先將前後端專案都部署到對應的 port