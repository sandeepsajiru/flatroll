var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var nodemailer = require('nodemailer');

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
    flatNo:'string',
    receiptId: 'string',
    amount: 'string',
    date: 'string',
    paymentMode: 'string',
    paymentTyp: 'string',
    remarks: 'string',
    received: 'string',
    year: 'string',
    months: ['string']    
});

var settingsSchema = new Schema(
    {
        ID:'string',
        MaintenanceReminderMailTemplate:'string',
        CustomFields:['string'],
        CreatedOn:Date
    });
// Mongoose Model definition


var tenants = mongoose.model('tenant', tenantSchema);

var owners = mongoose.model('owner', ownerSchema);

var flats = mongoose.model('flat', flatSchema);

var receipts = mongoose.model('receipt', receiptsSchema);

var settings = mongoose.model('setting', settingsSchema);

// Bootstrap express
// Bootstrap express
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
        flatNo : req.body.flatNo,
        receiptId : req.body.receiptId ,
        amount : req.body.amount ,
        date : req.body.date ,
        paymentMode: req.body.paymentMode,
        paymentTyp: req.body.paymentTyp,
        remarks: req.body.remarks ,
        received: req.body.received ,
	year: req.body.year ,
	months: req.body.months
        });
		Receipt.save(function(err, Receipt) {
			if (err){
				return res.send(500, err);
			}
			return res.json(Receipt);
		});
        console.log(Receipt)
	});    

//app.post('/postMailTemplate', functoin    

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
    
app.get('/settings',function(req,res){
    var m = [];
    var id = ['a'];
    var name = [];
   receipts.find({year : '2015'}, function(err, docs){
                        for(var i=0,j=0; i<docs.length;i++)
                        {
                            if(docs[i].year!=null)
                            {
                                m[j] =docs[i].flatNo;
                                //console.log(m.length);
                                //console.log(m[j]);
                                j++;
                                
                            }
                        }
       console.log('Entered');
       for(var i=0,j=0;i<m.length;i++)
    {
        flats.find({ FLAT_NO: m[i]}, function(err, docs){
            id.push(docs[i].OWNERS);
        });
        console.log('LENGTH OF ID ARRAY: '+id.length);
        j++;
    }
    for(var i=0;i<id.length;i++)
    {
        owners.find({ OWNER_ID: id[i]}, function(err, docs){
            name[i] = docs[i].LAST_NAME;
            mail[i] = docs[i].EMAIL_IDS;
            phone[i] = docs[i].PHONE_NUMBERS;
            console.log(name[i]);
        });
    }
   });
    
   
    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "samplebz1@gmail.com",
            pass: "beingzero"
        }
    });
     for(var i=0;i<name.length;i++)
    {
    var mailOptions = {
        from: name[i],
        to: "johnnikhil95@gmail.com", 
        subject: 'Test',
        text: 'message'
    }
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            res.redirect('/dashboard');
        }
    });
    }
});

/*    
var d = new Date();
var currMonth = d.getMonth();    
    
var dueStatus = new Array();
    
app.get('/monthlyStatus/:flatNumber/:year',function(req,res){
    receipts.find({
                flatNumber : req.params.flatNumber, 
                year : req.params.year,
                paymentTyp : "Maitenance"} ,
                  {
                months: 1,
                _id: 0
            })
            .toArray(function(err,results){
            console.log(results)
            // 1 for green, 0 for red, 2 for green .
            for(var i=0; i < results.length; i++)
            {
                dueStatus[result[i]] = 1;
            }
            for(var j=i; j < currMonth; j++)
            {
                dueStatus[j] = 0 ;
            }
            for(var k=currMonth; k < 12; k++ )
            {
                dueStatus[k] = 2 ;
            }
        res.json({ dueStatus: dueStatus }); 
});
});*/

var sortBy = require('sort-by');
//For sorting flat numbers.
    
    
app.get('/flatDetails', function (req, res) {
    console.log('Got Get Call');
    flats.find({}, function (err, docs) {
        res.json({  docs: docs.sort(sortBy('FLAT_NO')) });
    });
});

app.get('/email', function (req, res) {
    settings.find({}, function (err, docs) {
        res.json({  docs: docs });
    });
});   
    
app.get('/receiptDetails', function (req, res) {
    console.log('Got Get Call');
    receipts.find({}, function (err, docs) {
        res.json({ docs : docs });
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