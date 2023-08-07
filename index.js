

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

      app.patch('/allToy/details/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatedToy = req.body;
        //console.log(updatedToy);
        const toy = {
          $set: {
            name: updatedToy.name,
            picture: updatedToy.picture,
            price: updatedToy.price,
            availableQuantity: updatedToy.availableQuantity,
            description: updatedToy.description,
  
          }
        }
  
        const result = await toyCollection.updateOne(filter, toy, options);
        res.send(result)
      })



      
      app.get('/toySearchBytitle/:text', async(req, res) => {
        const searchText = req.params.text;
        const searchResult = await toyCollection.find({
          toy_name: { $regex: searchText, $options: 'i' }
        }).toArray();

       // console.log(searchResult)
        res.send(searchResult)
      });
  
  
      app.get('/allToy/details/:id', async (req, res) => {
        const id = req.params.id;
        //console.log(id);
        const query = { _id: new ObjectId(id) };
        const result = await toyCollection.findOne(query);
        res.send(result);
      })
  
      app.get('/allToy/:category', async (req, res) => {
         //console.log(req.params.category);
         const upperString = req.params.category;
          const lowerString = upperString.toLowerCase();
        if (lowerString === 'car' || lowerString === 'bus' || lowerString === 'truck') {
          const result = await toyCollection.find({ category: lowerString }).toArray();
          return res.send(result)
        }

      })
  
      app.get('/mytoys', async (req, res) => {
        //console.log(req.query);
        let query = {};
        if (req.query?.email) {
          query = { email: req.query.email }
        }
        const cursor = toyCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      })

      app.get('/mytoys/ascending', async (req, res) => {
        //console.log(req.query);
        let query = {};
        if (req.query?.email) {
          query = { email: req.query.email }
        }
        const cursor = toyCollection.find(query).sort({price: 1});
        const result = await cursor.toArray();
        res.send(result);
      })
  
      app.get('/mytoys/descending', async (req, res) => {
        //console.log(req.query);
        let query = {};
        if (req.query?.email) {
          query = { email: req.query.email }
        }
        const cursor = toyCollection.find(query).sort({price: -1});
        const result = await cursor.toArray();
        res.send(result);
      })

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