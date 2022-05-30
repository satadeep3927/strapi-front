import Cookies from '/node_modules/js-cookie/dist/js.cookie.min.mjs'
let API = {
    login: "http://localhost:1337/api/auth/local/",
}
let jwt_token = Cookies.get('jwt_token');

if (jwt_token) {
    window.location.href = '/'
}

let form = document.querySelector('#login-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let formData = new FormData(form);

    fetch(API.login, {
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