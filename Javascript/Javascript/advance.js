// ES6 是 JavaScript 語言新一代的標準，在 2015 年發佈
// 這是個泛稱，涵蓋了 ES2015, ES2016, ES2017 等等
// 一般講 ES6 指的是 ES2015 所訂定的標準
// 下面列出 ES6 標準新增的語法

// let, const

// var 為 function scope
// let, const 為 block scope 僅在 for, if, while, switch 內 (即{}內)
// let, const 不能重複宣告，var 可以會覆蓋
// 用 let 寫法宣告物件，可以避免名字不小心重複使用
// 盡量多多使用 const 寫法讓程式易讀且易維護

function f() {
    var x = 1;
    let y = 1;
    const z = 1;
    const arr = [1,2];

    // let y = 3; const z = 3; 重複宣告，報錯
    
    if (true) {
        var x = 2;
        let y = 2; 
        const z = 2;
        // x = 2; y = 2; z = 2;
    }
    // x = 2; y = 1; z = 1;

    // z = 3; 會報錯，const 無法指派值
    // arr 只要指向同一個位址就可
    // arr[0]=4 可以 ｜ arr.push(3) 可以 ｜ arr='123' 不可以 
}

// setTimeout(), setInerval()
var n = 0;
// 第一項通常是 callback function，第二項要等幾 ms，會回傳一個 object
// 若有更多項，後面的項為輸入函數內的參數
// setTimeout：過了某段時間，執行一次
// setInerval：每隔一段時間，執行函數
var ID1 = setTimeout(function f(){ ++n; }, 1000); // 1s 後 n++
var ID2 = setTimeout(() => ++n, 1000);            // 1s 後 n++
var ID3 = setInterval(() => ++n , 1000);          // 每過 1s 則 n++ 
var ID4 = setTimeout(function f(i){ ++i; }, 1000, 10); // i 初始為 10， 1s 後變 11
// 使用完記得清除 (setTimeout 不一定要，會自動清除)
clearInterval(ID3);

// Arrow Function
var multiply = function(a, b) {return a * b;}
var multiply = (a, b) => a * b;           // 與上方寫法等價，會自動 return
var multiply = (a, b) => (a * b);         // 給跨行的單行程式使用，會自動 return
var multiply = (a, b) => {return a * b};  // 有 {} 記得要加 return
var multiply = (a, b) => {a * b};         // 有 {} 卻沒 return 值會回傳 undefined
var multiply = (a, b) => {};              // undefined
var multiply = (a, b) => ({});            // {} 物件

// callback 用 Arrow Functions 更精簡
var n = [1, 2, 3];
var square = n.map(num => {return num * 2;}); // [2,4,6]

// Arrow Functions 還會自動綁定 (bind) this 到當時宣告它的環境
function Person() {
    this.age = 0;
    var self = this;
  
    // 若使用 this.age 的 this 指向的是 window 物件，會報錯
    // self 變數才會正確的指向 person 物件
    setInterval(function grow() {
        self.age++;
    }, 1000);

    // 定義該 Arrow Functions 時的環境，是在 Person 物件中
    // 所以 this 會正確指向 Person 物件
    setInterval(() => {
        this.age++;
    }, 1000);
}
// var p = new Person(); 

// spread operator
function f(a,b,c,d,e) {a+b+c+d+e;}
var arr = [3, 4];
var arr = [1,2,...arr,5]; // [1,2,3,4,5]
f(1, 2, ...arr, 5);       // 等同於 f(1, 2, 3, 4, 5)
function f(a,...b) {b;}   // 輸入 f(1,2,3) 則 b=[2,3]


// 解構賦值 Destructuring assignment
var foo = ['1', '2', '3'];
var [one, two, three] = foo; // one = '1' 以此類推

function myFoo() {return [1, 2, 3];}
var [a, b, c]  = myFoo(); // a=1 b=2 c=3
var [a,  , c]  = myFoo(); // a=1 c=3
var [a, ...b]  = [1,2,3]; // a=1 b=[2,3]
var [a=5, b=7] = [1];     // a=1 b=7

var obj = {p: 42, q: true};
var {p, q} = obj;         // p=42 q=true

var a, b;
({a, b} = {a: 1, b: 2});  // a=1 b=2

var o = {p: 42, q: true};
var {p: foo, q: bar} = o;     // foo=42 bar=true
var {a = 10, b = 5} = {a: 3}; // a=3 b=5

