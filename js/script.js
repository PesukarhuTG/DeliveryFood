const cartBtn = document.querySelector('.cart-btn');
const modalWindow = document.querySelector('.modal');
const closeBtn = document.querySelector('.close');

cartBtn.addEventListener('click', (e) => {
    modalWindow.classList.add('open');
});

closeBtn.addEventListener('click', (e) => {
    modalWindow.classList.remove('open');
});
