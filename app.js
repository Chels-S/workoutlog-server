require('dotenv').config();
const Express = require('express');
const app = Express();
app.use(Express.json());
const controllers = require('./controllers');
const dbConnection = require('./db');
const middleware = require('./middleware');

app.use('/test', (req, res) => {
    res.send('This is a message from test')
});

app.use(middleware.headers);


app.use("/user", controllers.usercontroller);
app.use("/log", controllers.logcontroller);


dbConnection.authenticate()
.then(() => dbConnection.sync())
.then(()=> {
    app.listen(process.env.PORT, () => console.log(`[Server]: App is listening on ${process.env.PORT}`));
})
.catch((err) => {
    console.log("[Server: ] Server has crashed");
    console.log(err);
})
