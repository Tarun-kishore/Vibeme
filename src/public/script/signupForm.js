const $emailAlert = document.querySelector('#emailAlert')
const $passwordAlert = document.querySelector('#passAlert')
const $form = document.querySelector('#signup')
const $email = document.querySelector('#email')
const $password = document.querySelector('#exampleInputPassword2')
const $confirmPassword = document.querySelector('#confirmPassword')

$form.addEventListener('submit',(e)=>{
    // $emailAlert.innerHTML = ''
    // $passwordAlert.innerHTML = ''

    $email.value = $email.value.toLowerCase()


    e.preventDefault()
    data={email:$email.value}
    fetch('/user/exist',{
        method: 'post',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(data)
    }).then((response)=> response.json()
    ).then((response)=>{
        $emailAlert.classList.add('Invisible');
        $passwordAlert.classList.add('Invisible');
        if(response.exist){
            $emailAlert.classList.remove('Invisible');
        }
        else if($password.value.length < 8){
            console.log('<div class="form-error">Password should be atleast 8 characters long</div>')
            $passwordAlert.classList.remove('Invisible');
            $passwordAlert.querySelector('p').innerText = "Password should be atleast 8 characters long";
        }
        else if($password.value !== $confirmPassword.value){
            console.log('<div class="form-error">Password and confirm password should have same value</div>')
            $passwordAlert.classList.remove('Invisible');
            $passwordAlert.querySelector('p').innerText = "Password and Confirm password doesn't match";
        }
        else $form.submit()
    })
})