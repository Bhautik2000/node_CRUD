const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/employees2', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);  // wrning aavti hate te solve karva mate (findoneAndupdate and findOneAndDelete)
const db = mongoose.connection;

const uplodeSchema = new mongoose.Schema({
  imagename:String,
});
   
// create Model

let uplodeModel = mongoose.model('uplodeimage',uplodeSchema); // employee name nu tabel bane

module.exports = uplodeModel;

