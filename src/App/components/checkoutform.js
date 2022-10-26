import CardSection from "./cardSection";
import {useState, useContext} from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { SiteContext } from "../../utils/context";
import upperCaser from "../../utils/uppercaser";

function CheckoutPage(props) {
  const ctx = useContext(SiteContext);
  const currentUser = ctx.currentUser[0];
  const [cart, setCart] = props.cart;
  const [subtotal, setSubTotal] = props.subtotal;
  const [data, setData] = useState({
    address: "",
    city: "",
    state: "",
    stripe_id: "",
  });
  const [error, setError] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  function onChange(e) {
    const updateItem = (data[e.target.name] = e.target.value);
    setData({...data, updateItem});
  }

  async function submitOrder() {
    const cardElement = elements.getElement(CardElement);
    const API_URL = 'http://localhost:5000';
    const token = await stripe.createToken(cardElement);
    const body = {
      amount: subtotal,
      dishes: cart,
      address: data.address,
      city: data.city,
      state: data.state,
      token: token.token.id,
      user: currentUser
    }
    window.alert('Payment Successful!');
    setCart([]);
    setSubTotal(0);
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error(response.statusText)
    };
  }

  const CartItem = (props) => {
    return (
      <div key={props.item.item} className='cart-item checkout-item'>
        <div className="item-name">{upperCaser(props.item.item)}</div>
        <div className="item-price">${props.item.price}</div>
        <div className="item-quantity">x{props.item.quantity}</div>
      </div>
    )
  }

  function mapOrderItems() {
    return (<div className="cart-checkout">

      {cart.map(item => {
        return <CartItem item={item} />
      })}
      <div>Subtotal: ${subtotal}</div>
      </div>
      ) 
  }

  return (

    <div className="paper">
      {mapOrderItems()}
      <div style={{width: '50%', borderLeft: '5px solid'}}>
        <h5>Your information:</h5>
        <div style={{display: 'grid', gridTemplate: '3 / 4', paddingLeft: '10%'}}>
        <FormGroup>
          <div style={{ flex: "4"}}>
            <Label>Address</Label><br/>
            <Input name="address" onChange={onChange} />
          </div>
        </FormGroup>
        <FormGroup style={{display: 'flex', flexDirection: 'row'}}>
          <div style={{ flex: "1"}}>
            <Label>City</Label><br />
            <Input name="city" onChange={onChange} />
          </div>
          <div style={{ flex: "1", marginRight: 0 }}>
            <Label>State</Label><br />
            <Input name="state" onChange={onChange} />
          </div>
        </FormGroup>
          <CardSection data={data} stripeError={error} submitOrder={submitOrder}/>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;