# hungarian_dict
App to practice hungarian-serbian words translations.
App is in serbian language, but the code and comments are in english.
This is one page application, but there are separate pages with instructions in serbian, and for login and adding new words to database.

# Technologies used
Javascript, jQuery, css, Bootstrap, ejs, node.js, Mongoose, MongoDB Atlas, passport, connect-flash.

# About files
There is main app.js file made with node and express, ejs files in views folder, style.css in public folder, and few js files in public folder.

# Description
There are several parts:
- Main part where user can input translation of shown word, check if it is correct or wrong, along with some other feedbacks, and button for next word
- Checkboxes for user to choose which type of words he would like to insert or remove from game
- Links to instructions and for adding new words to DB (in order to add new words, you must type in password and username)
- Radio buttons for choosing on which language user wants to write his answers (hungarian is default)
- Counter of correct and wrong answers and button for reseting the counter
- Help section (shows first letter of answer on mause hover)
- Section that shows which word was the last one
- Page on which user is required to login to view page on which to add new words to dababase
- There is search section to search for input word in database on page for adding new words to database

Order of sections is changed on mobile sizes.

# Features
- Choosing from different categories of words
- Turn on and off any category of words during game
- If no category of words is selected, game stops
- Choosing on which language to answer
- Instructions in serbian
- All done on one page without reloading
- Messages and icons appear to notify if user guessed correctly or incorrectly
- If user wants to move to the next word, button for skipping the current word
- When current guess have two missplaced, wrong or less letters, notification that user is close to correct answer
- Counter of correct and wrong answers, and button to restart it
- Help section - on mouse hover shows first letter of solution
- Showing of previous word and it's translation
- When guessed correctly specific word three times, that word is removed from game
- If all words from selected categories are guessed correctly three times, that category becomes unavailable until page reloads
- All words are fetched from MongoDB Atlas, if there is some error accessing db, some words are available locally
- Possibility to enter new words to DB, through login - username: bojan, password: morvai
- Search for existing word in db on enter new word page
- When new word is added to appropriate category, it's also added to 'new' ('novo') category



