import Pill from '../components/navitem';
import React from 'react';
import Searchbar from '../components/search';
import { SiteContext } from '../../utils/context';
import cartImg from '../styles/cart.png';
import Cart from './cart';

function Navbar(props) {
  const ctx = React.useContext(SiteContext);
  const [loggedIn, setLoggedIn]       = ctx.login;
  const [currentUser, setCurrentUser] = ctx.currentUser;
  const [cartOpen, setCartOpen]       = props.cartState;
  const search          = props.search;

  function handleShopClick() {
    const cartLogo = document.getElementById('shopping-cart');
    cartLogo.classList.toggle('open');
    setCartOpen(!cartOpen);
  }

  return (
    <div className="navbar">
      <div className='nav-links'>
        <Pill name='Home' link='#/' />
        <Pill name='Restaurants' link='#/restaurants' />
        <Pill name={loggedIn ? 'Account' : 'Log In'} link='#/account' />
      </div>
        <div className='cart-and-search'>
          <div id='shopping-cart' className='shopping-cart' onClick={handleShopClick}>
            <img className='shopping-cart-img' src={cartImg} alt='Shopping Cart'></img>
          </div>
          {cartOpen && <Cart cartstate={props.cartState} cart={props.cart} subtotal={props.subtotal}/>}
          <Searchbar key="searchbar" search={search} />
        </div>
        <span className='welcome-message'>Welcome, {currentUser.name}</span>
    </div>
  )
}

export default Navbar;
