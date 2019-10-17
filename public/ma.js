/*global ruter*/
/*global $*/
var r;
var u=false;
var nemaUSkupu=true;
var prvoSlovo;
var tacno;
var provera_slova=false;
var jezik='srpski';
var odgovori={
		tacni:0,
		pogresni:0
};
var imee;
var prethodnaRec="";

//var test = [{srpski:"rec",madjarski:"rec",slika:false},{srpski:"rec",madjarski:"rec",slika:true,br:1}];

var sve=[];
var pogoci=[];
var prethodni=[];

var sve_pogodjeno=false
function pocetak(){
	document.getElementById('glavniInput').disabled = true;
	document.getElementById('dalje').disabled = true;
	document.getElementById('proveri').disabled = true;
	$("input[type=text]").attr("placeholder", "Izberite kategoriju pitanja!");
	if(sve_pogodjeno){
		alert("Pogodili ste sve iz zadate kategorije, odaberite drugu...");
	}
	$("img").addClass("ode");
	$("#recc").remove();
	tacno=null;
	$('#mesto_za_pitanja p').addClass("ode");
}

function da_li_Nema_Nista(){
	if(sve[0]===undefined){
    		pocetak();
    		reset_odgovora();
    	}else{
    		for(var i=0;i<sve.length;i++){
    			if(sve[i].madjarski===tacno || sve[i].srpski===tacno){
    				nemaUSkupu=false;
    				break;
    			}else{
    				nemaUSkupu=true;
    			}
			}
			//console.log("nema u skupu: "+nemaUSkupu)
			if(nemaUSkupu){
				//reset_odgovora();
				//reset();
			}
			reset(); //DA SE NE DESI BAG
    	}
    	
}

function skupovi_dodavanje(skup){
	sve_pogodjeno=false
	document.getElementById('glavniInput').disabled =false; 
	document.getElementById('dalje').disabled = false;
	document.getElementById('proveri').disabled = false;
	$("input[type=text]").attr("placeholder", "Vas odgovor");
 	if(sve[0]===undefined){
		skup.forEach(function(q,brojj){
			sve.push(skup[brojj]);
		});
		reset();
	}else{
		skup.forEach(function(q,brojj){
			sve.push(skup[brojj]);
		});
	}
}

var jos_jedna_provera=false;
function skupovi_oduzimanje(skup){
	jos_jedna_provera=true;
	pogoci=[];
	for(var i=0;i<sve.length;i++){
		if(sve[i]===skup[0]){
		//	prethodni.push(sve[broj]); TREBA POPRAVITI!!!
		//	prethodna_rec();
    		sve.splice(i,skup.length);
    	}
    }
    da_li_Nema_Nista();
}

function proveraRanduma(skupp){
	skupp.sort();
	//console.log("sortiran skup: "+skupp)
	for(var i=1;i<skupp.length;i++){
		if((skupp[0]!==skupp[1] && skupp[0]!==skupp[2]) || (skupp[0]===skupp[1] && skupp[0]!==skupp[2])){
			return true; //IZ RAZLOGA STO NE RADI KOD PRVOG CLANA DONJI KOD!
		}
		if(skupp[i]!==skupp[i-1] && skupp[i]!==skupp[i+2]){
			//console.log("ima jedistvenu vrednost!")
			return true;
		}
	}
	if(skupp.length<=3){return true;}
	if(skupp.length<sve.length*3){return true;}
	return false;
}



var broj_pogodaka =0;
function randum(){
	console.log(" ")
	if(!proveraRanduma(pogoci)){
		pocetak();
		return null;
	}          ////////MORA SE SREDITI!!!!
	var bio_vec=true;
	while(bio_vec){
		bio_vec=false;
		r=Math.floor(Math.random() * sve.length);
		for(var i=0;i<pogoci.length;i++){
			if(r+1===pogoci[i]){ //MORA +1 JER NE PREPOZNAJE NULU!
				broj_pogodaka++;
				//console.log("broj_pogodaka: "+broj_pogodaka)
				if(broj_pogodaka>=3){
					bio_vec=true;
				}
			}	
		}
		broj_pogodaka=0;
	}
	return r;
}

