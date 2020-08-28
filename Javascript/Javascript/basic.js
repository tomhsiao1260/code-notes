// Javascript 為腳本語言 (scripting language)
// Javascript 為直譯語言 (interpreted language)
// 即不需事先編譯 (compile)，直接在瀏覽器上執行

const { clear } = require("console");

// JavaScript 是一種動態 (dynamically typed)
// 弱型別 (weakly typed)，只有 var 型別 (或 const、let)
// 基於原型 (prototype based)
// 的物件導向程式語言 (object oriented programming language)
// 除了內建型別 (primitive types) 外，其他都是物件(objects) 

// 由 ECMA 組織來制定標準，因此也命名為 ECMAScript

var a = 100; // 數字都是 double
var b = 'hello';
var c;
typeof a;   // number
typeof b;   // string
typeof c;   // undefined
a = b;      // 會自動轉換型別
typeof a;   // string
typeof NaN; // number

// 內建型別   ： Boolean, Number, String, 
//             null, undefined, Symbol (ES6 語法)

// 複合資料型態： Array, Object              

// 運算子
// +(加) -(減) *(乘) /(除)
// %(餘數) **(次方) <<(二進位左移) >>(二進位右移)  
// &(AND) |(OR) ^(XOR) ~(NOT)
// >(大於) <(小餘) >=(大於等於) <=(小於等於)
// ==(等於判斷) !=(不等於判斷) ===(同==但不自動換型別) !==(同!=但不自動換型別)
// ++x(加再賦值) x++(賦值再加) --x x--
// +x 將x轉為數值

1 == '1';  // true
1 ==='1';  // false

9 << 2;    // 36
9 >> 2 ;   // 2
19 >>> 2;  // 4

15 & 9;    // 9
15 | 9;    // 15
15 ^ 9;    // 6

var foo = 'Cat' && 'Dog'; // Dog
var foo = false && 'Cat'; // false
var foo = 'Cat' || 'Dog'; // Cat
var foo = false || 'Cat'; // Cat
foo = !foo;               // false

(26 >= 18) ? 'adult' : 'minor'; // adault

// if 條件式
if (1==='1') {
    var result = 'if';
}
else if (1=='1') {
    var result = 'else if';
} 
else {
    var result = 'else';
} 

// primitive type 為 call by value
// 其他的 object 都是 call by reference

var a = 3;
var b = a;  // {a, b} = {3, 3}
b = 4;      // {a, b} = {3, 4}
a = 5;      // {a, b} = {5, 4} 

var i = { a:3 };
var j = i;
j.a = 4;   // i.a = 4
i.a = 5;   // j.a = 5


// switch 判斷式
var fruit = 'Banana';
switch (fruit) {
    case 'Orange':
        var result = 'Orange';
        break;
    case 'Apple':
        var result = 'Apple';
        break;
    case 'Banana':
    case 'Cherrie':
        var result = 'other';
        break;
    default:
        var result = 'None';
}

// for 迴圈
var counter = 0;

for (var i = 0; i < 5; ++i) {
    // i = 0,1,2,3,4
    counter += i;
    // i = 5 (有指定但沒跑進迴圈)
} 

for (;;) {// 判斷式不一定要寫
    ++i;
    // 跳過此輪
    if (i == 8) {continue;}
    // 跳出迴圈
    if (i >= 10) {break;}
    // i = 6, 7, 9
    counter += i;
}

// for ... of (ES6 語法)
var arr = [10, 20, 30];
var str = 'hello';
for (let value of arr) { value;} // 依序為 10 20 30
for (let value of str) { value;} // 依序為 h e l l o

// forEach (ES6 語法)
arr.forEach(function(i){i}); // 依序為 10 20 30
arr.forEach((i)=>{i});       // 同上

// while 判斷式
var n = 0;

while (n < 3) {
    n++;
    // n = 1, 2, 3
}

do {
    n++;
    // n = 4, 5
} while (n < 5);

// label 標記
var x = 0;
var y = 0;

