function showHideLinks() {
    hideAllLinks()
    if (sessionStorage.getItem('authToken')) { //logged ed in user
        $("#linkFlights").show()
        $("#linkLogout").show()
    } else { // no logged in user
        $("#linkLogin").show()
        $("#linkRegister").show()
    }
}

async function showHomeView() {
    $('#linkLogout > span').text('Welcome, ' + sessionStorage.getItem('username') + '!')
    hideAllViews()
    $('#viewCatalog > div > a').remove()
    if (sessionStorage.getItem('username')) {
        let flights = await kinveyRequester.getAllPublicFlight()
        renderHomeView(flights);
        $('#viewCatalog > a').show()
    }else {
        $('#viewCatalog > a').hide()
    }
}

function hideAllViews() {
    $('#container > section').hide()
}

function hideAllLinks() {
    $('#linkFlights').hide()
    $('#linkLogin').hide()
    $('#linkRegister').hide()
    $('#linkLogout').hide()
}

function attachLinkEvents() {
    $('#linkHome').on('click', function () {
        hideAllViews()
        $('#viewCatalog').show()
    })
    $('#linkFlights').on('click', async function () {
        hideAllViews()
        let flights = await kinveyRequester.getMyFlight()
        renderMyFlight(flights);
        $('#viewMyFlights').show()
    })
    $('#linkLogin').on('click', function () {
        hideAllViews()
        $('#viewLogin').show()
    })
    $('#linkRegister').on('click', function () {
        hideAllViews()
        $('#viewRegister').show()
    })
    $('#viewCatalog > a').on('click', function () {
        hideAllViews()
        $('#viewAddFlight').show()
    })
}