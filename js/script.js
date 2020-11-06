"use strict";

//SLIDER SWIPER

const swiper = new Swiper('.swiper-container', {
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
const restaurantTitle = document.querySelector('.restaurant-title');
const restaurantrating = document.querySelector('.rating');
const restaurantPrice = document.querySelector('.price');
const restaurantCategory = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-price-tag');
const buttonClearCart = document.querySelector('.clear-cart');
const stylesheet = document.documentElement.style;
const switcher = document.querySelector('.switch-input[data-theme-toggle]');

let login = localStorage.getItem('delivery');
const cart = JSON.parse(localStorage.getItem(`delivery_${login}`)) || [];

//save cart data in localStorage
const saveCart = () => {
    localStorage.setItem(`delivery_${login}`, JSON.stringify(cart));
};

const downloadCart = () => {
    if (localStorage.getItem(`delivery_${login}`)) {
        const data = JSON.parse(localStorage.getItem(`delivery_${login}`));
        cart.push(...data);
    }
};

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
        downloadCart();

        authBtn.removeEventListener('click', toggleModalAuth);
        closeAuth.removeEventListener('click', toggleModalAuth);
        logInForm.removeEventListener('submit', logIn);
        logInForm.reset();
        checkAuth();
    } else {
        loginInput.style.border = '2px solid #ff0000';
        loginInput.value = '';
    }
};

const returnMain = () => {
    containerPromo.classList.remove('hide');
    swiper.init();
    restaurants.classList.remove('hide');
    menu.classList.add('hide');

};

const authorized = () => {

    const logOut = () => {
        login = null;
        cart.length = 0;
        localStorage.removeItem('delivery');
        authBtn.style.display = '';
        userName.style.display = '';
        outBtn.style.display = '';
        cartBtn.style.display = '';
        outBtn.removeEventListener('click', logOut);
        checkAuth();
        returnMain();
    };

    userName.textContent = login;
    authBtn.style.display = 'none';
    userName.style.display = 'inline';
    outBtn.style.display = 'flex';
    cartBtn.style.display = 'flex';

    outBtn.addEventListener('click', logOut);
};

const notAuthorized = () => {
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

    //destructurization
    const { image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery } = restaurant;

    const cardsRestaurant = document.createElement('a');
    cardsRestaurant.className = 'card card-restaurant';
    cardsRestaurant.products = products;
    cardsRestaurant.info = { kitchen, name, price, stars };

    const card = `
            <div class="card-text">
                <img class="card-image" src="${image}" alt="card-img">
                <div class="card-heading">
                    <h3 class="card-title">${name}</h3>
                    <span class="card-tag tag">${timeOfDelivery} мин.</span>
                </div>
                <div class="card-info">
                    <div class="rating"><span>${stars}</span></div>
                    <div class="price">от ${price} ₽</div>
                    <div class="category">${kitchen}</div>
                </div>
            </div>
            
    `;

    cardsRestaurant.insertAdjacentHTML('beforeend', card);
    cardsRestaurants.insertAdjacentElement('beforeend', cardsRestaurant);

};

