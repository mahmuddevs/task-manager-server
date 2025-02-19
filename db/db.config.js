import { MongoClient, ServerApiVersion } from 'mongodb'
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@merncluster.qifq6.mongodb.net/?retryWrites=true&w=majority&appName=MernCluster`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function connectDB() {
    try {
        return client.db("Task-Manager")
    } catch (err) {
        console.error('Error Connecting DB: ', err)
    }
}

export default connectDB