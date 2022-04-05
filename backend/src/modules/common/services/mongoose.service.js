import mongoose from 'mongoose';
import { config } from './mongo.config';
const { user, pass, dataBase, connection } = config;

let count = 0;

const options = {
    autoIndex: false, // Don't build indexes  
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    //geting rid off the depreciation errors
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const uri = `mongodb+srv://${user}:${pass}${connection}/${dataBase}?retryWrites=true&w=majority`;

const connectWithRetry = () => {
    console.log('MongoDB connection with retry')
    mongoose.connect(uri, options).then(() => {
        console.log('MongoDB is connected')
    }).catch(() => {
        console.log('MongoDB connection unsuccessful, retry after 5 seconds. ', ++count);
        setTimeout(connectWithRetry, 5000)
    })
};

connectWithRetry();

const _mongoose = mongoose;
export { _mongoose as mongoose };
