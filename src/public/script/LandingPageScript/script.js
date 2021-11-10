let loader = document.querySelector('#preloader');
let text1 = document.querySelector('.to-be-animated-text1');
let text2 = document.querySelector('.to-be-animated-text2');
let para = document.querySelector('.to-be-animated-para');
let anchor = document.querySelector('.to-be-animated-anchor');

const $videoElement = document.querySelector('video')

window.addEventListener('load', () => {
    console.log('checkpoint');
    $videoElement.addEventListener('load',()=>{
    console.log('checkpoint');
        if($videoElement.readyState >= 3){
    console.log('checkpoint');
        loader.style.display = "none";
        text1.classList.add('text1');
        text2.classList.add('text2');
        para.classList.add('animate__animated', 'animate__fadeInLeftBig');
        anchor.classList.add('animate__animated', 'animate__fadeInRightBig');
        console.log('checkpoint');
        }
    })
});