const cartBtn = document.querySelector('#cart-button');
const modalWindow = document.querySelector('.modal');
const closeBtn = document.querySelector('.close');

const toggleModal = () => {
    modalWindow.classList.toggle('open');
};

cartBtn.addEventListener('click', toggleModal);
closeBtn.addEventListener('click', toggleModal);
