'use strict';
const connectToDatabase = require('./db');
const Card = require('./models/Card');
const DBCard = require('./models/DBCard');
const sets = require('./AllSets.json')
const querystring = require('querystring');
require('dotenv').config({ path: './variables.env' });

//CREATE ONE CARD
module.exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Card.create(JSON.parse(event.body))
        .then(card => callback(null, {
          statusCode: 200,
          body: JSON.stringify(card)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not create the card.'
        }));
    });
};

//POPULATE DB
module.exports.populate = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let cards = []
  let set = event.pathParameters.set
  connectToDatabase()
    .then(() => {
      for (let card in sets[set]['cards']) {
        sets[set]['cards'][card].expansion = 'DOM'
        cards.push(sets[set]['cards'][card])
      }
      DBCard.create(cards)
        .then(card => callback(null, {
          statusCode: 200,
          body: JSON.stringify(cards)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not create the card.'
        }));
    });
};

//GET ONE CARD WITH {ID}
module.exports.getOne = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Card.findById(event.pathParameters.id)
        .then(card => callback(null, {
          statusCode: 200,
          body: JSON.stringify(card)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the card.'
        }));
    });
};

module.exports.getDBCards = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      let options = event.queryStringParameters && event.queryStringParameters.page ? {page: event.queryStringParameters.page} : {page: 1}
      let query = event.queryStringParameters && event.queryStringParameters.cardName ? { name: new RegExp('^'+ event.queryStringParameters.cardName +'$', "i") } : {}
      DBCard.paginate(query, options)
        .then(cards => callback(null, {
          statusCode: 200,
          body: JSON.stringify(cards)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the cards.'
        }))
    });
}; 

module.exports.getAll = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      let page = event.queryStringParameters !== null ? event.queryStringParameters.page : 1
      Card.paginate({}, {page: page})
        .then(cards => callback(null, {
          statusCode: 200,
          body: JSON.stringify(cards)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the cards.'
        }))
    });
};

module.exports.update = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Card.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), { new: true })
        .then(card => callback(null, {
          statusCode: 200,
          body: JSON.stringify(card)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the cards.'
        }));
    });
};

module.exports.delete = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Card.findByIdAndRemove(event.pathParameters.id)
        .then(card => callback(null, {
          statusCode: 200,
          body: JSON.stringify({ message: 'Removed card with id: ' + card._id, card: card })
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the cards.'
        }));
    });
};