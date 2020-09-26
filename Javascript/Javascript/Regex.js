// 參考資料
// https://www.fooish.com/regex-regular-expression/
// 線上 regex
// https://regex101.com/

// 字元類別 (Character Classes)
// 用來表示一組特定的字符集，有下面幾種：

// .test() 可用來判斷使否有符合的字串
// .exec() 可用來找出符合的字串

// . dot
// 用來匹配除了換行符號 \n \r 之外的任何一個字元
/a.c/.test('abc');  // true
/a.c/.test('a#c');  // true
/a.c/.test('a\nc'); // false

// [\s\S] match any
// 用來匹配任意一個字元，包含換行符號
/a[\s\S]c/.test('abc');  // true
/a[\s\S]c/.test('a#c');  // true
/a[\s\S]c/.test('a\nc'); // true

// \w word
// 用來匹配所有大小寫英文字、阿拉伯數字和底線 _
// 同等於 [A-Za-z0-9_]
/a\wc/.test('abc');  // true
/a\wc/.test('a#c');  // false
/a\wc/.test('a\nc'); // false

// \W not word
// 用來匹配 \w 以外的所有字
/a\Wc/.test('abc');  // false
/a\Wc/.test('a#c');  // true
/a\Wc/.test('a\nc'); // true

// \d digit
// 用來匹配所有阿拉伯數字 0-9
/a\dc/.test('abc');  // false
/a\dc/.test('a5c');  // true
/a\dc/.test('a\nc'); // false

// \D not digit
// 用來匹配 \d 以外的所有字
/a\Dc/.test('abc');  // true
/a\Dc/.test('a5c');  // false
/a\Dc/.test('a\nc'); // true

// \s whitespace
// 用來匹配所有的空白字元- 空白 (space)、tab 和換行符號 \r \n
/a\sc/.test('a c');  // true
/a\sc/.test('a5c');  // false
/a\sc/.test('a\nc'); // true

// \S not whitespace
// 用來匹配 \s 以外的所有字
/a\Sc/.test('a c');  // false
/a\Sc/.test('a5c');  // true
/a\Sc/.test('a\nc'); // false

// [ ] character set
// 用來表示一個字元集合，整個中括號代表一個字元，裡面的內容就是這個字元的所有可能
/a[abcde123]c/.test('abc'); // true
/a[abcde123]c/.test('a#c'); // false
/a[abcde123]c/.test('a_c'); // false

// [^ ] negated set
// 是 [ ] 的相反，用來匹配不在字元集合裡面的字元
/a[^abcde123]c/.test('abc'); // false
/a[^abcde123]c/.test('a#c'); // true
/a[^abcde123]c/.test('a_c'); // true

// [A-Z] range
// [ ] 或 [^ ] 中還可以用 - 符號來表示連續的好幾個字元
/a[a-zC-F3-7]c/.test('abc'); // true
/a[a-zC-F3-7]c/.test('a5c'); // true
/a[a-zC-F3-7]c/.test('aGc'); // false


// 錨點符號 (Anchors)
// 用來表示「定位」的樣式，不用來比對字元，本身不佔據任何字元位置，有下面幾種：

// ^... beginning
// 用來表示只匹配以 ... 「開頭」的字串
/^hello/.test('hello world');   // true
/^hello/.test('say hello 123'); // false

// ...$ end
// 用來表示只匹配以 ... 「結尾」的字串
/foo$/.test('bar foo'); // true
/foo$/.test('foo bar'); // false

// \b word boundary
// 用來匹配單字邊界，表示字元的「前面」或「後面」除了空白字元、標點符號
// 或是在字串開頭或結尾外，不可再有其它字元
/llo\b/.test('hello world'); // true
/llo\b/.test('hello_world'); // false
// llo\b 可以用來匹配 "hello world", "hello\nworld", "hello", "hello, Mike"
// 但不能用來匹配 "hello_world", "helloworld", "hello101"

// \B not word boundary
// 用來匹配非單字邊界 (word boundary)
// \Bworld\B 可以用來匹配 "123worldxyz"，但不能用來匹配 "helloworld"
/llo\B/.test('hello world'); // false
/llo\B/.test('hello_world'); // true

// 特殊字元 (Escaped Characters)
// \000   : 000 是一個 2~3 位數的數字，表示 ASCII 字元的八進位代碼，ex: \101 表示大寫英文字元 A
// \xFF   : FF 是兩位數的數字，表示 ASCII 字元的十六進位代碼。例如 \x41 表示大寫英文字元 A
// \uFFFF : FFFF 是一個 4 位數的數字，表示 UTF-16 code unit
// \t     : 表示 tab
// \n     : 表示換行
// \v     : 表示 vertical tab
// \0	  : null 字元
// 其他特殊符號 . \ + * ? ^ $ [ ] { } ( ) | / 只要在前方加上 \ 即可正常表示

