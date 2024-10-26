const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const config = require("./config/db");
const account = require("./routes/account");
const posts = require("./routes/posts");
const session = require("express-session");
const { connectToDb } = require("./services/connect");

const app = express();

app.use(
  session({
    secret: config.secret, // заміни на більш надійний ключ
    resave: false, // не перезаписувати сесію, якщо нічого не змінилося
    saveUninitialized: true, // зберігати порожні сесії
    cookie: { secure: false }, // виставляй true, якщо використовуєш HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

app.use(cors());

app.use(bodyParser.json({ limit: "5mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "5mb",
    extended: true,
    parameterLimit: 1000000,
  })
);

const port = 3001;

connectToDb()
  .then(() => {
    app.use("/posts", posts());
    app.use("/account", account());

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(console.error);
