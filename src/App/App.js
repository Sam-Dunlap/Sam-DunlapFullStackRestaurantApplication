import './App.css';
import Navbar from './pages/nav.js';
import { Route, Routes, HashRouter } from 'react-router-dom';
import RestaurantsList from './pages/restaurants'
import Account from './pages/account'
import Home from './pages/home'
import {React, useState} from 'react';
import ResultsPopup from './components/results';
import {SiteContext} from '../utils/context';
import Checkout from './pages/checkout';

function App() {
  const [cartOpen, setCartOpen]         = useState(false);
  const [nameResults, setNameResults]   = useState([]);
  const [styleResults, setStyleResults] = useState([]);
  const [dishResults, setDishResults]   = useState([]);
  const [focus, setFocus]               = useState(false);
  const [currentUser, setCurrentUser]   = useState({'name' : 'Peebo Bryson', 'email' : 'guest@guest.guest', 'address' : '123 Main St.', 'theme' : 'light'});
  const [loggedIn, setLoggedIn]         = useState(false);
  const [theme, setTheme]               = useState('light');
  const [cart, setCart]                 = useState([]);
  const [subtotal, setSubTotal]         = useState(0);
  const [chosenRestaurant, setChosenRestaurant] = useState(null);

  const guest = {
    'name' : 'Peebo Bryson',
    'email' : 'guest@guest.guest'
  }

  function addToCart(e) {
    const item = e.target.id;
    const restaurant = e.target.attributes.restaurant.value;
    const price = e.target.attributes.price.value;
    function isDupe(item1, cart) {
      return cart.find(el => item1.item === el.item && item1.restaurant === el.restaurant);
    };
    const order = {'item' : item, 'restaurant' : restaurant};
    const dupe = isDupe(order, cart);
    if (!dupe) {
      setCart([...cart, {'restaurant' : restaurant, 'item' : item, 'price' : price, 'quantity' : 1}])
    } else {
      dupe.quantity += 1;
      setCart([...cart]);
    }
    if (!document.getElementById('shopping-cart').classList.contains('open')) {
      document.getElementById('shopping-cart').classList.add('open');
    }
    setFocus(false);
    setCartOpen(true);
  }


  async function search(e) {
    setFocus(true);
    if (e.target.value.length === 0) {
      setFocus(false);
    }
    e.preventDefault();
    const response = await fetch('http://localhost:5000/restaurants');
    if (!response.ok) {
      const message = `An error occurred ${response.statusText}.`
      window.alert(message);
      return;
    }

    const records = await response.json();
    const nameResults  = await records.filter(result => result.name.includes(e.target.value.toLowerCase()) && e.target.value.length > 0);
    const styleResults = await records.filter(result => result.style.includes(e.target.value.toLowerCase()) && e.target.value.length > 0);
    let dishResults = [];

    await records.forEach(restaurant => {
      const dishes = restaurant.menu.filter(dish => dish.name.includes(e.target.value.toLowerCase()) && e.target.value.length > 0);
      if (dishes.length > 0) {
        dishResults.push({'dishes' : dishes, 'restaurant' : restaurant});
      }
    })

    setNameResults(nameResults);
    setStyleResults(styleResults);
    setDishResults(dishResults);

  }
  return (
    <div className="App">
      <HashRouter>
        <SiteContext.Provider value={{
          restaurant  : [chosenRestaurant, setChosenRestaurant],
          guest       : guest,
          currentUser : [currentUser, setCurrentUser],
          login       : [loggedIn, setLoggedIn],
          theme       : [theme, setTheme]
          }}>
          <Navbar key="nav" search={search} cart={[cart, setCart]} cartState={[cartOpen, setCartOpen]} subtotal={[subtotal, setSubTotal]}/>
          <ResultsPopup focus={[focus, setFocus]} nameResults={nameResults} styleResults={styleResults} dishResults={dishResults} addToCart={addToCart} chosenRestaurant={[chosenRestaurant, setChosenRestaurant]} />
          <Routes>
            <Route exact path='/' element={<Home />}/>
            <Route path='/restaurants' element={<RestaurantsList cart={[cart, setCart]} addToCart={addToCart}/>}/>
            <Route path='/account' element={<Account />}/>
            <Route path='/checkout' element={<Checkout cart={[cart, setCart]} subtotal={[subtotal, setSubTotal]} />} />
          </Routes>
        </SiteContext.Provider>
      </HashRouter>
    </div>
  );
}

export default App;
