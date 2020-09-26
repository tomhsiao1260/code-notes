import React from 'react'
import './header.css'

const title = 'todos';

const Header = () => {
    return (
        <header className="todo-app__header">
            <div className="todo-app__title">{title}</div>
        </header>
    )
}

export default Header;
