import React from 'react'
import p from 'prop-types'
import './input.css'

const placeholder = 'What need to be done?';

const Input = (props) => {

    const handleKeyUp = e => {
        if (e.keyCode === 13 && e.target.value !== '')  {  
            props.addTodo(e.target.value);  
            e.target.value = '';
        }
    }

    return (
        <input id="todo-input" 
            className="todo-app__input" 
            placeholder={placeholder}
            onKeyUp={handleKeyUp}>
        </input>
    )
}

Input.propTypes = {
    addTodo: p.func.isRequired,
};

export default Input;