myLabel: // 此寫法可直接跳出出多個 while 
while (true) {
    x += 1; y = 1;
    while (true) {
        y += 1;
        if (y === 3 && x === 3) {
            // 跳出 labelCancelLoops 迴圈
            // 也有 continue 語法
            break myLabel;
        } else if (y === 3) {
            // 只跳出一個迴圈
            break; 
        }
    }
}

// function 函數

// 在 JS 中 function 為 First-Class Functions
// 也就是說 functions 被當成是一般的變數(物件)
// 可以當成其他 function 的參數或是回傳值，也可以被 assigned 給別的變數
var n1 = 20;
var n2 = 3;

// 若沒 return 則回傳 undefined
// function 內也可以 return function
// function 不能跟 var 撞名，不然會被覆蓋
function multiply() {
    return n1 * n2;
}
multiply();

function multiply(a, b) {
    return a * b;
}
multiply(1,2);

// 注意函式不能跟其他資料型態撞名，會報錯
// 下面為 expression 定義的 function 的寫法
// 因為是物件，所以可以被存入 var 中
var result = function multiply(a, b) {
    // 此時的 multiply 只能在函式內被呼叫，在外呼叫會無效
    typeof multiply; // function
    return a * b;
}
result(1,2); // 注意不能使用 multiply(1,2) 呼叫

// 也可用此寫法，為匿名 (anonymously) 函式(沒有函式名)
var result = function (a,b) {
    // 透過自定義的變數名稱取得 function
    // 所以沒有一定要替這個函式取名的理由
    typeof result; // function
    return a * b;
}
result(1,2);

// default function (為 ES6 才有的語法)
function multiply(a, b = 1) {
  return a * b;
}
multiply(5, 2); // 10
multiply(5);    // 5

// Immediately Invokable Function Expression (IIFE)
// 當 function 只用一次，就可以用匿名的寫法，並且即時的呼叫 (evoke) 它
var i = 10;
(function(x) {
    // x = 10;
})(i);

// 在 js 裡 function 為一種 object (function object)
// function 內可以有屬性或方法，也可以用 new 語法
// 事實上除了基本型別以外的都是物件

// scope 範圍

// 全域變數 (global scope)
var num1 = 2;
var num2 = 3;
var name = 'Mike';

function getScore() {
    // 局部變數 (function scope)
    var num1 = 2;
    var num3 = 4;
    
    // 沒加 var 宣告變數，則成為全域變數
    num2 = 5; 
    num4 = 6; 

    // 函數也可以宣告在其他函數內部 (function scope)
    function add() {
        // 內部函數可以存取到外部函數的局部變數
        return name + ' scored ' + (num1 + num2 + num3);
    }  
    return add();
}

getScore(); // "Mike scored 11"
num1;       // 2
num2;       // 5 函式內有對全域改變
num4;       // 6 函式的全域變數
            // num3 為區域變數不能呼叫
            // add() 為區域函數不能呼叫

// var 為 function scope
// 若沒有加 var 會成為 global scope
// let, const 為 block scope 僅在 for, if, while, switch 內 (即{}內)
// const 表示變數不會再被重新指定更改，let 則會 (例如在 for loop 中)
// 盡量使用 const 或 let 嚴謹的宣告變數而非 var ，可增加開發專案的穩定和可讀性

// Hoisting
a = 1;
var a = 2;
// 上面寫法 Variable 定義的位置會自動抬升 (Hoisting) 到最前面，即
var a;
a = 1;
a = 2;

var something = function() {
    // 只會提升到這個 scope 裡的最上方
    // 所以為 u 為 undefined 而非 ReferenceError 變數尚未宣告的錯誤
    console.log(u);
    var u = 2;
    return u;
};
// 所以變數都盡量在 scope 的最上面先宣告完成後再使用會比較易讀
// 注意只有 var 有 hoisting， let、const 則沒有

// 函數也有 Hoisting，與變數提升的差別在於不只是提升宣告本身，函數的內容也會跟著提升
square(2);  // 4

function square(number) {
  return number * number;
}

// 但下面的函數寫法是不會自動提升的
// square(2);  // TypeError: square is not a function
var square = function (number) {
  return number * number;
};

