var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
const ejs=require('ejs');
const app = express();
var fs = require('fs');
var path = require('path');
require('dotenv/config');

const stripe = require('stripe')('sk_test_51M7IoOSGHNdj06JRPfm98NsGBTnxO8XjdLIdx5wYeixCf73Y8peGwzfXVDHBbQWbF7c6DZM3Cq56Mj1H83Sy8DTp00EAf646Et');
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile)
app.set('views',"./views");
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/nurserydb',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use(bodyParser.urlencoded({ extended: false }))

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

app.get("/",(req,res)=>{
    
    return res.redirect('index');
});

app.get("/sign_up",function(req,res){
    res.redirect("signup.html");
})
var email;
app.post("/sign_up",(req,res)=>{
    var name = req.body.name;
     email = req.body.email;
    var password = req.body.password;
    var address =req.body.address;
    var contact = req.body.contact;
    
   
    var data = {
        "name": name,
        "username" : email,
        "password": password,
        "address" : address,
        "contact" : contact,
        "code":1
        
    }
    console.log(email);

    db.collection('customers').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });
   /* var data1={
        "email":email,
        "code":"1"
    }
    db.collection('logins').insertOne(data1,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    })*/

    return res.redirect('index.html')

})


var email;
 var password;
 app.get('/loginDetails',(req,res)=>{
    res.redirect('log.html')
 })
app.post("/loginDetails", function(req, res) {
    email=req.body.email;
     password=req.body.password;
     checkpass(req,res,email,password)
})
app.get('/log',checkpass);
function checkpass(req,res,email,password){
    mongoose.model('Customer').findOne({username:email,password:password},function(err,customers){
        console.log(customers);
		if(customers!= null){
            console.log("Done Login");
           
            db.collection('customers').updateOne({username:email},{$set:{code:1}},(err,collection)=>{
                if(err){
                    throw err;
                }
                console.log("Record Inserted Successfully");
            })
                res.redirect('index.html')
				
			}      
        else{
			console.log("failed");
            res.redirect('log.html')
		}
	});
};
//profile
app.get('/',(req,res)=>{
    res.render('index');
})

const customersSchema={
    name:String,
    username:String,
    password:String,
    address:String,
    contact:String,
    code:Number
    
}
const Customer= mongoose.model('Customer',customersSchema);

