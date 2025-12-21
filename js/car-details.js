import {getCarById} from "./carsService.js";
import {sendConfirmationEmail} from "./emailService.js";
import {getCurrentUser} from "./authenticationService.js";

function renderCarDetails(car) {
    document.getElementById('carName').innerText = car.modelName;
    document.getElementById('carImage').src = car.images.diagonal;
    document.getElementById('tankCapacity').innerText = car.tankCapacity;
    document.getElementById('numberOfDoors').innerText = car.numberOfDoors + " Doors";
    document.getElementById('numberOfSeats').innerText = car.numberOfSeats + " Seats";
    document.getElementById('bodyType').innerText = car.bodyType;
    document.getElementById('tarif').innerText = car.dailyPrice;
}

/////////////Set today's date as default \\\\\\\\\\\\\\\


const startDateInput = document.getElementById('startDate');
const today = new Date().toISOString().split('T')[0];
startDateInput.value = today;
startDateInput.min = today;

/////////////Calculate total price code \\\\\\\\\\\\\\\


const daysInput = document.getElementById('days');
const total = document.getElementById('totalDisplay');
const insurance = document.getElementById('Calculator');
const gps = document.getElementById('opt-gps');

function calculateTotal() {
    let tarif = Number(document.getElementById('tarif').innerText);



    let nmbr_days = Number(daysInput.value);
    let total1 = tarif * nmbr_days;

    if (insurance.checked) total1+= 500;

    if (gps.checked)  total1 += 150;

    total.innerText = total1 + 'DH';
}

daysInput.addEventListener('input', calculateTotal);
insurance.addEventListener('change', calculateTotal);
gps.addEventListener('change', calculateTotal);


//render car details
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (id) {
    getCarById(id).then(car => {
        if (car) {
            renderCarDetails(car);
            calculateTotal();
        }
    });
}

//form handling
const form = document.getElementById('bookingForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = getCurrentUser();

    if (!user) {
        alert("Please log in to book a car.");
        window.location.href = "/signin.html";
        return;
    }

    const carName = document.getElementById('carName').innerText;
    const carImage = document.getElementById('carImage').src;
    const dailyPrice = document.getElementById('tarif').innerText;
    const startDate = document.getElementById('startDate').value;
    const days = document.getElementById('days').value;

    const insuranceChecked = document.getElementById('Calculator').checked;
    const gpsChecked = document.getElementById('opt-gps').checked;

    const totalText = document.getElementById('totalDisplay').innerText;
    // Remove 'DH' and trim whitespace
    const total = totalText.replace('DH', '').trim();

    const templateParams = {
        email: user.email,
        name: carName,
        startingDate: startDate,
        days: days,
        price: dailyPrice,
        image_url: carImage,
        cost: {
            insurance: insuranceChecked ? "500" : "0",
            gpsAndWifi: gpsChecked ? "150" : "0",
            total: total,
        }
    };

    sendConfirmationEmail(templateParams)
        .then((response) => {
            console.log("SUCCESS!", response.status, response.text);
            alert("Booking confirmed!");
            e.target.reset();
            calculateTotal();
        })
        .catch((error) => {
            console.error("FAILED...", error);
            alert("Booking failed. Please try again later.");
        });
})