var obj = {p: ['Hi', {y: 'World'}]};
var {p: [x, {y}]} = obj;      // x='Hi' y='World'
// 解構賦值的寫法常用在 function 的輸入上

// super 關鍵字
var parent = {
    foo() {console.log('from Parent');},
    a: 'parent'
}
var child = {
    foo() {
        // super 關鍵字會指向父類別
        console.log('from Child');
        super.foo();          // from Parent 
        console.log(this.a);  // from Child
        console.log(super.a); // parent
    },
	a: 'child'
}
Object.setPrototypeOf(child, parent); // 繼承

// template string 字串樣版
var a=1; var b=1;
var str = `line 1 
line 2`;                      // 等價於 'line1\nline2'
var str = `sum a+b = ${a+b}`; // sum a+b = 2
                              // ${} 也可加入函式等表達式
// Map 物件
var myMap = new Map(); // 建立一個 map

// Map 與一般 object 不同在於，不一定要是 string
// 資料是有序的，會依照插入的順序遍歷

var a = 'string';
var b = {};
var c = function() {};

// set 新增 key-value pair
myMap.set(a, 'key is string');
myMap.set(b, 'key is object');
myMap.set(c, 'key is function');

// get 取得 value 
myMap.get(a); // 'key is string'
myMap.get(b); // 'key is object'
myMap.get(c); // 'key is function'

myMap.get('string');     // 'key is string' 因為 a === 'string'
myMap.get({});           // undefined       因為 b !== {}
myMap.get(function(){}); // undefined       因為 c !== function(){}

var arr = [['key1', 'value1'], ['key2', 'value2']];
var myMap = new Map(arr); // 利用陣列初始化 map 

myMap.get('key1'); // value1
myMap; // 顯示 Map {'key1' => 'value1', 'key2' => 'value2'}
myMap.size; // 2

// set 方法會回傳 map 本身，所以能使用 chaining 寫法
var m = new Map();
m.set('str', 123)
 .set(1, [1, 2])
 .set(undefined, 'blah');

// m.keys() 為 Iterator 物件，依序回傳 key
// m.values() 為 Iterator 物件，依序回傳 value
// m.entries() 為 Iterator 物件，依序回傳 key-value pair
for (let k of m.keys()){k;}   // 'str', 1, undefined
for (let v of m.values()){v;} // 123, [1,2], 'blah'

for (let [k, v] of m.entries()){k; v;}
for (let [k, v] of m){k; v;}
m.forEach(function(v, k, map){v; k;})

m.delete('str'); // 刪除 'str' 並回傳 true
m.delete('111'); // 無此 key 回傳 false
m.has(1);        // true 有此 key
m.has('111');    // false 無此 key
m.clear();       // 清空得 Map {}

// Set 物件
var mySet = new Set(); // 建立一個 Set
// Set 與 陣列 不同在於 Set 裡的元素不會重複

// add 新增元素
var obj = {a: 1};
mySet.add(1);
mySet.add(1); // 1===1 已重複會被忽略
mySet.add('text');
mySet.add(obj);    // 注意 obj !== {a:1}
mySet.add({a: 1}); // 和 obj 為不同位址的物件，不算重複，可加入
mySet.add(NaN);
mySet.add(NaN);    // 雖然 NaN !== NaN 但會預設當重複忽略

for(v of mySet){v;} // 1, 'text', {a:1}, {a:1}, NaN
for (let v of mySet.values()){v;}  // 結果同上
for (let k of mySet.keys()){k;}    // 結果同上
for (let i of mySet.entries()){i;} // 結果同上
mySet.forEach((i)=>{i;});          // 結果同上

// has 找元素
mySet.has(1);     // true
mySet.has(obj);   // true
mySet.has({a:1}); // false 因為 {a:1} !== {a:1}
mySet.has(NaN);   // true  雖然 NaN !== NaN，但還是預設能找查

var mySet = new Set(['v1','v2','v3']); // 用陣列初始化 Set
mySet; // Set {'v1', 'v2', 'v3'}
mySet.size; // 3

// add 方法會回傳 Set 本身，所以能使用 chaining 寫法
var s = new Set();
s.add(1)
 .add(5)
 .add('text');

s.delete(1);   // 刪除 1 回傳 true
s.delete('1'); // 回傳false
s.clear();     // 清空 Set

