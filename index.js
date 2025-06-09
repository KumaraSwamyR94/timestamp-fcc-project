// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");

function isUnixTimestamp(param) {
  const num = Number(param);
  return (
    !isNaN(num) &&
    (param.length === 10 || param.length === 13) &&
    new Date(num).getTime() > 0
  );
}

function isDateString(param) {
  const date = new Date(param);
  return !isNaN(date.getTime());
}

app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/:timestamp?", (req, resp) => {
  const { timestamp } = req.params;
  try {
    let date;
    if (!timestamp) {
      date = new Date();
    } else if (isUnixTimestamp(timestamp)) {
      const num = Number(timestamp);
      date = new Date(timestamp.length === 10 ? num * 1000 : num);
    } else if (isDateString(timestamp)) {
      date = new Date(timestamp);
    } else {
      return resp.status(400).json({ error: "Invalid Date" });
    }

    resp.json({
      unix: date.getTime(),
      utc: date.toUTCString(),
    });
  } catch (error) {
    console.error(error);
  }
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
