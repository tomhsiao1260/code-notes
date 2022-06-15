console.log('Hello World');

// 根據 yaml 的 config，腳本會被 host 在 :3000，可以透過 :27017 連接到資料庫

// 1. 沒用 docker compose 可以用下面方式跟 DB 溝通
// MongoClient.connect('mongodb://admin:password@localhost:27017', ...);
// MongoClient.connect('mongodb://admin:password@mongodb:27017', ...);

// 2. 用 docker compose 不用指定 port，會自動管理
// MongoClient.connect('mongodb://admin:password@mongodb', ...);