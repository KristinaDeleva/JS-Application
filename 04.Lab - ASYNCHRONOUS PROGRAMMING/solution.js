function attachEvents() {
    const URL = 'https://baas.kinvey.com/appdata/kid_BkyHZYWr7/'
    const USERNAME = 'peter'
    const PASSWORD = 'p'
    const BASE_64 = btoa(USERNAME + ':' + PASSWORD)
    const AUTH = {"Authorization": "Basic " + BASE_64}
    const SELECT = $('#posts')
    const TITLE = $('#post-title')
    const BODY = $('#post-body')
    const COMMENTS = $('#post-comments')

    $('#btnLoadPosts').on('click', loadPosts)
    $('#btnViewPost').on('click', viewPosts)

    function loadPosts() {
        $.ajax({
            method: "GET",
            url: URL + 'posts',
            headers: AUTH
        }).then(function (res) {
            for (let post of res) {
                SELECT.append($(`<option id="${post._id}" body="${post.body}">${post.title}</option>`))
            }
        }).catch(function (err) {
            console.log(err)
        })
    }

    function viewPosts() {
        let selectedElement = SELECT.find(":selected")
        let id = selectedElement.attr('id')
        $.ajax({
            method: "GET",
            url: URL + `comments/?query={"post_id":"${id}"}`,
            headers: AUTH
        }).then(function (res) {
            BODY.empty()
            COMMENTS.empty()
            let value = selectedElement.text()
            let body = selectedElement.attr('body')
            TITLE.text(value)
            BODY.append($(`<li>${body}</li>`))
            for (let com of res) {
                COMMENTS.append($(`<li>${com.text}</li>`))
            }
        }).catch(function (err) {
            console.log(err)
        })
    }
}