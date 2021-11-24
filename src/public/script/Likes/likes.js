//Elemets in document
$likeButtons = document.getElementsByClassName('like');

//utility functions
const setLiked = function($likeButton){
    $likeButton.classList.add('is-liked');
};

const unsetLiked = function($likeButton){
    $likeButton.classList.remove('is-liked');
};

for(let i=0;i<$likeButtons.length;i++){
    const postId = $likeButtons[i].attributes.id.value;
    fetch(`/post/isLiked`,{
        method: 'post',
        headers:{
            'Content-type': 'application/json'
        },
        body : JSON.stringify({
            post:postId
        })
    }).then((response)=>response.json())
    .then((data)=>{
        if(data.liked) $likeButtons[i].classList.toggle('is-liked');
    })
    .catch((e)=> {
    
    } );
}

const hitlike = function(button){
    const $likesCount =button.parentElement.childNodes[1];
    const postId = button.attributes.id.value;
    fetch('/post/hit',{
        method:'post',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({
            post:postId
        })
    }).then((data)=> data.json())
    .then(data => {
        if(data.like){
            setLiked(button);
            $likesCount.innerHTML++;
        }
        else{
            unsetLiked(button);
            $likesCount.innerHTML--;
        }
    });
};