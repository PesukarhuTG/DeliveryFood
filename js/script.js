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

let login = localStorage.getItem('delivery');

// open/close modal cart window
const toggleModal = () => {
    modalCart.classList.toggle('open');
};


//authorization 
const toggleModalAuth = () => {
    modalAuth.classList.toggle('open');
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

    if (!loginInput.value) {
        alert('Введите логин для авторизации');
    } else {

    login = loginInput.value;

    localStorage.setItem('delivery', login);

    toggleModalAuth();
    authBtn.removeEventListener('click', toggleModalAuth);
    closeAuth.removeEventListener('click', toggleModalAuth);
    logInForm.removeEventListener('submit', logIn);
    logInForm.reset();
    checkAuth();
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
    
};

cartBtn.addEventListener('click', toggleModal);
closeBtn.addEventListener('click', toggleModal);

checkAuth();