// 不同於 Java、C# 等基於類別 Class 的物件導向程式語言
// 它們透過定義 Class、建立實例 instance 、指定繼承等方式來傳遞屬性及方法
// Javascript 則是個基於原型 Prototype 的物件導向程式語言 
// 透過預先建立出的原型物件，每當新物件建立時，便指定物件的原型要參照到哪個原型物件

// 若有個叫做 Person 的函數，則可以把它當作 constructor
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 並利用 new 關鍵字對這個 constructor 產生一個 instance 物件
var nick = new Person('nick', 18);
var peter = new Person('peter', 20);
// 設計上，不像其他語言用 class 而是用 constructor 去 new (因為 JS 只有原型沒 class)

// constructor 內的 prototype 屬性會與 instance 的 __proto__ 屬性連接
Person.prototype.log = function () {
  var data = this.name + ', age:' + this.age;
}
// 此 prototype 即為原型物件，會在不同 instance 間共用 (同個記憶體位置)
nick.log === peter.log  // true

nick.__proto__                === Person.prototype // true
Object.getPrototypeOf( nick ) === Person.prototype // true (等效)

// Person.prototype 物件本身也有 __proto__ 屬性與前一個原型鏈結
// 這條透過 __proto__ 不斷鏈結在一起的鏈稱為 prototype chain
// 當使用某個屬性或方法時會透過原型鏈一直往上尋找，直到 null

Person.prototype.__proto__ === Object.prototype   // true
Object.prototype.__proto__                        // null

// 另外，函式本身也有 __proto__，原型鏈如下：
Person.__proto__ === Function.prototype           // true
Function.prototype.__proto__ === Object.prototype // true
Object.prototype.__proto__                        // null

// 此外，可用 hasOwnProperty 判別某屬性屬不屬於 instance 本身
nick.hasOwnProperty('log')           // false
nick.__proto__.hasOwnProperty('log') // true

// 也可使用 Object.create( obj ) 會回傳一個物件，其 __proto__ 屬性值為 obj

// A instanceof B 判斷 A 是不是 B 的 instance
nick instanceof Person // true
nick instanceof Object // true
nick instanceof Array  // false

// prototype 都會有一個叫做 constructor 的屬性，指向構造函數
Person.prototype.constructor === Person        // true
Person.prototype.hasOwnProperty('constructor') // true
// 這段是要讓大家知道，這邊其實是往原型鍊的上面去找
nick.constructor === Person                    // true
nick.hasOwnProperty('constructor')             // false
// A.prototype.constructor === A，用 Function, Person, Object 帶進去都成立

// << new 做了下面幾件事 >>
// 1. 創出一個新的 object，並把 constructor 裡的 this 指向此物件
// 2. 把 object 的 __proto__ 屬性指向 constructor 裡的 prototype 屬性，以繼承原型鍊
// 3. 把 object 的 __proto__.constructor 屬性值設為 constructor 函數
// 3. 執行此 constructor，並回傳最終的 object

// 參考：https://blog.techbridge.cc/2017/04/22/javascript-prototype/
// 參考：https://www.fooish.com/javascript/oop-object-oriented-programming.html


// class 關鍵字

// 引入了一些新語法，可定義類別，能直觀的使用 JS 寫物件導向程式
// 但大多數語法只是 語法糖，並不是重新設計一套物件繼承模型
// 不像 C++ 或 Java 等 class-based 的語言有 class 語法來宣告一個類別
// 只是更方便操作 JS 既有的 原型繼承模型 prototype-based
// JS 使用函數 (function) 做為類別 (class) 的建構子 (constructor) 來定義一個類別

class Animal { 
	// constructor 方法會在 new 時被自動呼叫，用來做初始化
    constructor(name) {
        this.name = name;
        this.num = 0;
    }
    // 在 constructor 外會被自動放在 __proto__ 屬性內作為原型繼承
    speak() {return this.name;}
    count() {return this.num;}
    // 即 Animal.prototype.speak 和 .count
}
// a 為 Animal 這個 class 產生的 object (類實例)
// 使用類別建立物件，就好比用新的資料型別 (class) 來建立一個類別變數 (object)
// 需使用 new 運算子，會將 'Elephant' 傳給建構子初始化
// 注意 class 的寫法沒有 hoisting 的功能
var a = new Animal('Elephant');
a.name;        // Elephant
a.speak();     // Elephant
typeof Animal; // function 
typeof a;      // obj

