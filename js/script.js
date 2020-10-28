"use strict";

const cartBtn = document.querySelector('#cart-button');
const modalCart = document.querySelector('.modal');
const closeBtn = document.querySelector('.close');

const authBtn = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');

const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const outBtn = document.querySelector('.button-out');

const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('delivery');

// open/close modal cart window
const toggleModal = () => {
    modalCart.classList.toggle('open');
};

//authorization 
const toggleModalAuth = () => {
    modalAuth.classList.toggle('open');
    loginInput.style.border = '';
    if (modalAuth.classList.contains('open')) {
        disableScroll();
    } else {
        enableScroll();
    }
};

const checkAuth = () => {
    if (login) {
        authorized();
    } else {
        notAuthorized();
    }
};

const logIn = (e) => {
    e.preventDefault();

    if (loginInput.value.trim()) {
        login = loginInput.value;
        localStorage.setItem('delivery', login);
        toggleModalAuth();

        authBtn.removeEventListener('click', toggleModalAuth);
        closeAuth.removeEventListener('click', toggleModalAuth);
        logInForm.removeEventListener('submit', logIn);
        logInForm.reset();
        checkAuth();
    } else {
        // alert('Введите логин для авторизации');
        loginInput.style.border = '2px solid #ff0000';
        loginInput.value = '';
    }
};

const authorized = () => {

    const logOut = () => {
        login = null;
        localStorage.removeItem('delivery');
        authBtn.style.display = '';
        userName.style.display = '';
        outBtn.style.display = '';
        outBtn.removeEventListener('click', logOut);
        checkAuth();
    };

    console.log('Авторизован');

    userName.textContent = login;
    authBtn.style.display = 'none';
    userName.style.display = 'inline';
    outBtn.style.display = 'block';

    outBtn.addEventListener('click', logOut);
};

const notAuthorized = () => {
    console.log('Не авторизован');
    authBtn.addEventListener('click', toggleModalAuth);
    closeAuth.addEventListener('click', toggleModalAuth);
    logInForm.addEventListener('submit', logIn);
    modalAuth.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('open')) {
            toggleModalAuth();
        }
    });
};

//generate cards of restaurants
const createCardRestaurant = () => {

    const card = `
    <a class="card card-restaurant">
        <img class="card-image" src="img/pizza-plus/preview.jpg" alt="card-img">
        <div class="card-text">
            <div class="card-heading">
                <h3 class="card-title">Пицца плюс</h3>
                <span class="card-tag tag">50 мин.</span>
            </div>
            <div class="card-info">
                <div class="rating">
                    <img src="./img/star.svg" alt="star">
                    <span>4.5</span>
                </div>
            <div class="price">от 900 ₽</div>
            <div class="category">Пиццерия</div>
            </div>
        </div>
    </a>
    `;

    cardsRestaurants.insertAdjacentHTML('beforeend', card);

};

//create card
const createCardGood = () => {
    const card = document.createElement('div');
    card.className = 'card';

    card.insertAdjacentHTML('afterbegin', `
			<img src="img/pizza-plus/pizza-girls.jpg" alt="image" class="card-image"/>
				<div class="card-text">
					<div class="card-heading">
						<h3 class="card-title card-title-reg">Пицца Девичник</h3>
					</div>
					<div class="card-info">
						<div class="ingredients">Соус томатный, постное тесто, нежирный сыр, кукуруза, лук, маслины,
						грибы, помидоры, болгарский перец.
						</div>
					</div>
					<div class="card-buttons">
						<button class="button button-primary button-add-cart">
							<span class="button-card-text">В корзину</span>
							<span class="button-cart-svg"></span>
						</button>
						<strong class="card-price-bold">450 ₽</strong>
					</div>
				</div>
    `);

    cardsMenu.insertAdjacentElement('beforeend', card);
};

//open menu restaurant after click on card
const openGoods = (e) => {

    const target = e.target;

    if (login) {
        const restaurant = target.closest('.card-restaurant');

        if (restaurant) {
            cardsMenu.textContent = '';
            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');
            menu.classList.remove('hide');
    
            createCardGood();
            createCardGood();
        }
    } else {
        toggleModalAuth();
    }
};


cartBtn.addEventListener('click', toggleModal);
closeBtn.addEventListener('click', toggleModal);
cardsRestaurants.addEventListener('click', openGoods); //клик на карточке через делегирование
logo.addEventListener('click', () => {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
});

checkAuth();
createCardRestaurant();
createCardRestaurant();
createCardRestaurant();


//SLIDER SWIPER

new Swiper('.swiper-container', {
    slidesPerView: 1,
    loop: true,
    autoplay: true,
    speed: 400,
    spaceBetween: 10,
    direction: 'horizontal',
    effect: 'fade',
    scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
        },
});