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
const restaurantTitle = document.querySelector('.restaurant-title');
const restaurantrating = document.querySelector('.rating');
const restaurantPrice = document.querySelector('.price');
const restaurantCategory = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-price-tag');
const buttonClearCart = document.querySelector('.clear-cart');


let login = localStorage.getItem('delivery');

const cart = [];

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
        cartBtn.style.display = '';
        outBtn.removeEventListener('click', logOut);
        checkAuth();
    };

    console.log('Авторизован');

    userName.textContent = login;
    authBtn.style.display = 'none';
    userName.style.display = 'inline';
    outBtn.style.display = 'flex';
    cartBtn.style.display = 'flex';

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

    const cardsRestaurant = document.createElement('a');
    cardsRestaurant.className = 'card card-restaurant';
    cardsRestaurant.products = products;
    cardsRestaurant.info = { kitchen, name, price, stars };

    const card = `
        <img class="card-image" src="${image}" alt="card-img">
        <div class="card-text">
            <div class="card-heading">
                <h3 class="card-title">${name}</h3>
                <span class="card-tag tag">${timeOfDelivery} мин.</span>
            </div>
            <div class="card-info">
                <div class="rating">
                    <span>${stars}</span>
                </div>
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
			<img src=${image} alt=${name} class="card-image"/>
				<div class="card-text">
					<div class="card-heading">
						<h3 class="card-title card-title-reg">${name}</h3>
					</div>
					<div class="card-info">
						<p class="ingredients">${description}</p>
					</div>
					<div class="card-buttons">
						<button class="button button-primary button-add-cart" id="${id}">
							<span class="button-card-text">В корзину</span>
							<span class="button-cart-svg"></span>
						</button>
						<strong class="card-price-bold card-price">${price} ₽</strong>
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

            const { kitchen, name, price, stars } = restaurant.info;

            restaurantTitle.textContent = name;
            restaurantrating.textContent = stars;
            restaurantPrice.textContent = `от ${price} ₽`;
            restaurantCategory.textContent = kitchen;

            //брабатываем ответ промиса 
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

        //если еда существует, увеличиваем count,
        //иначе создаем новую позицию
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
}

function changeCount(e) {

    const target = e.target;

    if (target.classList.contains('counter-button')) {
            const food = cart.find(item => {
                return item.id === target.dataset.id;
            });

            if (target.classList.contains('counter-minus')) {
                food.count--;

                //если позиция 0 шт
                if (food.count === 0) {
                    cart.splice(cart.indexOf(food), 1); //найдем айдишник товара и удалим из масива карточки
                }
            }

            if (target.classList.contains('counter-plus')) {
                food.count++;
            }
            
            renderCart();
    }
}


function init() {
    //брабатываем ответ промиса 
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

    });

    modalBody.addEventListener('click', changeCount);
    closeBtn.addEventListener('click', toggleModal);
    cardsMenu.addEventListener('click', addToCart);
    cardsRestaurants.addEventListener('click', openGoods); //клик на карточке через делегирование
    logo.addEventListener('click', () => {
        containerPromo.classList.remove('hide');
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
                }, 1500); //очищаем поле поиска после 1.5с
                return;
            }

            getData('./db/partners.json')
                .then(function (data) { //делаем запрос, получаем всех партнеров
                    return data.map(function(partner) {
                        return partner.products;
                    });//перебираем данные, возвращая массив
                })
                .then(function(linksProduct) {
                    cardsMenu.textContent = '';

                    linksProduct.forEach(function(link) {
                        getData(`./db/${link}`)
                            .then(function(goods) {

                                const resultSearch = goods.filter(function(item) {
                                    const name = item.name.toLowerCase();
                                    return name.includes(value.toLowerCase()); //возвращаем только те карточки, ктр-е совпадают с value
                                });
                                
                                containerPromo.classList.add('hide');
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






