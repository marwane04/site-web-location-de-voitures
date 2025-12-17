const daysInput = document.getElementById('days');
const total = document.getElementById('totalDisplay');

daysInput.addEventListener('input', function() {
    let tarif = Number(document.getElementById('tarif').innerText);
    let nmbr_days = Number(daysInput.value);
    let total1 = tarif * nmbr_days;

    total.innerText = total1 + 'DH';
});

