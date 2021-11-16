// For moving image left on scrolling
var lastScrollTop = 0;
var backgroundOpacity = 1;

// selecting background Image and container containing text
const backgroundImage = document.querySelector('#stunning-header .background-image');
const headingContainer = document.querySelector('#stunning-header .container');

// added event listener to whole page which gets activated on scroll
document.addEventListener("scroll", function () {

    // taking the y offset value of browser
    var st = window.pageYOffset || document.documentElement.scrollTop;

    // if this happens means user has scroll downward
    if (st > lastScrollTop) {
        backgroundOpacity -= (st / 8000);
        backgroundImage.style.backgroundPosition = `${st}px`;
        headingContainer.style.opacity = `${backgroundOpacity}`;
    } 
    // else upward scroll or no scroll
    else {
        backgroundOpacity += (st / 8000);
        if (!st) {
            backgroundOpacity = 1;
        }
        backgroundImage.style.backgroundPosition = `${st}px`;
        headingContainer.style.opacity = `${backgroundOpacity}`;
    }
    // ternary condition which checks whether st becomes -ve or not
    lastScrollTop = st <= 0 ? 0 : st;
}, false); // and put useCapture = false 
// (A boolean value indicating whether events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree).

// For counting animation and back-to-top arror function

// selecting numbers div
const countingNumbers = document.querySelectorAll('#stunning-counting .counting-number');

// this value will be send by backend to us
const countingValue = [1500, 860, 7401, 294]; // imaginary value

// telling that counting will happen only 1 time
var countingFlag = true;

// selecting arrow button
const topArrow = document.querySelector('#back-to-top');

// counting function which counts from start to end with a given increment value and duration so that counting can be completed at max in this time
function animateCounting(id, start, end, increment, duration) 
{

    if (start === end) return;
    let range = end - start;
    let current = start;

    // calculating interval delay b/w each increment
    let stepTime = Math.abs(Math.floor((duration * increment) / range));

    // if value to be incremented < increment then we reduce the increment
    let timer = setInterval(function () {
        if (end - current < increment) {
            increment = Math.floor(increment / 10);
        }
        current += increment;
        id.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// adding scroll event listener to the window
$(window).scroll(function () {

    // calculating offset value of stunning-counting section
    let hT = $('#stunning-counting').offset().top,
        hH = $('#stunning-counting').outerHeight(),
        wH = $(window).height(),
        wS = $(this).scrollTop();
    
    // calculating offset value of learn-more section
    let hT1 = $('#learn-more').offset().top,
        hH1 = $('#learn-more').outerHeight();

    // Back to top arrow script
    // if our lower screen just touches the learn more section then our arrow becomes visible
    if ((wS > (hT + hH - wH))) {
        topArrow.classList.remove('Invisible');
    } else {
        topArrow.classList.add('Invisible');
    }

    // Counting Script
    // if our lower screen is b/w the counting number section then counting will get starts
    if (countingFlag && (wS > (hT + hH - wH)) && (wS < (hT1 + hH1 - wH))) {
        countingFlag = false;
        animateCounting(countingNumbers[0], 0, countingValue[0], 11, 1500);
        animateCounting(countingNumbers[1], 0, countingValue[1], 11, 1500);
        animateCounting(countingNumbers[2], 0, countingValue[2], 111, 1500);
        animateCounting(countingNumbers[3], 0, countingValue[3], 1, 1500);
    }
});