function rezultat(){
	if(u){
		odgovori.tacni++;
		document.querySelector("#tac").textContent=odgovori.tacni;
	}else{
		odgovori.pogresni++;
		document.querySelector("#pog").textContent=odgovori.pogresni;
	}
}

var broj=0;
function reset(){
	prethodnaRec=tacno;
	//tacanObjekat=sve[broj];
	prethodna_rec(); //POPRAVKA!!!
	broj=randum();
	if(broj===null){
		return false;
	}
//	console.log("broj: "+broj)
	console.log("skup: "+pogoci)
	$("#recc").remove();
	if(sve[broj].slika){
		$("#slika").attr("src", sve[broj].br);
		$("img").removeClass("ode");  
	}else{
		$("img").addClass("ode");
		if(jezik==='srpski'){
			$("#pit").append("<h1 id='recc'>"+sve[broj].srpski+"</h1>");
		}else{
			$("#pit").append("<h1 id='recc'>"+sve[broj].madjarski+"</h1>");
		}
	}
	if(jezik==='srpski'){
		tacno=sve[broj].madjarski;
	}else{
		tacno=sve[broj].srpski;
	}
	prvoSlovo=tacno[0];
	$('#mesto_za_pitanja p').removeClass("ode");
	console.log(tacno);
	return true;
}

function fejd(){
	$('#sta_je').fadeOut(3500,function(){
		$(this).remove();
	});
	document.getElementById("dalje").disabled = true;
	document.getElementById('proveri').disabled = true;
    setTimeout(function()
    	{
    		document.getElementById("dalje").disabled = false;
    		document.getElementById('proveri').disabled = false;

    	},3500);
    
    //BAGCINA kada se vise puta zaredom pogodi
    $('p+p').fadeOut(2000,function(){
		$(this).remove();
	});
}

function fejd1(){
	$(".dobro, .lose").fadeOut(2000,function(){
		$(this).remove();
	});
}

function jednoSlovoFali(pokusaj){
	var i1=tacno.length;
	var i2=0;		//broj pogodjenih slova
	for(var i=0;i<pokusaj.length;i++){
		if(pokusaj[i]===tacno[i] || pokusaj[i]===tacno[i-1] || pokusaj[i]===tacno[i+1]){
			i2++;
		}
		if(i2>i1-2){
			provera_slova=true;
		}
	}
}

function reset_odgovora(){
	if(!nema_pitanja){
		odgovori.tacni=0;
		odgovori.pogresni=0;
		document.querySelector("#tac").textContent=odgovori.tacni;
		document.querySelector("#pog").textContent=odgovori.pogresni;
	}
	nema_pitanja=false;
}

function potvrdaTacno(){
	$("#mesto_za_pitanja span").append("<i class='dobro far fa-check-circle'></i>");
	fejd1();
}

function potvrdaPogresno(){
	if(provera_slova===true){
		$("#mesto_za_pitanja").append("<p id='sta_je'>Blizu ste!</p>");
		fejd();
		provera_slova=false;
	}
	$("#mesto_za_pitanja span").append("<i class='lose far fa-times-circle'></i>");
	fejd1();
}


//var brojac1=0;
function prethodna_rec(){
	if(prethodnaRec!==null){
	//	document.querySelector("#prethodna_rec").textContent=prethodni[brojac1].srpski+" - "+prethodni[brojac1].madjarski;
		document.querySelector("#prethodna_rec").textContent=prethodnaRec;
	//	brojac1++;
	}
}

