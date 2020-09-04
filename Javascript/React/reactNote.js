import React, {Component} from 'react';
import p from 'prop-types';

// 1.建立一個 react 的 functional component
// props 是一個物件，傳入 element 的屬性
// JSX 語法可在 js 裡撰寫 react element
// JSX 最終會透過 webpack 或 Babel 轉成 js 的語法
// 但在 public 資料夾下的檔案不會被 webpack 打包，而是直接被放在 build 後的根目錄下
function A(props) {
    return <p>Hi, {props.name}</p>;
}
// 可寫為 :
// const A = (props) => {
//     return <p>Hi, {props.name}</p>;
// }
// 注意 component 名稱第一個字要大寫

// JSX 語法遇到 js 語法處要加 {}
// 例如： <div>{true ? <p>Hi</p> : "Hello"}</div>
// props 也可傳入 component (因為都是物件)
// 例如 : 在屬性欄加入 attr = {<myEle />}

// 在 component 內加入方法 :
// function A(props) {
//    // 兩種寫法擇一
//	  function click(){ something... }
//	  const click = () => { something... }
//	  return <p onClick={click}>Hi, {props.name}</p>;
// }
// 也可寫成：onClick={()=>click()}

// 傳入事件：
// const click = (e) => { something... }
// function click(e) { something... } // 與上一列語法擇一
// onClick={click}           
// onClick={(e) => click(e)}          // 與上一列語法擇一
// onClick={(e) => click(e,id)}       // 也可同時傳入其他變數
export default A;

// 或建立一個 react 的 class component
// D 繼承了 React.Component，並實作 render 方法
// 用 this.props 存取物件
class D extends React.Component {
    render() {
        return <p>Hi, {this.props.name}</p>;
    }
}
// 加入方法
// class D extends React.Component {
//     // 兩種寫法擇一
//     click(){ something... }
//     click = () => { something... }
//     render() {
//         return <p onClick={this.click}>Hi, {this.props.name}</p>;
//     }
// }
// 也可寫成：onClick={()=>this.click()}
// 這樣寫會自動綁定 click(){ ... } 函數的 this 到 class 本身
// 除了要注意 this 以外，傳入事件的方法和 functional 的相同
export {D};  //非默認值時加{}

// 2.外部使用默認值時輸入 
// import A from './reactNote';
// 也可使用非默認值
// import {D} from './reactNote';

// 3.並產生一個 react element 
// const element = <A name="Mike" />;
// const element = <D name="Mike" />;

// 4.再將此 element 渲染到指定的 DOM
// ReactDOM.render(element, document.getElementById('root'));

// 渲染出 Hi, Mike (建議將流程反過來看)


// component 裡可包其他的 component，並以 props 傳遞參數
// props 是唯讀的，傳遞時不能更改 (像 pure function)
function B(props) {
    return (
        // 兩個元素以上要包在 <div></div> 或 <></> 裡
        // B 裡的 children 也會被傳到 props 裡
        <div>
            <A name={props.n1} />
            <A name={props.n2} />
            <div>{props.children}</div>
        </div>
    );
    // 注意 return 多行用 () 包起來
}
function C(props){ // 不需傳入 props 也可寫為 C()
    return(
        <B n1={props.n1} n2={props.n2}>
            <p>Children</p>
        </B>
    );
}

// 注意在 JSX 中寫 class 屬性要改為 className 呼叫
// 屬性名稱也儘量以 CamelCase 定義

// import {B, C} from './reactNote';        非默認值時加{}
// import {C as Rename} from './reactNote'; 也可取別名
// import * from './reactNote';             載入全部
export {B, C};

// 產生元素 <B n1="Yao" n2="Tien" />
// 用 ReactDOM 可渲染出 Hi, Yao 和 Hi, Tien
// 產生元素 <C n1="Yao" n2="Tien" />
// 用 ReactDOM 可渲染出 Hi, Yao 和 Hi, Tien 和 Children

