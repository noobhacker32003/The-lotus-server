const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
app.use(cors())
app.use(express.json())

require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.user}:${process.env.user_pass}@cluster0.bwhswpd.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    
    // Send a ping to confirm a successful connection
    const myDb= client.db("assignment-10").collection("Cars-db")
    const myhomeDb= client.db("assignment-10").collection("home")
    const users= client.db("assignment-10").collection("users")
    const cart= client.db("assignment-10").collection("cart")


    app.get('/home', async(req, res) => {
      
      const cursor =myhomeDb.find()
      const result = await cursor.toArray()
      res.send(result)
        // res.send(cardata)
      })
      app.post("/home/cars",async(req,res)=>{
        const newCar = req.body
        // console.log(newCar);
        const result =await myDb.insertOne(newCar)
        res.send(result)

    })
      app.post("/users",async(req,res)=>{
        const newUser = req.body
        // console.log(newUser);
        const result =await users.insertOne(newUser)
        res.send(result)

    })
      app.post("/cart",async(req,res)=>{
        const newUser = req.body
        console.log(newUser);
        const result =await cart.insertOne(newUser)
        res.send(result)

    })
    app.get('/cart', async(req, res) => {
      
      const cursor =cart.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/users', async(req, res) => {
      
      const cursor =users.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/users/:email', async(req, res) => {
      const email= req.params.email;
      // console.log(email);
      const query = { email: email  }
      const result = await users.find(query).toArray();
      // console.log(result);
      res.send(result);
    })
    
    app.get('/home/cars', async(req, res) => {
      const cursor = myDb.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/home/cars/:id', async(req, res) => {
      const id = req.params.id;
      const query = { BrandName: id  }
      const result = await myDb.find(query).toArray();
      res.send(result);
    })
    app.get('/home/update/:id', async(req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await myDb.findOne(query)
      res.send(result);
    })
    app.put('/home/update/:id', async(req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) }
      const updateCar = req.body
      const UpdatedCar ={
        $set:{
          BrandName:updateCar.BrandName,
          Name:updateCar.Name,
          Details:updateCar.Details,
          Type:updateCar.Type,
          Image:updateCar.Image,
          Price:updateCar.Price,
          Rating:updateCar.Rating,
        }
      }
      const result = await myDb.updateOne(query,UpdatedCar)
      res.send(result);
    })
    app.delete("/cart/:id",async(req,res) =>{
      const id = req.params.id

      const query ={_id: id}
      const result = await cart.deleteOne(query)
      res.send(result)
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
  res.send('My data-base')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})