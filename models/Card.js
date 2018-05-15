const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const CardSchema = new mongoose.Schema({
  artist: String,
  colorIdentity: Array,
  expansion: String,
  price: String,
  foil: String,
  rarity: String,
  amount: String,
  cmc: String,
  type: String,
  colors: Array,
  manaCost: String,
  multiverseid: String,
  name: String,
  number: String,
  power: String,
  subtypes: Array,
  text: String,
  toughness: String,
  types: Array,
  flavor: String,
  userId: String
});
CardSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Card', CardSchema);
