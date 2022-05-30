import Cookies from '/node_modules/js-cookie/dist/js.cookie.min.mjs'
let API = {
    upload: "http://localhost:1337/api/upload",
    register: "http://localhost:1337/api/auth/local/register"
}
let jwt_token = Cookies.get('jwt_token');

if(jwt_token) {
    window.location.href = '/'
} 
let fileInput = document.querySelector('#files');

fileInput.addEventListener('change', (e) => {
    let file = e.target.files[0];

    let image = URL.createObjectURL(file);

    e.target.style.setProperty('background', `url("${image}")`)
    e.target.style.setProperty('--content-opacity', 0)
})

let form = document.querySelector('#register-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let formData = new FormData(form);

    fetch(API.upload, {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            let avatar = data[0].url;
            let username = Math.floor(Math.random() * 10 ** 10)

            formData.append('avatar', avatar);
            formData.append('username', username)

            fetch(API.register, {
                method: "POST",
                body: formData
            })
                .then(response => response.json())
                .then((userdata) => {
                    let jwt_token = userdata.jwt;

                    let userId = userdata.user.id;

                    let userName = userdata.user.username;

                    Cookies.set('jwt_token', jwt_token, { expires: 365 })
                    Cookies.set('userId', userId, { expires: 365 })
                    Cookies.set('userName', userName, { expires: 365 })   
                    
                    window.location.replace('/')

                })
        })
})