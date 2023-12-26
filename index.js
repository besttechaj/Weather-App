const http = require('http');
const fs = require('fs');
var requests = require('requests');
//fetching the file from system
const homeFile = fs.readFileSync('Home.html', 'utf-8', (data, err) => {
  if (err) {
    console.log(err);
  }
});

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace('{%tempval%}', orgVal.main.temp);

  temperature = temperature.replace('{%tempmin%}', orgVal.main.temp_min);
  temperature = temperature.replace('{%tempmax%}', orgVal.main.temp_max);
  temperature = temperature.replace('{%location%}', orgVal.name);
  temperature = temperature.replace('{%country%}', orgVal.sys.country);
  temperature = temperature.replace('{%tempstatus%}', orgVal.weather[0].main);
  return temperature;
};

//creating the server
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    requests(
      'https://api.openweathermap.org/data/2.5/weather?q=mumbai&units=metric&appid=199f221bdf35cc500b974dd35c22161c' 
    )
      .on('data', function (chunk) {
        //we are getting the data in json format

        //converting the data from json to object format
        let objData = JSON.parse(chunk);
        //converting the object data format to array
        let arrayData = [objData];
        console.log(arrayData);

        //replacing the old data with the new one
        const realTimeData = arrayData
          .map((val) =>
            //here i want to replace the homeFile content with the arrayData content
            replaceVal(homeFile, val)
          )
          .join(''); //the join() will convert your data from array to string

        // console.log(realTimeData);

        res.write(realTimeData);
      })
      .on('end', function (err) {
        if (err) return console.log('connection closed due to errors', err);
        else {
          res.end();
        }
      });
  }
});

server.listen(8000, '127.0.0.1', (err) => {
  if (err) console.log(err);
  else console.log('running server successfully');
});
