var express = require('express');

// Mongoose import

var mongoose = require('mongoose');

// Mongoose connection to MongoDB 

mongoose.connect('mongodb://localhost/flatroll', function (error)
 {
    if (error) 
	{
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
    ADDRESS:'string',
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

// Mongoose Model definition


var tenants = mongoose.model('tenant', tenantSchema);

var owners = mongoose.model('owner', ownerSchema);

var flats = mongoose.model('flat', flatSchema);

// Bootstrap express

var app = express();

// URLS management


app.get('/tenantDetails', function (req, res)
	 {    
		tenants.find({}, function (err, docs) 
		{
			res.json({docs:docs});
		});
});

app.get('/ownerDetails', function (req, res)
	 {    
		owners.find({}, function (err, docs) 
		{
			res.json({docs:docs});
		});
});

app.get('/flatDetails', function (req, res)
	 {    
		flats.find({}, function (err, docs) 
		{
			res.json({docs:docs});
		});
});


app.get('/tenants', function(req, res)
	{
		res.sendFile(__dirname+'/sample1.html');
	});

app.get('/owners', function(req, res)
	{
		res.sendFile(__dirname+'/sample2.html');
	});

app.get('/flats', function(req, res)
	{
		res.sendFile(__dirname+'/sample3.html');
	});

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://locahost:%s", port)

})