const body = document.body;
const btns = document.querySelectorAll('.menu_btn');
const overlay = document.getElementById('overlay');

btns.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
        body.classList.toggle('sidebar_open');
    });
});

overlay.addEventListener('click', () => body.classList.remove('sidebar_open'));

document.querySelectorAll('.remove_car').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.car_item').remove();
    });
});

const wishlistContainer = document.querySelector('.whishlit_list');
if (wishlistContainer) {
    wishlistContainer.addEventListener('click', (ev) => {
        if (ev.target.closest('.car_image')) {
            const carItem = ev.target.closest('.car_item');
            if (carItem) {
                const carId = carItem.getAttribute("data-car-id")
                window.location.href = `car-details.html?id=${carId}`;
            }
        }
    });
}

/************************************ WHISHLIST ************************************/
let clientId = window.sessionStorage.getItem("loggedInUser");
if (!clientId) {
    clientId = crypto.randomUUID(); // Génère un UUID unique
}

const WISHLIST_KEY = `wishlist_client_${clientId}`;
let wishlist = [];

// Import des fonctions depuis carsService.js
let getAllCars, getCarById;

// Charger dynamiquement les fonctions depuis carsService.js
async function loadCarsService() {
    try {
        const module = await import('./carsService.js');
        getAllCars = module.getAllCars;
        getCarById = module.getCarById;
        console.log('carsService.js loaded successfully');
        console.log(getAllCars())
        console.log(getCarById(1))
        return true;
    } catch (error) {
        console.warn('Failed to load carsService.js as module:', error);
    }
}

// Charger la wishlist depuis le sessionStorage
function loadWishlist() {
    try {
        const stored = sessionStorage.getItem(WISHLIST_KEY);
        wishlist = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(wishlist)) wishlist = [];
        updateWishlistCount();
        return wishlist;
    } catch (error) {
        console.error('Error loading wishlist:', error);
        wishlist = [];
        return wishlist;
    }
}

// Sauvegarder la wishlist dans le sessionStorage
function saveWishlist() {
    try {
        window.sessionStorage.setItem('client_id', clientId);
        sessionStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        updateWishlistCount();
    } catch (error) {
        console.error('Error saving wishlist:', error);
    }
}

// Vérifier si une voiture est dans la wishlist
function isInWishlist(carId) {
    if (!carId) return false;
    const idStr = String(carId);
    return wishlist.some(id => String(id) === idStr);
}

// Ajouter une voiture à la wishlist
async function addToWishlist(carId) {
    if (!carId) {
        console.error('No carId provided');
        return false;
    }
    
    if (!isInWishlist(carId)) {
        wishlist.push(carId);
        saveWishlist();
        
        await addCarToWishlistDisplay(carId);
        
        // Mettre à jour TOUS les boutons wishlist
        updateAllWishlistButtons();
        
        showMessage('Car added to wishlist!');
        return true;
    }
    return false;
}

// Retirer une voiture de la wishlist
async function removeFromWishlist(carId) {
    if (!carId) return false;
    
    const idStr = String(carId);
    const index = wishlist.findIndex(id => String(id) === idStr);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        saveWishlist();
        
        removeCarFromWishlistDisplay(carId);
        
        // Mettre à jour TOUS les boutons wishlist
        updateAllWishlistButtons();
        
        showMessage('Car removed from wishlist');
        return true;
    }
    return false;
}

// Mettre à jour TOUS les boutons wishlist sur la page
function updateAllWishlistButtons() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    
    wishlistButtons.forEach(button => {
        const carId = button.getAttribute('data-car-id');
        if (carId) {
            updateSingleButton(button, carId);
        }
    });
}