//create card
const createCardGood = (goods) => {

    const { description, id, image, name, price } = goods;

    const card = document.createElement('div');
    card.className = 'card';

    card.insertAdjacentHTML('afterbegin', `
            <div class="card-text">
                <img src=${image} alt=${name} class="card-image"/>
				<div class="card-heading">
					<h3 class="card-title card-title-reg">${name}</h3>
				</div>
				<div class="card-info">
					<p class="ingredients">${description}</p>
                </div>
            </div>    
            <div class="card-buttons">
				<button class="button button-primary button-add-cart" id="${id}">
					<span class="button-card-text">В корзину</span>
					<span class="button-cart-svg-incard"></span>
				</button>
				<strong class="card-price-bold card-price">${price} ₽</strong>
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
            swiper.destroy(false);
            restaurants.classList.add('hide');
            menu.classList.remove('hide');

            const { kitchen, name, price, stars } = restaurant.info;

            restaurantTitle.textContent = name;
            restaurantrating.textContent = stars;
            restaurantPrice.textContent = `от ${price} ₽`;
            restaurantCategory.textContent = kitchen;

            //analyze Promise answer
            getData(`./db/${restaurant.products}`)
            .then(function(data) {
                data.forEach(createCardGood);
            });

        }
    } else {
        toggleModalAuth();
    }
};


function addToCart(e) {
    const target = e.target;
    const buttonAddToCart = target.closest('.button-add-cart');
    if (buttonAddToCart) {
        const card = target.closest('.card');
        const title = card.querySelector('.card-title-reg').textContent;
        const cost = card.querySelector('.card-price').textContent;
        const id = buttonAddToCart.id;

        const food = cart.find((item) => {
            return item.id === id;
        });

        //if 'food' is => count+1, else create new item in cart
        if (food) {
            food.count += 1;
        } else {
            cart.push({
                id,
                title,
                cost,
                count: 1,
            });
        }
        saveCart();
    }
}

function renderCart() {
    modalBody.textContent = '';

    cart.forEach(item => {

        const { id, title, cost, count } = item;

        const itemCart = `
            <div class="food-row">
                <span class="food-name">${title}</span>
                <span class="food-price">${cost}</span>
                <div class="food-counter">
                    <button class="counter-button counter-minus" data-id=${id}>-</button>
                    <span class="counter">${count}</span>
                    <button class="counter-button counter-plus" data-id=${id}>+</button>
                </div>
            </div>
        `;

        modalBody.insertAdjacentHTML('afterbegin', itemCart);
    });

    const totalPrice = cart.reduce((result, item) => {
        return result + (parseFloat(item.cost)) * item.count;
    }, 0);

    modalPrice.textContent = `${totalPrice} ₽`;
    saveCart();
}

function changeCount(e) {

    const target = e.target;

    if (target.classList.contains('counter-button')) {
            const food = cart.find(item => {
                return item.id === target.dataset.id;
            });

            if (target.classList.contains('counter-minus')) {
                food.count--;

                //if 'food count = 0', then find 'id' food and remove food from cart
                if (food.count === 0) {
                    cart.splice(cart.indexOf(food), 1);
                }
            }

            if (target.classList.contains('counter-plus')) {
                food.count++;
            }
            
            renderCart();
    }
}


function init() {
    getData('./db/partners.json')
    .then(function(data) {
        data.forEach(createCardRestaurant);
    });

    cartBtn.addEventListener('click', () => {
        renderCart();
        toggleModal();
    });

    buttonClearCart.addEventListener('click', () => {
        cart.length = 0;
        renderCart();
        toggleModal();
    });

    modalBody.addEventListener('click', changeCount);
    closeBtn.addEventListener('click', toggleModal);
    cardsMenu.addEventListener('click', addToCart);
    cardsRestaurants.addEventListener('click', openGoods); //click on card through delegation

    logo.addEventListener('click', () => {
        containerPromo.classList.remove('hide');
        swiper.init();
        restaurants.classList.remove('hide');
        menu.classList.add('hide');
    });

    checkAuth();

    //реализация поиска
    inputSearch.addEventListener('keypress', (e) => {

        if (e.charCode === 13) {

            const value =  e.target.value.trim();
            
            if (!value) {
                e.target.style.backgroundColor = '#fdcaca';
                e.target.value = '';
                setTimeout(() => {
                    e.target.style.backgroundColor = '';
                }, 1500); //clear search input after 1.5s
                return;
            }

            getData('./db/partners.json')
                .then(function (data) { //send the request and get all partners
                    return data.map(function(partner) {
                        return partner.products;
                    });//iterating the data and return an array
                })
                .then(function(linksProduct) {
                    cardsMenu.textContent = '';

                    linksProduct.forEach(function(link) {
                        getData(`./db/${link}`)
                            .then(function(goods) {

                                const resultSearch = goods.filter(function(item) {
                                    const name = item.name.toLowerCase();
                                    return name.includes(value.toLowerCase()); //return cards that contain Value
                                });
                                
                                containerPromo.classList.add('hide');
                                swiper.destroy(false);
                                restaurants.classList.add('hide');
                                menu.classList.remove('hide');

                                restaurantTitle.textContent = 'Результат поиска';
                                restaurantrating.textContent = '';
                                restaurantPrice.textContent = '';
                                restaurantCategory.textContent = 'разная кухня';

                                resultSearch.forEach(createCardGood);
                            });
                    });
                });
        }
    });
}

init();

//SWITCHER

switcher.addEventListener('click', () => {

    const color1 = getComputedStyle(document.documentElement).getPropertyValue('--color-1');
    const color2 = getComputedStyle(document.documentElement).getPropertyValue('--color-2');

    stylesheet.setProperty('--color-1', color2);
    stylesheet.setProperty('--color-2', color1);

});








