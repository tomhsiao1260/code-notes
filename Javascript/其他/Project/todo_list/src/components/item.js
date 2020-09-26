import React from 'react'
import p from 'prop-types'
import './item.css'
import x from '../assets/x.png'

const Content = (props) => {
    const done = props.done;
    const style = [
        {textDecoration: 'line-through', opacity: 0.5},
        {textDecoration: 'none', opacity: 1},
    ]
    if(done){
        return <h1 className='todo-app__item-detail' style={style[0]}>{props.children}</h1>
    }else{
        return <h1 className='todo-app__item-detail' style={style[1]}>{props.children}</h1>
    }
}

Content.propTypes = {
    done: p.bool.isRequired,
};

const Item = (props) => {

    const checkClick = e => {
        const id = e.target.getAttribute('id');
        props.isComplete(id);
    }

    const remove = e => {
        const item = e.target.parentNode;
        const input = item.getElementsByTagName('input')[0];
        const id = input.getAttribute('id');
        props.removeTodo(id);
    }

    return (
        <ul id="todo-list" className="todo-app__list">
            {
                props.todo.map(item => {
                    return(
                        <li className='todo-app__item' key={item.id}>
                            <div className='todo-app__checkbox'>
                                <input type='checkbox'
                                       onClick={checkClick}
                                       id={item.id}
                                       done={item.isComplete ? 1:0}>
                                </input>
                                <label htmlFor={item.id}></label>
                            </div>
                            <Content done={item.isComplete}>{item.text}</Content>
                            <img className='todo-app__item-x' src={x} alt='x' onClick={remove}/>
                        </li>
                    )
                })
            }
        </ul>
    )
}

Item.propTypes = {
    isComplete: p.func.isRequired,
    removeTodo: p.func.isRequired,
    todo: p.arrayOf(p.shape({
        id: p.number.isRequired,
        text: p.string.isRequired,
        isComplete: p.bool.isRequired,
    })).isRequired,
};

export default Item;
