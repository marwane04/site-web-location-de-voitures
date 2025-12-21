
/////////////Set today's date as default \\\\\\\\\\\\\\\


const startDateInput = document.getElementById('startDate');
const today = new Date().toISOString().split('T')[0];
startDateInput.value = today;


/////////////Calculate total price code \\\\\\\\\\\\\\\


const daysInput = document.getElementById('days');
const total = document.getElementById('totalDisplay');
const insurance = document.getElementById('Calculator');
const gps = document.getElementById('opt-gps'); 

daysInput.addEventListener('input', function() {

    let tarif = Number(document.getElementById('tarif').innerText);

    if (insurance.checked)
        tarif = tarif + 500; 

    if (gps.checked)
        tarif = tarif + 150;

    let nmbr_days = Number(daysInput.value);
    let total1 = tarif * nmbr_days;

    total.innerText = total1 + 'DH';
});


// ///////Scroll images code \\\\\\\\\\\\\\\

const leftBtn = document.getElementById('left');
const rightBtn = document.getElementById('right');
const image = document.getElementsByTagName('img')[0];


const img_lst = ["assets/images/cars/Porshe-911-GT3-RS/img_1.webp",
                "assets/images/cars/Porshe-911-GT3-RS/img_2.webp",
                "assets/images/cars/Porshe-911-GT3-RS/img_3.webp",
                "assets/images/cars/Porshe-911-GT3-RS/img_4.webp",
                "assets/images/cars/Porshe-911-GT3-RS/img_5.webp",
                "assets/images/cars/Porshe-911-GT3-RS/img_6.webp",
                "assets/images/cars/Porshe-911-GT3-RS/img_7.webp"
               ];


// slide to right

rightBtn.addEventListener('click', function() {

    let cheminRelatif = image.getAttribute('src');
    let position = img_lst.indexOf(cheminRelatif);
    

        if (position == 6) {
            position = -1;
        }

        image.src = img_lst[position + 1];

});


// slide to left

leftBtn.addEventListener('click', function() {

    let cheminRelatif = image.getAttribute('src');
    let position = img_lst.indexOf(cheminRelatif);
    

        if (position == 0) {
            position = 7;
        }

        image.src = img_lst[position - 1];

});