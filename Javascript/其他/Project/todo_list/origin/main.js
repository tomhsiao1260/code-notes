const input = document.getElementById('todo-input');

let todoListData = [];

input.addEventListener('keyup', event => {
  if (event.keyCode == '13' && event.target.value !== '')  {

	  addList(event.target.value);
	  updateCount();

	  event.target.value = '';
  }
});

function addList(content){

	const wrapper = document.createElement("DIV");
	const checkbox = document.createElement("INPUT");
	const label = document.createElement("LABEL");

	wrapper.setAttribute("class","todo-app__checkbox");
	checkbox.setAttribute("type","checkbox");
	checkbox.setAttribute("id",todoListData.length);
	checkbox.setAttribute("onClick", "checkClick(this)");
	label.setAttribute("for",todoListData.length);

	wrapper.appendChild(checkbox);
	wrapper.appendChild(label);

	const itemNode = document.createElement("LI");
	const detail = document.createElement("H1");
	const itemX = document.createElement("img");

	itemNode.setAttribute("class","todo-app__item");
	detail.setAttribute("class","todo-app__item-detail");
	itemX.setAttribute("class","todo-app__item-x");
	itemX.setAttribute("src","./img/x.png");
	itemX.setAttribute("onClick", "deleteItem(this)");

	detail.innerText = content;

	itemNode.appendChild(wrapper);
	itemNode.appendChild(detail);
	itemNode.appendChild(itemX);

	const list = document.querySelector("#todo-list");
	list.appendChild(itemNode);

	const newItem = { node: itemNode, isComplete: false };
	todoListData.push(newItem);
}

function updateCount(){
	const todoCount = document.getElementById("todo-count");
	todoCount.innerHTML = todoListData.filter(ele => !ele.isComplete).length;
	todoCount.innerHTML += ' left';
}

function checkClick(input){
	let node = input;
	node = node.parentNode;
	node = node.parentNode;
	node = node.getElementsByTagName('h1');
	node = node[0];

	const id = input.getAttribute('id');
	if(!todoListData[id].isComplete){
		node.style["textDecoration"] = "line-through";
		node.style["opacity"] = 0.5;
	}else{
		node.style["textDecoration"] = "none";
		node.style["opacity"] = 1.0;
	}
	todoListData[id].isComplete = !todoListData[id].isComplete;

	updateCount();
}

function deleteItem(ele){
	const item = ele.parentNode;
	const list = item.parentNode;
	list.removeChild(item);

	const input = item.getElementsByTagName('input')[0];
	const id = input.getAttribute('id');
	todoListData[id].isComplete = true;

	updateCount();
}

const btnView = document.querySelector(".todo-app__view-buttons");
const all = btnView.children[0];
const active = btnView.children[1];
const completed = btnView.children[2];
const btnColor = "#e6e6e6";

all.setAttribute("onClick", "listAll()");
active.setAttribute("onClick", "listActive()");
completed.setAttribute("onClick", "listCompleted()");
all.style.backgroundColor = btnColor;

function listAll(){
	const list = document.querySelector("#todo-list");
	for(const item of list.children){
		item.style.display = "flex";
	}
	all.style.backgroundColor = btnColor;
	active.style.backgroundColor = "transparent";
	completed.style.backgroundColor = "transparent";
}

function listActive(){
	const list = document.querySelector("#todo-list");
	for(const item of list.children){
		const input = item.getElementsByTagName('input')[0];
		const id = input.getAttribute('id');
		item.style.display = todoListData[id].isComplete ? "none" : "flex";
	}
	all.style.backgroundColor = "transparent";
	active.style.backgroundColor = btnColor;
	completed.style.backgroundColor = "transparent";
}

function listCompleted(){
	const list = document.querySelector("#todo-list");
	for(const item of list.children){
		const input = item.getElementsByTagName('input')[0];
		const id = input.getAttribute('id');
		item.style.display = todoListData[id].isComplete ? "flex" : "none";
	}
	all.style.backgroundColor = "transparent";
	active.style.backgroundColor = "transparent";
	completed.style.backgroundColor = btnColor;
}

let btnClean = document.querySelector(".todo-app__clean");
btnClean = btnClean.firstElementChild;

btnClean.setAttribute("onClick", "clearCompleted()");

function clearCompleted(){
	const list = document.querySelector("#todo-list");
	for(const item of list.children){
		const input = item.getElementsByTagName('input')[0];
		const id = input.getAttribute('id');
		if(todoListData[id].isComplete){ list.removeChild(item); }
	}
}