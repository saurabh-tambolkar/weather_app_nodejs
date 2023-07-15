const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal=(tempVal,orgval)=>{
  let temperature=tempVal.replace("{%tempval%}",orgval.main.temp);
  temperature=temperature.replace("{%tempmin%}",orgval.main.temp_min);
  temperature=temperature.replace("{%tempmax%}",orgval.main.temp_max);
  temperature=temperature.replace("{%location%}",orgval.name);
  temperature=temperature.replace("{%country%}",orgval.sys.country);
  temperature=temperature.replace("{%tempStatus%}",orgval.weather[0].main);
  
  return temperature;
}

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=b08caced861db87b079956ac186ed0ab")
      .on("data",  (chunk)=> {
        const weatherData = JSON.parse(chunk);
        const arrData=[weatherData]
        const realTimeData=arrData.map((val)=> replaceVal(homeFile,val)).join(" ");
        res.write(realTimeData);
        // console.log(realTimeData);
      })
      .on("end",  (err)=> {
        if (err) return console.log("connection closed due to errors", err);

        res.end("");
      });
  }
});

server.listen(8000,"127.0.0.1");
