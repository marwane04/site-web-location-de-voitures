let brandsContainer = document.querySelector('.filter-options');
let bodyTypesContainer = document.querySelectorAll('.filter-options')[1];
let filterButtons = document.querySelectorAll('.filter-button');

let brands = [
    'BMW', 'Volkswagen', 'Peugeot',
    'Porsche', 'Audi', 'Citroen',
    'Dacia', 'Fiat', 'Hyundai',
    'Kia', 'Mercedes', 'Nissan',
    'Opel', 'Renault', 'SEAT',
    'Skoda', 'Toyota', 'Volvo',
    'Alfa Romeo', 'Alpine', 'Aston Martin',
    'BYD', 'Chevrolet', 'Cupra',
    'Dodge', 'Honda', 'Jaguar',
    'Jeep', 'Land Rover', 'Lexus'
];

let bodyTypes = [
    'Sedan', 'SUV',
    'Hatchback', 'Coupe',
    'Wagon', 'Convertible',
    'MPV', 'Van',
    'Furgon', 'Minibus',
    'Window Van',
    'Pickup'
];


//add filter brands
brands.forEach((brand) => {
    let brandContainer = document.createElement("label");
    brandContainer.className = "checkbox-container";
    brandContainer.textContent = brand;

    let checkBox = document.createElement('input');
    checkBox.type = "checkbox";
    checkBox.name = "Brand";
    checkBox.value = brand;

    let checkMark = document.createElement("span");
    checkMark.className = "checkmark";

    brandContainer.appendChild(checkBox);
    brandContainer.appendChild(checkMark);

    brandsContainer.appendChild(brandContainer);
})

//add filter bodyTypes
bodyTypes.forEach((type) => {
    let bodyTypeContainer = document.createElement("label");
    bodyTypeContainer.className = "checkbox-container";
    bodyTypeContainer.textContent = type;

    let checkBox = document.createElement('input');
    checkBox.type = "checkbox";
    checkBox.name = "bodyType";
    checkBox.value = type;

    let checkMark = document.createElement("span");
    checkMark.className = "checkmark";

    bodyTypeContainer.appendChild(checkBox);
    bodyTypeContainer.appendChild(checkMark);

    bodyTypesContainer.appendChild(bodyTypeContainer);
})

//handling filter buttons logic
filterButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            if (!event.target.style.transform) {
                event.target.style.transform = 'rotate(180deg)';
            } else {
                event.target.style.transform = '';
            }
            console.log(event.target.parentElement.nextElementSibling.classList.toggle("collapsed"));

        })
    }
)
