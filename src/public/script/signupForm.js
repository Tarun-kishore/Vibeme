
const $emailAlert = document.querySelector('#emailAlert')
const $passwordAlert = document.querySelector('#passAlert')
const $form = document.querySelector('#signup')
const $email = document.querySelector('#email')
const $password = document.querySelector('#password')
const $confirmPassword = document.querySelector('#confirmPassword')

$form.addEventListener('submit',(e)=>{
    $emailAlert.innerHTML = ''
    $passwordAlert.innerHTML = ''

    $email.value = $email.value.toLowerCase()

    data={email:$email.value}
    fetch('/user/exist',{
        method: 'post',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(data)
    }).then((response)=> response.json()
    ).then((response)=>{
        if(response.exist){
            $emailAlert.innerHTML = '<div class="form-error">Email ID already exists</div>'
            e.preventDefault()
        }
    })
    
    
    if($password.value.length < 8){
        $passwordAlert.innerHTML = '<div class="form-error">Password should be atleast 8 characters long</div>'
        e.preventDefault()
    }
    
    if($password.value !== $confirmPassword.value){
        $passwordAlert.innerHTML = '<div class="form-error">Password and confirm password should have same value</div>'
        e.preventDefault()
    }

})