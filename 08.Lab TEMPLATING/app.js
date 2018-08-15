(async () => {
    const data = await $.get('./data.json')
    const contactHTML = await $.get('./templates/contact.hbs')
    let contactTemplate = Handlebars.compile(contactHTML)
    let finalData = {contacts: data}
    let resultHTML = contactTemplate(finalData)
    $('#list').append(resultHTML)

    const partialInfoHtml = await $.get('./templates/partials/info.hbs')
    const partialInfoLineHtml = await $.get('./templates/partials/info-line.hbs')
    Handlebars.registerPartial('info', partialInfoHtml)
    Handlebars.registerPartial('info-line', partialInfoLineHtml)
    const detailsHtml = await $.get('./templates/details.hbs')
    const detailsTemplate = Handlebars.compile(detailsHtml)

    $('.contact').on('click', function () {
        $('.content > div').removeClass('contanctSelected')
        $(this).addClass('contanctSelected')
        let index = $(this).attr('data-id')
        let result = detailsTemplate(data[index])
        $('#details > div').remove()
        $('#details').append(result)
    })
})();