// extends 作類別繼承
class Dog extends Animal {
    // 使用父類的建構式
    // 可用父類的方法
    // 同名方法優先用自己的
    speak() {
        // 用 super 使用父類方法
        return super.speak() + ' Hi, ' + this.name;
    }
}
var d = new Dog('Puppy');
d.count();   // 0
d.speak();   // Puppy Hi, Puppy

// super
class Cat extends Animal {
    constructor(name) {
        // 繼承加上要寫自己的建構式前要加 super()
        // 此語法會先跑過父類的建構式，() 內可加入想初始的參數
        super();
        this.name = name;
        this.num = 1;
    }
    // 使用父類方法時，this 會指向自己，所以 this.num 為 1
    speak() {return super.count() + this.name;}
}
var c = new Cat('Cookie'); 
c.speak(); // 1Cookie

// static method
class Triple {
  static triple(n) { return n * 3; }
}

class BiggerTriple extends Triple {
  static triple(n) {
    return Math.pow(super.triple(n), 2);
  }
}

// 在類別裡的屬性、方法前加上 static 關鍵字
// 會成為該類別下產生的類實例之間的共用屬性、方法
// 而且在尚未產生類實例前即可直接用 class 本身來呼叫
// 在 JS 語法更是進一步規定不能用類實例呼叫 static 方法、屬性
// 此外，因為 static 表共用，其語法內部不能用到 this 語句
// 常被使用在建立應用程式的工具函式，例如 Math 類別裡的常數、次方運算

// 實作上，若一個方法沒有用到 this，建議直接將方法獨立出來在外面
// 或是改為 static 加以使用

Triple.triple(6);       // 18
BiggerTriple.triple(3); // 81

var tp = new Triple();
// 類實例無法使用 static method
// tp.triple();  TypeError: 'tp.triple is not a function'.

// 另外也可將會重複使用的 element 寫成一個 class
// 寫法另外整理在 ./Project/class_dom 內

// 命名方面 class 通常會使用 PascalCase
// 其他例如 method、variable 則使用 camelCase

// Symbol 資料型態
var s1 = Symbol();
var s2 = Symbol();
var s3 = Symbol('foo');
var s4 = Symbol('foo');
s1 === s2; // false
s3 === s4; // false
s3.toString()===s4.toString(); // true "Symbol('foo')"

// 有相同的 key 名稱卻又想分開當不同鍵值時可以使用
// object 的 key 可為 Symbol，讓鍵值不衝突
// 也可以寫在 switch 裡當作不同 case
// 為一個函數，不是物件，無 new 語法

var obj = {
    [s1]:'Hi'
};
obj[s3] = 'Hi';     // 兩種輸入法
obj.s3 = 'Hi';      // 不行這樣寫，會產生字串 's3' 的 key
obj[s3];            // 'Hi'
obj[Symbol('foo')]; // undefined 因為 Symbol 彼此不相等

// 建立一個 global Symbol
var s1 = Symbol.for('bar');
var s2 = Symbol.for('bar'); // 指向同個 key，不會重複建立
s1 === s2;                  // true
s1.toString();              // "Symbol('bar')"
Symbol.keyFor(s1);          // 'bar'
                            // 一般 local Symbol 會回傳 undefined

// Iterables, Iterators 迭代器

// 有幾種資料結構例如 Array, Object, Map, Set
// ES6 介紹了統一的機制來遍歷，這機制叫做 iterator

// 它是種接口的定義，可以看作是種實作規則，若個物件符合 Iterator protocol 定義的規則
// 我們就可以稱這個物件是一個 iterator (迭代器)，規則如下：

// 1. 定義一個物件將如何被遍歷
// 2. 讓資料結構中的成員，可以按照控制的順序來做排列
// 在 JS 中，一個 Iterator 只是一個有 next() 方法的物件

function myIterator(arr) {
    // 記錄目前的位置
    var nextIndex = 0;
    
    return {
       next: function() {
           return nextIndex < arr.length ?
               {value: arr[nextIndex++], done: false} :
               {done: true};
       }
    };
}
var it = myIterator(['Hi', 'Puppy']);
it.next().value; // Hi
it.next().value; // Puppy
it.next().done;  // true


// Iterable Protocol 定義了，如果一個物件要能被遍歷
// 必須實作 Symbol.iterator 這個 Symbol 物件屬性
// Symbol.iterator 的值是一個函數，用來取得一個 iterator

