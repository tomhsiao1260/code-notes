import React, { Component } from "react";
import { connect } from "react-redux";
import { getData } from "../js/actions/index";

export class Post extends Component {
  componentDidMount() {
    // 會以 AJAX 方式產生 action 並 dispatch 給 store
    this.props.getData();
  }

  render() {
    return (
      <ul>
        {this.props.articles.map(el => (
          <li key={el.id}>{el.title}</li>
        ))}
      </ul>
    );
  }
}

function mapStateToProps(state) {
  return {
    // 將 store 中 remoteArticles 的 state 存成名為 articles 的 props
    articles: state.remoteArticles.slice(0, 10)
  };
}

// { getData } 寫法會在執行 this.props.getData(...) 時
// 自動將 return 值作為 action 並 dispatch 到 store
export default connect(
  mapStateToProps,
  { getData }
)(Post);