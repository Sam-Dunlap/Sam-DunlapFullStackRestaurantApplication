import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { SiteContext } from '../../utils/context';

function Account() {

  const ctx = React.useContext(SiteContext);
  const [currentUser, setCurrentUser] = ctx.currentUser;
  const [loggedIn, setLoggedIn]       = ctx.login;
  const defaultUser                   = ctx.guest; 
  function passwordToggle(e) {
    const id = e.target.id.slice(7);
    var pswField = document.getElementById(id);
    if (pswField.type === 'password') {
      pswField.type = 'text';
      return;
    }
    pswField.type = 'password';
  }
  async function register(e) {
    e.preventDefault();
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, e.target.elements.email.value, e.target.elements.password.value)
      .then(async (userCredential) => {
        const user = userCredential.user;
        setLoggedIn(true);
        setCurrentUser({
          'uid' : user.uid,
          'name' : e.target.elements.name.value,
          'email' : e.target.elements.email.value
        })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`Error ${errorCode}: ${errorMessage}`);
      })

  };

  function googleLogin() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const userGoogle = result.user;
        setLoggedIn(true);
        setCurrentUser({
          'uid' : userGoogle.uid,
          'name' : userGoogle.displayName,
          'email' : userGoogle.email
        })
        // writeNewUser(userGoogle.uid, userGoogle.displayName, userGoogle.email);
        
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      })
  }

  async function writeNewUser(uid, name, email) {
    const url = `http://localhost:5000/Accounts/${name}/${uid}/light`;
    await fetch(url, {method: 'POST'});
    console.log('successfully wrote user')
    setLoggedIn(true);
    setCurrentUser({
      'uid' : uid,
      'name' : name,
      'email' : email
    })
  }


  function logIn(e) {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, e.target.elements.email.value, e.target.elements.password.value)
      .then(async (userCredential) => {
        const userGoogle = userCredential.user;
        const url = `http://localhost:5000/Accounts/${userGoogle.uid}`;
        const response = await fetch(url);
        const jsonResponse = await response.json();
        const user = {
          'uid' : userGoogle.uid,
          'name' : jsonResponse.name,
          'email' : userGoogle.email
          // add saved addresses, theme preference, etc
        }
        setLoggedIn(true);
        setCurrentUser(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`Error ${errorCode}: ${errorMessage}`);
      })
  };

  function logOut() {
    setLoggedIn(false);
    setCurrentUser(defaultUser);
  }


  return (
    <div className="page account-page">
      {loggedIn ? <div>lorem ipsum etc</div> : <div className="account-box">
      <label className="account-label" htmlFor='register'>New User</label>
      <hr />
      <form onSubmit={register} className='form account-form' key='register' id='register'>
        <label className="account-label" htmlFor="name">Name</label>
        <input type="text" key="name" name="name" placeholder="What should we call you?"/>
        <label className="account-label" htmlFor="email">Email</label>
        <input type="text" key="email" name="email" placeholder="How can we reach you?"/>
        <label className="account-label" htmlFor="password">Password</label>
        <input type="password" id="password" key="password" name="password" placeholder="Secure your account."/>
        <label className="account-label" htmlFor='psw-toggle'>Show Password</label>
        <input type='checkbox' name='psw-toggle' id="toggle-password" onClick={passwordToggle}/>
        <input type="submit"/>
      </form>
      </div>}
      {loggedIn ? <div></div> : <div className="account-button" onClick={googleLogin}>Log In With Google</div>}
      {loggedIn ? <div className="account-button" onClick={logOut}>Log Out</div> : <div className="account-box">
      <label className="account-label" htmlFor='login'>Returning User</label>
      <hr />
      <form onSubmit={logIn} className='form account-form' key='login'>
        <label className="account-label" htmlFor="email">Email</label>
        <input type="text" key="email" name="email" placeholder="How can we reach you?"/>
        <label className="account-label" htmlFor="password">Password</label>
        <input type="password" id="password-login" key="password" name="password" placeholder="Secure your account."/>
        <label className="account-label" htmlFor='psw-toggle'>Show Password</label>
        <input type='checkbox' name='psw-toggle' id="toggle-password-login" onClick={passwordToggle}/>
        <input type='submit'/>
      </form>
      </div>}
    </div>
  )
}

export default Account;