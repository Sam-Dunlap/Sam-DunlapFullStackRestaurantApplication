import upperCaser from "../../utils/uppercaser";

export default function ResultsPopup(props) {
  const [chosenRestaurant, setChosenRestaurant] = props.chosenRestaurant;
  const [focus, setFocus]                        = props.focus;

  async function handleRestaurantClick(e) {
    const response = await fetch(`http://localhost:5000/restaurants/${e.target.id}`);

    if (!response.ok) {
      const message = `An error occurred ${response.statusText}`;
      window.alert(message);
      return;
    };
    window.location.href = '#/restaurants';
    const restaurant = await response.json();
    setChosenRestaurant(restaurant);
    setFocus(false);
  };

  const resultsTotal = props.nameResults.concat(props.styleResults).concat(props.dishResults);
  function mapDishes(dishResults) {
    return (
    <div>
      {dishResults.map(result => <div className='dish-result'><span className="dish-origin">{upperCaser(result.restaurant.name)}</span>{result.dishes.map(dish => <div className="cart-item" id={dish.name} restaurant={result.restaurant.name} price={dish.price} onClick={props.addToCart}><div className="item-name">{upperCaser(dish.name)}</div><div className="item-price">${dish.price}.00</div></div>)}</div>)}
    </div>
    )
  };

  if (!focus) return null;

  if (resultsTotal.length == 0) {
    return (
      <div className="results-popup">Nothing to see here . . .</div>
    )
  }
  return (
    <div className="results-popup">
      <div className="results-title">Search Results</div>
      <div className="name-results">
        <span>Restaurant Results</span>
        {props.nameResults.map(item => <div className="cart-item" id={item._id} onClick={handleRestaurantClick} key={item._id}><span className="item-name">{upperCaser(item.name)}</span><span className="item-origin">{upperCaser(item.style)}</span></div>)}
      </div>
      <hr style={{width: '90%'}} />
      <div className="style-results">
        <span>Cuisine Results</span>
        {props.styleResults.map(item => <div className="cart-item" id={item._id} onClick={handleRestaurantClick} key={item._id}><span className="item-name">{upperCaser(item.style)}</span><span className="item-origin">{upperCaser(item.name)}</span></div>)}
      </div>
      <hr style={{width: '90%'}} />
      <div className="dish-results">
        <span>Dish Results</span>
        {mapDishes(props.dishResults)}
      </div>
    </div>
  )
}