// Mettre à jour un seul bouton
function updateSingleButton(button, carId) {
    if (!button) return;
    
    const isInList = isInWishlist(carId);
    
    // Vérifier si c'est un bouton cœur (avec classe "heart")
    if (button.classList.contains('heart')) {
        // Bouton cœur : seulement changer le style de l'icône
        const heartIcon = button.querySelector('i');
        
        if (heartIcon) {
            if (isInList) {
                // Coeur rempli (rouge)
                heartIcon.classList.remove('fa-regular');
                heartIcon.classList.add('fa-solid');
                heartIcon.style.color = '#e74c3c';
            } else {
                // Coeur vide (retour à la couleur par défaut)
                heartIcon.classList.remove('fa-solid');
                heartIcon.classList.add('fa-regular');
                heartIcon.style.color = '';
            }
        }
    } else {
        // Bouton texte : changer le texte comme avant
        if (isInList) {
            button.textContent = 'REMOVE FROM WISHLIST';
            button.classList.add('in-wishlist');
            button.classList.remove('not-in-wishlist');
        } else {
            button.textContent = 'ADD TO WISHLIST';
            button.classList.remove('in-wishlist');
            button.classList.add('not-in-wishlist');
        }
    }
}

// CORRECTION PRINCIPALE : Ajouter une voiture à l'affichage de la wishlist
async function addCarToWishlistDisplay(carId) {
    const container = document.querySelector('.whishlit_list');
    if (!container) {
        console.error('Wishlist container not found');
        return;
    }
    
    try {
        const car = await getCarById(carId);
        if (!car) {
            console.warn(`Car with ID ${carId} not found`);
            createMinimalCarItem(carId);
            return;
        }
        
        const existingItem = container.querySelector(`[data-car-id="${carId}"]`);
        if (existingItem) return;
        
        // CORRECTION : Retirer le message "empty" s'il existe
        const emptyMsg = container.querySelector('.empty-wishlist');
        if (emptyMsg) {
            // Vider complètement le conteneur
            container.innerHTML = '';
            
            // Afficher le titre
            const sectionTitle = document.querySelector(".section_title");
            if (sectionTitle) {
                sectionTitle.style.display = "block";
            }
        }
        
        const carItem = createWishlistItem(car);
        container.appendChild(carItem);
        
        // Ajouter l'événement au bouton remove
        addRemoveButtonListener(carItem, carId);
    } catch (error) {
        console.error('Error adding car to display:', error);
        createMinimalCarItem(carId);
    }
}

// Ajouter l'écouteur d'événement au bouton remove
function addRemoveButtonListener(carItem, carId) {
    const removeBtn = carItem.querySelector('.remove_car');
    if (removeBtn) {
        // Retirer les anciens écouteurs
        const newRemoveBtn = removeBtn.cloneNode(true);
        removeBtn.parentNode.replaceChild(newRemoveBtn, removeBtn);
        
        // Ajouter le nouvel écouteur
        newRemoveBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            await removeFromWishlist(carId);
        });
    }
}

// Créer un élément minimal
function createMinimalCarItem(carId) {
    const container = document.querySelector('.whishlit_list');
    if (!container) return;
    
    // CORRECTION : Retirer le message "empty" s'il existe
    const emptyMsg = container.querySelector('.empty-wishlist');
    if (emptyMsg) {
        container.innerHTML = '';
        
        // Afficher le titre
        const sectionTitle = document.querySelector(".section_title");
        if (sectionTitle) {
            sectionTitle.style.display = "block";
        }
    }
    
    const carItem = document.createElement('div');
    carItem.className = 'car_item';
    carItem.setAttribute('data-car-id', carId);
    
    carItem.innerHTML = `
        <div class="car_image">
            <a href="#">
                <img src="assets/images/default-car.png" 
                     alt="Car ${carId}">
            </a>
        </div>
        <div class="car_info">
            <h5>Car ID: ${carId}</h5>
            <p><strong>Model:</strong> Information not available</p>
            <p><strong>Price:</strong> $--,--</p>
            <p><strong>Location:</strong> Casablanca</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <button class="remove_car" data-car-id="${carId}">
                Remove
            </button>
        </div>
    `;
    
    container.appendChild(carItem);
    addRemoveButtonListener(carItem, carId);
}

