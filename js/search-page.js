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

//variable for testing
let numOfPages = 14;

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
const handlePaging = (currentPage, pagesNumber) => {
    const pages = generatePaging(currentPage, pagesNumber);
     const pagesContainer = document.querySelector('.paging-container');
     pagesContainer.innerHTML = "";
    let ul = document.createElement("ul");

    let arrowLeft = document.createElement("li");
    arrowLeft.className = "arrow";
    arrowLeft.innerHTML = '<i class="uil uil-angle-left-b"></i>';

    ul.appendChild(arrowLeft);

    for(let page of pages){
        let pageElement = document.createElement("li");
        if(page === currentPage) {
            pageElement.className = "active";
        } else if(page === "...") {
            pageElement.className = "dots";
        } else {
            pageElement.addEventListener("click", () => {
                handlePaging(page, pagesNumber);
            })
        }
        pageElement.textContent = page;
        ul.appendChild(pageElement);
    }
    let arrowRight = document.createElement("li");
    arrowRight.className = "arrow";
    arrowRight.innerHTML = `<i class="uil uil-angle-right-b"></i>`;

    ul.appendChild(arrowRight);

    pagesContainer.appendChild(ul);
}

handlePaging(3, 20);