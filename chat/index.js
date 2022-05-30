import Cookies from '/node_modules/js-cookie/dist/js.cookie.min.mjs'

let recipient_id = parseInt((window.location.href).split('#')[1])

let sender_id = parseInt(Cookies.get('userId'))
let jwt_token = Cookies.get('jwt_token')

let oldMessagesId;

let API = {
    baseUrl: 'http://localhost:1337',
    me: "http://localhost:1337/api/users/me",
    users: "http://localhost:1337/api/users/",
    messeages: "http://localhost:1337/api/messages?_limit=-1&sort[0]=id%3Aasc",
    postMessage: "http://localhost:1337/api/messages"
}
const backButton = document.querySelector('#back-btn');

backButton.addEventListener('click', () => {
    history.back()
});

const scrollToBottom = () => {
    let scrollBox =  document.querySelector('.chat-scroll');
    let messageListHeight = document.querySelector('.message-list').clientHeight
   scrollBox.scrollTo(0, messageListHeight)
}
const setProfile = () => {
    let url = API.users + recipient_id;
    fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `bearer ${jwt_token}`
        }
    })
        .then(response => response.json())
        .then((data) => {
            let name = data.name;
            let avatar = API.baseUrl + data.avatar;

            document.querySelector('.header-avatar').src = avatar;
            document.querySelector('.header-name').innerHTML = name;
        })
}

const getMessages = () => {
    let url = API.messeages;
    let newMessageId;
    let oldDate;
    fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `bearer ${jwt_token}`
        }
    })
        .then(response => response.json())
        .then((data) => {
            let messageContainer = document.querySelector('.message-list');
            messageContainer.innerHTML = '';
            let messages = data.data;
            messages.forEach(mess => {
                let { message, createdAt, senderId, recipientId} = mess.attributes;

                if ((senderId === sender_id && recipientId === recipient_id) || (senderId === recipient_id && recipientId === sender_id)) {
                    let time = (new Date(createdAt)).toLocaleTimeString();
                    let hrm = time.split(':')
                    let ampm = time.split(' ')
                    let formatedTime = `${hrm[0]}:${hrm[1]} ${ampm[1]}`
                    let date = (new Date(createdAt)).toLocaleDateString()
                    newMessageId = mess.id
                    messageContainer.innerHTML += `<div class="message-wrapper"><small class="timestamp">${oldDate !== date ? date + ' At ' + formatedTime: ''}</small><div class="message ${senderId === sender_id ? '' : 'not-my'}">${message}</div></div>`
                    oldDate = date
                }
            })
            if(oldMessagesId !== newMessageId) { 
                scrollToBottom();
                oldMessagesId = newMessageId;
            }


        })
}

setProfile();
getMessages();


const sendButton = document.querySelector('.send-button');
sendButton.addEventListener('click', () => {
    let message = document.querySelector('.chat-textarea').innerHTML;
    let recipientId = recipient_id;
    let senderId = sender_id;

    fetch(API.postMessage, {
        method: 'POST',
        headers: {
            Authorization: `bearer ${jwt_token}`,
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            data:{
                message, senderId, recipientId
            }
        })
    })
    .then( response => {
        if(response.ok) {
            getMessages();
            document.querySelector('.chat-textarea').innerHTML = ''
        }
    })
})

setInterval(()=>{
    getMessages();
}, 2000)