app.get('/',(req,res)=>{
    res.render('index.html');
})
app.get("/profile",(req,res)=>{
    Customer.find({username:email,code:1},function(err,customers){
        
       res.render('profile',{
        customersList:customers,
       
       })

    })
})
app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/update_profile',(req,res)=>{
    Customer.find({username:email},function(err,customers){
        console.log(email);
        console.log('hello')
       res.render('update_profile',{
        customersList:customers,
       
       })

    })
})
 app.post("/update_pro",(req,res)=>{

        
        var newpass = req.body.new_pass;
        var password=req.body.confirm_pass;
        var address = req.body.address;
        var number = req.body.number;
        console.log(newpass);
        if(newpass == password){
            console.log('ok');
        db.collection('customers').updateOne({username:email},{$set:{password:password,address:address,contact:number}},(err,collection)=>{
            if(err){
                throw err;
            }
            console.log("Record updated Successfully");
        });
    
         res.redirect('profile')
    }
    })
    
    var multer = require('multer');
  
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads')
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now())
        }
    });
      
    var upload = multer({ storage: storage });
    var imgModel = require('./model');
    app.get('/',(req,res)=>{
        res.render('index');
    })
    app.get('/plants', (req, res) => {
      imgModel.find({id:/^P/}, (err, items) => {
          if (err) {
              console.log(err);
              res.status(500).send('An error occurred', err);
          }
          else {
              res.render('plants', { items: items });
          }
      });
    });
    var loginsSchema= new mongoose.Schema({
        email:String,
        code:Number
    })
    const Login=mongoose.model('Login',loginsSchema);

    var amount;
    var total;
    
    app.post('/add-to-cart',(req,res)=>{
           
           var id=req.body.id;
          var qty=req.body.qty;
           amt=req.body.price;
          amount=amt*qty;
          var name=req.body.name;
       //   total=amount+total;
          var data={
            "id":id,
            "username":email,
            "qty":qty,
            "price":amount,
            "name":name
          }
        db.collection('customers').findOne({username:email,code:1},function(err,logins){
            if(logins!=null){
                console.log('hello')
          db.collection("orders").insertOne(data,(err,collection)=>{
            if(err){
                throw err;
            }
            else{
            console.log("record inserted successfully")
            }
        })
    }
    else{
        res.redirect('log.html')
    }
    })
})


    
    var multer = require('multer');
  
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads')
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now())
        }
    });
      
    var upload = multer({ storage: storage });
    var imgModel = require('./model');
    app.get('/',(req,res)=>{
        res.render('index');
    })
    app.get('/seeds', (req, res) => {
      imgModel.find({id:/^S/}, (err, items) => {
          if (err) {
              console.log(err);
              res.status(500).send('An error occurred', err);
          }
          else {
              res.render('seeds', { items: items });
          }
      });
    });

    
    var multer = require('multer');
  
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads')
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now())
        }
    });

      
    var upload = multer({ storage: storage });
    var imgModel = require('./model');
    app.get('/',(req,res)=>{
        res.render('index');
    })
    app.get('/fertilizers', (req, res) => {
      imgModel.find({id:/^F/}, (err, items) => {
          if (err) {
              console.log(err);
              res.status(500).send('An error occurred', err);
          }
          else {
              res.render('fertilizers', { items: items });
          }
      });
    });

    var multer = require('multer');
  
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads')
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now())
        }
    });
      
    var upload = multer({ storage: storage });
    var imgModel = require('./model');
    app.get('/',(req,res)=>{
        res.render('index');
    })
    app.get('/decoratives', (req, res) => {
      imgModel.find({id:/^D/}, (err, items) => {
          if (err) {
              console.log(err);
              res.status(500).send('An error occurred', err);
          }
          else {
              res.render('decoratives', { items: items });
          }
      });
    });

//view add to cart

var ordersSchema= new mongoose.Schema({
    id:String,
    username:String,
    qty:String,
    price:Number

   

})
const Order=mongoose.model('Order',ordersSchema);

app.get("/",(req,res)=>{
    res.render('index')
})
//edit
var id;
app.post('/edit',(req,res)=>{
     id=req.body.id;
      var qty=req.body.qty;
       amt=req.body.price;
      amount=amt*qty;
    console.log(id)
    console.log(qty)
    db.collection('orders').updateOne({username:email,id:id},{$set:{qty:qty,price:amount}},(err,collection)=>{
        if(err)
        console.log(err)
        console.log('record update')
    })
      console.log('chaNGING')
          res.redirect('cart')
    

})


//view cart
var pid;

app.get('/cart',(req,res)=>{
    db.collection('customers').findOne({username:email,code:1},function(err,logins){
        if(logins!=null){
    db.collection('orders').find({username:email}).toArray(function(err,orders){
        //console.log(orders.item_id)
     if(err){
         console.log(err);
         res.status(500).send('An error occurred', err);
     }
        else
        {
            var subtotal=[];
            var oid=[];
            console.log(orders.length)

            for(i=0;i<orders.length;i++){
                pid=orders[i].id;
                oid.push(pid);
               subtotal.push(orders[i].price);
               
            }
           var total=0;
           console.log(subtotal)
            for(i=0;i<subtotal.length;i++){
                total=total+subtotal[i]
            }
            console.log(oid)
            console.log(total)
            console.log('hellohi')
            imgModel.find({id:oid}, (err, items) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('An error occurred', err);
                }
                else {
                  console.log('storing')
                    res.render('cart', {total:total,items:items});
                 //   oid.splice(0,orders.length);
                }
               })

          console.log('hrllo')
         }
           })
        }
        else{
            res.redirect('log.html')
        }
    })
           
 })
   

 //delete the product from cart
