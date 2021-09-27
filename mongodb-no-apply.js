//CRUD

// Inicializamos la conexion
// Se le conoce como el cliente de mongo
// Y es lo que nos dará en acceso a la función necesaria para conectarlo
// a la base de datos para que se puedan realizar las cuatro operaciones basicas

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectId;

// const { MongoClient, ObjectID } = require('mongodb');

// const connectionURL = 'mongodb://127.0.0.1:27017';
// const databaseName = 'task-manager';

// //ObjectID automatic identificator
// // const id = new ObjectID();
// // console.log(id.id.length); //representación numerica
// // console.log(id.toHexString()); //representación en cadena
// // console.log(id.getTimestamp());
// MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
//     if(error) {
//         return console.log('connection declined', error);
//     }
//     console.log('connection success');
//     //se nombre la base de datos
//     const db = client.db(databaseName);

//     //se determina cuál colección se está tratando de manipular
//     //se pueden usar colecciones para rastrear todas las cosas de la aplicación
//     //ejem: tareas, usuarios, ciudades, etc

    
//     //db.collection('users').insert({}) is not a function it was for version
//     //const collection = db.collection('users');

//     // db.collection('users').insert({
//     //         name: 'Ramdom',
//     //         age: 25
//     //     }, (error, result) => {
//     //         if(error) {
//     //             return console.log(error);
//     //         }
//     //         console.log(result);
//     // });//se ejecuta el insertar un documento el cual espera un objeto como primer argumento 
//     //y un callback en el segundo que indica el estado de la operación

//     // 
    
//     // db.collection('tasks').insertMany([
//     //     {
//     //         description: 'Math task',
//     //         completed: false
//     //     }, 
//     //     {
//     //         description: 'Chimical task',
//     //         completed: false
//     //     },
//     //     {
//     //         description: 'Language task',
//     //         completed: true
//     //     }
//     // ], (error, result) => {
//     //     if(error) {
//     //         return console.log(error);
//     //     }
//     //     console.log(result);
//     // })

//     // db.collection('users').findOne({ _id: new ObjectID('614bee83d31353c42d936488')  }, (error, user) => {
//     //     if(error) {
//     //         return console.log(error);
//     //     }
//     //     console.log(user);
//     // })

//     // db.collection('users').find({ age: 26 }).toArray((error, users) => {
//     //     if(error) {
//     //         return console.log(error);
//     //     }
//     //     console.log(users);
//     // })

//     // db.collection('users').find({ age: 26 }).count((error, count) => {
//     //     if(error) {
//     //         return console.log(error);
//     //     }
//     //     console.log(count);
//     // })

//     // db.collection('tasks').findOne({ _id: new ObjectID('614be2f3df269762c3491411') }, (error, task) => {
//     //     if(error) {
//     //         return console.log(error);
//     //     }
//     //     console.log(task);
//     // })

//     // db.collection('tasks').find({ completed: false }).toArray((error, task) => {
//     //     if(error) {
//     //         return console.log(error);
//     //     }
//     //     console.log(task);
//     // })

//     // db.collection('users').updateOne(
//     //     { 
//     //         _id: new ObjectID('614bd7ea9046e1b046000001')
//     //     },
//     //     {
//     //         // $set: {
//     //         //     name: 'Juliana María'
//     //         // }
//     //         $inc: {
//     //             age: 1
//     //         }
//     //     }
//     // ).then((data) => console.log(data)).catch(error => console.log(error));

//     // db.collection('tasks').updateMany({
//     //     completed: false
//     // },{
//     //     $set: {
//     //         completed: true
//     //     }
//     // }).then(data => console.log(data)).catch(error => console.log(error));

//     // db.collection('users').deleteMany({
//     //     age: 26
//     // }).then(data => {
//     //     console.log(data);
//     // }).catch(error => console.log(error))

//     // db.collection('tasks')
//     //     .deleteOne(
//     //         { description: 'Math task'}
//     //     ).then(data => console.log(data))
//     //     .catch(error => console.log(error))
// })