const app = require('./app');
const port = process.env.PORT;

app.listen(port, () => {
    console.log("server is running in port " + port);
});

//index.js crea la aplicación y la pone en marcha