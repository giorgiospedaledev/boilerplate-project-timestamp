// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

const hasDateParameter = (req, res, next) => {
  const dateString = req.params.date;
  const now = new Date();

  if (!dateString) {
    res.json( {
      unix: now.getTime(),
      utc: now.toUTCString()
    });
    return;
  }

  req.dateString= dateString;
  req.now = now;
  next();
}

const isDateEmpty = (req, res, next) => {

  if (req.dateString.length ===  0) {
    res.json( {
      unix: req.now.getTime(),
      utc: req.now.toUTCString()
    });
    return;
  }
  next();
}

app.get("/api/:date?",hasDateParameter, isDateEmpty,  (req, res) => {
  
  const parsedDate =  Date.parse(req.dateString);
  if (isNaN(parsedDate)) {
    if (!isNaN(Number.parseInt(req.dateString))) {
      const millis = Number.parseInt(req.dateString);
      const dateTime = new Date(millis);
      res.json({
        unix: dateTime.getTime(),
        utc: dateTime.toUTCString()
      })
      
    } else {
      res.json({
        error: "Invalid Date"
      })
    }

    
  } else {
    const date = new Date(req.dateString);
    res.json(
      {
        unix: date.getTime(),
        utc: date.toUTCString()
      }
    )
  }

  

  
  
 


  
});



// listen for requests :)
var listener = app.listen(3000, function () {
  console.log('Your app is listening on port ' + 3000);
});
