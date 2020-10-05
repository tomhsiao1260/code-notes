// dotenv 負責將敏感資訊存放在環境變數內 (server side only)
import 'dotenv/config';
// npm install dotenv --save
// 會透過讀取 .env 檔，把 key-value pair 存到 node.js 的 process.env
// .env 裡主要放一些敏感資料例如密碼，應該加入 .gitignore
// 獲取環境變數
console.log('envPassword:', process.env.MY_SECRET);
// 刪除環境變數
delete process.env.MY_SECRET;

// bcrypt 負責處理密碼的 hash 加密
import bcrypt from 'bcrypt';
// npm install bcrypt --save
// saltRounds 越高安全層級就越高
const saltRounds = 10; 
const myPassword = 'password1';
const testPassword = 'password2';
// myHash 為事先經過 bcrypt.hash 與 myPassword 產生的 hash
// 會在與 myPassword 做 bcrypt.compare 顯示 true
const myHash ='$2b$10$RrbcdJtXiu5g255oSbyxaugS8CPuGLArHrq3KzHhLWJGZavoEq1nq';

// 產生 hash 的方法
bcrypt.hash(myPassword, saltRounds).then(function (hash) {
  console.log('myHash:', hash); });

// 密碼驗證
bcrypt.compare(myPassword, myHash).then(function (res) {
  console.log('myPassword:', res); }); // true
bcrypt.compare(testPassword, myHash).then(function (res) {
  console.log('testPassword:', res); }); // false

// 實作上只要存 hash 到資料庫內，不用存 myPassword
// 只要 user 輸入正確的密碼就會與 hash 匹配而回傳 true