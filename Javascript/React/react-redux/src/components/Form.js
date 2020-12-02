import React, { Component } from "react";
import { connect } from "react-redux";
import {v4 as uuid} from 'uuid'
import { addArticle } from "../js/actions/index";

// 將 dispatch 方法存成元件的 props
function mapDispatchToProps(dispatch) {
  return {
    // 即 store.dispatch(action)
    // 此時 action 為 {type:"ADD_ARTICLE", payload:article}
    // dispatch 會透過 reducer 更新 store
    addArticle: article => dispatch(addArticle(article))
  };
}

// 下面是 React 的 controlled component 寫法
class ConnectedForm extends Component {
  constructor() {
    super();
    this.state = {
      title: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { title } = this.state;
    const id = uuid();
    // 因為有 mapDispatchToProps，所以可直接呼叫 props 進行 dispatch
    // 最終會在 store 裡的 article 屬性對應的 array 裡新增一個 { title, id } 的物件
    // store 的更新會觸發 List.js 的 mapStateToProps 進而重新渲染 List 元件
    this.props.addArticle({ title, id });
    this.setState({ title: "" });
  }

  render() {
    const { title } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={this.handleChange}
          />
        </div>
        <button type="submit">
          SAVE
        </button>
      </form>
    );
  }
}

// 利用 Redux 的 connect 產生新的 component
// mapDispatchToProps 為第二個參數，會將 dispatch 方法處理為元件的 props
const Form = connect(null, mapDispatchToProps)(ConnectedForm);
// 更簡潔的寫法可將 mapDispatchToProps 改為 { addArticle } 達到同樣的效果
// 此寫法在執行 this.props.addArticle(...) 時，自動將 return 值作為 action 並 dispatch 到 store

export default Form;