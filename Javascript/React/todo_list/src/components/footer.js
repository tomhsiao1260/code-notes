import React from 'react'
import p from 'prop-types'
import './footer.css'

const btnView = ['All', 'Active', 'Completed'];
const btnColor = "#e6e6e6";

const Footer = (props) => {
    const numLeft = props.todo.filter(ele => !ele.isComplete).length;

    const click = e =>{
        const btnId = Number(e.target.id);

        let list = document.querySelector("#todo-list");
        list = Array.from(list.children);

        let btnView = e.target.parentNode;
        btnView = Array.from(btnView.children);

        switch (btnId) {
            case 0:
                list.forEach( item => item.style.display = "flex");
                break;
            case 1:
                list.forEach( item => {
                    const input = item.getElementsByTagName('input')[0];
                    const done = input.getAttribute('done');
                    item.style.display = Number(done) ? "none" : "flex";
                })
                break;
            case 2:
                list.forEach( item => {
                    const input = item.getElementsByTagName('input')[0];
                    const done = input.getAttribute('done');
                    item.style.display = Number(done) ? "flex" : "none";
                })
                break;
            default: break;
        }

        btnView.forEach(btn => btn.style.backgroundColor ="transparent")
        e.target.style.backgroundColor = btnColor;
    }

    const clear = () => {
        const list = document.querySelector("#todo-list");
        for(let item of list.children){
            const input = item.getElementsByTagName('input')[0];
            const id = input.getAttribute('id');
            const done = input.getAttribute('done');
            if (Number(done)){ props.removeTodo(id); }
        }
    }

    return (
        <footer id="todo-footer" className="todo-app__footer">
            <div id="todo-count" className="todo-app__total">{numLeft} left</div>
            <ul className="todo-app__view-buttons">
                {
                    btnView.map( (item, id) => {
                        return <button key={id} id={id} onClick={click}>{item}</button>
                    })
                }
            </ul>
            <div className="todo-app__clean">
                <button onClick={clear}>Clear completed</button>
            </div>
        </footer>
    )
}

Footer.propTypes = {
    todo: p.arrayOf(p.shape({
        id: p.number.isRequired,
        text: p.string.isRequired,
        isComplete: p.bool.isRequired,
    })).isRequired,
    removeTodo: p.func.isRequired,
};

export default Footer;
