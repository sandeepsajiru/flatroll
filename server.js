var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

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
    paymentItems:'string',
    paymentTypes:'string',
    id:'string',
    idEditorEnabled: 'string',
    receiptId: 'string',
    receiptIdEditorEnabled: 'string',
    amount: 'string',
    amountEditorEnabled: 'string',
    date: 'string',
    dateEditorEnabled: 'string',
    paymentMode: 'string',
    paymentTyp: 'string',
    remarks: 'string',
    remarksEditorEnabled: 'string',
    received: 'string',
    receivedEditorEnabled: 'string'    
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

app.put('/flat/:id',(function(req,res){
  flats.findOne({ _id: req.params.id }, function(err, flat) {
    if (err) {
      return res.send(err);
    }

    for (prop in req.body) {
      flat[prop] = req.body[prop];
    }

    // save the flat
    flat.save(function(err) {
      if (err) {
        return res.send(err);
      }

      res.json({ message: 'flat updated!' });
    });
  });
}));    

app.put('/owner/:id',(function(req,res){
  owners.findOne({ _id: req.params.id }, function(err, owner) {
    if (err) {
      return res.send(err);
    }

    for (prop in req.body) {
      owner[prop] = req.body[prop];
    }

    // save the flat
    owner.save(function(err) {
      if (err) {
        return res.send(err);
      }

      res.json({ message: 'owner updated!' });
    });
  });
}));         

app.put('/tenant/:id',(function(req,res){
	
	/*
	tenants.findAndModify({ _id: req.params.id }, function(err, tenant)
		{
			if (err) {
				return res.send(err);
			}
			res.json({ message: 'tenant updated!' });
		});
	*/
	console.log('Req_ID: '+req.params.id);
	tenants.findOne({ _id: req.params.id }, function(err, tenant) {
    if (err) {
      return res.send(err);
    }

    for (prop in req.body) {
      tenant[prop] = req.body[prop];
	  console.log(req.body[prop]);
    }

    // save the tenant
    tenant.save(function(err) {
      if (err) {
		  console.log(err);
        return res.send(err);
      }

      res.json({ message: 'tenant updated!' });
    });
  });
  
})); 
    
app.post('/',function(req, res){

		var Receipt = new receipts({
        paymentItems : req.body.paymentItems,
        paymentTypes : req.body.paymentTypes,
        id : req.body.id,
        idEditorEnabled  : req.body.idEditorEnabled ,
        receiptId : req.body.receiptId ,
        receiptIdEditorEnabled : req.body.receiptIdEditorEnabled ,
        amount : req.body.amount ,
        amountEditorEnabled : req.body.amountEditorEnabled ,
        date : req.body.date ,
        dateEditorEnabled : req.body.dateEditorEnabled ,
        paymentMode: req.body.paymentMode,
        paymentTyp: req.body.paymentTyp,
        remarks: req.body.remarks ,
        remarksEditorEnabled: req.body.remarksEditorEnabled ,
        received: req.body.received ,
        receivedEditorEnabled: req.body.receivedEditorEnabled
        });
		Receipt.save(function(err, Receipt) {
			if (err){
				return res.send(500, err);
			}
			return res.json(Receipt);
		});
        console.log(Receipt)
	});

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
    console.log('Got Get Call');
    flats.find({}, function (err, docs) {
        res.json({ docs: docs });
    });
});

app.get('/receiptDetails', function (req, res) {
    console.log('Got Get Call');
    receipts.find({}, function (err, docs) {
        res.json({ docs: docs });
    });
});


app.get('/tenants', function (req, res) {
    res.sendFile(__dirname + '/dashboard.html');
});

app.get('/owners', function (req, res) {
    res.sendFile(__dirname + '/dashboard.html');
});

app.get('/flats', function (req, res) {
    res.sendFile(__dirname + '/dashboard.html');
});

app.get('/receipts', function (req, res) {
    res.sendFile(__dirname + '/receipts.html');
});

app.get('/dashboard', function (req, res) {
    res.sendFile(__dirname + '/dashboard.html');
});

});