// error handle
try {
    // 語法錯誤，走 catch
    ekwo();
    // 可以自己 throw error 走 catch，此時 err = 'myException'
    throw 'myException';
    // err.name = Error; err.message = 'oops';
    throw new Error('oops');

} catch(err) {
    // 有錯誤會走 catch
    err.name;    // 錯誤名稱
    err.message; // 錯誤說明
} finally {
    // 有無報錯都會走 finally 可略
}

// 物件 object
// 宣告物件有三種方法

// 1. new 寫法
var myObj = new Object; 
// 2. object literal 寫法
var myObj = {};
var myObj = { name:"Ric", score:100 };
// 3. Constructor function
function Student(name, score) {
  this.name = name;
  this.score = score;
}
var myObj = new Student('Ric', 100); // myObj.name = 'Ric'
                                     // myObj.score = 100

// JS 為 Prototype-Based object construction，即
// 不用先定義 class 即可建置物件
// 以上面例子來說，就是 name:'Ric' 不一定要在建置時先定義好
// 且一旦一個物件被建置好，後續的物件可以用它來當作原型來建置類似的物件

// 加入屬性，鍵值必須是字串
var key = 'something';
myObj.color = 'blue';
myObj['number'] = 3;
// []的寫法才能放變數，.的寫法會自動將鍵值存為字串
myObj[key] = 0;

var myObj = {'color': 'blue', 'number': 3};
var myObj = {color: 'blue', number: 3};   // 鍵值''可略
var myObj = {
    color: 'blue',
    number: 3,

    // 屬性質也可以是函數，稱為物件的方法 (Method)
    // this 為物件方法中可使用的關鍵字，表示物件自己
    myFun: function() {return this.number;}
    // 兩個以上方法後面記得加逗號 ,
}
myObj.number;      // 3
myObj['number']    // 3
myObj.myFun();     // 3
myObj['myFun']();  // 3

var foo = 'Hi';
var goo = 'Fun';
var myObj = {
    // 等效於 foo: 'Hi' (ES6 語法)
    foo,
    // 等效於 'Hi Yo': 'cool' (ES6 語法)
    [foo+' Hi']:'cool',
    // 等效於上方 myFun 寫法 (ES6 語法)
    myFun(){return this.foo;}
    // 兩個以上方法後面記得加逗號 ,
}
myObj.foo;        // 'Hi'
myObj['foo']      // 'Hi'
myObj.myFun();    // 'Hi'
myObj['myFun'](); // 'Hi'
myObj['Hi Hi'];   // 'cool'

var obj = {};
({}==={});     // false 兩邊產生的是不同位址的物件
(function(){}===function(){}); // false 同上原因
obj === obj;   // true 同一個物件

// null 表示沒有東西 ex: 1 + null = 1
// undefined 表示尚未定義資料型態 ex: var x; var x = null;
// NaN 表示在 number 運算中，出現無法轉換成 number 的計算，其資料型態也是 number

null === null;           // true
undefined === undefined; // true 
NaN === NaN;             // fasle (NaN 不等於任何值)
                         // null, undefined, NaN 彼此也不相等


// Number
var x = 180;
var x = 30.25;
var x = 101e5;     // 10100000
var x = 101e-5;    // 0.00101
var x = 017;       // 15 八進位
var x = 0o17;      // 15 八進位
var x = 0xaf;      // 175 十六進位
var x = 0b11;      // 3 二進位

// 在 JS 中，整數或浮點數皆為 Number 資料型態，都為 8 bits 儲存

1e11 > Infinity;   // false
-1e11 > -Infinity; // true

var x = 1 - 'Hi';   // NaN (not a number)
var x = 5 + x;      // NaN
var x = 1 + 'Hi';   // '1Hi'

// isNaN() 只要是無法轉換成數值的資料型態都會顯示 true

isNaN(NaN);       // true
isNaN(undefined); // true
isNaN({});        // true
isNaN('Hi');      // true

isNaN(true);      // false
isNaN(null);      // false
isNaN(10);        // false
isNaN('10');      // false

// 若要判斷是否是真正的 NaN，可以用判斷式 value !== value
// 因為 NaN 是唯一一種自己不等於自己的型態

Number('3.14') // 3.14
Number('100')  // 100
Number(' ')    // 0
Number('')     // 0
Number(false)  // 0
Number(true)   // 1
Number('a123') // NaN

