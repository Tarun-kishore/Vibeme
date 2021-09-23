//Elemets in document
$likeButtons = document.getElementsByClassName('like')

//utility functions
const setLiked = function($likeButton){
    $likeButton.style.background = 'red'
    $likeButton.style.color = 'white'
}

const unsetLiked = function($likeButton){
    $likeButton.style.background = 'white'
    $likeButton.style.color = 'black'
}

for(let i=0;i<$likeButtons.length;i++){
    const postId = $likeButtons[i].attributes.id.value
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
        if(data.liked)  setLiked($likeButtons[i])
        else unsetLiked($likeButtons[i])
    })
    .catch((e)=> {
    
    } )
}


const hitlike = function(button){
    const $likesCount =button.parentElement.childNodes[3]
    const postId = button.attributes.id.value
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
            setLiked(button)
            $likesCount.innerHTML++
        }
        else{
            unsetLiked(button)
            $likesCount.innerHTML--
        }
    })
}
// $likeButton.addEventListener('click',(e)=>{

// })
// 