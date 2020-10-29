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

//get data from db
const getData = async function(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}`);
    }
    return await response.json();
};

// open/close modal cart window
const toggleModal = () => {
    modalCart.classList.toggle('open');
};

//validation
const validName = (str) => {
    const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
    return regName.test(str); //test is method for reg
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

    if (validName(loginInput.value)) {
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
const createCardRestaurant = (restaurant) => {

    //десруктуировали данные, чтобы достать их поотдельности
    const { image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery } = restaurant;

    const card = `
    <a class="card card-restaurant" data-products="${products}">
        <img class="card-image" src="${image}" alt="card-img">
        <div class="card-text">
            <div class="card-heading">
                <h3 class="card-title">${name}</h3>
                <span class="card-tag tag">${timeOfDelivery} мин.</span>
            </div>
            <div class="card-info">
                <div class="rating">
                    <img src="./img/star.svg" alt="star">
                    <span>${stars}</span>
                </div>
            <div class="price">от ${price} ₽</div>
            <div class="category">${kitchen}</div>
            </div>
        </div>
    </a>
    `;

    cardsRestaurants.insertAdjacentHTML('beforeend', card);

};

//create card
const createCardGood = (goods) => {

    const { description, id, image, name, price } = goods;

    const card = document.createElement('div');
    card.className = 'card';

    card.insertAdjacentHTML('afterbegin', `
			<img src="${image}" alt="image" class="card-image"/>
				<div class="card-text">
					<div class="card-heading">
						<h3 class="card-title card-title-reg">${name}</h3>
					</div>
					<div class="card-info">
						<div class="ingredients">${description}</div>
					</div>
					<div class="card-buttons">
						<button class="button button-primary button-add-cart">
							<span class="button-card-text">В корзину</span>
							<span class="button-cart-svg"></span>
						</button>
						<strong class="card-price-bold">${price} ₽</strong>
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

            //брабатываем ответ промиса 
            getData(`./db/${restaurant.dataset.products}`)
            .then(function(data) {
                data.forEach(createCardGood);
            });

        }
    } else {
        toggleModalAuth();
    }
};

function init() {
    //брабатываем ответ промиса 
    getData('./db/partners.json')
    .then(function(data) {
        data.forEach(createCardRestaurant);
    });

    cartBtn.addEventListener('click', toggleModal);
    closeBtn.addEventListener('click', toggleModal);
    cardsRestaurants.addEventListener('click', openGoods); //клик на карточке через делегирование
    logo.addEventListener('click', () => {
        containerPromo.classList.remove('hide');
        restaurants.classList.remove('hide');
        menu.classList.add('hide');
    });

    checkAuth();

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
    
}

init();






