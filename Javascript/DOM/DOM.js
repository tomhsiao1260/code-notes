// DOM (Document Object Model) 定義了一組標準 API
// 讓 JS 能對 HTML 文件操作

// DOM 將一份 HTML 文件看作是一個樹狀結構的物件
// 可以方便直觀的存取樹中的節點 (node) 來改變其結構、樣式 (CSS) 或內容等

// HTML DOM 規範中定義了這些類型的 API：
// 1. 讓我們可以對 HTML 的元素 (element) 當作是 JS 物件 (object) 來操作
// 2. 定義了 HTML 元素有哪些屬性 (properties) 可以來做存取
// 3. 定義了 HTML 元素有哪些方法 (methods) 可以來被操作
// 4. 定義了 HTML 元素事件 (events)，可以針對特定元素來綁定事件處理函式

// DOM nodeType
Node.ELEMENT_NODE === 1;            // 表示 HTML 元素
Node.TEXT_NODE === 3;               // 表示文字 (Text) 或屬性 (Attr)
Node.COMMENT_NODE === 8;            // 表示註解節點 (Comment)
Node.DOCUMENT_NODE === 9;           // 表示根節點 (Document)
Node.DOCUMENT_TYPE_NODE === 10;     // 表示 <!DOCTYPE html> 節點
Node.DOCUMENT_FRAGMENT_NODE === 11; // 表示 DocumentFragment 節點

// nodeName
// 不同形態的 node 會有不同的名稱

// Attr： 值同 Attr.name
// Comment：值為 '#comment'
// Document：值為 '#document'
// DocumentFragment：值為 '#document-fragment' 
// DocumentType：值同 DocumentType.name 如 html
// Element：值同 Element.tagName
// text：值為 '#text'

// 用 Id 取得元素
// 返回元素 ex: <div id='d1'>...</div>
var d1 = document.getElementById('d1');

var f = d1.firstChild;          // d1 裡第一個 child 節點
var l = d1.lastChild;           // d1 裡最後得 child 節點
var p = d1.parentNode;          // d1 的 parent 元素
var f_ = d1.firstElementChild;  // d1 裡第一個 child 元素
var l_ = d1.lastElementChild;   // d1 裡最後得 child 元素

d1.nodeType; // 1
d1.nodeName; // 'DIV'
d1.tagName;  // 'DIV'

f.nodeType;  // 3
f.nodeName;  // '#text' (因為換行)
f.tagName;   // undefined

l.nodeType;  // 3
l.nodeName;  // '#text' (因為換行)
l.tagName;   // undefined

p.nodeType;  // 1
p.nodeName;  // 'BODY'
p.tagName;   // 'BODY'

d1.contains(l);     // true d1 中是否有 l 
d1.hasChildNodes(); // true d1 中是否有 childs

// 取得 d1 的 child 下的所有標籤為 p 的元素 
// 返回一個像陣列的標籤的元素集合物件 (HTMLCollection)
var p = d1.getElementsByTagName('p');
var u = p[0];      // 第一個標籤為 p 的元素
var v = p[1];      // 第二個標籤為 p 的元素
p.length;          // d1 內 p 標籤個數為 6          
u.tagName;         // 標籤名稱 'P'
u.nodeName;        // 節點名稱 'P'
u.innerHTML;       // 元素裡的內容 
u.innerText;       // 元素裡的內容 (會去除有 HTML 標籤的地方)
u.outerHTML;       // 比 inner 方法多了最外層的標籤              
v.nextSibling;     // 取得下一個節點 <p>Hi</p> 
v.previousSibling; // 取得前一個節點  #text
v.closest('div');  // 回傳最接近且為 div 的 ancestor (若無回傳 null) 

u.firstChild.nodeValue;    // 'Hello World'
v.attributes.id.nodeValue; // 'p1'
u.innerHTML = '123';       // 改寫元素內容

