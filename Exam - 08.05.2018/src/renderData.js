function renderHomeView(flights) {
    for (const f of flights) {
        let a = $('<a href="#" class="added-flight"></a>').on('click', function () {
            renderDetailsView(f)
        })
        a.append($(`<img src="${f.img}" alt="" class="picture-added-flight">`))
        a.append($(`<h3>${f.destination}</h3>`))
        a.append($(`<span>from ${f.origin}</span><span>${f.departureDate}</span>`))
        $('#viewCatalog > div').append(a)
    }
}

function renderDetailsView(f) {
    hideAllViews()
    $('#viewFlightDetails').show()
    let mainDiv = $('#viewFlightDetails > div')
    mainDiv.empty()
    mainDiv.append($(`<div class="ticket-area-left"><img src="${f.img}" alt=""></div>`))
    let innerDiv = $('<div class="ticket-area-right"></div>')
    innerDiv.append($(`<h3>${f.destination}</h3><div>from ${f.origin}</div>`))
    let mostInnerDiv = $(`<div class="data-and-time">${f.departureDate} ${f.departureTime}</div>`)
    if (sessionStorage.getItem('userId') === f._acl.creator) {
        mostInnerDiv.append($(`<a href="#" class="edit-flight-detail"></a>`).on('click', function () {
            renderEditView(f)
        }))
    }
    innerDiv.append(mostInnerDiv)
    innerDiv.append($(`<div>${f.seats} Seats (${f.cost} per seat)</div>`))
    mainDiv.append(innerDiv)
    $('#viewFlightDetails').append(mainDiv)
}

function renderEditView(f) {
    hideAllViews()
    $('#viewEditFlight').show()
    $('#viewEditFlight').attr('flightId', f._id)
    $('#formEditFlight input[name=destination]').val(f.destination)
    $('#formEditFlight input[name=origin]').val(f.origin)
    $('#formEditFlight input[name=departureDate]').val(f.departureDate)
    $('#formEditFlight input[name=departureTime]').val(f.departureTime)
    $('#formEditFlight input[name=seats]').val(Number(f.seats))
    $('#formEditFlight input[name=cost]').val(Number(f.cost))
    $('#formEditFlight input[name=img]').val(f.img)
    $('#formAddFlight input[type=checkbox]').val(f.isPublic)
}

function renderMyFlight(flights) {
    $('#viewMyFlights > div').remove()
    for (const f of flights) {
        let mainDiv = $(`<div class="flight-ticket"></div>`)
        mainDiv.append($(`<div class="flight-left"><img src="${f.img}" alt=""></div>`))
        let innerDiv = $('<div class="flight-right"></div>')
        innerDiv.append($(`
                <div>
                    <h3>${f.destination}</h3><span>${f.departureDate}</span>
                </div>
                <div>
                    from ${f.origin} <span>${f.departureTime}</span>
                </div>
                <p>${f.seats} Seats (${f.cost}$ per seat) </p>`))
        innerDiv.append($(`<a href="#" class="remove">REMOVE</a>`).on('click', function () {
            kinveyRequester.removeFlight(f._id)
        }))
        innerDiv.append($(`<a href="#" class="details">Details</a>`).on('click', function () {
            renderDetailsView(f)
        }))
        mainDiv.append(innerDiv)
        $('#viewMyFlights').append(mainDiv)
    }
}

