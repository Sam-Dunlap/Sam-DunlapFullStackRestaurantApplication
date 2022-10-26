const express = require('express');
const recordRoutes = express.Router();
const dbo = require('../db/conn');

const ObjectId = require('mongodb').ObjectId;

const stripe = require("stripe")('sk_test_51LwfvEIwp745RsYt7ByuNuROljFHixkrLZDmgL7Gy5OwtlGA2k2mHgfqZ8OXRcdLpem9l5fVLS314rvaIFyuNYUN00Sa0zxEXx');




//Returns a list of all restaurants present in the database. The restaurants are objects structured as
// {'name': name,
//  'style': (the type of cuisine),
//  'menu' : (the available items)}
recordRoutes.route('/restaurants').get(function (req, res) {
  let db_connect = dbo.getDb('Final');
  db_connect
    .collection('Restaurants')
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// returns a specific restaurant based on the given id. All the components which contain restaurant names
// on the website are given either a key or an id that matches the restaurant's database _id.
recordRoutes.route('/restaurants/:id').get(function(req, res) {
  let db_connect = dbo.getDb();
  let query = { _id : ObjectId(req.params.id) };
  db_connect
    .collection('Restaurants')
    .findOne(query, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// returns one user account based on their uid. uid is set by firebase and extracted and stored in Mongo along
// with other relevant user information.
recordRoutes.route('/accounts/:uid').get(function (req, res) {
  let db_connect = dbo.getDb();
  let query = { uid : req.params.uid }
  db_connect
    .collection('Accounts')
    .findOne(query, function (err, result) {
      if (err) throw err;
      res.json(result)
    });
});

// Posts a new user account to the database. :theme is the light/dark mode preference, which currently does nothing.
recordRoutes.route('/accounts/:name/:uid/:theme').post(function(req, res) {
  let db_connect = dbo.getDb();
  db_connect
    .collection('Accounts')
    .insertOne(
      {
        uid   : req.params.uid,
        name  : req.params.name,
        theme : req.params.theme
      }
    )
})

// Posts a pending order to Stripe for approval, then writes the contents of the order to Mongo.
recordRoutes.route('/orders').post(async function (req, res) {
  const stripeAmount = Math.floor(req.body.amount * 100);
  const charge = await stripe.charges.create({
    amount: stripeAmount,
    currency: 'usd',
    description: `Order ${new Date()} by ${req.body.user.name}`,
    source: 'tok_visa'
  });
  let db_connect = dbo.getDb();
  db_connect
    .collection('Orders')
    .insertOne(req.body);
})
module.exports = recordRoutes;