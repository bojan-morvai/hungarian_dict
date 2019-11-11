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