class E extends React.Component {
    constructor(props) {
        // 繼承父類的 props
        super(props);
        // state 是一個物件，儲存這個 component 的狀態
        // state 只能在 constructor 宣告
        this.state = {
            date: new Date(),
            count: 0,
        };
        // 內建的 Lifecycle 方法裡的 this 都會正確指向 Component 本身
        // 但如果是自己新增的方法，需要在 constructor() 手動綁定 this
        // 沒寫會自動綁定到全域 window 上
        // 這點跟 ES6 裡的 class 不同 (ES6 的方法裡會自動綁定到 class)
        this.click = this.click.bind(this);
    }
    // Mount (掛載) 後執行 (Liftcycle Method)
    componentDidMount() {
        // 產生 timer
        this.timerID = setInterval(() => this.tick(), 1000);
    }
    // Unmount (卸載) 前執行 (Liftcycle Method)
    componentWillUnmount() {
        // 刪除 timer
        clearInterval(this.timerID);
    }  
    tick() {
        // setState 可用來改變 State 狀態，並觸發 virtual DOM 重新呼叫 render() 來更新
        // 直接改 this.state 為錯誤語法，不會觸發 render 更新
        this.setState({date: new Date()});
        // 因為 this.state 和 this.props 是非同步更新
        // 所以不行利用現在的值去更新下一步，可改用在 setState 裡輸入函數
        // 第一項會輸入會預設是當前更新後的 state，props 則為當前的 props 
        this.setState((state,props)=>({
            count: state.count + props.start + 1
        }));
    }
    // 若沒有 bind 則打印出的 this 為 undefined
    click() {
        this.setState(state => ({
            count: state.count++
        }));
    }
    // 也可用 arrow function 會自動把 this 綁定到建立的環境下，就不需 bind 語法
    // tick 不需要事先 bind 是因為呼叫時用了 arrow 自動綁定了
    // 傳入事件可寫為 click_ = e => {console.log(e);}
    // 可用 e.target 去找出 node
    click_ = () => {console.log(this);}
    render() {
        // render 和 return 間可以寫一些 JS 的語法或條件判斷
        return (
            <>
                <p>{this.state.date.toLocaleTimeString()}</p>
                <p>{this.state.count} seconds passed</p>
                <button onClick={this.click}>press</button>
            </>
        );
    }
}
export {E};
// 產生元素 <E start={0} />，動態渲染出當下時間
// state 只供 Component 內部使用，但可傳出作為下個 Component 的 props 使用
// Stateless Component: 不涉及狀態更新，只有 props 和 render (ex: funtional component)
// Stateful Component: 維護自身狀態，甚至使用 Liftcycle Method
// Virtual DOM: 在記憶體中 React 自己維護一個跟 DOM 一樣的資料結構
// 當狀態更新時，首先會去用一套 diff 演算法算出哪些元素有需要更新，接著才去操作真實的 DOM

// state 只可使用在宣告的 component 本身
// 若想在 child component 使用 parent 的 state，可用 props 傳遞下去給 child
// state 是專門給會改變的資料使用的，所以靜態的文字不建議使用
// 且使用 state 上儘量以最少化為原則，找出 App 需要最關鍵會變化的參數

// 有一些 component 需要反映相同的資料變化，可以將共享的 state 提升到最靠近它們的共同 ancestor
// 讓所有需要該資訊的 components 可以透過 state 的往下傳而得到資訊
// 若這樣的 ancestor 不存在，可以建立一個 wrapper component 儲存這些 state 資訊

// 事件處理
// HTML  語法： onclick='function()'
// React 語法： onClick={function}
// 不需使用額外的 Listener 語法監聽
function F() {
    function click(e) {
        // 阻止預設發生事件，這裡阻止了跳到 href="#" 這個連結
        e.preventDefault();
        // 阻止事件冒泡 (Event Bubbling)
        e.stopPropagation();
        console.log('The link was clicked.');
    } 
    return (
      // 注意不能寫 this.click 在 functional component 裡
      <a href="#" onClick={click}>Click me</a>
    );
}
export {F};

// 條件式 render
function G(props) {
    const login = props.isLoggedIn;
    if (login) { return <Case1 /> }
    else       { return <Case2 /> }
}
function Case1(){return null;}
function Case2(){return null;}
// 使用 <G isLoggedIn={true} />
// 也可搭配使用 return null; 不render，來實作條件式 render
export {G};