// 用 class 屬性取得元素
// 返回一個標籤的元素集合物件 (HTMLCollection)
var c1  = d1.getElementsByClassName('c1');

// 用 name 屬性取得元素
// 返回 NodeList
var n1 = document.getElementsByName('n1');
n1[0];         // 第一個 name='n1' 的元素

// 用 CSS 的一部份 selector 來選取
var target = document.querySelector("#d2");
var arr = document.querySelectorAll(".c1");
var arr = document.querySelectorAll("p");
// arr 為矩陣，內部元素為 element

// 判斷是否有子元素
if (d1.hasChildNodes()) {
    // 取得元素下的所有 子節點 集合，為一個 NodeList
    var children = d1.childNodes; 
    // 取得元素下的所有 子元素 集合，為一個 HTMLCollection
    var children_ = d1.children;

    for (var i=0; i<children.length; ++i) {
        // 用 children[i] 來取得遍歷到子元素
        // 會依序遍歷到 文字(換行)、元素 等
        // 若為單一元素，childNodes 語法為其內容
        // 若只想要元素本身，則改使用 d1.children 語法
    }
}

// 建立一個新 <div>
var ele = document.createElement('div');
// 建立一個新的文字節點
var content = document.createTextNode('add some text');
// 將文字節點加到剛建立的 <div> 元素中
ele.appendChild(content);
// 取得目前頁面上的 id='d2' 元素
var d2 = document.getElementById('d2');
// 將剛建立的 <div> 元素加入 d2 元素中，加在最後面
d1.appendChild(ele);
// 回將既有的元素 id='p1' 移動到 d1 的最下面
var p1 = document.getElementById('p1');
d1.appendChild(p1);
// 也可用 ele.innerHTML = 'add some text'; 寫法新增內容

// 在 a 節點內的 b 元素 加到 c 元素前面，也可用來移動元素
// a.insertBefore(b, c);

// 在 a 節點內移除 b 元素，並回傳移除的元素
// a.removeChild(b);

// 在 a 節點內將 c 元素以 b 取代，會回傳 c 元素
// a.replaceChild(b, c);

// Properties 是 JS DOM 物件上的屬性，不會影響到 HTML 元素
// Attributes 是 HTML 元素上的屬性，像是標籤上的 id 或 class 屬性

var d1 = document.getElementById('d1');
d1.hasAttribute('href');       // false
d1.hasAttribute('id');         // true
d1.getAttribute('href');       // null
d1.getAttribute('id');         // 'd1'
d1.setAttribute('class','d1'); // 建立屬性 class='d1'
d1.className;                  // 'd1'
d1.className = 'd'             // 更改屬性 class='d'
d1.classList.add('new')        // 新增名 new 的 class
d1.classList.remove('new')     // 刪除名 new 的 class (可用來動態更改樣式)
d1.removeAttribute('class');   // 移除屬性
d1.attributes['id'].name;      // 'id'
d1.attributes['id'].value;     // 'd1'
d1.attributes.id.name;         // 'id'
d1.attributes.id.value;        // 'd1'
d1.id = 'd1';                  // 修改 id 的值

// 也可用迴圈遍歷所有屬性
for (var i=0; i<d1.attributes.length; ++i) {
    d1.attributes[i].name;
    d1.attributes[i].value;
}

// Data 屬性

// 在 HTML 的屬性欄位以 data 開頭可自定義屬性，例如：
// <li data-num='1' data-note>

// 在 JS 裡呼叫方法為：
// li.dataset.num  回傳 '1'
// li.dataset.note 回傳 ''
// li.dataset.sss  回傳 undefined

// style
var p1 = document.getElementById('p1');
p1.style.color = 'white';
p1.style.background = 'gray';
p1.style.marginTop = '30px';
p1.style['color'] = 'white';  // 等效

// 可寫入和讀取 style 屬性
p1.style.cssText = 'color: white; background: gray; margin-top: 30px;'