var foo = {
    [Symbol.iterator]: () => ({
        items: ['p', 'o', 'n', 'y'],
        next: function next () {
            return {
                done: this.items.length === 0,
                value: this.items.shift()
            }
        }
    })
}
// foo 物件實作了 Iterable 接口，所以它可以被遍歷
for (let pony of foo) {pony;} // p o n y

// 總結 Iterator 和 Iterable 的接口規則:

// interface Iterable {
//    [Symbol.iterator](): Iterator;
// }

// interface Iterator {
//    next(): IteratorResult;
//}

// interface IteratorResult {
//    value: any;
//    done: boolean;
// }

// Generators 生成器

// Iterators 雖然強大，但要維護內部的指針狀態有些麻煩
// Generators 像是個可隨時 暫停 和 繼續 執行的特殊函數，會自動維護內部狀態

function* gen_1() { 
    yield 1;
    yield 2;

    return 3; // return 非必要，讓後面的語法不執行

    while(true) {yield 10;} // 可以訪問無限次 10 10 10 ...
}
// 也可以透過 gen_1() 裡的 () 傳入初始數值
var g = gen_1();
g.next(); // 返回 Object {value: 1, done: false}
g.next(); // 返回 Object {value: 2, done: false}
g.next(); // 返回 Object {value: 3, done: true}
g.next(); // 返回 Object {value: undefined, done: true}

var h = gen_1();
for (let i of h){i;} // 也可以用 for 遍歷 1 2 3

// // 也可以從外部傳入值，next(value) 方法可以接受一個參數，當作上一次 yield 語句的返回值
function* gen_2() {
    let arr = [yield, yield, yield];
    
    return arr;
}
 
var g = gen_2();
g.next();    // { value: undefined, done: false }   
g.next('A'); // { value: undefined, done: false }
g.next('B'); // { value: undefined, done: false }
g.next('C'); // { value: [ 'A', 'B', 'C' ], done: true }

// yield 的優先權很低，需適時加括號
// 錯誤： 'Hi' + yield 或 'Hi' + yield 123
// 正確： 'Hi' + (yield) 或 'Hi' + (yield 123)
// yield a + b + c 等效於 yield (a + b + c) 而非 (yield a) + b + c

// yield* 關鍵字可以在一個 generator 裡執行另一個的 generator
function* g1() {
    yield 2;
    yield 3;
    yield 4;
}
function* g2() {
    yield 1;
    yield* g1();
    yield 5;
}
var g = g2();
for (let v of g2()) {v;} // 1 2 3 4 5

var result;
function* g3() {
    yield* [1, 2, 3];

    // 返回 foo 給外面的 yield*
    return 'foo';
}
function* g4() {
    // result 的值是 g4() 的 return value
    result = yield* g3();
}
var g = g4();
g.next(); // {value: 1, done: false}
g.next(); // {value: 2, done: false}
g.next(); // {value: 3, done: false}
g.next(); // {value: undefined, done: true}
result;   // 'foo'

// Promise 語法

// 是一種非同步 (asynchronous) 編程的解決方案
// 是一個等待非同步操作完成的物件，事件完成時
// Promise 根據操作結果是成功、或者失敗，做對應的處理動作

// Promise 狀態的改變只有兩種可能：
// 1. 從 pending (進行中) 變成 resolved (成功)
// 2. 從 pending (進行中) 變成 rejected (失敗)

// Promise.then 語法
var promise = new Promise(function(resolve, reject) {
    // 執行非同步的 setTimeout
    setTimeout(function(){
        // 250ms 過後，將 Promise 物件狀態改為成功 (resolve)
        resolve('Success');
    }, 250);
  });
// 狀態變成功 (resolve) 後會執行 then
// 250ms 執行 message = 'Success'
promise.then(function(message) {message;})

// Promise.catch 語法
var promise = new Promise(function(resolve, reject) {
    // 回傳失敗 (rejected) 狀態
    throw 'error';
});
// 狀態變失敗 (rejected) 後會執行 catch
// e = 'error' 
promise.catch(function(e) {e;})
// 也可以用 then 的第二個 function 參數接收 rejected 的值
promise.then(function(message) {message;},function(e) {e;})

// fetch 語法
// 接收了一個 url 作參數，並用 then 接收此次請求的相關資訊
// 會回傳一個包含 response 的 promise
// 只能在瀏覽器環境執行，在 node 環境要使用外部模塊

// fetch('https://httpbin.org/get')
//    .then((res) => res.json()) // 將 response 轉為 json 形式
//    .then((myJson) => myJson)  // myJson 為 json 形式
                                 // 線上的資料傳輸大多為 json 形式

