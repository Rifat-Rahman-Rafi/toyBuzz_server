

const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 8000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://rifat:${process.env.DB_PASS}@cluster0.2vfwg.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
  
  
      const toyCollection = client.db("toyCarTraderDB").collection("carDetails");
  

      app.get('/allToy', async (req, res) => {
        const cursor = toyCollection.find().limit(20);
        const result = await cursor.toArray();
        res.send(result);
      })


      app.post('/postallToy', async (req, res) => {
        const newToy = req.body;
    
        // newToy.category = newToy.category.toLowerCase();

        // Insert the new toy into the MongoDB collection
        const result = await toyCollection.insertOne(newToy);
        res.send(result);
        
      })


      app.delete('/allToy/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await toyCollection.deleteOne(query);
        res.send(result);
      })


      



      

   





      
  
  
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Test port Running')
})

app.listen(port, () => {
    console.log(`Server is Running  ${port}`)
})