// Retirer une voiture de l'affichage
function removeCarFromWishlistDisplay(carId) {
    const container = document.querySelector('.whishlit_list');
    if (!container) return;
    
    const carItem = container.querySelector(`[data-car-id="${carId}"]`);
    if (carItem) {
        carItem.style.opacity = '0';
        carItem.style.transform = 'translateX(-100px)';
        carItem.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            carItem.remove();
            
            // CORRECTION : Vérifier si la wishlist est vide APRÈS la suppression
            if (wishlist.length === 0) {
                const sectionTitle = document.querySelector(".section_title");
                if (sectionTitle) sectionTitle.style.display = "none";
                
                // Afficher le message "empty"
                container.innerHTML = `
                    <div class="empty-wishlist">
                        <p>Your wishlist is empty</p>
                        <p>Add cars from the catalog to your wishlist</p>
                    </div>
                `;
            }
        }, 300);
    }
}

// Créer un élément HTML
function createWishlistItem(car) {
    const carItem = document.createElement('div');
    carItem.className = 'car_item';
    carItem.setAttribute('data-car-id', car.id);
    
    const carName = car.modelName;
    const carBrand = car.brand;
    const carPrice = car.dailyPrice;
    const carImage = car.images.side;
    const tankCapacity = car.tankCapacity;
    const numberOfSeats = car.numberOfSeats;
    const numberOfDoors = car.numberOfDoors;
    
    const formattedPrice = typeof carPrice === 'number' 
        ? `$${carPrice.toLocaleString()}` 
        : String(carPrice);
    
    const currentDate = new Date().toLocaleDateString();
    
    carItem.innerHTML = `
        <div class="car_image">
            <a href="#">
                <img src="${carImage}" 
                     alt="${carBrand} ${carName}"
                >
            </a>
        </div>
        <div class="car_info">
            <h5> ${carName}</h5>
            <p><strong>Price:</strong> ${formattedPrice}</p>
            <p><strong>tank capacity:</strong> ${tankCapacity}</p>
            <p><strong>number Of Seats:</strong> ${numberOfSeats}</p>
            <p><strong>number Of Doors:</strong> ${numberOfDoors}</p>
            <p><strong>Date:</strong> ${currentDate}</p>
            <button class="remove_car" data-car-id="${car.id}">
                Remove
            </button>
        </div>
    `;
    
    return carItem;
}

// Rendre tous les éléments
async function renderWishlist() {
    const container = document.querySelector('.whishlit_list');
    const sectionTitle = document.querySelector(".section_title");
    
    if (!container) return;
    
    if (wishlist.length === 0) {
        if (sectionTitle) sectionTitle.style.display = "none";
        container.innerHTML = `
            <div class="empty-wishlist">
                <p>Your wishlist is empty</p>
                <p>Add cars from the catalog to your wishlist</p>
            </div>
        `;
        return;
    }
    
    if (sectionTitle) sectionTitle.style.display = "block";
    
    // CORRECTION : Vider le conteneur au début du rendu
    container.innerHTML = '';
    
    for (const carId of wishlist) {
        await addCarToWishlistDisplay(carId);
    }
}

// Mettre à jour le compteur
function updateWishlistCount() {
    const counters = document.querySelectorAll('.whishlist_length');
    counters.forEach(counter => {
        counter.textContent = wishlist.length;
    });
}

// Afficher un message
function showMessage(text) {
    const oldMessages = document.querySelectorAll('.wishlist-message');
    oldMessages.forEach(msg => msg.remove());
    
    const msg = document.createElement('div');
    msg.className = 'wishlist-message';
    msg.textContent = text;
    
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            z-index: 10000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        
        setTimeout(() => {
            msg.style.opacity = '1';
            msg.style.transform = 'translateY(0)';
        }, 5);
        
        setTimeout(() => {
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (msg.parentNode) msg.remove();
            }, 300);
        }, 2000);
    }, 5);
}

