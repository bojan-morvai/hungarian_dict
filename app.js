const 	express = require("express"),
 		session = require('express-session'),
 		cookieParser = require('cookie-parser'),
 		flash = require("connect-flash"),
 		mongoose = require('mongoose'),
 		bodyParser = require("body-parser"),
 		methodOverride = require("method-override"),
		app = express();

const 	module_words_local = require('./public/reci'),
 		Local_words = module_words_local.get_words_local(),
		Admin = require("./models/admin"),
 		All_words = require("./models/words");

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

app.use(session({
    secret: "vanja",
    resave: false,
	saveUninitialized: false,
	maxAge: 100000
}));

// Password configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());
//

//Flash messages configuration
app.use(cookieParser('vanja'));
app.use(session({cookie: { maxAge: 60000 },resave:false,saveUninitialized:false,secret:'vanja'}));
app.use(flash());
//

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.use(function(req, res, next){
	currentAdmin = req.user;
    next();
});

// Create administrator that can enter new words in DB
function create_admin(){
	const newAdmin = new Admin({username:'bojan'})
	Admin.register(newAdmin, 'morvai', function(err,admin){
		if(err){
			console.log(err);
		}else{
			passport.authenticate('local');
			console.log('Created Admin')
		}
	});
}

// create_admin()

// All_words.create({
// 	category: "test",
// 	words: [{srpski:'stest',madjarski:'mtest'},{srpski:'sstest',madjarski:'mmtest'}]
// })

app.get("/uputstva", (req, res) =>{
    res.render("uputstva");
});

app.get('/recnik',(req,res) =>{
	All_words.find({},function(err,allwords){
		if(err){
			alert('Error connecting to db, establishing link to local db...');
			res.render('recnik',{allwords:Local_words,currentAdmin});
		}else{
			res.render('recnik',{allwords,currentAdmin});
		}
	});
});

app.get('/',(req,res) =>{
	All_words.find({},function(err,allwords){
		if(err){
			alert('Error connecting to db, establishing link to local db...');
			res.render('home',{allwords:Local_words,currentAdmin});
		}else{
			res.render('home',{allwords,currentAdmin});
		}
	});
});

// Route for AJAX request inside script.js
app.get('/get/words',(req,res)=>{
	All_words.find({},function(err,allwords){
		if(err){
			alert('Error connecting to db, establishing link to local db...');
			res.send(Local_words);
		}
	  res.send(allwords);
	});
});

app.get('/login', (req,res)=>{
	res.render('login')
});

app.post('/login',passport.authenticate('local',{
	successRedirect: "/new",
	failureRedirect: "/login"
}), (req,res)=>{
});

app.get('/new', isLoggedIn, (req,res)=>{
	All_words.find({},function(err,allwords){
		if(err){
			res.send('ERROR FINDING DB!');
		}else{
			res.render('update',{allwords,message:req.flash('added')});
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
									req.flash('added', 'Added new word to database!')
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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
	}
    res.redirect("/login");
}

const hostname = process.env.IP;// || '127.0.0.1';
const port = process.env.PORT;// || 3000;

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});