const httpForm = document.querySelector(".HTTP");
const textarea = document.querySelector("textarea");

// 從 server 端 GET 資料，route 為 /api
function GET(){
    // 獲得 server 端的 response 
    fetch('/api').then( res => res.text() )
                 .then( result => textarea.innerText = result )
}

// POST 資料給 server 端，並得到 response，route 為 /api
function POST(){
    fetch('/api', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // 要 POST 給 server 端的資料內容
        body: JSON.stringify({
            name: 'Hubot',
            login: 'hubot'
        })
    })
    // 獲得 server 端的 response 
    .then( res => res.text() ) 
    .then( result => textarea.innerText = result )
}