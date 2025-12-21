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

    if (insurance.checked) tarif = tarif + 500;

    if (gps.checked) tarif = tarif + 150;

    let nmbr_days = Number(daysInput.value);
    let total1 = tarif * nmbr_days;

    total.innerText = total1 + 'DH';
}

daysInput.addEventListener('input', calculateTotal);
insurance.addEventListener('change', calculateTotal);
gps.addEventListener('change', calculateTotal);