// 可得到 HTML 裡的 style 和 .css 檔裡的屬性
var cssAll = window.getComputedStyle(p1);
// 取得屬性值
cssAll.getPropertyValue('color'); 

// 事件處理
function Click(){alert('click !');}
function Hi(){alert('Hi !');}

var btn = document.createElement('button');
btn.innerHTML = 'Button';
btn.setAttribute('onClick','Click()');
// 即 <button onclick='Click()'>Button</button>
// 可用 onclick='Click(this)' 寫法，this 傳入 btn 物件本身
d1.appendChild(btn);

// 取消綁定
btn.onclick = null;
// 也可寫成
btn.onclick = Click;

// 相較於 setAttribute 方法， listener 可設定多個 
btn.addEventListener('click', Click);
btn.addEventListener('click', Hi);
// 刪除 listener
btn.removeEventListener('click', Hi);

// Event Bubbling & Event Capturing

// 事件都是先由外層一層層 Capturing 到內層
// 再由內層一層層 Bubbling 到外層
var B_div = document.getElementById('Bubble_DIV');
var B_ul = B_div.getElementsByClassName('Bubble_ul');
var child = B_ul[0].childNodes;

// 將 div 加上一個 event
B_div.addEventListener('click', Hi);
// 將 div 內的 li 加上一個 event
for (B_li of child){
    if(B_li.nodeType === Node.ELEMENT_NODE){
        B_li.addEventListener('click', Click);
    }
}

// 點擊 B_div： 觸發 Hi
// 點擊 B_li： 先觸發 Click，後觸發觸發 Hi (事件 Bubbling 到 B_div)

// listener 有第三個參數輸入 boolean，預設為 false
// true 表示在 Capturing 階段觸發，false 表示在 Bubbling 觸發
// 所以上面例子改為 true，點擊 B_li 會先觸發 Hi 再觸發 Click

// Event Delegation

// 若同時有很多 DOM 有相同的事件處理，與其在每個元素上個別附加事件處理
// 不如利用 event bubbling 的特性，統一在他們的 ancestor 處理

var B_div = document.getElementById('Bubble_DIV');
B_div.addEventListener('click', e => {
    // 檢查被按的元件確實在這個 B_div 裡面
    const li = e.target.closest('li');
    if (!li || !B_div.contains(li)) return
  
    alert('Bubble' + li.dataset.num);
})

// event 事件

// 可將函數改為 Click(event)，event 會自動傳入事件物件，屬性列表：

// type: 事件類型
// target: 指向觸發事件源頭的 DOM
// currentTarget: 指向正在執行事件的 DOM (跟 target 在 Bubbling 時會有所不同)

// MouseEvent 時，會多些屬性：

// which: 0:非按鍵 1:左鍵 2:中鍵或滾輪 3:右鍵
// relatedTarget: 指向參與事件的相關 DOM
//                用在 mouseover 事件，表示剛離開的那個 DOM element
//                用在 mouseout 事件，表示剛進入的那個 DOM element
// pageX: 按下滑鼠時(或觸控螢幕時)，取得距離頁面 (document) 最左上角的水平距離 (pixel)
// pageY: 同上，但為垂直距離

// KeyboardEvent 時，會多些屬性：
// keyCode: 當 keypress 事件時，返回 character code
//          當 keydown 或 keyup 事件時，返回 key code
// which: 值同 keyCode
// charCode: 當 keypress 事件時，返回 character code
// altKey、ctrlKey、shiftKey: boolean 值，判斷是否按下 alt、ctrl、shift

function someEvent(event){
    // 可避免事件往下一層 Bubbling
    event.stopPropagation();
    // 可避免觸發元素本身的預設行為，ex:點超連結會預設跳出新頁面
    event.preventDefault();
}

// 事件列表

