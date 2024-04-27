import MongoStore from "connect-mongo";
import mongoose, { ConnectOptions } from "mongoose";
const MONGO_URL = "mongodb://localhost:27017/prototype"

class DatabaseService {
    private mongoose;
    private readonly options: any;

    constructor(options?: any) {
        this.options = options;
        this.mongoose = mongoose
    }

    connect() {
        this.mongoose.set('strictQuery', false);

        this.mongoose.connect(MONGO_URL as string, this.options as ConnectOptions)

        this.mongoose.connection.once('connecting', () => {
            console.log('connecting to mongodb server via mongoose...')
        })
        this.mongoose.connection.once('connected', () => {
            console.log('connected to mongodb server via mongoose...')
        })
        this.mongoose.connection.once('open', () => {
            console.log('database is active...')
        })
        this.mongoose.connection.once('disconnecting', () => {
            console.log('disconnecting from mongodb server...')
        })
        this.mongoose.connection.once('disconnected', () => {
            console.log('disconnected from mongodb server...')
        })
        this.mongoose.connection.once('close', () => {
            console.log('closing connections with mongodb server...')
        })
        this.mongoose.connection.once('reconnected', () => {
            console.log('reconnected to mongodb server...')
        })
        this.mongoose.connection.once('error', (err) => {
            console.log('mongodb server error...')
            console.log(err)
        })
    }

    disconnect() {
        this.mongoose.disconnect()
            .then(() => {
                console.log('Successfully disconnected from db')
            })
    }
}

export default DatabaseService