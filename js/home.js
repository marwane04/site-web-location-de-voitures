
import {getPopularCars} from "./carsService.js";
///////////////////////////carousel///////////////////////////
let nextButton = document.getElementById('next');
let prevButton = document.getElementById('prev');
let carousel = document.querySelector('.carousel');
let listHTML = document.querySelector('.carousel .list');
let seeMoreButtons = document.querySelectorAll('.seeMore');
let backButton = document.getElementById('back');

//testing getPopulatCars function
console.log(await getPopularCars())

nextButton.onclick = function(){
    showSlider('next');
}
prevButton.onclick = function(){
    showSlider('prev');
}
let unAcceppClick;
const showSlider = (type) => {
    nextButton.style.pointerEvents = 'none';
    prevButton.style.pointerEvents = 'none';

    carousel.classList.remove('next', 'prev');
    let items = document.querySelectorAll('.carousel .list .item');
    if(type === 'next'){
        listHTML.appendChild(items[0]);
        carousel.classList.add('next');
    }else{
        listHTML.prepend(items[items.length - 1]);
        carousel.classList.add('prev');
    }
    clearTimeout(unAcceppClick);
    unAcceppClick = setTimeout(()=>{
        nextButton.style.pointerEvents = 'auto';
        prevButton.style.pointerEvents = 'auto';
    }, 2000)
}
seeMoreButtons.forEach((button) => {
    button.onclick = function(){
        carousel.classList.remove('next', 'prev');
        carousel.classList.add('showDetail');
    }
});
backButton.onclick = function(){
    carousel.classList.remove('showDetail');
}
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