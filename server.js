var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

// Mongoose import

var mongoose = require('mongoose');

// Mongoose connection to MongoDB 

mongoose.connect('mongodb://localhost/flatroll', function (error) {
    if (error) {
        console.log(error);
    }

});

// Mongoose Schema definition

var Schema = mongoose.Schema;

var tenantSchema = new Schema(
{
    TENANT_ID: 'string',
    FIRST_NAME: 'string',
    MIDDLE_NAME: 'string',
    LAST_NAME: 'string',
    PHONE_NUMBERS: 'string',
    EMAIL_IDS: 'string',
    OCCUPATION: 'string',
    OCCUPATION_DETAILS: 'string',
    START_DATE: 'string',
    END_DATE: 'string',
    NOTES: 'string'
});

var ownerSchema = new Schema(
{
    OWNER_ID: 'string',
    FIRST_NAME: 'string',
    MIDDLE_NAME: 'string',
    LAST_NAME: 'string',
    ADDRESS: 'string',
    CITY: 'string',
    PHONE_NUMBERS: 'string',
    EMAIL_IDS: 'string',
    NOTES: 'string'
}
);

var flatSchema = new Schema(
{
    FLAT_NO: 'string',
    BLOCK_NUMBER: 'string',
    REGISTRATION_NUMBER: 'string',
    OWNERS: 'string',
    PROPERT_TAX_NUMBER: 'string',
    ELECTRICITY_SERVICE_NUMBER: 'string',
    SALE_DEED_DATE: 'string',
    KVAOA_MEMBERSHIP_PAID: 'string',
    CAR_PARKING_SLOTS: 'string',
    SCOOTER_PARKING_SLOTS: 'string'
});

var receiptsSchema = new Schema(
{
    id:'string',
    receiptId: 'string',
    amount: 'string',
    date: 'date',
    paymentMode: 'string',
    paymentTyp: 'string',
    remarks: 'string',
    received: 'string',
    isValid: 'Boolean'
});
// Mongoose Model definition


var tenants = mongoose.model('tenant', tenantSchema);

var owners = mongoose.model('owner', ownerSchema);

var flats = mongoose.model('flat', flatSchema);

var receipts = mongoose.model('receipt', receiptsSchema);

// Bootstrap express

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://localhost:%s", port)

// URLS management

app.post('/',function(req, res){

		var Receipt = new receipts({
        id : req.body.id,
        receiptId : req.body.receiptId ,
        amount : req.body.amount ,
        date : req.body.date ,
        paymentMode: req.body.paymentMode,
        paymentTyp: req.body.paymentTyp,
        remarks: req.body.remarks ,
        received: req.body.received,
        isValid: false
        });
		Receipt.save(function(err, Receipt) {
			if (err){
				return res.send(500, err);
			}
			return res.json(Receipt);
		});
        console.log(Receipt)
	})

app.get('/tenantDetails', function (req, res) {
    tenants.find({}, function (err, docs) {
        res.json({ docs: docs });
    });
});

app.get('/ownerDetails', function (req, res) {
    owners.find({}, function (err, docs) {
        res.json({ docs: docs });
    });
});

app.get('/flatDetails', function (req, res) {
    flats.find({}, function (err, docs) {
        res.json({ docs: docs });
    });
});

app.get('/receiptDetails', function (req, res) {
    receipts.find({}, function (err, docs) {
        res.json({ docs: docs });
    });
});


app.get('/dashboard', function (req, res) {
    res.sendFile(__dirname + '/dashboard.html');
});


});

app.get('/receipts', function (req, res) {
    res.sendFile(__dirname + '/receipts.html');
});

	