import React, { Component } from 'react'

class Header extends Component {
    render() {
        const style = {
            margin: '20px auto',
            fontSize: '20px',
            fontWeight: 'bold'
        };
        return (
            <div style={style}>
                React Todos
            </div>
        )
    }
}

export default Header;
