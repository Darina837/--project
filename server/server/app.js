const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('../schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const PORT = 3006;
mongoose.connect('mongodb://Darina:database@graph-shard-00-00-hwade.mongodb.net:27017,graph-shard-00-01-hwade.mongodb.net:27017,graph-shard-00-02-hwade.mongodb.net:27017/Jewelry?ssl=true&replicaSet=graph-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(`Connection error: ${err}`));
dbConnection.once('open', () => console.log('Connected to DB!'));

app.listen(PORT, err => {
    err ? console.log(error) : console.log('Server started!')
})