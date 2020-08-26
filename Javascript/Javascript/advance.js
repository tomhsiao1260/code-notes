// ES6 是 JavaScript 語言新一代的標準，在 2015 年發佈
// 這是個泛稱，涵蓋了 ES2015, ES2016, ES2017 等等
// 一般講 ES6 指的是 ES2015 所訂定的標準
// 下面列出 ES6 標準新增的語法

// let, const

// var 為 function scope
// let, const 為 block scope 僅在 for, if, while, switch 內 (即{}內)
// let, const 不能重複宣告，var 可以
// 用 let 寫法宣告物件，可以避免名字不小心重複使用

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
var multiply = (a, b) => a * b;           // 與上方寫法等價
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


// 解構賦值
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

// 字串樣版
var a=1; var b=1;
var str = `line 1 
line 2`;                      // 等價於 'line1\nline2'
var str = `sum a+b = ${a+b}`; // sum a+b = 2
                              // ${} 也可加入函式等表達式
// Map 物件
var myMap = new Map(); // 建立一個 map

// Map 與一般 object 不同在於， key 不一定要是 string
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

// class 關鍵字

// 引入了一些新語法，可定義類別，能直觀的使用 JS 寫物件導向程式
// 但大多數語法只是 語法糖，並不是重新設計一套物件繼承模型
// 不像 C++ 或 Java 等 class-based 的語言有 class 語法來宣告一個類別
// 只是更方便操作 JS 既有的 原型繼承模型 prototype-based
// JS 使用函數 (function) 做為類別 (class) 的建構子 (constructor) 來定義一個類別

class Animal { 
    constructor(name) {
        this.name = name;
        this.num = 0;
    }
    speak() {return this.name;}
    count() {return this.num;}
}
// 將 'Elephant' 傳給建構子初始化
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
        // 此語法會先跑過父類的建構式
        super();
        this.name = name;
        this.num = 1;
    }
    // 使用父類方法時，this 會指向自己，所以 this.num 為 1
    speak() {return super.count() + this.name;}
}
var c = new Cat('Cookie'); 
c.speak(); // 1Cookie

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

// this 指向 window
this.name = 'hi'
if (true) {this;}

// this 指向 window
setTimeout(function() {this;}, 100);

var obj = {
    bar: 'hello',
    // fa 的 this 指向 obj 本身
    fa: function(){this;},
    // fb 的 this 指向 window
    fb: function(){setTimeout(function(){this;},100)},
    // fc 的 this 指向 obj 本身
    fc: function(){setTimeout(()=> {this;}, 200)},
};
obj.fa();
obj.fb();
obj.fc();

// this 指向 window
var f = obj.fa;
f();

// this 指向 obj
var obj = {
    foo: function() {
        // 直接執行 eval 函數，ThisBinding 不變
        eval('this');
    }
};
obj.foo();

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

