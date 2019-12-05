let game_words=[]; // Words used in game instance
let all_words={"pridevi":[],"namirnice":[],"mesta":[],"predlozi_i_prefiksi":[],"prilozi_i_veznici":[],"glagoli":[],"brojevi":[],"imenice":[],"novo":[],"test":[]}; //All words object to be populated from DB
let language = 'srpski'; // Language for questions
let correct_answer = null; // Current correct answer
let given_word = null; // Current game word. It's object, has 'srpski' and 'madjarski'
let counter={
	correct:0,
	wrong:0
} // Counter for correct and wrong answers
let guessed_correct_answers=[]; // Array of correctly guessed words

get_words_from_db();


// Get all words from MongoDB
function get_words_from_db(){
	$.ajax({
		type : "get",
		url : '/get/words',
		contentType : "application/json",
		dataType : 'json',
		success : function(data){
			const obj_words=data;
			// console.log(obj_words[1].words.length)
			// console.log(obj_words)
			beginning(obj_words);	
		}
	})
}

// Take words and make list of them for game
function make_list_of_words(obj_words){
	for (let i in obj_words){
		const allowed=["pridevi","namirnice","mesta","predlozi_i_prefiksi","prilozi_i_veznici","glagoli","brojevi","imenice","novo","test"];
		if (allowed.includes(obj_words[i].category)){
			// console.log(obj_words[i].category)
			for(let j=0;j<obj_words[i].words.length;j++){
				// console.log(obj_words[i].words[j])
				all_words[obj_words[i].category].push(obj_words[i].words[j]);
			}
		}
	}
}

// Execute making list of words for game, and disable all inputs until user select categories of words for game
function beginning(obj_words){
	make_list_of_words(obj_words);
	document.getElementById('main-input').disabled = true;
	document.getElementById('next-word').disabled = true;
	document.getElementById('check-answer').disabled = true;
	$("input[type=text]").attr("placeholder", "Izberite kategoriju pitanja!");
}

// Checkboxes for category choosing
$('input[type=checkbox]').change(function(){
	nameof_category=this.name;
	let selected_words= all_words[nameof_category];
	if($('input[name='+nameof_category+']').is(':checked')){
		adding_words(selected_words);
	}else{
		removing_words(selected_words);
	}
});

// Adding selected words to game, enabling input
function adding_words(selected_words){
    if(!check_if_game_have_words(game_words)){
        document.getElementById('main-input').disabled =false; 
	    document.getElementById('next-word').disabled = false;
	    document.getElementById('check-answer').disabled = false;
        $("input[type=text]").attr("placeholder", "Vas odgovor");
        selected_words.forEach((word)=>{
            game_words.push(word)
        });
        show_word()
    }else{
        selected_words.forEach((word)=>{
            game_words.push(word)
        });
    }
}

// Checking if there are truthy words left in game
function check_if_game_have_words(array){
    return (array[0] ? true : false);
}

// Removing selected words from game
function removing_words(selected_words){
	for(let i=0;i<game_words.length;i++){
		if(game_words[i]===selected_words[0]){
    		game_words.splice(i,selected_words.length);
    	}
	}
    if(!check_if_game_have_words(game_words)){
		delete_word();
        beginning();
	}else if(!game_words.includes(given_word)){
		delete_word();
		show_word();
	}
	guessed_correct_answers=[];
}

// Return random word from words used in game
function random_word(){
    let random_index=Math.floor(Math.random() * game_words.length);
    return game_words[random_index];
}

// Button for changing language 
$('input[name=jezik]').click(function(){
	language = this.getAttribute('value');
});

// Show random truthy word from list of game words
function show_word(){
	do{
		given_word=random_word();
	} while(given_word.srpski===undefined);
	if(language==='srpski'){
		$("#word").text(given_word.srpski);
	}else{
		$("#word").text(given_word.madjarski);
	}
	if(language==='srpski'){
		correct_answer=given_word.madjarski;
	}else{
		correct_answer=given_word.srpski;
	}
	console.log(correct_answer)
}

// Delete word from screen
function delete_word(){
	$("input[type='text']").val("");
	$("#word").text("");
}

// Button for checking answers
const check_answer_button=document.querySelector("#check-answer");
check_answer_button.addEventListener("click", ()=>{
	check_answer();
});

// You can type enter from keyboard for checking answers
$("input[type='text']").keypress(function(event){
	if(event.which===13){
		check_answer();
	}
});

// Check if input answer is correct
function check_answer(){
	let try_answer=$("input[type='text']").val().toLowerCase();
	if(try_answer===correct_answer){
		$("#mesto_za_pitanja").append("<p id='sta_je'>Tacno, rekli ste: "+try_answer+"</p>");
		result(true);
		previous_word();
		fade_info();
		correct_icon();
		if(counter_answers(given_word)===false){
			document.getElementById('main-input').disabled = true;
			document.getElementById('next-word').disabled = true;
			document.getElementById('check-answer').disabled = true;
			$("input[type=text]").attr("placeholder", "Izberite kategoriju pitanja!");
			delete_word();
			removing_words_from_game();
			game_words=[];
			alert('Pogodili se sve reci, izaberite novu kategoriju')
			return false;
		};
		give_new_word();
	}else{
		wrong_icon(try_answer);
		result(false);
	}
}

