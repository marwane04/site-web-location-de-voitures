///////////////////////////carousel///////////////////////////
import { getPopularCars } from './carsService.js';
import {addUserToStorage} from "./authenticationService.js";

let user = {firstName: "marwane",
    lastName: "fakir",
    phone: "0123456789",
    city: "casa",
    email: "marwane@gm.com",
    password: "12345678",

};


let nextButton = document.getElementById('next');
let prevButton = document.getElementById('prev');
let carousel = document.querySelector('.carousel');
let listHTML = document.querySelector('.carousel .list');
let backButton = document.getElementById('back');
let unAcceppClick;

// Store car data for later use
let carouselData = [];

// Initialize carousel controls
function initCarouselControls() {
    // Remove existing event listeners
    nextButton.onclick = null;
    prevButton.onclick = null;
    backButton.onclick = null;
    
    // Add new event listeners
    nextButton.onclick = function() {
        showSlider('next');
    };
    
    prevButton.onclick = function() {
        showSlider('prev');
    };
    
    backButton.onclick = function() {
        carousel.classList.remove('showDetail');
    };
    
    // Use event delegation for dynamically created "See More" buttons
    listHTML.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('seeMore')) {
            event.preventDefault();
            carousel.classList.remove('next', 'prev');
            carousel.classList.add('showDetail');
        }
    });
}

const showSlider = (type) => {
    if (!nextButton || !prevButton) return;
    
    nextButton.style.pointerEvents = 'none';
    prevButton.style.pointerEvents = 'none';

    carousel.classList.remove('next', 'prev');
    let items = document.querySelectorAll('.carousel .list .item');
    
    if (items.length === 0) return;
    
    if (type === 'next') {
        listHTML.appendChild(items[0]);
        carousel.classList.add('next');
    } else {
        listHTML.prepend(items[items.length - 1]);
        carousel.classList.add('prev');
    }
    
    clearTimeout(unAcceppClick);
    unAcceppClick = setTimeout(() => {
        nextButton.style.pointerEvents = 'auto';
        prevButton.style.pointerEvents = 'auto';
    }, 2000);
}

/////////////fetching data/////////////
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const popularCars = await getPopularCars();
        carouselData = popularCars;
        populateCarousel(popularCars);
        
    } catch (error) {
        console.error('Error loading popular cars:', error);
        // Fallback to static content if API fails
        const items = document.querySelectorAll('.carousel .list .item');
        if (items.length > 0) {
            initCarouselControls();
        }
    }
});

function populateCarousel(cars) {
    const carouselList = document.querySelector('.carousel .list');
    if (!carouselList) return;

    // Clear existing items
    carouselList.innerHTML = '';

    // Create a carousel item for each car (max 5 for the CSS to work)
    const carsToShow = cars.slice(0, 5); // Only show 5 cars to match CSS
    
    carsToShow.forEach((car, index) => {
        const carItem = createCarouselItem(car, index);
        carouselList.appendChild(carItem);
    });
    
    // Initialize controls after populating
    initCarouselControls();
    
    // Initialize animations for the first item
    setTimeout(() => {
        const firstItem = document.querySelector('.carousel .list .item:nth-child(2)');
        if (firstItem) {
            initItemAnimations(firstItem);
        }
    }, 100);


    if (window.Wishlist && typeof window.Wishlist.updateButtons === 'function') {
        setTimeout(() => {
            window.Wishlist.updateButtons();
        }, 200);
    }
}



function createCarouselItem(car, index) {
    // Create the main item container
    const item = document.createElement('div');
    item.className = 'item';
    
    // Set data attributes
    item.setAttribute('data-car-id', car.id);
    
    // Create the HTML structure
    item.innerHTML = `
        <img src="${car.images?.transparent || 'assets/images/top_cars/default-car.png'}" alt="${car.modelName}">
        <div class="introduce">
            <div class="title">FEATURED CAR</div>
            <div class="topic">${car.modelName || car.make} ${car.model || ''}</div>
            <div class="des">
                ${car.description || `Experience the ${car.modelName} — a perfect blend of performance, comfort, and modern design. Built for everyday driving and long-distance travel with premium quality.`}
            </div>
            <button class="seeMore">SEE MORE &#8599</button>
        </div>

        <div class="detail">
            <div class="title">${car.modelName || car.make} ${car.model || ''} – Specifications</div>
            <div class="des">
                ${car.fullDescription || `The ${car.modelName || car.make} delivers an outstanding driving experience with a powerful engine, precise handling, and a refined interior. Equipped with advanced technology, safety features, and elegant design.`}
            </div>

            <div class="specifications">
                <div>
                    <p>Engine</p>
                    <p>${car.engine || car.tankCapacity || '2.0L'} ${car.engineType || 'Turbo'}</p>
                </div>
                <div>
                    <p>Body Type</p>
                    <p>${car.bodyType || 'Sedan'}</p>
                </div>
                <div>
                    <p>Doors</p>
                    <p>${car.numberOfDoors || '4'}</p>
                </div>
                <div>
                    <p>Transmission</p>
                    <p>${car.transmission || 'Automatic'}</p>
                </div>
                <div>
                    <p>Seats</p>
                    <p>${car.numberOfSeats || '5'}</p>
                </div>
            </div>

            <div class="checkout">
                <button class="wishlist-btn" data-car-id="${car.id}">ADD TO WISHLIST</button>
                <button class="rental-btn">Rental</button>
            </div>
        </div>
    `;
    
    // Add animation classes based on position
    if (index === 1) { // Second item (center position)
        item.classList.add('active');
    }

    return item;
}

