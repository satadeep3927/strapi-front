import Cookies from '/node_modules/js-cookie/dist/js.cookie.min.mjs'

const API = {
    baseUrl: 'http://localhost:1337',
    me: "http://localhost:1337/api/users/me",
    users: "http://localhost:1337/api/users/",
    messeages: "http://localhost:1337/api/messages?_limit=-1&sort[0]=id%3Adesc"
}
let rememberArray = []
let clickEventForMessage = ()=>{
    document.querySelectorAll('.home-chat').forEach(homechat => {
        homechat.addEventListener('click', (e) => {
            let url = `/chat#${e.target.dataset.recipientid}`;
            window.location.href = url;
        })
    })
}
let id = parseInt(Cookies.get('userId'))
let jwt_token = Cookies.get('jwt_token');

if (!jwt_token) {
    window.location.href = '/login'
}
fetch(API.me, {
    method: "GET",
    headers: {
        Authorization: `bearer ${jwt_token}`
    }
})
    .then(res => res.json())
    .then(data => {
        document.querySelector('#profile-img').src = API.baseUrl + data.avatar
    })

fetch(API.messeages, {
    method: "GET",
    headers: {
        Authorization: `bearer ${jwt_token}`
    }
})
    .then(res => res.json())
    .then(data => {
        let messages = data.data;

        messages.forEach(mess => {
            let { message, createdAt, recipientId, senderId } = mess.attributes;

            if (senderId === id) {
                let rememberValue = `${senderId}-${recipientId}`
                if(rememberArray.includes(rememberValue)){
                    return false;
                }
                rememberArray = [...rememberArray, rememberValue ]
                fetch(API.users + recipientId, {
                    method: "GET",
                    headers: {
                        Authorization: `bearer ${jwt_token}`
                    }
                })
                    .then(r => r.json())
                    .then(usersDetails => {
                        let time = (new Date(createdAt)).toLocaleTimeString();
                        let hrm = time.split(':')
                        let ampm = time.split(' ')
                        document.querySelector('.chat-container').innerHTML += `<div class="home-chat" data-recipientid="${recipientId}">
                    <div class="avatar">
                        <img src="${API.baseUrl}${usersDetails.avatar}" alt="avatar">
                    </div>
                    <div class="message">
                        <h3>${usersDetails.name}</h3>
                    <h6 class="m-preview">
                            ${message}
                    </h6>
                    </div>
                    <div class="timestamp">
                        ${hrm[0]}:${hrm[1]} ${ampm[1]}
                    </div>
                    </div>`;
                    clickEventForMessage()
                    })
            }
            else if(recipientId === id) {
                let rememberValue = `${recipientId}-${senderId}`
                if(rememberArray.includes(rememberValue)){
                    return false;
                }
                rememberArray = [...rememberArray, rememberValue ]
                fetch(API.users + senderId, {
                    method: "GET",
                    headers: {
                        Authorization: `bearer ${jwt_token}`
                    }
                })
                    .then(r => r.json())
                    .then(usersDetails => {
                        let time = (new Date(createdAt)).toLocaleTimeString();
                        let hrm = time.split(':')
                        let ampm = time.split(' ')
                        document.querySelector('.chat-container').innerHTML += `<div class="home-chat" data-recipientid="${senderId}">
                    <div class="avatar">
                        <img src="${API.baseUrl}${usersDetails.avatar}" alt="avatar">
                    </div>
                    <div class="message">
                        <h3>${usersDetails.name}</h3>
                    <h6 class="m-preview">
                            ${message}
                    </h6>
                    </div>
                    <div class="timestamp">
                        ${hrm[0]}:${hrm[1]} ${ampm[1]}
                    </div>
                    </div>`
                    clickEventForMessage()
                    })
            }

        });
    })