// click     滑鼠點擊物件時
// change    物件內容改變時
// dblclick  滑鼠連點二下物件時
// keydown   按下鍵盤按鍵時，長按會不斷連續觸發
// keypress  與keydown不同在於，只會針對可輸出文字符號的鍵有效
// keyup     按下並放開鍵盤按鍵後
// mousedown 按下滑鼠按鍵時
// mouseup   放開滑鼠按鍵時
// mouseover 滑鼠進入一個元素時
// mouseout  滑鼠離開某物件時
// mousemove 介於over跟out間的滑鼠移動行為
// resize	 當視窗或框架大小被改變時
// scroll	 當捲軸被拉動時
// select	 當文字被選取時
// blur      物件失去焦點時
// focus     當物件被點擊或取得焦點時
// load      網頁或圖片完成下載時
// error     當圖片或文件下載產生錯誤時
// submit	 當按下送出按紐時
// unload	 當使用者關閉 (或離開) 網頁之後


// jQuery

// jQuery 是一套物件導向式簡潔輕量級的 JS Library
// 可以用最精簡的程式碼來達到跨瀏覽器 DOM 操作、事件處理 等
// 下面皆為 jQuery 語法 (記得先在 HTML 裡使用 jQuery 的 script )

// $(目標).要處理的操作
$('#d2').css('color', 'blue');

// 若 $ 符號與其他函式衝突，可用別名取代 $
// var $alias = jQuery.noConflict();
// $alias('#d2').css('color', 'blue');

// jQuery 大多會返回執行結果，所以可以用 chaining 語法
$('#el').css('color', 'blue')
        .css('background-color', 'red');

// 目標的選擇採 css 選擇器語法，與 css 中寫法相同
$('a');                   // 取得頁面中所有的 <a> 標籤元素
$('#el');                 // 取得 id 為 el 的元素
$('.item');               // 取得 class name 為 item 的所有元素
$('#d2 a');               // 取得 id 為 d2 之元素其內部的所有連結 <a>
$('div > p');             // 取得 div 父元素其下所有直接 (不包括子元素的子元素) 的 p 子元素
$('tr:first');            // 取得第一個找到的 tr 標籤元素
$('input[name="email"]'); // 取得其 name 屬性值為 email 的 input 元素

// $ 會將匹配到的元素以 陣列 型態返回一個 jQuery 物件，取得數量可用下面語法
$('a').length; 
$('a').size;

// get 語法可轉為 DOM 物件
$('#d2').get();                         // 轉為元素集合
$('#d2').get(1);                        // 回傳找到的第二個元素
$('#d2')[1];                            // 與上方寫碼等價
$('#d3').get(0).style.color = 'black';  // 後面可接 DOM 語法
$(document.getElementById('d3'));       // 將 DOM 轉為 jQuery

// attr 找屬性
$('a').attr('title');       // 找 title 屬性
$('a').attr('title', 'Hi'); // 設定其值
$('a').attr({               // 設定多個屬性值
    alt: 'Hello',
    title: 'Hi'
});
$('a').removeAttr('title'); // 刪除屬性
$('a').attr('title', null); // 效果同上
$('a').addClass('blue');    // class 屬性寫法比較特別
$('a').removeClass('blue'); // 刪除 class='blue' 屬性 

// css 樣式
$('a').css('color'); // 取得第一個 a 的顏色
$('a').css('opacity', '1'); // 所有 a 都為半透明
$('a').css({      // 同時改多個樣式
    color: 'black',
    // 有 - 的需要加 ''
    'background-color': 'white' 
  });

// .width() .height()
// 抓到的值是元素內容 寬、高
// 不含 padding, border, margin 的部分
$('a').height();  // 取得第一個 a 的高 (px)
$('a').height(5); // 將所有 a 高設定為 100px

$('p:last').offset().left; // 元素相對視窗左邊的偏移量
$('p:last').offset().top;  // 元素相對視窗上邊的偏移量

$('p').eq(2); // 取得第三個元素，與 get 方法不同在於回傳 jQuery 物件
$('p').filter('.c1'); // 取得 class 為 c1 的所有 p
$('p').not('.a, #b'); // 刪除掉 class 為 a 的及 id 為 b 的元素

