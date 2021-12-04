let redirection = document.querySelector('.redirection');

window.addEventListener('load', ()=> {
    let redirectionNumber = 3;
    let id = setInterval(() => {
        redirection.innerText = redirectionNumber;
        redirectionNumber--;
        if(redirectionNumber === 0)
        {
            window.location.href = "/login";
            clearInterval(id);
        }
    }, 1000);
});