function initItemAnimations(item) {
    // Initialize image animation
    const img = item.querySelector('img');
    if (img) {
        img.style.animation = 'showItemImg 0.5s 1s ease-in-out 1 forwards';
        img.style.opacity = '0';
    }
    
    // Initialize content animations
    const title = item.querySelector('.introduce .title');
    const topic = item.querySelector('.introduce .topic');
    const des = item.querySelector('.introduce .des');
    const seeMore = item.querySelector('.introduce .seeMore');
    
    if (title) {
        title.style.animation = 'showContent 0.5s 1s ease-in-out 1 forwards';
        title.style.opacity = '0';
    }
    if (topic) {
        topic.style.animation = 'showContent 0.5s 1.2s ease-in-out 1 forwards';
        topic.style.opacity = '0';
    }
    if (des) {
        des.style.animation = 'showContent 0.5s 1.4s ease-in-out 1 forwards';
        des.style.opacity = '0';
    }
    if (seeMore) {
        seeMore.style.animation = 'showContent 0.5s 1.6s ease-in-out 1 forwards';
        seeMore.style.opacity = '0';
    }
}

// If you have wishlist.js, ensure it's loaded after the carousel
// and add this to integrate with your existing wishlist system
document.addEventListener('DOMContentLoaded', function() {
    // This assumes your wishlist.js has a function called initWishlistButtons
    if (typeof initWishlistButtons === 'function') {
        // Reinitialize wishlist buttons after carousel loads
        setTimeout(() => {
            initWishlistButtons();
        }, 500);
    }
});

// Make sure to export if needed
export { populateCarousel, initCarouselControls };
///////////////////////////carousel///////////////////////////




///////////////////////////CATEGORIES SLIDER///////////////////////////
let slider = document.querySelector('.links_categories .slider');
let listLinks = document.querySelector('.links_categories .list_links');
let prevBtn = document.querySelector(".links_categories .slider button.previous");
let nextBtn = document.querySelector(".links_categories .slider button.next");

// Initialize currentTranslate with existing transform
let currentTranslate = new DOMMatrixReadOnly(getComputedStyle(listLinks).transform).m41;

function update() {
    const sliderWidth = slider.clientWidth;
    const listWidth = listLinks.scrollWidth;
    const minTranslate = Math.min(0, sliderWidth - listWidth);
    
    // Update button states
    prevBtn.style.opacity = currentTranslate < 0 ? 1 : 0;
    nextBtn.style.opacity = currentTranslate > minTranslate ? 1 : 0;
    prevBtn.disabled = currentTranslate >= 0;
    nextBtn.disabled = currentTranslate <= minTranslate;
}

function moveSlider(direction) {
    const sliderWidth = slider.clientWidth;
    const listWidth = listLinks.scrollWidth;
    const minTranslate = Math.min(0, sliderWidth - listWidth);
    const step = 140; // Match your item width + margin

    currentTranslate += direction * step;
    currentTranslate = Math.max(minTranslate, Math.min(0, currentTranslate));
    
    listLinks.style.transform = `translateX(${currentTranslate}px)`;
    update();
}

// Event listeners
prevBtn.addEventListener('click', () => moveSlider(1));
nextBtn.addEventListener('click', () => moveSlider(-1));

// Handle window resize
window.addEventListener('resize', () => {
    const sliderWidth = slider.clientWidth;
    const listWidth = listLinks.scrollWidth;
    const minTranslate = Math.min(0, sliderWidth - listWidth);
    
    currentTranslate = Math.max(minTranslate, Math.min(0, currentTranslate));
    listLinks.style.transform = `translateX(${currentTranslate}px)`;
    update();
});

update();

document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector(".links_categories .slider");
    const listLinks = slider.querySelector(".list_links");
    const links = listLinks.querySelectorAll("a"); // select all <a> in list_links
    const width = window.innerWidth;

    if (links.length > 8 && width >= 1000) {
        slider.style.justifyContent = "flex-start";
        listLinks.style.transform = "translateX(62px)";
    }
});

///////////////////////////CATEGORIES SLIDER///////////////////////////