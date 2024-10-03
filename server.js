const fs = require("fs");
// const http = require("http")
const express = require("express");

const app = express();

// middleware untuk membaca json dari request body(client, FE dll) ke kita
app.use(express.json());

// default URL = Health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Application is running good...",
  });
});

// kalau HTTP module kan if(req.url === / "Ferdi") {}
app.get("/ferdi", (req, res) => {
  res.status(200).json({
    message: "Ping Successfully !",
  });
});

const cars = JSON.parse(
  fs.readFileSync(`${__dirname}/data/cars.json`, "utf-8")
);

// /api/v1/(collection nya) => collection nya ini harus JAMAK (s)
app.get("/api/v1/cars", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Success get cars data",
    isSuccess: true,
    totalData: cars.length,
    data: {
      cars,
    },
  });
});

// response.data.cars

app.post("/api/v1/cars", (req, res) => {
  // insert into ......
  const newCar = req.body;

  cars.push(newCar);

  fs.writeFile(
    `${__dirname}/data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(201).json({
        status: "Success",
        message: "Success add new car data",
        isSuccess: true,
        data: {
          car: newCar,
        },
      });
    }
  );
});


//data car by id
app.get("/api/v1/cars/:id", (req, res) => {
  // select * from fsw2 id-"1" OR NAME = "Ferdi"
  const id = req.params.id * 1;
  console.log("typeof id : ");
  console.log(typeof id);

  // == maka tidak peduli tipe datanya apa, kalau sama "10" ==  10 = TRUE, karena tidak check data
  // === jika 10 === "10" = FALSE, karena tipe data berbeda

  const car = cars.find((i) => i.id === id);
  console.log(car);

  // salah satu basic error handling, 
  if(!car) {
    console.log("gak ada data");
    return res.status(404).json({
      status: "Failed",
      message: `failed get car data this id: ${id}`,
      isSuccess: false,
      data: null,
    });
  }

  res.status(200).json({
    status: "Success",
    message: "Success add get car data",
    isSuccess: true,
    data: {
      car,
    },
  });
  
});

//data car by id
app.get("/api/v1/cars/:id", (req, res) => {
  // select * from fsw2 id-"1" OR NAME = "Ferdi"
  console.log(req.params.id);

  const car = cars.find(i => i.id === req.params.id);

  res.status(201).json({
    status: "Success",
    message: "Success add new car data",
    isSuccess: true,
    data: {
      car,
    },
  });
   
});

// middleware / handler untuk url yang tidak dapat diakses karena memang tidak ada di aplikasi
// membuat middleware = our own middleware
app.use((req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: "API not exist !!!",
  });
});

app.listen("3000", () => {
  console.log("start aplikasi kita di port 3000");
});