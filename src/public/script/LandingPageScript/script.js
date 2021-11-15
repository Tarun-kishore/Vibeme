// Selecting the loader, text1, text2, para and anchor
let loader = document.querySelector('#preloader');
let text1 = document.querySelector('.to-be-animated-text1');
let text2 = document.querySelector('.to-be-animated-text2');
let para = document.querySelector('.to-be-animated-para');
let anchor = document.querySelector('.to-be-animated-anchor');

// To make sure our animation starts only after our complete code has been rendered on user's browser screen
// Till then our loader will be displayed to user
window.addEventListener('load', () => {
    loader.style.display = "none";
    text1.classList.add('text1');
    text2.classList.add('text2');
    para.classList.add('animate__animated', 'animate__fadeInLeftBig');
    anchor.classList.add('animate__animated', 'animate__jackInTheBox');
});