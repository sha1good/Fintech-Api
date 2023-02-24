const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
 const cookiesParser =  require("cookie-parser")
const authRoute = require("./routes/auth");
const enquiryRoute = require("./routes/enquiryRoute");
const placeLienRoute = require("./routes/placeLienRoute");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => "DB Connection was successful!")
  .catch((err) => {
    console.log(err);
  });

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(cookiesParser())
app.use(express.json());
app.use("/api/v2/auth", authRoute);
app.use("/api/v2/fintech", enquiryRoute);
app.use("/api/v2/fintech", placeLienRoute);

//Error handling  middleware
app.use((error, request, response, next) => {
  const errorStatus = error.status || 500;
  const errorMessage = error.message || "Something went wrong!";
  return response.status(errorStatus).json({
    status: errorStatus,
    message: errorMessage,
    //stack: error.stack,
  });
});

app.listen(process.env.PORT || 8880, () => {
  console.log("Backend  server is running!");
});
