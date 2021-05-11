// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Nope!` // a string of data
    }
  }
  else {


    let returnValue = {
      numResults: 0,
      movies: []
    }
    
    // define counter for numResults
    let numCount = 0

    // For loop to loop through all movies
    for (let i=0; i < moviesFromCsv.length; i++) {

      // if statement to include only query movies and movies with runtime > 0
      if(moviesFromCsv[i].genres.includes(`${genre}`) && moviesFromCsv[i].startYear.includes(`${year}`) && moviesFromCsv[i].runtimeMinutes > 0){

        // counter and variable definitions for title, year, and genres
        numCount++

        let titleMovie = moviesFromCsv[i].primaryTitle
        let yearMovie = moviesFromCsv[i].startYear
        let genresMovie = moviesFromCsv[i].genres

        // object to push to movies  
        let movieSummary = {
          movieTitle: [titleMovie],
          movieYear: [yearMovie],
          movieGenres: [genresMovie]
          }

        // push to movies and numResults
        returnValue.movies.push(movieSummary)
        returnValue.numResults = numCount
        
      } 
      
    }

    
    

    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue) // a string of data
    }
  }
}