let express = require("express");
const app = express();
const multer = require('multer'); // for img or file uplode
const path = require('path'); // also for img or file uplode
const bodyParser = require("body-parser");
let empModel = require("./modules/employee_schema");
let uplodeModel = require("./modules/uplodeFile");

let employee = empModel.find({}); // arr male

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    employee.exec((err, data) => {
        if (err) throw err
        res.render('index', { title: 'Employee Record', records: data , success: '' });
    })
});

app.post('/employee', (req, res) => {

    let empDetalis = new empModel({
        name: req.body.name,
        email: req.body.email,
        etype: req.body.EmpType,
        hourlyrate: req.body.hourlyrate,
        totalHour: req.body.totalHr
    });

    // for save value in data base
    empDetalis.save((err, res1) => {  // uper post ma res use kar u hova thi 2nd time same use na thai so res1 use kar u
        if (err) throw err;
        // res1 ye database ma value save thai tayre je res male te aa res1 ch
        employee.exec((err, data) => {
            if (err) throw err
            res.render('index', { title: 'Employee Record', records: data ,success: 'Record Insert Successfully' }); // aahi res ch te post req no res ch empDetalis no nahi
        });
    });

    // console.log(empDetalis);
});

app.post('/filter', (req, res) => {

    let fltrName = req.body.name;
    let fltrEmail = req.body.email;

    if (fltrName != '' && fltrEmail != '') {
        var filterPara = {
            $and: [
                { name: fltrName },
                { email: fltrEmail }
            ]
        }
    }
    else if (fltrName != '' && fltrEmail == '') {
        var filterPara = {
            $or: [
                { name: fltrName },
                { email: fltrEmail }
            ]
        }
    }
    else if (fltrName == '' && fltrEmail != '') {
        var filterPara = {
            $or: [
                { name: fltrName },
                { email: fltrEmail }
            ]
        }
    }
    else{ 
        var filterPara = {}
    }

    let employeeFilter = empModel.find(filterPara);

    employeeFilter.exec((err, data) => {

        if (err) throw err
        res.render('index', { title: 'Employee Record', records: data, success: ''});
    });
});

app.get('/delete/:id',(req,res)=>{

    var id = req.params.id;
    var del = empModel.findByIdAndDelete(id);

    del.exec((err) => {
        if (err) throw err
        employee.exec((err, data) => {
            if (err) throw err
            res.render('index', { title: 'Employee Record', records: data ,success: 'Record Delete Successfully' }); // aahi res ch te post req no res ch empDetalis no nahi
        });
    });
});

app.get('/edit/:id', function (req, res) {
    var id = req.params.id;
    var edit = empModel.findById(id);
    edit.exec((err, data) => {
        if (err) throw err
        res.render('edit', { title: 'Edit Record', records: data });
    })
});

app.post('/update', function (req, res) {
    var id = req.body.id; // form ma hidden id ch tethi te form mathi aave so req.body lakhavu pade req.params url mathi aave to lakhavu
    var update = empModel.findByIdAndUpdate(id,{
        name: req.body.name,
        email: req.body.email,
        etype: req.body.EmpType,
        hourlyrate: req.body.hourlyrate,
        totalHour: req.body.totalHr
    });
    update.exec((err, data) => {
        if (err) throw err
        // res.redirect('/');
        employee.exec((err, data) => {
            if (err) throw err
            res.render('index', { title: 'Employee Record', records: data , success: 'Record Update Successfully' });
        })
    })
});

// ******************************* File Uplode ***************************** 
// khali img file j nahi parantu bathi file uplode kari sakai
app.use(express.static('public'));
let uplodeData = uplodeModel.find({}); // data base mathi value featch karva mate 
var Storage = multer.diskStorage({  // img or other file mate tamporary local storage banave
    destination:"./public/uploads/", // je jagya per uplode karvanu hoi te
    filename:(req,file,cb)=>{ // cb =call back function
        // extantion mate :- extname(file.originalname) je automatic file extanstion gotiaape
        //  date.now ye multipal user aak sathe file uplode kare to file overright na thai and replace na thai te mate 
        // fieldname = imgFile (form ma je input fild nu name hoi te j)
        cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname));  
    }
});

var uplode_medalwere = multer({
    storage:Storage
}).single('imgFile'); //form ma je input nu name hoi te aahi te name imgFile ch

// get and post bane method ma uplodeData.exec function run karvu becueses jayre page reclode thai tayre and 
// jayre data uplode kare tayre bane time data page per display karvana chh
app.get('/uplodeImg',(req,res)=>{
    uplodeData.exec((err,data)=>{
        if(err) throw err;
        res.render('img', { title: 'Uplode File',records:data , success:''});
    });
});

app.post('/uplodeImg',uplode_medalwere,(req,res)=>{
    var imageFile = req.file.filename;
    var success = req.file.filename + "uplode Successfully";

    // created images objects
    var imageDetails = new uplodeModel({
        imagename:imageFile,
    });
    // save in db
    imageDetails.save((err,data)=>{
        if(err) throw err;
        uplodeData.exec((err,data)=>{
            if(err) throw err;
            res.render('img', { title: 'Uplode File',records:data, success: success });
        });
        
    });
});

app.listen(2000, () => {
    console.log("Server stared at port 2000");
})