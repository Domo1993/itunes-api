const express = require('express')                  // Fetching the express module
const app = express()
const PORT = process.env.PORT || 3001
const myFavourites = require('./myFavourites.json') // My favourites list (json file)
const fileHandler = require('fs')                   // Fetching File system module
const cors = require('cors')
const helmet = require('helmet')                    // Used for express protection
const path = require('path');
require('isomorphic-fetch');

app.use(helmet())
app.use(cors())

// Fetching the itunes api with spefic parameters (inputted by the user) and displays the information of the '/api' path
app.get('/api',(request, response) => {

	fetch(`https://itunes.apple.com/search?term=${request.query.term}&entity=${request.query.entity}&limit=25`)
	    .then(response => response.json())
	    .then((result) => {
	          items= result.results;
	          response.send(items)
	        }),

	      (error) => {
	       console.log(error);
	      }
})

// Using the get method in conjunction with the readfile function to display the favourites.json file's contents
app.get('/favourites', function(req, res) {
    fileHandler.readFile('myFavourites.json', (err, data) => {
        if (err) res.send('File not found. First post to create file.');
        else
            res.send(`${data}`);
    })
})

// this post method takes in the inputted user's parameters and pushes the information into the favourites json file
app.post('/favourites', (req, res) => {
    let myData = {id: req.query.id, collectionName: req.query.collectionName, image: req.query.image, artist: req.query.artist, 
        title: req.query.title, previewUrl: req.query.previewUrl, wrapperType: req.query.wrapperType, kind: req.query.kind, 
        description: req.query.description};
    myFavourites.push(myData);

    fileHandler.writeFile('myFavourites.json', JSON.stringify(myFavourites), (err) => {
        if(err) throw err;
        res.send('File created')
    })
})

// this delete method deletes an item from the favourites json file depending on the id parameter
app.delete('/favourites', (req, res) => {
    
    filteredFavourites = myFavourites.filter((item) => {
        if(req.query.wrapperType == "audiobook"){
            return item.previewUrl != req.query.previewUrl
        } else {
            return item.id != req.query.id
        }
    })
        

    fileHandler.writeFile('myFavourites.json', JSON.stringify(filteredFavourites), (err) => {
        if(err) {
            res.send("File could not be deleted!");
        }else {
            res.send("File Deleted!");
        }
    })
})

if (process.env.NODE_ENV === 'production'){
    app.use(express.static('frontend/build'))
    app.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
      })
}

// Hosting a localhost server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});