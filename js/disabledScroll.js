/* Могли бы использовать 'position: relative', но это не работает в Safari и iOs
поэтому используем position: fixed + top+left+width*/

window.disableScroll = function () {

    /*сохраним значение ширины проявляющегося скролла справа,
    чтобы верстка не прыгала*/
    const widthScroll = window.innerWidth - document.body.offsetWidth;

    /*фиксируем значение нахождения по Y, чтобы после закрытия
    модального окна пользователя не скроллило наверх страницы по умолчанию*/
    document.body.dbScrollY = window.scrollY;

    document.body.style.cssText = `
    position: fixed;
    top: ${-window.scrollY}px;
    left: 0;
    width: 100%;
    overflow: hidden;
    height: 100vh;
    padding-right: ${widthScroll}px;
    `;
};

window.enableScroll = function () {
    document.body.style.cssText = ``; //clear style css
    window.scroll({top: document.body.dbScrollY});
};