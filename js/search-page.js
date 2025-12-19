import {getCarsByFilters, pageCars} from "./carsService.js";

let brandsContainer = document.querySelector('.filter-options');
let bodyTypesContainer = document.querySelectorAll('.filter-options')[1];
let filterButtons = document.querySelectorAll('.filter-button');

let brands = [
    'BMW', 'volkswagen', 'Peugeot',
    'porsche', 'Audi', 'Citroen',
    'Dacia', 'Fiat', 'Hyundai',
    'Kia', 'Mercedes', 'Nissan',
    'Opel', 'Renault', 'SEAT',
    'Skoda', 'Toyota', 'volvo',
    'alfa romeo', 'alpine', 'aston martin',
    'byd', 'chevrolet', 'cupra',
    'dodge', 'honda', 'jaguar',
    'jeep', 'land rover', 'lexus'
]


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
    brandContainer.textContent = brand.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    let checkBox = document.createElement('input');
    checkBox.type = "checkbox";
    checkBox.name = "brand";
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


//generates array of pages based on the current page and the pagesNumber
const generatePaging = (currentPage, pagesNumber) => {
    let pages = [];

    if (pagesNumber < 1) return [];

    pages.push(1);

    let rangeStart = Math.max(2, currentPage - 1);
    let rangeEnd = Math.min(pagesNumber - 1, currentPage + 1);

    if (rangeStart > 2) {
        pages.push("...");
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
    }

    if (rangeEnd < pagesNumber - 1) {
        pages.push("...");
    }

    if (pagesNumber > 1) {
        pages.push(pagesNumber);
    }

    return pages;
}

//generates the paging html elements based on the current page and the pagesNumber
const renderPagination = (currentPage, pagesNumber) => {
    const pages = generatePaging(currentPage, pagesNumber);
    const pagesContainer = document.querySelector('.paging-container');
    pagesContainer.innerHTML = "";

    if (pagesNumber <= 1) return;

    let ul = document.createElement("ul");

    let arrowLeft = document.createElement("li");
    arrowLeft.className = "arrow";
    if (currentPage === 1) arrowLeft.classList.add("disabled");
    arrowLeft.innerHTML = '<i class="uil uil-angle-left-b"></i>';
    arrowLeft.addEventListener("click", () => {
        if (currentPage > 1) updateResults(currentPage - 1);
    });

    ul.appendChild(arrowLeft);

    for (let page of pages) {
        let pageElement = document.createElement("li");
        if (page === currentPage) {
            pageElement.className = "active";
        } else if (page === "...") {
            pageElement.className = "dots";
        } else {
            pageElement.addEventListener("click", () => {
                updateResults(page);
            })
        }
        pageElement.textContent = page;
        ul.appendChild(pageElement);
    }
    let arrowRight = document.createElement("li");
    arrowRight.className = "arrow";
    if (currentPage === pagesNumber) arrowRight.classList.add("disabled");
    arrowRight.innerHTML = `<i class="uil uil-angle-right-b"></i>`;
    arrowRight.addEventListener("click", () => {
        if (currentPage < pagesNumber) updateResults(currentPage + 1);
    });

    ul.appendChild(arrowRight);

    pagesContainer.appendChild(ul);
}

const updateResults = async (currentPage = 1) => {
    const brands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(cb => cb.value);
    const types = Array.from(document.querySelectorAll('input[name="bodyType"]:checked')).map(cb => cb.value);
    const seats = Array.from(document.querySelectorAll('input[name="seats"]:checked')).map(cb => cb.value);
    const doors = Array.from(document.querySelectorAll('input[name="doors"]:checked')).map(cb => cb.value);
    const minPrice = document.querySelector('.price-input[placeholder="Min"]').value;
    const maxPrice = document.querySelector('.price-input[placeholder="Max"]').value;
    const search = document.querySelector('.search-box input').value;
    const sort = document.querySelector('.search-dropdown').value;

    const cars = await getCarsByFilters(brands, types, seats, doors, minPrice, maxPrice, search, sort);
    const totalPages = Math.ceil(cars.length / 6);

    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    renderPagination(currentPage, totalPages);
    generateCarsCards(currentPage, cars);
}

const generateCarsCards = (currentPage, loadedCars) => {
    const carsContainer = document.querySelector('.cars-grid');
    carsContainer.innerHTML = "";

    const cars = pageCars(loadedCars, currentPage);

    for (let car of cars) {
        let card = document.createElement("div");
        card.className = "car-card";


        let imageContainer = document.createElement("div");
        imageContainer.className = "card-image-container";

        let image = document.createElement("img");
        image.src = car.images.diagonal;
        image.alt = car.modelName;
        image.className = "car-image";

        let wishlistBtn = document.createElement("button");
        wishlistBtn.className = "wishlist-btn";
        wishlistBtn.innerHTML = '<i class="fa-sharp fa-regular fa-heart"></i>';

        imageContainer.appendChild(image);
        imageContainer.appendChild(wishlistBtn);

        let content = document.createElement("div");
        content.className = "card-content";

        let headerInfo = document.createElement("div");
        headerInfo.className = "card-header-info";
        headerInfo.innerHTML = `
            <h3 class="car-model">${car.modelName}</h3>
            <p class="car-price">${car.dailyPrice}DH<span>/day</span></p>
        `;

        let specs = document.createElement("div");
        specs.className = "car-specs";
        specs.innerHTML = `
            <div class="spec-item">
                <i class="uil uil-users-alt"></i>
                <span>${car.numberOfSeats} Seats</span>
            </div>
            <div class="spec-item">
                <i class="uil uil-pump"></i>
                <span>${car.tankCapacity}</span>
            </div>
            <div class="spec-item">
                <i class="uil uil-car-sideview"></i>
                <span>${car.numberOfDoors} Doors</span>
            </div>
        `;

        let rentBtn = document.createElement("button");
        rentBtn.className = "rent-now-btn";
        rentBtn.textContent = "Rent Now";
        rentBtn.addEventListener('click', () => {
            window.location.href = `car-details.html?id=${car.id}`;
        });

        content.appendChild(headerInfo);
        content.appendChild(specs);
        content.appendChild(rentBtn);

        card.appendChild(imageContainer);
        card.appendChild(content);

        carsContainer.appendChild(card);
    }
}


const setupEventListeners = () => {
    document.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', () => updateResults(1));
    });

    document.querySelectorAll('.price-input').forEach(input => {
        input.addEventListener('input', () => updateResults(1));
    });

    document.querySelector('.search-btn').addEventListener('click', () => updateResults(1));

    document.querySelector('.search-dropdown').addEventListener('change', () => updateResults(1));

    document.querySelector('.clear-filters').addEventListener('click', () => {
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('.price-input').forEach(input => input.value = '');
        document.querySelector('.search-box input').value = '';
        document.querySelector('.search-dropdown').value = '';
        updateResults(1);
    });
}


//initialization of the page
setupEventListeners();
await updateResults(1);
