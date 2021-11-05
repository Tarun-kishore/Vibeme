let accordion = document.querySelector('.accordion-list');
let items = accordion.querySelectorAll('li');
let questions = accordion.querySelectorAll('.accordion-title');

questions.forEach(question => question.addEventListener('click', toggleAccordion));

function toggleAccordion(){
    thisItem = this.parentNode;
    items.forEach(item => {
        if (thisItem == item){
            thisItem.classList.toggle('open');
            return;
        }
        item.classList.remove('open');
        item.classList.toggle('Invisible');
    });
}