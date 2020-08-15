const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/employees2', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);  // wrning aavti hate te solve karva mate
const db = mongoose.connection;

const employeeSchema = new mongoose.Schema({
    name:String,
    email:String,
    etype:String,
    hourlyrate:Number,
    totalHour:Number,
});
   
// create Model

let employeeModel = mongoose.model('Employee',employeeSchema); // employee name nu tabel bane

module.exports = employeeModel;

