let pageLoader = document.querySelector('.pageloader');
let infraLoader = document.querySelector('.infraloader');

window.addEventListener('load', () => {
    infraLoader.classList.remove('is-active');
    pageLoader.classList.remove('is-active');
});