var did;
app.post("/cartbtn",(req,res)=>{
    did=req.body.sid;
    console.log('delete1');
   deletecart(req,res,did)
    
})
app.get('/cart',deletecart);
function deletecart(req,res,did){
mongoose.model('Order').deleteOne({username:email,id:did},(err,orders)=>{
    if(err)
    console.log(err)
  else{
    cartdisplay(req,res)
  }
})
}
app.get('/cart',cartdisplay) 
function cartdisplay(req,res){
    db.collection('orders').find({username:email}).toArray(function(err,orders){
        //console.log(orders.item_id)
     if(err){
         console.log(err);
         res.status(500).send('An error occurred', err);
     }
        else
        {
            var subtotal=[]
            var oid=[];
            console.log(orders.length)

            for(i=0;i<orders.length;i++){
                pid=orders[i].id;
                oid.push(pid);    
                subtotal.push(orders[i].price)          
            }
            var total=0;
          // console.log(subtotal)
            for(i=0;i<subtotal.length;i++){
                total=total+subtotal[i]
            }
            console.log(oid)
            imgModel.find({id:oid}, (err, items) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('An error occurred', err);
                }
                else {
                  console.log('storing')
                    res.render('cart', {total:total, items: items});
                 //   oid.splice(0,orders.length);
                }
               })

          console.log('deleteone')
         }
           })
    }

//delete all product from cart
app.post("/deleteall",(req,res)=>{
    console.log('coming');
   deletecartall(req,res)
    
})

app.get('/cart',deletecartall);
function deletecartall(req,res){
mongoose.model('Order').deleteMany({username:email},(err,orders)=>{
    if(err)
    console.log(err)
})
res.redirect('index.html')
}
app.get('/',(req,res)=>{
    res.render('index');
})
app.get("/cart",(req,res)=>{
    Customer.find({username:email},function(err,customers){
        
       res.render('cart',{
        ordersList:orders,
       
       })

    })
})

//payment

app.post("/charge", (req, res) => {
    try {
        stripe.customers
          .create({          
            email: req.body.email,
            source: req.body.stripeToken
          })
          .then(customer =>
            stripe.charges.create({
              amount: req.body.amount * 100,
              currency: "usd",
              customer: customer.id
            })
          )
          .then( delivery(req,res))     
          .catch(err => console.log(err));
         // console.log('hello')
      } catch (err) {
        res.send(err);
      }
    //  res.redirect("success.html");
    })
    app.get('/',(req,res) => {
        res.redirect('success.html')
    }
    
    )
app.get('/payment',delivery)
function delivery(req,res){
    mongoose.model('Order').deleteMany({username:email},(err,orders)=>{
        if(err)
        console.log(err)
    })
  //  res.redirect('index.html')
    res.redirect('success.html')
}

    //CONTACT
    
    app.get('/',(req,res)=>{
        
           res.render('contact.html')
        })
    
   
    app.post('/message',(req,res)=>{
        var name=req.body.name;
        var email=req.body.email;
        var ph=req.body.ph;
        var sub=req.body.sub;
        var con=req.body.con;

        var data={
            "email":email,
            "name":name,
            "sub":sub,
            "contact":ph,
            "content":con
        }
        db.collection('customers').findOne({username:email,code:1},function(err,logins){
            if(logins!=null){
                  db.collection('reviews').insertOne(data,(err,collection)=>{
                  if(err)
              console.log(err)
            
                 else
                 res.redirect('index.html')
                })
    }
        else{
            res.redirect('log.html')
        }
    
    })
    
    })


app.get('/searching',(req,res)=>{
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('searching', { items: items });
        }
    });
})

app.post('/ser',(req,res)=>{
    var s=req.body.searching;
    search(req,res,s)
})
app.get('/searching', search) 
function search(req,res,s){

  imgModel.find({name:{$regex:'^'+s, $options:'i'}}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('searching', { items: items });
      }
  });
};

    app.post('/logo',(req,res)=>{
        logopage(req,res)
    })
    app.get('/logout',logopage)
    function logopage(req,res){

    
        db.collection('customers').updateOne({username:email},{$set:{code:0}},(err,logins)=>{
            console.log(email);
            console.log('hello')
           
    
        })
        res.redirect('index.html');
    }


var port = process.env.PORT || 1778
;
app.listen(port, function () {
    console.log("Server Has Started!");
})

