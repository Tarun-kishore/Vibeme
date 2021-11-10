// For moving image left on scrolling
var lastScrollTop = 0;
var backgroundOpacity = 1;
const backgroundImage = document.querySelector('#stunning-header .background-image');
const headingContainer = document.querySelector('#stunning-header .container');

document.addEventListener("scroll", function () {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop) {
        backgroundOpacity -= (st / 8000);
        backgroundImage.style.backgroundPosition = `${st}px`;
        headingContainer.style.opacity = `${backgroundOpacity}`;
    } else {
        backgroundOpacity += (st / 8000);
        if (!st) {
            backgroundOpacity = 1;
        }
        backgroundImage.style.backgroundPosition = `${st}px`;
        headingContainer.style.opacity = `${backgroundOpacity}`;
    }
    lastScrollTop = st <= 0 ? 0 : st;
}, false);

// For counting animation
const countingNumbers = document.querySelectorAll('#stunning-counting .counting-number');
const countingValue = [1500, 860, 7401, 294]; // imaginary value
var countingFlag = true;
const topArrow = document.querySelector('#back-to-top');

function animateCounting(id, start, end, increment, duration) {
    if (start === end) return;
    let range = end - start;
    let current = start;
    let stepTime = Math.abs(Math.floor((duration * increment) / range));
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

$(window).scroll(function () {
    let hT = $('#stunning-counting').offset().top,
        hH = $('#stunning-counting').outerHeight(),
        wH = $(window).height(),
        wS = $(this).scrollTop();
    let hT1 = $('#learn-more').offset().top,
        hH1 = $('#learn-more').outerHeight();

    // Back to top arrow script
    if ((wS > (hT + hH - wH))) {
        topArrow.classList.remove('Invisible');
    } else {
        topArrow.classList.add('Invisible');
    }

    // Counting Script
    if (countingFlag && (wS > (hT + hH - wH)) && (wS < (hT1 + hH1 - wH))) {
        countingFlag = false;
        animateCounting(countingNumbers[0], 0, countingValue[0], 11, 1500);
        animateCounting(countingNumbers[1], 0, countingValue[1], 11, 1500);
        animateCounting(countingNumbers[2], 0, countingValue[2], 111, 1500);
        animateCounting(countingNumbers[3], 0, countingValue[3], 1, 1500);
    }
});