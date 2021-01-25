const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://rii:rii@cluster0-shard-00-00.mlszw.mongodb.net:27017,cluster0-shard-00-01.mlszw.mongodb.net:27017,cluster0-shard-00-02.mlszw.mongodb.net:27017/todo?ssl=true&replicaSet=atlas-13lpyr-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).catch(error => handleError(error));

// create a schema - this is like a bluerint
const todoSchema = new mongoose.Schema({
    item: String
});

const Todo = mongoose.model('Todo', todoSchema);

// let data = [{item: 'get milk'}, {item: 'walking'}, {item: 'kick some coding ass'}];
const urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app) {

    app.get('/todo', (req, res) => {
        // get data from mongodb and pass it to view
        Todo.find({}, (err, data) => {
            if (err) throw err;
            res.render('todo', {todos: data});
        });
    });

    app.post('/todo', urlencodedParser, (req, res) => {
        // get data from view and add it to mongodb
        let newTodo = Todo(req.body).save((err, data) => {
            if (err) throw err;
            res.json(data);
        });
    });

    app.delete('/todo/:item', (req, res) => {
        // delete the requested item from mongodb
        Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove((err, data) => {
            if (err) throw err;
            res.json(data);
        });
    });

};