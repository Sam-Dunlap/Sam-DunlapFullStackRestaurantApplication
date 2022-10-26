import upperCaser from "../../utils/uppercaser"

function Restaurant(props) {
  function makeMenu(restaurant) {
    return restaurant.menu.map(item => {
      return (
        <div className='menu-item' key={item.name} id={item.name} onClick={props.addToCart} price={item.price} restaurant={restaurant.name}>
          <span>{upperCaser(item.name)}</span>
          <span>{` $${item.price}`}</span>
        </div>
      )
    })
  }
  return (
  <div className="menu-and-title">
    <div className="menu">
      {makeMenu(props.restaurant)}
    </div>
    <span className="restaurant-name">{upperCaser(props.restaurant.name)}</span>
  </div>
  )
}

export default Restaurant