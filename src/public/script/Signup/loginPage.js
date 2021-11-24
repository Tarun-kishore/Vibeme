// password show feature for both signin and signup page
const togglePassword1 = document.querySelector(".Box1 #togglePassword");
const password1 = document.querySelector(".Box1 #exampleInputPassword1");
const togglePassword2 = document.querySelector(".Box2 #togglePassword");
const password2 = document.querySelector(".Box2 #exampleInputPassword2");

togglePassword1.addEventListener('click', function(e) {
  if(password1.type === "password")
    {
      password1.type = "text";
      togglePassword1.classList.remove("fa-eye-slash");
      togglePassword1.classList.add("fa-eye");
    }
  else
    {
      password1.type = "password";
      togglePassword1.classList.remove("fa-eye");
      togglePassword1.classList.add("fa-eye-slash");
    }
});

togglePassword2.addEventListener('click', function(e) {
  if(password2.type === "password")
    {
      password2.type = "text";
      togglePassword2.classList.remove("fa-eye-slash");
      togglePassword2.classList.add("fa-eye");
    }
  else
    {
      password2.type = "password";
      togglePassword2.classList.remove("fa-eye");
      togglePassword2.classList.add("fa-eye-slash");
    }
});

// animation during clicking signin and signup options on top right of boxes
var backgroundPhoto = document.querySelector(".bg-image");
var loginBox = document.querySelector(".Box1");
var signupBox = document.querySelector(".Box2");
var signIn = loginBox.querySelector(".No-Account .SignUp-changer");
var signUp = signupBox.querySelector(".No-Account .SignIn-changer");
var navbarContent = document.querySelector("#navbarContent");

signIn.addEventListener('click', function(e) {
  loginBox.querySelector('form').reset();
  loginBox.querySelector('form #exampleInputEmail1').value = null;
  if(loginBox.querySelector('#InvalidAlert')){
      loginBox.querySelector('#InvalidAlert').classList.add('Invisible');
  }

  loginBox.classList.remove("animate__fadeIn");
  loginBox.classList.toggle("animate__fadeOut");
  setTimeout(function() {
    loginBox.classList.toggle("Invisible");
  },300);
  setTimeout(function() {
    backgroundPhoto.classList.toggle("animate__flip");
  },150);
  setTimeout(function() {
    document.querySelector("main").classList.toggle("SignUpMain");
    backgroundPhoto.style.transform = "scaleX(-1)";
  }, 300);
  setTimeout(function() {
    navbarContent.innerText = "Sign up";
    signupBox.style.opacity = "0";
    signupBox.classList.toggle("animate__fadeIn");
    signupBox.style.removeProperty("opacity");
    signupBox.classList.toggle("Invisible");
    loginBox.classList.remove("animate__fadeOut");
  }, 550);
});

signUp.addEventListener('click', function(e) {
  signupBox.querySelector('form').reset();
  signupBox.querySelector('#emailAlert').classList.add('Invisible');
  signupBox.querySelector('#passAlert').classList.add('Invisible');
  signupBox.classList.remove("animate__fadeIn");
  signupBox.classList.toggle("animate__fadeOut");
  backgroundPhoto.classList.toggle("animate__flip");
  setTimeout(function() {
    signupBox.classList.toggle("Invisible");
  }, 300);
  setTimeout(function() {
    backgroundPhoto.classList.toggle("animate__flip2");
  },150);
  setTimeout(function() {
    document.querySelector("main").classList.toggle("SignUpMain");
    backgroundPhoto.style.transform = "scaleX(1)";
  }, 300);
  setTimeout(function() {
    navbarContent.innerText = "Sign in";
    loginBox.style.opacity = "0";
    loginBox.classList.toggle("animate__fadeIn");
    loginBox.style.removeProperty("opacity");
    loginBox.classList.toggle("Invisible");
    signupBox.classList.remove("animate__fadeOut");
  }, 550);
});

// adding feature to see which alert has come
const emailAlert = document.querySelector('#emailAlert');
const passwordAlert = document.querySelector('#passAlert');
const invalidAlert = document.querySelector("#InvalidAlert");

emailAlert.querySelector("i").addEventListener('click', function() {
  emailAlert.querySelector("p").classList.remove("Invisible");
  setTimeout(function() {
    emailAlert.querySelector("p").classList.add("Invisible");
  }, 5000);
});
passwordAlert.querySelector("i").addEventListener('click', function() {
  passwordAlert.querySelector("p").classList.remove("Invisible");
  setTimeout(function() {
    passwordAlert.querySelector("p").classList.add("Invisible");
  }, 5000);
});

if(invalidAlert)
{
  invalidAlert.querySelector("i").addEventListener('click', function() {
  invalidAlert.querySelector("p").classList.remove("Invisible");
  setTimeout(function() {
    invalidAlert.querySelector("p").classList.add("Invisible");
  }, 5000);
});
}