// Boolean
Boolean(0);   // false
Boolean('0'); // true
// 回傳 false 的： false, undefined, null, 0, NaN, ''

// String
var str = 'text';
var str = "Mike's pet";  // Mike's pet
var str = 'A "book"';    // A "book"
var str = 'Mike\'s pet'; // Mile's pet
var str = "A \"book\"";  // A "book"
var str = 'hel' + 'lo';  // hello
var str = 'hello '+       
          'world';       // hello world

String(123)              // '123'
String(100 + 23)         // '123'
String(true)             // 'true'
// \n 換行 \t tab 

// Array
var arr = ['Apple', 'Banana'];
arr[0];                 // Apple
arr[arr.length - 1];    // Banana
arr[1] = 1;             // ['Apple', 1];
arr.push('Orange');     // 最後面加入   ['Apple', 1, 'Orange']
arr.unshift(10);        // 最前面加入   [10, 'Apple', 1, 'Orange']
arr.pop();              // 最後面移除   [10, 'Apple', 1]
arr.shift();            // 最前面移除   ['Apple', 1] 
delete arr[0];          // 移除指定位置 [undefined, 1] 
arr.length;             // 2
typeof arr;             // object
Array.isArray(arr);     // true

// Array 也是物件
var arr = [];
arr[0] = "John";        // ['John']
arr["Name"] = "Ric";    // ['John', Name: 'Ric']
arr[1] = "Tom"          // ['John', 'Tom', Name:'Ric']
Array.isArray(arr);     // true
arr.length;             // 2 鍵值對不會被算進去

// setTimeout  一秒後執行函數 
// setInterval 每秒執行一次函數
var t1 = setTimeout(( () => console.log('t1') ), 1000);
var t2 = setInterval(( () => console.log('t2') ), 1000);
// setInterval 用完後記得刪除，setTimeout 通常不用自己刪
clearTimeout(t1);
clearInterval(t2);

// Date
var date = new Date();                   // 現在時間
var date = new Date(10000);              // 從 1970-01-01 累積的毫秒數
var date = new Date(1995, 11, 17);       // 1995-12-17
var date = new Date(1995, 11, 17, 23, 30, 15); // 1995-12-17 23:30:15
var date = new Date(2018, 13, 1, 1, 80)  // 2018-1-1 02:20 超過會自動進位

new Date(2022,0,2) > new Date(2020,1,1); // true
date.getTime() === date.getTime()        // true 相等的比較必須用 getTime

// getTime()	     取得從 1970-01-01 UTC 累計的毫秒數
// setTime()	     用 milliseconds 設定是什麼日期時間

// getFullYear()     取年           setFullYear()	  設定年
// getMonth()	     取月   (0-11)  setMonth()	      設定月  (0-11)
// getDate()	     取日   (1-31)  setDate()	      設定日  (1-31)
// getHours()	     取時   (0-23)  setHours()	      設定時  (0-23)
// getMinutes()	     取分   (0-59)  setMinutes()	  設定分  (0-59)
// getSeconds()	     取秒   (0-59)  setSeconds()	  設定秒  (0-59)
// getMilliseconds() 取毫秒 (0-999) setMilliseconds() 設定毫秒 (0-999)
// getDay()	         取星期 (0-6)

// 在 get, set 後加 UTC 即表示使用 UTC 標準時間
// 例如： getUTCHours(), setUTCHours()

// Math
Math.PI;         // 圓周率
Math.abs(-1);    // 1
Math.ceil(3.2);  // 4 無條件進位
Math.floor(3.8); // 3 無條件捨去
Math.round(3.5); // 4 四捨五入
Math.random();   // [0,1) 範圍隨機小數
Math.max(1,2,3); // 3
Math.min(1,2,3); // 1
Math.sqrt(9);    // 3
Math.pow(2,10);  // 1024
Math.exp(1);     // 2.718 (自然數)
Math.log(0);     // -Infinity

Math.sin(Math.PI / 2); // 1    還有 Math.cos(), Math.tan()
Math.asin(1);          // pi/2 還有 Math.acos(), Math.atan()

// 若超出定義範圍會回傳 NaN

