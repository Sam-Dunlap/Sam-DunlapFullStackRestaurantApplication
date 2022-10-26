import React, { useEffect, useState } from 'react';
import Restaurant from '../components/restaurant';
import upperCaser from '../../utils/uppercaser';
import { SiteContext } from '../../utils/context'

function RestaurantsList(props) {
  const ctx = React.useContext(SiteContext);
  const [chosenRestaurant, setChosenRestaurant] = ctx.restaurant;
  async function handleRestaurantClick(e) {
    console.log(e.target);
    const response = await fetch(`http://localhost:5000/restaurants/${e.target.id}`);

    if (!response.ok) {
      const message = `An error occurred ${response.statusText}`;
      window.alert(message);
      return;
    };

    const restaurant = await response.json()
    setChosenRestaurant(restaurant);
  };

  function RestaurantEntry(props){
    const name = upperCaser(props.record.name);
    const style = upperCaser(props.record.style);
    return (
    <div className='restaurant' onClick={handleRestaurantClick} key={props.record._id} id={props.record._id}>
        <span style={{fontWeight: '500', fontSize: '110%'}}>{name}</span>
        <span style={{fontStyle: 'oblique', fontSize: '90%'}}>{style}</span>
    </div>
    )
  };

  function makeList() {
    return records.map((record) => {
      return (
        <RestaurantEntry key={record._id}
          record={record}
        />
      )
    })
  }

  const [records, setRecords] = useState([]);
  useEffect(() => {
    async function getRecords() {

      const response = await fetch('http://localhost:5000/restaurants');

      if (!response.ok) {
        const message = `An error occurred ${response.statusText}`;
        window.alert(message);
        return;
      };

      const records = await response.json();
      setRecords(records);
      
    };

    getRecords();

    return;
  }, [records.length]);


  return (
    <div className='page restaurant-page'>
      <div className='restaurant-list'>
        {makeList()}
      </div>
      {chosenRestaurant ? <Restaurant addToCart={props.addToCart} restaurant={chosenRestaurant}/> : <div><span>EAT</span></div>}
    </div>
  )
}

export default RestaurantsList;