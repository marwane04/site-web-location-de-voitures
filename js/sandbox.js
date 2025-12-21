const data = require('/home/marwane/uni/web/site-web-location-de-voitures/data/cars.json')


types = [];

data.forEach((element) => {
    if(types.indexOf(element.bodyType) === -1) {
        types.push(element.bodyType);
    }
})

console.log(types);
