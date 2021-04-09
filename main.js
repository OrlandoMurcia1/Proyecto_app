const loggedOutLinks = document.querySelectorAll('.logged-out')
const loggedInLinks = document.querySelectorAll('.logged-in')
const loginCheck = user =>{ 
    if (user){
        loggedInLinks.forEach(link => link.style.display = 'block');
        loggedOutLinks.forEach(link => link.style.display = 'none');
    }else{
        loggedInLinks.forEach(link => link.style.display = 'none');
        loggedOutLinks.forEach(link => link.style.display = 'block');
    }
}

//Sign Up 
const signupform = document.querySelector('#signup-form');
var SignUpModal = new bootstrap.Modal(document.getElementById('SignupModal'), {
    keyboard: true
})
var SignInModal = new bootstrap.Modal(document.getElementById('SignInModal'), {
    keyboard: true
})
signupform.addEventListener('submit', (e) => {
    e.preventDefault() // Se previene el comportamiento natural de html con los formularios

    const email = document.querySelector('#signup-email').value;
    const password = document.querySelector('#signup-password').value;

    auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            //Clear the form
            signupform.reset();

            //close the modal
            SignUpModal.hide();
            console.log("Signed up");
        })
        .catch(err => {
            alert(err)
        })
})

//Sign In
const signInform = document.querySelector('#login-form');

signInform.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;

    auth
        .signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            //Clear the form
            signInform.reset();
            //close the modal
            SignInModal.hide();
            console.log("Signed in");
        })
        .catch(err => {
            alert(err)
        })
})

const logout = document.querySelector('#logout');
logout.addEventListener('click', e => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('log-out')
    })
})

//Google login 
const googleButton = document.querySelector("#googleLogin")
googleButton.addEventListener('click', e => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => {
            //Clear the form
            signInform.reset();
            //close the modal
            SignInModal.hide();
            console.log('Google sign in')
        })
        .catch(err => {
            console.log(err)
        })
})
//Facebook login 
const facebookButton = document.querySelector("#facebookLogin")
facebookButton.addEventListener('click', e => {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => {
            //Clear the form
            signInform.reset();
            //close the modal
            SignInModal.hide();
            console.log('Facebook sign in')
        })
        .catch(err => {
            console.log(err)
        })
})

//Publicaciones
const postList = document.querySelector('.posts');
const setupPosts = data => {
    if (data.length) {
        let html = '';
        data.forEach(doc => {
            const post = doc.data()
            const li = `
            <div>
            <form onSubmit="return enviarMensaje()">
              LED:
              <select id="status" style="width:100px; height:30px">
                <option value=0>0</option>
                <option value=1>1</option>
              </select>
              <input type="submit" value="Enviar!">
            </form>
          </div>
            `;
            html += li;
        });
        postList.innerHTML = html;
    } else {
        postList.innerHTML = `<p class="text-center">Login to see Posts </p>       
    `;
    }
}

//eventos
//List for auth state changes
auth.onAuthStateChanged(user => {
    if (user) {
       
        fs.collection('posts')
            .get()
            .then((snapshot) => {
                setupPosts(snapshot.docs)
                ref.on('value', gotData, errData);
                loginCheck(user);
            })
    } else {
        setupPosts([])
        loginCheck(user);
    }

})

function enviarMensaje()
{
    var status=document.getElementById("status").value;
    db.ref("ControlVinedoIoT/Jardin/")
    .set({
        Luz_1: parseInt(status),
        Luz_2: parseInt(1)
    });
    return (false);
}


function gotData(data) {

    //console.log(data.val());
    const muestra_datos = document.querySelector('.scorelist');
    var datos = data.val();
    var keys = Object.keys(datos);
    console.log(keys);
    let html = '';
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var initials = datos[k];
        var dato = datos[k]

    }
    const li = `<li class ="list-group-item list-group-item-action">
                        <h5>${'Sensor de luz' + ': ' + dato['Luminosidad']}</h5> 
                        </li>`;
    html += li;
    muestra_datos.innerHTML = html;

}

function errData(data) {
    console.log('Error!'),
        console.log(err);
}