// Disable check boxes for category in which all words are guessed 
function removing_words_from_game(){
	let check_boxes=document.getElementsByClassName("boxes")
	for(let i=0;i<check_boxes.length;i++){
		if(check_boxes[i].checked === true){
			$('input[name='+check_boxes[i].name+']').prop('disabled',true);		
		}
	}
}

// Delete word shown on screen, and show new word
function give_new_word(){
	delete_word();
	show_word();
}

// Fade out info about guessing correctly or falsely
function fade_info(){
	$('#sta_je').fadeOut(3500,function(){
		$(this).remove();
	});
	document.getElementById("next-word").disabled = true;
	document.getElementById('check-answer').disabled = true;
    setTimeout(function()
    	{
    		document.getElementById("next-word").disabled = false;
    		document.getElementById('check-answer').disabled = false;

    	},3500);
    
    //When you guess fast more time in a row
    $('p+p').fadeOut(2000,function(){
		$(this).remove();
	});
}


//Fade out icon about correct or wrong answer
function fade_icon(){
	$(".dobro, .lose").fadeOut(2000,function(){
		$(this).remove();
	});
}

// Show icon for correct answer
function correct_icon(){
	$("#mesto_za_pitanja span").append("<i class='dobro far fa-check-circle'></i>");
	fade_icon();
}

// Show icon for wrong answer, and if guess is near enough show message about that
function wrong_icon(try_answer){
	if(check_letters(try_answer)===true){
		$("#mesto_za_pitanja").append("<p id='sta_je'>Blizu ste!</p>");
		fade_info();
	}
	$("#mesto_za_pitanja span").append("<i class='lose far fa-times-circle'></i>");
	fade_icon();
}

// Check if given answer is near correct answer - it's near if two letters are out of their place 
function check_letters(try_answer){
	let correct_letters=0;		//broj pogodjenih slova
	for(var i=0;i<try_answer.length;i++){
		if(try_answer[i]===correct_answer[i] || try_answer[i]===correct_answer[i-1] || try_answer[i]===correct_answer[i+1]){
			correct_letters++;
		}
		if(correct_letters>correct_answer.length-2){
			return true;
		}
	}
	return false;
}

// Button that give next word, current guess is considered miss
const next_button=document.querySelector("#next-word");
next_button.addEventListener("click", function(){
	$("#mesto_za_pitanja").append("<p id='sta_je'>Tačan odgovor je bio: "+correct_answer+"</p>");
	$("#mesto_za_pitanja span").append("<i class='lose far fa-times-circle'></i>");
	fade_info();
	fade_icon();
	previous_word();
	result(false);
	give_new_word();
});

// Help that consists of first letter of answer, given if scrolled over help section
$("#pomoc").on('mouseenter',function(){
	if(game_words[0]!==undefined){
		$(this).text(correct_answer[0]);
	}
});

// Return help section to previous state
$("#pomoc").on('mouseleave',function(){
	$(this).text("Pomoć prvo slovo");
});

// Show last incorrectly or correctly guessed word on section for that
function previous_word(){
	if(game_words[0]!==null){
		$('#last-word').text(given_word.madjarski+" - "+given_word.srpski);
	}
}

// Counter of wrong and right answers
function result(guess){
	if(guess){
		counter.correct++;
		document.querySelector("#correct-counter").textContent=counter.correct;
	}else{
		counter.wrong++;
		document.querySelector("#wrong-counter").textContent=counter.wrong;
	}
}

// Reset counter of wrong and right answers
function reset_result(){
	counter.correct=0;
	counter.wrong=0;
	document.querySelector("#correct-counter").textContent=counter.correct;
	document.querySelector("#wrong-counter").textContent=counter.wrong;
}

// Button for reseting counter of wrong and right answers
$('#btn-counter').on('click',function(){
	reset_result();
})

// Counter for checking how much time before was each particular word guessed correctly. 
// If particular word was guessed correctly three times, it becomes undefined in words array.
// If all words from selected array are guessed three times, returns false, so other functions may trigger accordingly.
function counter_answers(word){
	guessed_correct_answers.push(word);
	game_words.forEach((word_from_game)=>{
		let word_occurrences=0;
		guessed_correct_answers.forEach((guessed_word)=>{
			if(guessed_word.srpski===word_from_game.srpski){
				word_occurrences++;
				if(word_occurrences>=3){
					let index=game_words.indexOf(word_from_game);
					game_words[index].srpski=undefined;
					game_words[index].madjarski=undefined;
				}
			}
		});
	});
	if(guessed_correct_answers.length===game_words.length*3-1){
		return false;
	}else{
		return true;
	}
}