// Chaining 寫法
var promise = new Promise(function(resolve, reject) {
    resolve('Hello');
}); 
// catch 和 then 會回傳 Promise 物件本身，可以用 chaining 寫法
// 比起用 ES6 以前用 callback function 去寫來的易讀且好維護
promise.then((str) => {return str + ' World';})
       .then((str) => {return str;})
       .then((str) => {str;}); // str = 'Hello World'

// Promise.all 語法
var p1 = Promise.resolve(1); // 此寫法可以直接產生一個 resolve 後的 Promise
var p2 = 2;
var p3 = new Promise(function(resolve, reject) {
                setTimeout(resolve, 100, 'foo');
            }); 
// all 方法會等陣列裡的每個 Promise 都結束後執行 then 
// value 為 [1, 2, 'foo']    
Promise.all([p1, p2, p3]).then(function(values) {values;});


// Promise.race 語法
var p1 = new Promise((resolve, reject) => {setTimeout(resolve, 500, 'one');});
var p2 = new Promise((resolve, reject) => {setTimeout(resolve, 100, 'two');});
// race 方法會回傳最快完成，p2 比較快完成所以 value = 'two'
Promise.race([p1, p2]).then((value) => {value;});

// Promise.resolve() 用來將一個物件轉型為 Promise，然後立刻 resolve
Promise.resolve('Success').then((value) => {value;})
// Promise.reject() 用來將一個物件轉型為 Promise，然後立刻 reject
Promise.reject(new Error('Fail')).then((error) => {error;}
        , (error) => {error;}) // 走第二個 arrow function
                               // error = 'Fail'
  
// this 指向

// JS 的直譯器會在執行時維護一個執行環境 execution context
// 其中的 ThisBinding 儲存著 this 該指向哪個物件
// 注意 function 內的 this 被哪個 object 呼叫就會指向它

// 全域執行環境 this 會指向全域物件 window
this.name = 'hi'  
if (true) {this;} 

// 在全域環境執行的任意函式 this 都指向 window
setTimeout(function() {this;}, 100);

var obj = {
    bar: 'hello',
    // 被 obj 呼叫，所以 this 指向 obj 本身
    fa: function(){this;},
    // 同上原因， this 指向 obj 本身
    fb: function(){setTimeout(this,100)},
    // 在 setTimeout 這類函式裡執行 callback 會在 window 非同步執行，所以會改指向 window
    fc: function(){setTimeout(function(){this;},100)},
    // 可改用 arrow function 會自動把 this 指向外層環境，所以指向 obj 本身 
    fd: function(){setTimeout(()=> {this;}, 200)},
};
obj.fa(); // 指向 obj
obj.fb(); // 指向 obj
obj.fc(); // 指向 window
obj.fd(); // 指向 obj

// 在全域環境執行此函式，故 this 指向 window
var f = obj.fa;
f();

// 與上方原理相同，被重新指派進函數作為參數也會導致 this 指向 window
function xx(callback){ callback() };
xx( obj.fa );
// 所以把 function (或稱為 callback) 作為另一個 function 的參數傳入時，記得先 bind
// 這也是 react 的 event handler 都會先 bind 的原因

// this 指向 obj
var obj = {
    foo: function() {
        // 直接執行 eval 函數，ThisBinding 不變
        eval('this');
    }
};
obj.foo();

// function prototype 有提供 call, apply, bind 方法指定 this 指向的物件
var obj = { a:0, b:1 };

function ff1(){ this };
function ff2(x,y){ this };

ff1.call(obj);        // ff1 裡的 this 指向 obj
ff2.call(obj,1,2);    // 同上，並將 x=1, y=2 傳進函數
ff2.apply(obj,[1,2]); // 同上，只是 apply 以矩陣方式傳入
ff1.bind(obj);        // bind 會 return 一個新函數，裡頭的 this 指向 obj

// 此外 array prototype 裡的 forEach, map, filter ... 也有指定 this 的方法

// this 指向 window
var obj = {
    foo: function() {
        // 間接執行 eval 函數，改指向 window
        var eval_ = eval;
        eval_('this');
    }
};
obj.foo();

// this 指向 window
function fun() {
    // func 不屬於任何物件的方法
    this;
}
var obj = {
    foo: function() {
        // 雖然 eval code 裡面的 this 會指向 obj
        // 但 eval 裡面執行的 function 就不是了
        eval('fun()');
    }
};
obj.foo();

