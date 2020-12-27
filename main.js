const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      "http://localhost",
      "http://localhost:3000",
      "http://beebeebeeebeee.com",
      "https://beebeebeeebeee.com",
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const auth = require("./router/auth");
app.use("/api/user", auth);

app.listen(port, () => {
  console.log(`Auth server is running on http://localhost:${port}`);
});
