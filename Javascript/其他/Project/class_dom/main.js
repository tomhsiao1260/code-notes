// 下面寫法將表格的資料和語法邏輯分離
// 比起直接寫死在 HTML 內，此寫法更能方便的擴充或與後端傳遞資料
const columnIndex = ["Subject", "Score"];
const records =  [
		["Math", 100],
		["Chinese", 87],
	];

// 將會重複使用的 element 寫成一個名為 Row 的 class，node() 方法會產生：

// <tr>
//   <tag>data[0]</tag>
//   <tag>data[1]</tag>
//   ...
// </tr>

// tag 為輸入的標籤名稱
class Row {
	constructor(data, tag) {
		this.trNode = document.createElement("tr");
		for (let i=0; i< data.length; i++) {
			const thisNode = document.createElement(tag);
			thisNode.textContent = data[i];
			this.trNode.appendChild(thisNode);
		}
	}
	node(){ return this.trNode; }
}

const tbNode = document.getElementsByTagName("table")[0];

// 產生 thead
const thNode = document.createElement("thead");
// new 一個 Row class 並使用 node() 方法
thNode.appendChild(new Row(columnIndex, "th").node());
tbNode.appendChild(thNode);

// 產生 tbody
const tbodyNode = document.createElement("tbody");
for (let i=0; i< records.length; i++) {
	tbodyNode.appendChild(new Row(records[i], "td").node());
}
tbNode.appendChild(tbodyNode);

// 最終會在 table 的標籤內 append 出下面結果：

// <table>
// 	<thead>
// 		<tr>
// 			<th>Subject</th>
// 			<th>Score</th>
// 		</tr>
// 	</thead>
// 	<tbody>
//		<tr>
//			<td>Math</td>
//			<td>100</td>
//		</tr>
//		<tr>
//			<td>Chinese</td>
//			<td>87</td>
//		</tr>
// 	</tbody>
// </table>









