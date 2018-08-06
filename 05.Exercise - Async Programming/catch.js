function attachEvents() {
    const URL = "https://baas.kinvey.com/appdata/kid_BJ_WhnMSQ/";
    const USERNAME = "pesho";
    const PASSWORD = "ppp";
    const CATCHES = $("#catches");
    const ADDFORM = $("#addForm");

    let btnLoad = $("#aside").find(".load");
    let btnAdd = $("#aside").find(".add");
    btnLoad.on("click", loadCatches);
    btnAdd.on("click", addCatch);

    function loadCatches() {
        sendRequest("GET", "biggestCatches")
            .then(getCatches)
            .catch(handleError)
    }

    function sendRequest(method, extension, body) {
        return $.ajax({
            method: method,
            url: URL + extension,
            headers: {
                "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
            },
            contentType: 'application/json',
            data: JSON.stringify(body)
        });
    }

    function addCatch() {
        let body = jsonInput(ADDFORM);
        sendRequest('POST', "biggestCatches", body)
            .then(loadCatches)
            .catch(handleError)
    }

    function jsonInput(selector) {
        let angler = selector.find(".angler");
        let weight = selector.find(".weight");
        let species = selector.find(".species");
        let location = selector.find(".location");
        let bait = selector.find(".bait");
        let captureTime = selector.find(".captureTime");

        return {
            angler: angler.val(),
            weight: Number(weight.val()),
            species: species.val(),
            location: location.val(),
            bait: bait.val(),
            captureTime: Number(captureTime.val())
        };
    }

    function getCatches(data) {
        CATCHES.empty();
        for (let fish of data) {
            let div = $("<div>").addClass("catch").prop("data-id", `${fish._id}`);
            div.append($("<label>Angler</label>")).append($("<input>").attr("type", "text").addClass("angler").val(`${fish.angler}`))
                .append($("<label>Weight</label>")).append($("<input>").attr("type", "number").addClass("weight").val(`${fish.weight}`))
                .append($("<label>Species</label>")).append($("<input>").attr("type", "text").addClass("species").val(`${fish.species}`))
                .append($("<label>Location</label>")).append($("<input>").attr("type", "text").addClass("location").val(`${fish.location}`))
                .append($("<label>Bait</label>")).append($("<input>").attr("type", "text").addClass("bait").val(`${fish.bait}`))
                .append($("<label>Capture Time</label>")).append($("<input>").attr("type", "number").addClass("captureTime").val(`${fish.captureTime}`));
            div.append($("<button>Update</button>").addClass("update").on("click", updateCatch))
                .append($("<button>Delete</button>").addClass("delete").on("click", deleteCatch));
            CATCHES.append(div);
        }
    }

    function updateCatch() {
        let element = $(this).parent();
        let body = jsonInput(element);
        let id = element.prop("data-id");
        sendRequest('PUT', `biggestCatches/${id}`, body)
            .then(loadCatches)
            .catch(handleError);
    }

    function deleteCatch() {
        let element = $(this).parent();
        let id = element.prop("data-id");
        sendRequest('DELETE', `biggestCatches/${id}`).then(loadCatches).catch(handleError)
    }

    function handleError(err) {
        console.log(err)
    }
}