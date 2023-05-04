const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cors = require('cors')


// Import Routes
const userRoute = require('./routes/user')

// Config
dotenv.config();
const port = process.env.PORT || 5000;
const mongo_url = process.env.MONGO_URL;

// Middleware
app.use(express.json());
app.use(cors())


app.use("/api/user", userRoute)


// Route
app.get("/api/users", (req, res) => {
  res.send("Hello");
});


//Connect to the mongodb
mongoose.set('strictQuery', true);
mongoose
  .connect(`${mongo_url}/emailVerification`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("App is connected to the database"))
  .catch((err) => console.log(err));
  
// Listen to the port
app.listen(port, () =>
  console.log(`Backend is runnig on http://localhost:${port}`)
);
