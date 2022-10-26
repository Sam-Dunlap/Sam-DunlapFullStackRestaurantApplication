import React, { useContext } from "react";
import { Row, Col } from "reactstrap";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/checkoutform";


function Checkout(props) {
  
  
  // load stripe to inject into elements components
  const stripePromise = loadStripe(
    "pk_test_51LwfvEIwp745RsYtdnyGaLB99geRnK50oWmQfGVWAOP43iJGTi4fixii66FTZm6oM8ZiPFqvwA8iXgUpamhjctxl00XStr4z5D"
  );

  return (
    <Row>
      <Col style={{ paddingLeft: 5 }} sm={{ size: 6, order: 2 }}>
        <Elements stripe={stripePromise}>
          <CheckoutForm cart={props.cart} subtotal={props.subtotal} />
        </Elements>
      </Col>
    </Row>
  );
  // }
}
export default Checkout;