// array 的訪問有下面幾種方法： filter、find、forEach、map、every、some、reduce
var people = [
  { name: 'Tom' , age: 20},
  { name: 'Eric', age: 24},
  { name: 'Jack', age: 10},
];

// 可先使用 Array.from() 將其他資料型態 (HTMLCollection、NodeList) 轉為 array
// const myArray = Array.from( myData )

// filter() 
// 會回傳一個陣列，其條件是 return 後方為 true 的物件
var myFilter = people.filter((item, index, array) => item.age > 15)
// 回傳 Tom, Eric 這兩個物件形成的陣列
// 若沒 return 條件，會回傳 []

// find() 
// 與 filter() 相似，但 find() 只會回傳一次值，且是第一次為 true 的值
var myFind = people.find((item, index, array) => item.age > 15)
// 若沒 return 條件，會回傳 undefined

// forEach 
// 是這幾個陣列函式最單純的一個，不會額外回傳值，只單純執行每個陣列內的物件或值
var myForEach = people.forEach((item, index, array) => {
  // 此處語法可以更改 people 陣列內的資料
  // 不需寫 return 的語法， 寫了也不會有 return 值
});
// 無論如何 myForEach 皆為 undefined

// map() 
// 與 forEach (直接改寫 people) 不同，map 會產生一個新的陣列
var myMap = people.map((item, index, array) => item.age * 2)
// myMap = [40,48,20];

// every()
// 可以檢查所有的陣列是否符合條件，這僅會回傳一個 bool 值
var myEvery = people.every(function(item, index, array){
  // 當全部 age 大於 15 才能回傳 true
  return item.age > 15;
});
// myEvery 為 false

// some() 
// 與 every() 相似，都是回傳 bool 值，差異僅在 some() 僅需有任一項符合
var mySome = people.some(function(item, index, array){
  // 只要有一項 age 大於 15 即回傳 true
  // 全部符合則回傳 false
  return item.age > 15
});
// mySome 為 true

// reduce()
// 可以與前一個回傳的值再次作運算，參數包含以下：

// accumulator: 前一個參數，如果是第一個陣列的話，值是以另外傳入或初始化的值
// currentValue: 當前變數
// currentIndex: 當前索引
// array: 全部陣列

var myReduce = people.reduce(function(accumulator, currentValue, currentIndex, array){
  // 與前一個值相加
  return accumulator + currentValue.age;
}, 0); // 傳入初始化值為 0
// myReduce 為 20+24+10 = 54
// 若沒有條件，會回傳 undefined

var myReduce = people.reduce(function(accumulator, currentValue, currentIndex, array){
  // 取最大的
  return Math.max( accumulator, currentValue.age );
}, 0);
// myReduce 為最大值 24

// 預設的陣列行為內的 this 是指向 window (除了 reduce() 是傳入初始資料)
// 如果要改，可以在 function 後傳入
var myThis = people.forEach(function(item, index, array){
  // 這邊的 this 就會使用後方傳入的也就是 people
}, people);  // 傳入的物件，替代 this，如果無則是 window


// parsing URL

// 使用瀏覽器內建的 URL 建構函式、URLSearchParams 兩種 Web API，方便解析 URL
// 其中 ? 以後為 query parameter
var githubURL = new URL('https://github.com/search?q=react&type=Code');
// 透過物件的解構賦值，取出 URL 物件的屬性值
var { href, protocol, hostname, pathname, search, searchParams } = githubURL;
// href:     https://github.com/search?q=react&type=Code
// protocol: https:
// hostname: github.com
// pathname: /search
// search:   ?q=react&type=Code
// searchParams: URLSearchParams { 'q' => 'react', 'type' => 'Code' }

// 其中 URLSearchParams 可以方便設定、刪除和讀取 query parameter
// 也可轉為字串 "q=react&type=Code"
searchParams.toString();
// 也可透過陣列的解構賦值，取得網址參數部分，會依序取得：
for(let [key, value] of searchParams.entries()) { 
  var str = `key: ${key}, value: ${value}`;
  // key: q,    value: react
  // key: type, value: Code
}
// 也可檢測參數是否存在某種 key，並取得其值
searchParams.has('q'); // true
searchParams.get('q'); // "react"

