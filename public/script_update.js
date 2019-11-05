let all_words={"pridevi":[],"namirnice":[],"mesta":[],"predlozi_i_prefiksi":[],"prilozi_i_veznici":[],"glagoli":[],"brojevi":[],"imenice":[],"novo":[],"test":[]}; //All words object to be populated from DB

get_words_from_db()

// Get all words from MongoDB
function get_words_from_db(){
	$.ajax({
		type : "get",
		url : '/get/words',
		contentType : "application/json",
		dataType : 'json',
		success : function(data){
			const obj_words=data;
			make_list_of_words(obj_words);	
		}
	})
}

// Take words and make list of them for game
function make_list_of_words(obj_words){
	for (let i in obj_words){
		const allowed=["pridevi","namirnice","mesta","predlozi_i_prefiksi","prilozi_i_veznici","glagoli","brojevi","imenice","novo","test"];
		if (allowed.includes(obj_words[i].category)){
			for(let j=0;j<obj_words[i].words.length;j++){
				all_words[obj_words[i].category].push(obj_words[i].words[j]);
			}
		}
	}
}

// Search button
const check_answer_button=document.querySelector("#search-btn");
check_answer_button.addEventListener("click", ()=>{
	search_db();
});

// You can search by pressing enter on keyboard
$("#search").keypress(function(event){
	if(event.which===13){
		search_db();
	}
});

// Searching for input word, and displaying the result
function search_db(){
    let query=$("#search").val().toLowerCase();
    let found=search_word(query)
    if(found){
        alert(`nadjoh "${found[0].srpski}", a na madjarskom "${found[0].madjarski}", u kategoriji "${found[1]}"`)
        $("#search").val("")
    }
    else{
        alert('Nema takve reci')
    }
}

// Searching for given word in array of all words, returns word if found, or null if query is not in array
function search_word(query){
    for(let i in all_words){
        // console.log(i) //kategorije
        // console.log(all_words[i]) //array of words
        // console.log(all_words[i].length)
        for(let j=0;j<all_words[i].length;j++){
            if(query===all_words[i][j].srpski){
                return [all_words[i][j],i]
            }
        }
    }
    return null;
}