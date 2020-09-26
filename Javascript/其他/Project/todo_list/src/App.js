import React, { Component } from 'react'
import Header from './components/header'
import Footer from './components/footer'
import Input from './components/input'
import Item from './components/item'
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          todos:[
            {id:0, text: "Make dinner tonight!", isComplete: false},
            {id:1, text: "Fold the laundry.", isComplete: false},
            {id:2, text: "Learn to make a React app!", isComplete: false}
          ],
          nextId: 3,
        };
    }

    addTodo = (todoText) => {
        let todos = this.state.todos.slice();
        todos.push({
            id: this.state.nextId, 
            text: todoText, 
            isComplete: false
        });
        this.setState( state => ({
            todos: todos,
            nextId: ++state.nextId
        }));
    }

    removeTodo = (id) => {
        this.setState( state => ({
            todos: state.todos.filter( item => item.id !== Number(id))
        }));
    }

    isComplete = (id) => {
        let todos = this.state.todos.slice();
        todos.forEach( item => {
            if(item.id === Number(id)){ 
                item.isComplete = !item.isComplete;
            }
        })
        this.setState({todos: todos});
    }

    render() {
        return (
            <div id="root" className="todo-app__root">
                <Header />
                <section className="todo-app__main">
                    <Input addTodo={this.addTodo}/>
                    <Item todo={this.state.todos} 
                          isComplete={this.isComplete}
                          removeTodo={this.removeTodo}
                    />
                </section>
                <Footer todo={this.state.todos}
                        removeTodo={this.removeTodo}
                />
            </div>
        )
    }
}

export default App;
