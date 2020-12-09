// 使用 express 與前端溝通
import express from 'express';
const app = express();
const port = process.env.PORT || 5000;

// 因為前端在不同 port，會有跨域存取資源需求
// 使用 CORS 套件給予權限
import cors from 'cors';
app.use(cors());

// 使用 express router 讓 route 能模組化管理
// home 和 user 下的 route 都會分別加上 / 和 /user 的 prefix
import home from'./routes/home.js';
import user from './routes/user.js';
app.use('/', home);
app.use('/user', user);

// body-parser 能進一步 parse 來自前端的 request, response
import bodyParser from 'body-parser';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 讓 server 監聽特定 port
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

