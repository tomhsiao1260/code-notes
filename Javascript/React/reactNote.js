import React from 'react';
import ReactDOM from 'react-dom';

// 1.建立一個 react 的 functional component
// props 是一個物件，傳入 element 的屬性
// JSX 語法可在 js 裡撰寫 react element，但遇到 js 語法處要加 {}
// JSX 最終會透過 webpack 或 Babel 轉成 js 的語法
function A(props) {
    return <p>Hi, {props.name}</p>;
}
export default A;

// 或建立一個 react 的 class component
// D 繼承了 React.Component，並實作 render 方法
// 用 this.props 存取物件
class D extends React.Component {
    render() {
        return <p>Hi, {this.props.name}</p>;
    }
}
//非默認值時加{}
export {D};

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
}
function C(props){ // 不需傳入 props 也可寫為 C()
    return(
        <B n1={props.n1} n2={props.n2}>
            <p>Children</p>
        </B>
    );
}

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
        // setState 可用來改變 State 狀態，並觸發 render 更新
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
    click_ = () => {console.log(this);}
    render() {
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
      <a href="#" onClick={click}>Click me</a>
    );
}
export {F};


// react 檔案介紹和使用方法
// https://www.digitalocean.com/community/tutorials/how-to-set-up-a-react-project-with-create-react-app
// 在 public 資料夾下不會被 webpack 打包，而是直接被放在 build 後的根目錄下
// push 到 Github Page 方法
// https://medium.com/@yystartup/%E7%94%A8-github-pages-%E8%A3%BD%E4%BD%9C-react-demo-site-7840fcb9cc33