import {React, useEffect, useState} from "react";
import upperCaser from "../../utils/uppercaser";

function Cart(props) {
  const [cart, setCart] = props.cart;
  const [cartOpen, setCartOpen] = props.cartstate;
  const [subtotal, setSubTotal] = props.subtotal;

  function handleCheckout() {
    setCartOpen(false);
    document.getElementById('shopping-cart').classList.toggle('open');
    window.location.href = '#/checkout'
  }

  function handleCartChange(e) {
    const item = e.target.attributes.cartelement.value;
    const restaurant = e.target.attributes.restaurant.value;
    const alteredItem = cart.find(el => el.item == item && el.restaurant == restaurant);
    if (e.target.id === 'add') {
      alteredItem.quantity += 1;
    } else {
      if (alteredItem.quantity == 1) {
        cart.splice(cart.indexOf(alteredItem), 1);
      } else {
        alteredItem.quantity -= 1;
      }
    }
    setCart([...cart]);
  }

  useEffect(() => {
    let orderTotal = 0;
    cart.forEach(item => {
      orderTotal += (item.price * item.quantity);
    });
    setSubTotal(orderTotal);
  }, [cart]);

  const CartItem = (props) => {
    const name = upperCaser(props.item.item);
    const restaurant = upperCaser(props.item.restaurant);
    return (
      <div key={props.item.item} className='cart-item'>
        <div className="item-name">{name}</div>
        <div className="item-origin">{restaurant}</div>
        <div className="item-price">${props.item.price}</div>
        <div className="item-quantity">x{props.item.quantity}</div>
        <div className='button-container'>  
          <div className="quantity-adjust" onClick={handleCartChange} cartelement={props.item.item} restaurant={props.item.restaurant} id='add'>+</div>
          <div className="quantity-adjust" onClick={handleCartChange} cartelement={props.item.item} restaurant={props.item.restaurant} id='subtract'>-</div>
        </div>
      </div>
    )
  }

  function mapOrderItems() {
    if (cart.length > 0) {
      return cart.map(item => {
        return <CartItem item={item} />
      });
    };
    return (
      <div>There is nothing in your cart.</div>
    )
  }

  return (
    <div className="cart-popup">
      <div className="order">
        {mapOrderItems()}
      </div>
      <div className="subtotal-and-checkout">
        {subtotal > 0 && <div>Subtotal: ${subtotal}.00</div>}
        {cart.length > 0 && <div className="checkout-btn" onClick={handleCheckout}>Check Out</div>}
      </div>
    </div>
  )
}

export default Cart;