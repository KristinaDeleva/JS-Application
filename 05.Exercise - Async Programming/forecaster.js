function attachEvents() {
    const URL = "https://judgetests.firebaseio.com/";
    $("#submit").on("click",getLocation);

    const ICONS = {
        'Sunny':'&#x2600;',
        'Partly sunny':'&#x26C5;',
        'Overcast':'&#x2601;',
        'Rain':'&#x2614;',
    };

    function request(req) {
        return $.ajax({
            method: "GET",
            url: URL + req
        })
    }

    function getLocation() {
        let location = $("#location").val();
        request("locations.json")
            .then(getData)
            .catch(handleError);

        function getData(allLocations) {
            let locationCode = allLocations
                .filter(x => x.name === location)
                .map(x =>x.code)[0];

            if(locationCode === undefined){
                handleError();
            }

            let today = request(`forecast/today/${locationCode}.json`);
            let incoming = request(`forecast/upcoming/${locationCode}.json`);

            Promise.all([today,incoming])
                .then(getAllData)
                .catch(handleError);
        }
    }

    function getAllData([today,incoming]) {
        let location = today.name;
        let condition = today['forecast'].condition;
        let low = today['forecast'].low;
        let high = today['forecast'].high;

        let forecastToday = $("#forecast");
        forecastToday.empty();
        forecastToday.css('display','block')
            .append($("<div id='current'></div>")
                .append($("<div>")
                    .addClass("label")
                    .text("Current conditions"))
                .append($("<span>")
                    .addClass("condition symbol")
                    .html(ICONS[condition]))
                .append($("<div>")
                    .addClass("condition")
                    .append($("<span>")
                        .addClass("forecast-data")
                        .text(location))
                    .append($("<span>")
                        .addClass("forecast-data")
                        .html(`${low}&#176;/${high}&#176;`))
                    .append($("<span>")
                        .addClass("forecast-data")
                        .text(condition))
                )
            );

        forecastToday.append($("<div id='upcoming'></div>")
            .append($("<div>")
                .addClass("label")
                .text("Three-day forecast")));

        for(let up of incoming['forecast']){
            let conditionUp = up.condition;
            let lowUp = up.low;
            let highUp = up.high;

            let upcoming = $("#upcoming");

            upcoming.append($("<span>")
                .addClass("upcoming")
                .append($("<span>")
                    .addClass("symbol")
                    .html(ICONS[conditionUp]))
                .append($("<span>")
                    .addClass("forecast-data")
                    .html(`${lowUp}&#176;/${highUp}&#176;`))
                .append($("<span>")
                    .addClass("forecast-data")
                    .text(conditionUp))
            );
        }
    }

    function handleError() {
        $("#forecast").css('display','block').text("Error");
    }
}