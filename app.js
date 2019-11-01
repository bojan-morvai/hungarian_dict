const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const module_words_local = require('./public/reci')
let Local_words = module_words_local.get_words_local();
const Admin = require("./models/admin");
const All_words = require("./models/words");


// Password configuration
const passport = require("passport");
const LocalStrategy = require("passport-local");
//

mongoose.connect('mongodb+srv://Bojan:klisaklisa@cluster0-rfxxc.mongodb.net/madjarski?retryWrites=true&w=majority',{
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('connected to db');
}).catch(err => {
	console.log('ERROR:', err.message);
});
mongoose.set('useFindAndModify', false);

// Password configuration
app.use(require("express-session")({
    secret: "vanja",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());
//

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.use(function(req, res, next){
    currentAdmin = req.admin;
	console.log("asdasd: "+ currentUser)
    next();
});


// Skup= mongoose.model("Admin",AllWordsSchema)
// Admin.create({
//     username: "Bojan",
//     password: "bojanklisa"
// })

// All_words.create({
// 	category: "imenice",
// 	words: [{srpski:'bioskop',madjarski:'mozi'},{srpski:'crkva',madjarski:'templom'}]
// })

// All_words.create({
// 	category: "namirnice",
// 	words: [{srpski:'sir',madjarski:'sajt'},{srpski:'mleko',madjarski:'tej'}]
// })

// All_words.create({
// 	category: "test",
// 	words: [{srpski:'stest',madjarski:'mtest'},{srpski:'sstest',madjarski:'mmtest'}]
// })

app.get("/uputstva", (req, res) =>{
    res.render("uputstva");
});

app.get('/',(req,res) =>{
	All_words.find({},function(err,allwords){
		if(err){
			alert('Error connecting to db, establishing link to local db...');
			res.render('home',{allwords:Local_words});
		}else{
			res.render('home',{allwords});
		}
	});
});

app.get('/get/words',function(req,res){
	All_words.find({},function(err,allwords){
		if(err){
			alert('Error connecting to db, establishing link to local db...');
			res.send(Local_words);
		}
	  res.send(allwords);
	})
});

app.get('/new', (req,res)=>{
	All_words.find({},function(err,allwords){
		if(err){
			res.send('ERROR FINDING DB!');
		}else{
			res.render('update',{allwords});
		}
	});
});

app.put('/new', (req,res)=>{
	All_words.findOne({category:req.body.kategorija},function(err,found){
		if(err){
			res.send('ERROR FINDING DB!')
		}else{
			const new_word={srpski:req.body.srpski,madjarski:req.body.madjarski}
			found.words.push(new_word)
			All_words.findOneAndUpdate({category:req.body.kategorija},{words:found.words},function(err,updated){
				if(err){
					res.send("ERROR UPDATING")
				}else{
					// Need to add word to 'novo' category also
					All_words.findOne({category:'novo'},function(err,found_novo){
						if(err){
							res.send('Error finding "novo" category');
						}else{
							found_novo.words.push(new_word)
							All_words.findOneAndUpdate({category:'novo'},{words:found_novo.words},function(err,up){
								if(err){
									res.send('Error updating "novo" category');
								}else{
									res.redirect('/new')
								}
							});
						}
					});
				}
			});
		}
	});
});

const hostname = process.env.IP || '127.0.0.1';
const port = process.env.PORT || 3000;

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });