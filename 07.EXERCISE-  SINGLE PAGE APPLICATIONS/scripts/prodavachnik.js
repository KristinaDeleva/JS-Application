function startApp() {
    $('header').find('a').show()
    const ADS_DIV = $('#ads')

    function showView(view) {
        $('section').hide()
        switch (view) {
            case 'home': $('#viewHome').show(); break;
            case 'login': $('#viewLogin').show(); break;
            case 'register': $('#viewRegister').show(); break;
            case 'ads': $('#viewAds').show(); loadAds(); break;
            case 'create': $('#viewCreateAd').show(); break;
            case 'edit': $('#viewEditAd').show(); break;
            case 'detail': $('#viewDetailsAd').show(); break;
        }
    }

    function navigateTo(ev) {
        $('section').hide()
        let target = $(ev.target).attr('data-target')
        $('#' + target).show()
    }

    //Event listener
    $('#linkHome').click(() => showView('home'))
    $('#linkLogin').click(() => showView('login'))
    $('#linkRegister').click(() => showView('register'))
    $('#linkListAds').click(() => showView('ads'))
    $('#linkCreateAd').click(() => showView('create'))
    $('#linkLogout').click(logout)

    $('#buttonLoginUser').click(login)
    $('#buttonRegisterUser').click(register)
    $('#buttonCreateAd').click(createAd)

    //Notifications
    $(document).on({
        ajaxStart: () => $('#loadingBox').show(),
        ajaxStop: () => $('#loadingBox').fadeOut()
    })

    $('#infoBox').click((event) => $(event.target).hide())
    $('#errorBox').click((event) => $(event.target).hide())

    function showInfo(message) {
        $('#infoBox').text(message)
        $('#infoBox').show()
        setTimeout(() => $('#infoBox').fadeOut(), 3000)
    }

    function showError(message) {
        $('#errorBox').text(message)
        $('#errorBox').show()
    }

    function handleError(reason) {
        showError(reason.responseJSON.description)
    }

    let requester = (() => {
        const BASE_URL = 'https://baas.kinvey.com/'
        const APP_KEY = 'kid_Sy8IOrdBX'
        const APP_SECRET = 'c0f1ad7f523444808eb94f7bd1b44446'

        function makeAuth(type) {
            if (type === 'basic'){
                return 'Basic ' + btoa(APP_KEY + ':' + APP_SECRET)
            }else {
                return 'Kinvey ' + localStorage.getItem('authToken')
            }
        }

        function makeRequest(method, module, url, auth) {
            return req = {
                method,
                url: BASE_URL + module + '/' + APP_KEY + '/' + url,
                headers: {
                    'Authorization': makeAuth(auth)
                }
            }
        }

        function get(module, url, auth) {
            return $.ajax(makeRequest('GET', module, url, auth))
        }

        function post(module, url, data, auth) {
            let req = makeRequest('POST', module, url, auth)
            req.data = JSON.stringify(data)
            req.headers['Content-Type'] = 'application/json'
            return $.ajax(req)
        }

        function update(module, url, data, auth) {
            let req = makeRequest('PUT', module, url, auth)
            req.data = JSON.stringify(data)
            req.headers['Content-Type'] = 'application/json'
            return $.ajax(req)
        }

        function remove(module, url, auth) {
            let req = makeRequest('DELETE', module, url, auth)
            return $.ajax(req)
        }

        return {
            get, post, update, remove
        }
    })()

    if (localStorage.getItem('authtoken') !== null &&
        localStorage.getItem('username') !== null) {
        userLoggedIn()
    }else {
        userLoggedOut()
    }

    showView('home')

    function userLoggedIn() {
        $('#loggedInUser').text("Welcome, " + localStorage.getItem('username') + "!")
        $('#loggedInUser').show()
        $('#linkLogin').hide()
        $('#linkRegister').hide()
        $('#linkLogout').show()
        $('#linkListAds').show()
        $('#linkCreateAd').show()
    }

    function userLoggedOut() {
        $('#loggedInUser').text("")
        $('#loggedInUser').hide()
        $('#linkLogin').show()
        $('#linkRegister').show()
        $('#linkLogout').hide()
        $('#linkListAds').hide()
        $('#linkCreateAd').hide()
    }

    function saveSession(userInfo) {
        localStorage.setItem('authToken', userInfo._kmd.authtoken)
        localStorage.setItem('username', userInfo.username)
        localStorage.setItem('userId', userInfo._id)
        userLoggedIn()
    }

    async function login() {
        let username = $('#formLogin input[name="username"]').val()
        let password = $('#formLogin input[name="passwd"]').val()

        try {
            let data = await requester.post('user', 'login', {username, password}, 'basic')
            showInfo('Logged in!')
            saveSession(data)
            showView('ads')
        }catch (err) {
            handleError(err)
        }

    }

    async function register() {
        let username = $('#formRegister input[name="username"]').val()
        let password = $('#formRegister input[name="passwd"]').val()

        try {
            let data = await requester.post('user', '', {username, password}, 'basic')
            showInfo('Registered!')
            saveSession(data)
            showView('ads')
        }catch (err) {
            handleError(err)
        }
    }

    async function logout() {
        try {
            let data = await requester.post('user', '_logout', {authtoken: localStorage.getItem('authtoken')})
            localStorage.clear()
            showInfo('Logged out!')
            userLoggedOut()
            showView('home')
        }catch (err) {
            handleError(err)
        }
    }

    async function loadAds() {
        let data = await requester.get('appdata', 'prodavachnik')
        ADS_DIV.empty()
        if (data.length === 0) {
            ADS_DIV.append('<p>No ads in database</p>')
            return
        }

        for (let ad of data) {
            let html = $('<div>')
            html.addClass('ad-box')
            let title = $(`<div class="ad-title">${ad.title}</div>`)
            if (ad._acl.creator === localStorage.getItem('userId')) {
                let deleteBtn = $('<button>&#10006;</button>').click(() => deleteAd(ad._id))
                deleteBtn.addClass('ad-control')
                deleteBtn.appendTo(title)
                let editBtn = $('<button>&#9998;</button>').click(() => editAd(ad))
                editBtn.addClass('ad-control')
                editBtn.appendTo(title)
            }
            html.append(title)
            html.append(`<div><img src="${ad.imageUrl}"></div>`)
            html.append(`<div>Price: ${Number(ad.price).toFixed(2)} | By ${ad.publisher}</div>`)
            ADS_DIV.append(html)
        }
    }

    async function deleteAd(id) {
        await requester.remove('appdata', 'prodavachnik/' + id)
        showInfo('Ad deleted!')
        showView('ads')
    }

    function editAd(ad) {
        let form = $('#formEditAd')
        form.find('input[name="title"]').val(ad.title)
        form.find('textarea[name="description"]').val(ad.description)
        form.find('input[name="price"]').val(Number(ad.price))
        form.find('input[name="image"]').val(ad.imageUrl)


        let date = ad.date
        let publisher = ad.publisher
        let id = ad._id

        form.find('#buttonEditAd').click(() => edited(id, date, publisher))
        showView('edit')
    }

    async function edited(id, date, publisher) {
        let form = $('#formEditAd')
        let title = form.find('input[name="title"]').val()
        let description = form.find('textarea[name="description"]').val()
        let price = Number(form.find('input[name="price"]').val())
        let imageUrl = form.find('input[name="image"]').val()

        if (title.length === 0) {
            showError('Title cannot be empty')
            return
        }
        if (Number.isNaN(price)) {
            showError('Price cannot be empty')
            return
        }

        let editedAd = {
            title, description, price, imageUrl, date, publisher
        }

        try {
            await requester.update('appdata', 'prodavachnik/' + id, editedAd)
            showInfo('Ad editted!')
            showView('ads')
        }catch (err) {
            handleError(err)
        }
    }

    async function createAd() {
        let title = $('#formCreateAd input[name="title"]').val()
        let description = $('#formCreateAd textarea[name="description"]').val()
        let price = Number($('#formCreateAd input[name="price"]').val())
        let imageUrl = $('#formCreateAd input[name="image"]').val()
        let date = (new Date()).toString('dd/MM/yyyy')
        let publisher = localStorage.getItem('username')

        if (title.length === 0) {
            showError('Title cannot be empty')
            return
        }
        if (Number.isNaN(price)) {
            showError('Price cannot be empty')
            return
        }

        let newAd = {
            title, description, price, imageUrl, date, publisher
        }

        try {
            await requester.post('appdata', 'prodavachnik', newAd)
            showInfo('Ad created!')
            showView('ads')
        }catch (err) {
            handleError(err)
        }
    }
}