// 也可使用 URLSearchParams 建立 query parameter
// 有下面幾種方法：直接寫入、代入陣列、代入物件
var searchParams = new URLSearchParams('q=react&type=Code');
var searchParams = new URLSearchParams([['q', 'react'], ['type', 'Code']]);
var searchParams = new URLSearchParams({q: 'react', type: 'Code'});
// 都會得到一樣的結果
searchParams.toString() // "q=react&type=Code"

// URL 主體和 query parameter 分開，讓後續的 fetch 寫法更易讀好維護
var githubURL    = new URL('https://github.com/search');
var searchParams = new URLSearchParams({q: 'react', type: 'Code'});
githubURL.search = searchParams;
// fetch(githubURL.href).then( something... );

// 另外 URLSearchParams 還提供了
// .set() .append() .sort() .delete() 的方法以靈活操作參數


// 模組化

/////////////////////////////////
// require / exports 模組化寫法如下
/////////////////////////////////

// 每個檔案都有一個 module 物件，裡頭有 exports 屬性
// 可以將方法或屬性寫入 module.exports 供外部使用
// 在模組化的概念裡，一個檔案就是一個模組
// 其變數和方法的 scope 僅限於這個檔案本身

// exports
var text = 'hi';
module.exports = text;
// require
var example = require("./module.js"); // 'hi'
                                      // .js 可略
// 也可在 exports 下新增屬性 
// module.exports.myText = 'hi';
// var obj = require("./module.js");
// obj.myText; // 'hi'

// exports
var text = "hello";
module.exports = {
  getText: function() {return text;}
};
// require
var example = require("./module.js");
example.getText(); // 'hello'
example.text;      // undefined
                   // 所以 module 為 closure

// exports
var text = {
  value: "hello"
};
module.exports = {
  getText: function() {
    // 若直接回傳 return text; 則為 call by sharing，外部能夠修改 text
    // 若想避免這種情況可以建立物件深層 clone 的副本
    // 等同於自己做 call by value，避免外部修改到 text 本身的值
    return Object.assign({}, text);
  }
};
// require
var example = require("./module.js");
var text = example.getText();
text.value = 123;
// 若使用 return text; 則 example.getText().value 會被改為 123
// 使用 return Object.assign({}, text); 則仍會保留原本的 'hello'

// 也可以在 export 下實作多個方法，例如：
var a = 1;
var b = 2;
module.exports.m1 = a;
module.exports.m2 = b;
var example = require("./module.js"); // {m1: 1, m2: 2}


///////////////////////////////
// import / export 模組化寫法如下
///////////////////////////////

// 有兩種 export 方法，分別是 default export 和 named export
// default export: 一個檔案僅能有唯一的 default export，而此類型不一定要給予名稱

// export 數值
export default 1;
// export 物件
const obj = { name: 'obj' };
const obj2 = { name: 'obj2' };
export default { obj, obj2 };
// export 函數
export default function() {
  console.log('this is a function');
}
// export class
export default class {
  constructor(name) {this.name = name;}
  callName() {console.log(this.name);}
}

// named export  : 可匯獨立的物件、變數、函式等等
//                 匯出前必須給予特定名稱，而匯入時也必須使用相同的名稱
//                 且一個檔案中可以有多個 named export

// export 數值
export let a = 1;
// export 物件
export let obj = { name: 'obj'};
// export 函數
export function fn() {
  console.log('this is a function');
}
// export 統一
export { a, obj, fn };

// import 方法

// default import
export default function() {
  console.log('this is a function');
}
// import 則輸入
import fn from './module.js';
fn(); // 直接執行函式
      // .js 可略

// 非 default import
export function fn() {
  console.log('this is a function')
}
// 要用 {} import 進來
import { fn } from './module.js';
fn(); // 直接執行函式
// import 全部
import * as name from './module.js';
name.fn();
// 重新命名
import { fn as newFn } from './module.js';
newFn();

// import 是編譯中執行，CommonJS 的 require 是同步加載
// require 語法在 node 可以使用，但 browser 不行
// import 無論在 node 或是瀏覽器都不能直接使用，需透過 Webpack、Babel 轉譯後或使用 CommonJS 加載
// 所以兩者其實透過轉譯後是一樣的，只是遵循的規範及出現的時間點不同而已
// 在效能上基本上沒區別，因為轉譯過後還是一樣的東西
// require / exports 出生在野生規範，也就是 JavaScript 社群開發者自己草擬的規則
// import / export 跟隨著新的 ECMAScript 版本，也就是 ES5 / ES6