// 表單
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) => 
    // react 需要給每個 li 一個 key 的屬性
    // 每個元素的 key 值不同，以遍區分彼此增加渲染的效能
    <li key={number.toString()}>{number}</li> 
    // 只要在這個 array 操作內的 key 值唯一即可，array 以外可以重複
    // key 並不會被當作 props 傳遞下去，僅供 react 內部使用
);
// 使用 <ul>{listItems}</ul>

// 建議可以在 src 目錄下放下面兩個資料夾，存放不同性質的 Component：
// Containers: 存著 state/props 以及一些主要的邏輯，主要用 Class Component 撰寫
// Components: 沒有自己的 states, 也沒有什麼複雜的邏輯，建議改寫成 Functional Component 寫法上較簡潔

// 如果 子component 想要改變 父component 的 state，可參考下面寫法：
// 下方例子會在按鈕的外觀會從點擊後，從原本的 Press It 轉變為 Pressed
class H extends Component {
    constructor(props) {
        super(props);
        this.state = {btnText: 'Press It'};
    }
    // 先在 父component 寫好改變 state 的方法
    btnPress = () => {this.setState({btnText:'Pressed'})}

    render() {
        // 將 btnPress 方法用 props 傳給 子component
        return <Btn text={this.state.btnText} press={this.btnPress}/>
    }
}
function Btn(props) {
    // 子component 用 props 呼叫 父component 的方法去更新父的 state
    function Click(){ props.press() }
    // 父component 的 state 被更新的當下 (按鈕點擊)
    // 子component 的 props.text 也會隨之 update
    return <button onClick={Click}>{ props.text }</button>
}
// 所以，若 state 發生改變，跟 state 有關被傳下去的 props 對應的 component 外觀也會隨之 update
export {H};

// 加入樣式
const style = {
    margin: '20px auto',
    fontSize: '20px',
    fontWeight: 'bold'
};
// 使用 <div style={style}>text</div>


// 為了避免 JS 的自動型別轉換，可以用 propTypes 語法限制 props 的型態，以便提前報錯好找 bugs
// import PropTypes from 'prop-types';
  
// MyClass.propTypes = {
//     Prop1: PropTypes.string,
//     Prop2: PropTypes.func,
//     Prop3: PropTypes.bool.isRequired
// };

// MyClass 為 class 名稱，Prop1、Prop2 為 props 名稱
// 任何屬性都可加上 .isRequired，若沒有出現此 props 會跳出 warning
// 注意 PropTypes 的 p 大小寫
// 可用 const p = React.PropTypes; 則可改寫為 Prop1: p.string

// PropTypes 有幾種屬性：array、bool、func、number (基本型別)
//                     object、string、symbol (基本型別)
//                     node (任何節點)、element (元素)

// PropTypes 的其他屬性：
// PropTypes.oneOf(['str1', 'str2'])   (可為 'str1' 或 'str2')
// PropTypes.arrayOf(PropTypes.number) (矩陣內容許型態為數值)
// PropTypes.any.isRequired            (任何數據類型，且設為 Required)
// PropTypes.element.isRequired        (用來指定只能有一個 child node)
// PropTypes.shape({                   (只允許下面的結構)
//     color: PropTypes.string,
//     fontSize: PropTypes.number
// })
// PropTypes.oneOfType([               (可為下面幾種 type 其一)
// 	   PropTypes.string,
// 	   PropTypes.number
// ])

// import p from 'prop-types';
// PropTypes 改取為 p 較簡潔
function I(props){
	// 矩陣內的值必須為物件，且 key 1,2 分別為 數值,布林值
	const array = props.prop1;
	const fun = () => props.prop2();
	return null;
}
I.propTypes = {
    prop1: p.arrayOf(p.shape({
        key1: p.number.isRequired,
        key2: p.bool.isRequired,
    })).isRequired,
    prop2: p.func.isRequired,
};

// defaultProps 可為某些 props 指定預設值
// MyClass.defaultProps = {
//     someProp: 'Stranger'
// };  



