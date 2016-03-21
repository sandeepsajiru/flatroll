var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var nodemailer = require('nodemailer');
var prototypes = require('prototypes');
var bcrypt = require('bcrypt-nodejs');
var validator = require('validator');
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
    FLAT_NO: 'string',
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
        Template:'string',
        CustomFields:['string'],
        CreatedOn:Date
    });
var mailSchema = new Schema(
    {
        pass:'string',
        username:'string'
    });
// Mongoose Model definition

var emailSchema = new Schema(
    {
        body:'string'
    });

var tenants = mongoose.model('tenant', tenantSchema);

var owners = mongoose.model('owner', ownerSchema);

var flats = mongoose.model('flat', flatSchema);

var receipts = mongoose.model('receipt', receiptsSchema);

var settings = mongoose.model('setting', settingsSchema);

var mails = mongoose.model('mail', mailSchema);

var emailtemplates =  mongoose.model('emailtemplate',emailSchema);

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
    
app.put('/updateReceipt/:id', function(req, res){
    receipts.findOne({_id : req.params.id}, function(err, receipt){
        if (err) {
      return res.send(err);
    }
       for(val in req.body){
        receipt[val] = req.body[val];
           console.log(req.body[val]);
    }
    receipt.save(function(err){
        if(err){ 
            console.log(err);
            return res.send(err);
               }
        res.json({message: 'updated receipt'});
    }); 
    });
});    

app.put('/auth', function(req, res){
    mails.findOne({},function(err, docs){
        if (err) {
      return res.send(err);
    }
        var prop;
    for (prop in req.body) {
        if(prop=='pass')
        {
            var hash = bcrypt.hashSync(req.body[prop]);
            docs[prop] = hash;
        }
        else
            docs[prop] = req.body[prop];
    }
        
        docs.save(function(err){
            if(err)
                return res.send(err);
            res.json({message: 'Email Updated'});
            console.log(docs);
        });
});
});
var uipass;
app.put('/passauth', function (req, res){
    mails.findOne({},function(err, p){
        if(bcrypt.compareSync(req.body['pass'],p['pass'])==true){
            console.log('Reached');
            uipass=req.body['pass'];
           res.json(1);}
        else
        {
            res.json(0);
            console.log('screwed');
        }
    });
});
    
app.get('/uid', function(req, res){
    mails.findOne({},function(err, docs){
        res.json(docs);
    })
});
    
app.get('/editReceipt/:flatNo/:month/:year', function(req, res){
   receipts.findOne({flatNo : req.params.flatNo, months : {$in :[req.params.month]}, year: req.params.year}, function(err, docs){
       res.json(docs);
   }) 
});
    
    
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

app.post('/postMailTemplate/:Template', function (req,res){
    var Setting = new settings({
    Template : req.body.Template
    })
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

var msgtemp;    

app.get('/getTemplate', function(req, res){
    emailtemplates.findOne({},{body:1,_id:0}, function(err, docs){
        msgtemp = JSON.stringify(docs, ["body"]);
        msgtemp = msgtemp.replace('{"body":"','');
        msgtemp = msgtemp.replace('"}','');
        console.log(msgtemp);
       res.json(msgtemp); 
    });
});

app.put('/putTemplate', function(req, res){
    emailtemplates.findOne({},function(err, docs){
        docs['body'] = req.body['body'];    
        docs.save(function(err){
            if(err)
                return res.send(err);
            res.json({message: 'Email Template Updated'});
            console.log(docs);
        });
    });
});
    
app.get('/sendMail/:flats',function(req,res){
    
         var flatnos = req.params.flats;
        console.log(flatnos);
        var flats = [];
    for( var i=0,j=0; i<flatnos.length ;i=i+5,j++){
        var temp = flatnos[i]+flatnos[i+1]+flatnos[i+2]+flatnos[i+3];
        flats[j] = temp;
    }
    var sendmail;
    var smtpTransport;
    mails.find({},{ username : 1 } , function(err,docs) {
        sendmail = JSON.stringify(docs, ["username"]);
        sendmail = sendmail.replace('[{"username":"','');
        sendmail = sendmail.replace('"}]','');
        sendmail = sendmail.replace(' ','');
        smtpTransport = nodemailer.createTransport("SMTP",{
                            service: "Gmail",
                            auth: 
                            {
                                user: sendmail,
                                pass: uipass
                            }
                        });
        //console.log(flats.length);
    });
    
    for( var i=0;i<flats.length;i++)
    {
        tenants.find
                (
                    {FLAT_NO : flats[i]},
                    {
                      EMAIL_IDS : 1
                    },
                    function(err,email)
                    {
                        var mail;
                        mail = JSON.stringify(email,["EMAIL_IDS"]);
                        mail = mail.replace('[{"EMAIL_IDS":"','');
                        mail = mail.replace('"}]','');
                        mail = mail.replace(' ','');
                        if(validator.isEmail(mail))
                        {
                        var mailOptions = 
                        {
                            from: sendmail,
                            to: mail, 
                            subject: 'Reminder',
                            text: msgtemp
                        }
                        smtpTransport.sendMail(mailOptions, function(error, response){
                            if(error){
                                console.log(error);
                            }
                            else{
                            }
                        });
                        }
                        
                    }
                );  
    }
});

app.get('/getFlats',function(req,res){
    flats.find({},
        {
            FLAT_NO : 1
        }
        ,function(err,flats){
            res.json({flats : flats});
        });

});

var year,months;

app.get('/sendstatus/:month/:year',function(req,res){
    year = req.params.year;
    months = req.params.month;
    receipts.find({
        year : req.params.year ,
        months : {$in: [req.params.month]} },
        {
            flatNo : 1
        }
        ,function(err,flats){
            res.json({flats : flats});
        });

});
    
app.get('/monthlystatus/:flat/:year', function(req, res){
    receipts.find({flatNo : req.params.flat, year : req.params.year, paymentTyp: 'Montly Maintenance'}, {months : 1}, function(err, docs){
                    res.json({docs :docs});
            }
                 );
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
    settings.find({}, {MaintenanceReminderMailTemplate:1}, function (err, docs) {
        res.json({  docs: docs });
        x = JSON.stringify(docs);
        console.log(x);
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
    
app.get('/maintenance', function (req, res) {
    res.sendFile(__dirname + '/maintenance.html');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/dashboard.html');
});
    
app.get('/homepage', function(req, res){
    res.sendFile(__dirname + '/homepage.html');
});
    
app.get('/pics/kv2.jpg', function(req, res){
    res.sendFile(__dirname + '/pics/kv2.jpg');
});

app.get('/pics/kv3.jpg', function(req, res){
    res.sendFile(__dirname + '/pics/kv3.jpg');
});
    
app.get('/pics/kv4.jpg', function(req, res){
    res.sendFile(__dirname + '/pics/kv4.jpg');
});
    
app.get('/pics/kv5.jpg', function(req, res){
    res.sendFile(__dirname + '/pics/kv5.jpg');
});
    
app.get('/pics/kv6.jpg', function(req, res){
    res.sendFile(__dirname + '/pics/kv6.jpg');
});
    
app.get('/pics/kv7.jpg', function(req, res){
    res.sendFile(__dirname + '/pics/kv7.jpg');
});
    
app.get('/pics/kv8.jpg', function(req, res){
    res.sendFile(__dirname + '/pics/kv8.jpg');
});    
    
app.get('/pics/kv9.jpg', function(req, res){
    res.sendFile(__dirname + '/pics/kv9.jpg');
});    

});