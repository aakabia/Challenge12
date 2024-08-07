const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const sequelize = require("./config/connection");
const session = require('express-session');
const authHelpers = require('./utils/auth');
const equalHelper = require('./utils/equal');
const helpers = {
  ...authHelpers,
  equal: equalHelper // Add the equal helper
};







const hbs = exphbs.create({helpers});
// Above are the packages I am importing to run my application.

const app = express();
const PORT = process.env.PORT || 3001;
// Above is the port my server is listening on and my instance of express.



const sess = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    // Session will expire after 30 minutes of inactivity
    maxAge: 30 * 60 * 1000 // 30 minutes in milliseconds
  },
  rolling: true // Reset the cookie Max-Age on every response
};


app.use(session(sess));

// Above, we create sessions and pass our secret from our .env file.






app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
// Above is the link to handle bars

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(routes);

// Above is the middleware I use for my server.

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
});

// Above, I start my serve with the app.listen
