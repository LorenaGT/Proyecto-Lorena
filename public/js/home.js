// API
const showDogImage = function(imageUrl) {
    let image = $(
        '<img>'
    ).prop('src', imageUrl).addClass('img-fluid')

    $('#dog-img').append(image)
}

const showList = function(cryptoList, target) {
    let cryptoHtmlList = $('<ul>').addClass('list-group')
    let listItem

    for(item of cryptoList) {
        listItem = $(
            '<li>'
        ).addClass(
            'list-group-item'
        ).text(`${item.name} (${item.symbol}) price: $${Math.floor(item.priceUsd)} market: $${Math.floor(item.marketCapUsd)}`)
        cryptoHtmlList.append(listItem)
    }

    $(target).append(cryptoHtmlList)
}

$.getJSON(
    'https://dog.ceo/api/breeds/image/random',
    function(data) {
        showDogImage(data.message)
})

$.getJSON(
    'https://api.coincap.io/v2/assets',
    function(data) {
        const currencies = data.data
        // TODO
        currencies.sort(
            (currency1, currency2) => {
                currency1.priceUsd > currency2.priceUsd
            }
        )
        console.log(currencies)
        showList(currencies, '#realcrypto-list')
    }
)