function proveraOdgovora(){
	var pokusaj=$("input[type='text']").val();
	pokusaj=pokusaj.toLowerCase();
	if(jos_jedna_provera){ //Bagcina 
		pogoci=[]
		jos_jedna_provera=false;
	}
	if(pokusaj===tacno){
		pogoci.push(broj+1); //ZA PONAVLJANJE!  //MORA +1 JER NE PREPOZNAJE NULU!
		potvrdaTacno();
		//console.log("pogodak!")
		$("#mesto_za_pitanja").append("<p id='sta_je'>Tacno, rekli ste: "+tacno+"</p>");
		u=true;
		rezultat();
		prethodni.push(sve[broj]);
	//	reset();
	//	fejd();
		if(reset()){
		//	console.log("iniciran reset iz tacnog odgovora!")
			fejd();
		}else{ ////////////SREDITI!		//EDIT: Za sad sredjeno, ali se restartuje svaki put kada se oduzimaju skupovi
			//console.log("Nema reseta u tacnom odgovoru ")
			nemaPitanja(); 
		}
		$("input[type='text']").val("");
	}else{
		fejd();
		jednoSlovoFali(pokusaj);
		potvrdaPogresno();
		u=false;
		rezultat();
		//console.log("promasaj")
	}
	
}

var nema_pitanja=false;
function nemaPitanja(){
	nema_pitanja=true;
	sve_pogodjeno=true;
	console.log("GOTOVOOO!")
	var allInputs = document.getElementsByTagName("input");
	for (var i = 0, max = allInputs.length; i < max; i++){
		if (allInputs[i].type === 'checkbox'){
    		 allInputs[i].checked = false;
		}
	}
	sve=[];
	pogoci=[];
	da_li_Nema_Nista();
}

//Pocetak!
pocetak();

$('input[type=checkbox]').change(function(){
	imee=this.name;
	var objekat= ruter[imee];
	if($('input[name='+imee+']').is(':checked')){
		skupovi_dodavanje(objekat);
	}else{
		skupovi_oduzimanje(objekat);
	}
});

$('input[name=jezik]').click(function(){
	jezik = this.getAttribute('value'); // get you the value attr for clicked label
	if(sve[0]!==undefined){
	//	prethodni.push(sve[broj]); POPRAVKA!!!
		reset();
	}
});

var dugme=document.querySelector("#dalje");
dugme.addEventListener("click", function(){
	if(tacno===null){
		document.getElementById('dalje').disabled = true;
		document.getElementById('proveri').disabled = true;
	}else{
		// var rekli_ste=$("input[type='text']").val();
		// for(var i=0;i<sve.length;i++){
		// 	if(rekli_ste===sve[i].madjarski){
		// 		console.log("To sto ste rekli je: "+sve[i].srpski)
		// 		$("#mesto_za_pitanja").append("<p id='sta_je'>Tačan odgovor je bio: "+tacno+"<br>A to sto ste vi rekli je"+sve[i].srpski+"</p>");
		// 	}else{
		// 		$("#mesto_za_pitanja").append("<p id='sta_je'>Tačan odgovor je bio: "+tacno+"</p>");
		// 	}
		// }          ///////SREDITI!!!!
		$("#mesto_za_pitanja").append("<p id='sta_je'>Tačan odgovor je bio: "+tacno+"</p>");
		$("input[type='text']").val("");
		u=false;
		fejd();
		rezultat();
	//	prethodni.push(sve[broj]); POPRAVKA!!!
		prethodnaRec=tacno;
		reset();
		potvrdaPogresno();
	//	console.log("prethodna rec: "+prethodnaRec)
	}
});

var dugme1=document.querySelector("#btn_odgovori");
dugme1.addEventListener("click", reset_odgovora);


$("#pomoc").on('mouseenter',function(){
	if(sve[0]!==undefined){
		$(this).text(prvoSlovo);
	}
});
$("#pomoc").on('mouseleave',function(){
	$(this).text("Pomoć prvo slovo");
});

var proveri=document.querySelector("#proveri");
proveri.addEventListener("click", function(){
	if(tacno===null){
		document.getElementById('dalje').disabled = true;
		document.getElementById('proveri').disabled = true;
	}else{
		proveraOdgovora();
	}
});

$("input[type='text']").keypress(function(event){
	if(event.which===13){
		proveraOdgovora();
	}
});


