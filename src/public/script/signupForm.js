// const $emailAlert = document.querySelector('#emailAlert')
// const $passwordAlert = document.querySelector('#passAlert')
const $form = document.querySelector('#signup')
const $email = document.querySelector('#email')
const $password = document.querySelector('#exampleInputPassword2')
const $confirmPassword = document.querySelector('#confirmPassword')

console.log('running')
console.log($form)
console.log($email)
console.log($password)
console.log($confirmPassword)

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
        if(response.exist){
            console.log('<div class="form-error">Email ID already exists</div>')
            // $emailAlert.innerHTML = '<div class="form-error">Email ID already exists</div>'
        }
        else if($password.value.length < 8){
            console.log('<div class="form-error">Password should be atleast 8 characters long</div>')
            // $passwordAlert.innerHTML = '<div class="form-error">Password should be atleast 8 characters long</div>'
        }
        else if($password.value !== $confirmPassword.value){
            console.log('<div class="form-error">Password and confirm password should have same value</div>')
            // $passwordAlert.innerHTML = '<div class="form-error">Password and confirm password should have same value</div>'
        }
        else $form.submit()
    })
})