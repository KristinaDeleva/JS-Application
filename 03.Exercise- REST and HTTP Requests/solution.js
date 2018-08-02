function attachEvents() {
    let baseUrl = `https://messenger-29595.firebaseio.com/messenger`;
    let messages = $('#messages')
    let author = $('#author')
    let content = $('#content')

    $('#submit').on('click', postMessage)
    $('#refresh').on('click', visitMessage)

    visitMessage()

    function postMessage() {
        if (author.val().length === 0 || content.val().length === 0) {
            return
        }
        let msg = {
            author: author.val(),
            content: content.val(),
            timestamp: Date.now()
        }

        let request = {
            method: "POST",
            url: baseUrl + '.json',
            data: JSON.stringify(msg),
            success: () => {
                author.val('')
                content.val('')
            },
            error: handleError
        }
        $.ajax(request)
    }

    function visitMessage() {
        let request = {
            method: "GET",
            url: baseUrl + '.json',
            success: displayMs,
            error: handleError
        }
        $.ajax(request)
    }

    function displayMs(msg) {
        let text = ''
        let sortedId = Object.keys(msg).sort((a, b) => sortByDate(a, b, msg))
        for (let id of sortedId) {
            text += msg[id].author + ': ' + msg[id].content + '\n'
        }
        messages.text(text)
    }
    
    function sortByDate(a, b, msg) {
        let timeOne = msg[a].timestamp
        let timeTwo = msg[b].timestamp
        return timeOne - timeTwo
    }

    function handleError(err) {
        console.log(err)
    }
}