// 量詞與替代 (Quantifiers & Alternation)
// 表示某個條件需要出現的次數，有下面幾種：

// + Plus
// 表示連續出現 1 次或多次
// ab+c 可以用來匹配 "abc", "abbc", "abbbc", "abbbc" 等字串，但 "ac", "adc" 不符合
var match = /a+/.exec('caaandy');
match[0]; // aaa

// * Star
// 表示連續出現 0 次或多次
var match = /bo*/.exec('A ghost bed');
match[0]; // b

// {min,max} {n} {min,} ，Quantifier 有下面三種寫法：
// {min,max} 表示至少連續出現 min 次，但最多連續出現 max 次
// {n} 表示要出現 n 次
// {min,} 表示至少連續出現 min 次
// 例如 ab{1,3}c 可以用來匹配 "abc", "abbc", "abbbc" 等字串，但 "ac", "abbbbbc" 不符合
var match = /a{1,3}/.exec('caaaaaaandy');
match[0]; // aaa

// ? Optional
// 表示出現 0 次或 1 次
// ab?c 可以用來匹配 "ac", "abc" 等字串，但 "abbc", "abbbc" 不符合
var match = /e?le?/.exec('angel');
match[0]; // el

// ? Lazy
// 對於指定的量詞，預設上採能匹配越多字就盡量匹配，這一個特性叫做 greedy
// ex: 用 (.+)(\d+) 來匹配字串 "abcd1234"，group 1 會得到 "abcd123"，group 2 會得到 "4"
// ? 還有另外一個用法，接在量詞後面 (+?, *?, {min,max}?, ??) 
// 表示 lazy (非貪婪, 懶惰) 模式，會使匹配引擎變成以匹配越少字為原則
// ex: 用 (.+?)(\d+) 來匹配字串 "abcd1234"，group 1 會得到 "abcd"，group 2 會得到 "1234"
var match = /<.+>/.exec('<em>Hello World</em>');
match[0]; // <em>Hello World</em
var match = /<.+?>/.exec('<em>Hello World</em>');
match[0]; // <em>


// | Alternation
// 表示替代，當有多個選擇時，可用 | 分隔多個選擇
 // b(a|e|i)d，可以用來匹配 "bad", "bed", "bid" 等字串，但 "bd", "bbd", "bzd" 不符合
var match = /green|red/.exec('green apple');
match[0]; // green


// 群組與環顧 (Groups & Lookaround)

// Capturing Group ( )
// 小括號 ( ) 圈住的部分表示一個子樣式 (subexpression)，也稱作群組 (group)
var match = /(hello \S+)/.exec('This is a hello world!');
match[1]; // hello world!

// \1 Backreference
// 回朔的語法用來引用一個 capturing group 的內容 
// 數字 1 表示第一個 capturing group
// ex: (\w)a\1，其中的 \1 表示 \w 擷取到的字元，"hahaha"，得到的結果會是 "hah"
var match = /(hello) \1 \S+/.exec('This is a hello hello world!');
match[0]; // hello hello world!

// (?: ) Non-Capturing Group
// 相對於 capturing group，表示僅需要用作 group 的用途，但不需要擷取群組
// 語法用法例如 (?:foo){2,}
var match = /(?:hello) (\S+)/.exec('This is a hello world!');
match[1]; // world!

// (?= ) Positive Lookahead
// 檢視某文字 後面 連接的內容是否符合預期，只有 滿足 指定條件的前提下，才會繼續進行匹配
// 語法 A(?=B)，表示 A 後面必須是接著 B
// ex: a(?=[bcd]) 表示 a 後面接的必須是 b, c 或 d 字元
var match = /(?:foo)(?=hello)/.exec('this is foohello 123');
match[0]; // foo
var match = /(?:foo)(?=hello)/.exec('this is foohi 123');
match; // null

// (?! ) Negative Lookahead
// 是相對於 positive lookahead，只有在 後面 的內容能 不滿足 指定條件的前提下，才會繼續進行匹配
var match = /(?:foo)(?!hello)/.exec('this is foohi 123');
match[0]; // foo

/Jack(?=Sprat)/.test('JackFrost'); // false
/Jack(?=Sprat)/.test('JackSprat'); // true

// 例子
// Email Regex / Email 正規表示式
var str = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
// URL Regex / 網址正規表示式
var str = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
// IP Address Regex / IP 位址正規表示式
var str = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
// HTML Tag Regex / HTML Tag 正規表示式
var str = /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/;