// 將 li 的父元素背景改為紅色
$('li').parent().css('background-color', 'white');
// 將 li 的所有祖先元素背景都改為紅色 (直到 <html> 元素)
$('li').parents().css('background-color', 'white');
// 將 li 的所有 <p> 祖先元素背景都改為紅色
$('li').parents('p').css('background-color', 'white');
// 將有 .selected class 的 div 所有子元素顏色改為藍色
$('div').children('.selected').css('color', 'white');
// 取得所有 div 下的子元素為 p 的元素
$('div').find('p');
$('p', $('div'));

// 取得其後緊鄰的兄弟元素 (同輩元素)
$('a').next();
// 取得從下一個直到最後一個同輩元素
$('a').nextAll();
// 前一個同輩元素
$('a').prev();
// 從前一個直到最開頭的同輩元素
$('a').prevAll();
// 取得其所有同輩元素的集合
$('a').siblings();
// () 內可放條件來過濾符合條件的元素
$('a').prevAll('.some');

// 設定更改元素內容
$('#d3').html('<p>Hello World</p>');
// 取得元素內容
$('#d3').html();
// 設定元素內純文字內容，< 與 > 會自動被轉成 HTML entities
$('a').text('Hello World');
// 取得純文字內容，會自動略過標籤符號打印所有的文字內容
$('a').text();

// 元素內部 最後面 加入內容 (內部插入)
$('a').append('<b>Hello</b>');
// 元素內部 最前面 加入內容 (內部插入)
$('a').prepend('<b>Hello</b>'); 
// 匹配的元素 前面 加入內容 (外部插入)
$('a').before('<b>Hello</b>');
// 匹配的元素 後面 加入內容 (外部插入)
$('a').after('<b>Hello</b>');

// 上面語法的 () 若放 jQuery 或 DOM
// 代表把該指定元素移到指定節點，例如：
// 將 b 移到 a 元素裡的最後面
$('a').append($('b'));

// 將所有個別的 a 元素外圍都包上一個 wrap() 內的元素
$('a').wrap('<div class="new"></div>');
// 將所有的 a 元素一起包在一個 wrapAll() 內的元素
$('a').wrapAll('<div class="new" />');
// 將所有的 a 元素內都放入一個 wrapInner() 內的元素
// 並把 a 裡原本的 childs 都放入該元素裡
$('a').wrapInner('<div class="new"></div>');

// 刪除元素裡的所有 childs
$('.hello').empty();
// 刪除整個元素
$('.hello').remove();
$('div').remove('.hello');
// 複製元素
$('.hello').clone();
// 會 append 到 .hi 元素內的最後一個
// 因為是複製所以原本的元素不會不見
// 若沒使用 clone， 效果會像是移動
$('.hello').clone().appendTo('.hi');

// 事件處理

// 觸發所有 p 的 click 事件
$('p').click();
// 同上
$('p').click(function() {
    $(this).css('color', 'blue');
});
$('p').click(function() {
    $(this).css('background-color', 'yellow');
});
// 事件處理函數中的 this 為被觸發的 DOM，而非 jQuery 物件
// 一個事件可觸發多個 callback 函數 
// 也一樣支援 function(event) 的寫法

// hover 語法
$('#Bubble_DIV li').hover(
    // 當滑鼠移動到一個匹配的元素上面時，會觸發第一個函數 (handlerIn)
    function() {
      $(this).append($('<span> ***</span>'));
    // 當滑鼠移出該元素時，會觸發第二個函數 (handlerOut)
    }, function() {
      $(this).find('span:last').remove();
    }
);

// bind 語法
// 也可以用 bind 綁定事件

// 滑鼠點 foo 元素時跳出 alert 訊息
$('#foo').bind('click', function() {
    alert('User clicked on foo.');
});
// 移除 foo 元素上所有綁定的事件處理函式
$('#foo').unbind();
// 只移除 foo 元素上所有綁定的 click 事件處理函式
$('#foo').unbind('click');