// Initialiser les boutons wishlist avec délégation d'événements
function initWishlistButtons() {
    // D'abord, mettre à jour l'apparence de tous les boutons
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    
    wishlistButtons.forEach(button => {
        const carId = button.getAttribute('data-car-id');
        
        if (!carId) {
            console.warn('Wishlist button missing data-car-id attribute');
            return;
        }
        
        // Mettre à jour l'apparence initiale
        updateSingleButton(button, carId);
    });
    
    // ENSUITE, utiliser la délégation d'événements sur document
    // Retirer les anciens écouteurs pour éviter les doublons
    document.removeEventListener('click', handleWishlistClick);
    
    // Ajouter le nouvel écouteur avec délégation
    document.addEventListener('click', handleWishlistClick);
}
// Gérer les clics sur les boutons wishlist
function handleWishlistClick(e) {
    // Vérifier si le clic est sur un bouton wishlist
    const wishlistButton = e.target.closest('.wishlist-btn');
    if (wishlistButton) {
        e.preventDefault();
        e.stopPropagation();
        
        const carId = wishlistButton.getAttribute('data-car-id');
        if (carId) {
            toggleWishlist(carId);
        }
    }
}

// Toggle la wishlist
async function toggleWishlist(carId) {
    if (isInWishlist(carId)) {
        await removeFromWishlist(carId);
    } else {
        await addToWishlist(carId);
    }
}

// Rafraîchir la sidebar quand elle s'ouvre
function initSidebarRefresh() {
    const menuBtn = document.getElementById('menuBtn2');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            // Rafraîchir les boutons remove
            document.querySelectorAll('.remove_car').forEach(btn => {
                const carId = btn.getAttribute('data-car-id');
                if (carId) {
                    addRemoveButtonListener(btn.closest('.car_item'), carId);
                }
            });
        });
    }
}

// Initialiser tout
async function initWishlistSystem() {
    console.log('Starting wishlist system (using sessionStorage)...');
    
    await loadCarsService();
    loadWishlist();
    await renderWishlist();
    initWishlistButtons();
    initSidebarRefresh();
    
    // Observer les changements dans le carousel pour réinitialiser les boutons
    observeCarouselChanges();

    console.log('Wishlist system ready (sessionStorage)');
    console.log('Wishlist will be cleared when browser tab is closed');
}
// Observer les changements dans le carousel
function observeCarouselChanges() {
    const carousel = document.querySelector('.carousel .list');
    if (!carousel) return;
    
    const observer = new MutationObserver(function(mutations) {
        let shouldUpdate = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // Vérifier si des boutons wishlist ont été ajoutés
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            if (node.querySelector && node.querySelector('.wishlist-btn')) {
                                shouldUpdate = true;
                            }
                        }
                    });
                }
            }
        });
        
        if (shouldUpdate) {
            // Mettre à jour les boutons après un court délai
            setTimeout(initWishlistButtons, 100);
        }
    });
    
    observer.observe(carousel, {
        childList: true,
        subtree: true
    });
}

// Démarrer
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWishlistSystem);
} else {
    initWishlistSystem();
}

// Ajouter les styles
if (!document.querySelector('#wishlist-styles')) {
    const style = document.createElement('style');
    style.id = 'wishlist-styles';
    style.textContent = `
        .wishlist-btn:not(.heart) {
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
        }
        
        .heart.in-wishlist {
            color: red;
        }
        
        .wishlist-btn.in-wishlist {
            background-color: #dc3545 !important;
            color: white !important;
        }
        
        
        
        .wishlist-btn.in-wishlist:hover {
            background-color: #c82333 !important;
        }
        
        
        .remove_car {
            background: #dc3545;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
            transition: all 0.3s ease;
            font-size: 13px;
        }
        
        .remove_car:hover {
            background: #c82333;
            transform: translateY(-2px);
        }
        
        .car_item {
            transition: all 0.3s ease;
            animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .empty-wishlist {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        
        .empty-wishlist p {
            margin: 10px 0;
        }
        
        .empty-wishlist p:first-child {
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }
    `;
    document.head.appendChild(style);
}

// Exporter
window.Wishlist = {
    add: addToWishlist,
    remove: removeFromWishlist,
    toggle: toggleWishlist,
    has: isInWishlist,
    getAll: () => [...wishlist],
    refresh: renderWishlist,
    updateButtons: updateAllWishlistButtons,
    init: initWishlistSystem,
    clearSession: () => {
        sessionStorage.removeItem(WISHLIST_KEY);
        wishlist = [];
        renderWishlist();
        updateAllWishlistButtons();
    }
};
/************************************ WHISHLIST ************************************/