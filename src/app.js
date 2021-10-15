//inicilize express server
const express = require('express');

require('./db/mongoose')
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

// app.use((req, res, next) => {
//     if(req.method === 'GET') {
//         return res.send('GET requests are disabled');
//     }
//     next();
// });

// app.use((req, res, next) => {
//     res.status(503).send('Application in maintenance')
// }) 

// const multer = require('multer');
// const upload = multer({
//     dest: 'images'
// })

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send();
// })

app.use(express.json()); //from json to object req
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
//index.js crea la aplicación y la pone en marcha