// 只移除特定事件的特定處理函式
var handler = function() { alert('hi'); };
$('#foo').bind('click', handler);
$('#foo').unbind('click', handler);

// bind 及 unbind 還可以達到 自訂事件處理 的功能
$('#foo').bind('myEvent', handler);
// 用 trigger 觸發自定義的 myEvent
$('#foo').trigger('myEvent');
// 也可用來觸發一般事件
$('#foo').trigger('click');
// one 語法會在觸發一次後 unbind
$('#foo').one('click', function() {
    alert('Displayed only once.');
});

// on 語法

// 是主要推薦使用的事件處理綁定函式，也用來取代 bind
// bind 的缺點在於是直接綁定事件在選取的元素上，所以在綁定當時，元素必須是已經存在 DOM 中
// on 充分利用瀏覽器事件傳播 event bubbling 和事件委任 event delegation 的技巧
// 使得 on 可以用來綁定事件處理在現在已經存在或還沒存在的 DOM

// 在每個元素上都綁定事件，效能差
$('.Delegation li').on('click', function() {
    // 這裡的 this 指向 .Delegation li 這一個 DOM 元素
    console.log('Method 1: ' + $(this).text());
    // 也可寫成 'click mouseleave' 綁定多個事件
});

// 利用 delegation 只在 ancestor 統一處理事件，效能好
$('.Delegation').on('click', 'li', function() {
    // 這裡的 this 指向符合 selector 的 DOM 元素，也就是 li
    console.log('Method 2: ' + $(this).text());
});

// 移除所有 a 元素的事件處理
$('a').off();
// 移除所有 a 元素的 click 事件處理 
// 但若是 Delegation 還是可執行
$('a').off('click');
// 移除 #foo 的 click 事件委任
$('a').off('click', '#foo');
// 移除 #foo 的 click 事件委任中的 handler 函數
$('a').off('click', '#foo', handler);

// 例子
function flash() {
    // 顯示並淡出特效
    $('#d5 div').show().fadeOut( 'slow' );
}
// 點擊 #bind 讓 #theone 綁定事件，並顯示 Can Click!
$('#bind').click(function() {
    $('#d5')
      .on('click', '#theone', flash)
      .find('#theone')
      .text('Can Click!');
});
// 點擊 #unbind 移除 #theone 的綁定事件，並顯示 Does nothing...
$('#unbind').click(function() {
    $('#d5')
      .off('click', '#theone', flash)
      .find('#theone')
      .text('Does nothing...');
});

// ready 語法
$(document).ready(function() {
    // ready event 是等 HTML DOM 準備好才開始執行的程式
  });
$(function() {
    // 意思同上
});

// 效果動畫

// 慢慢淡出 1s，若沒填 () 會快速跳出
$('#e #e1').show(1000);
// 退去，() 內也可輸入 'fast' 'slow' 或 數字
$('#e #e1').hide('fast');
// 會翻轉目前的顯示狀態
$('#e #e2').toggle();
// 滑下的特效來顯示元素
$('#e #e3').slideDown(1000);
// 滑上的特效來隱藏元素
$('#e #e3').slideUp(1000);
// 淡入顯示
$('#e #e4').fadeIn('slow');
// 動態漸變調整元素透明度 opacity 0~1
$('#e #e4').fadeTo('slow', 0.33);
// 淡出隱藏
$('#e #e4').fadeOut('slow');
// 特效的 () 內的第二個參數也可以輸入 callback function

// 可以用 animate 自己設定動畫
$('#e #e5').animate({ 
    width: '20%',
    opacity: 0.4,
    marginLeft: '0.6in',
    fontSize: '1em',
    borderWidth: '10px'
}, 1500);
//只支援 可數字化 的屬性，如 height, width, left, top, opacity ...
