const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config()

const app = express();
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 4000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s3py8lp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();

		const database = client.db('phoneApi')
		const phoneCollection = database.collection('phones')
		const initalPhoneCollection = database.collection('initalPhone')


		app.post('/phone', async (req, res) => {
			const phone = req.body;
			const result = await phoneCollection.insertOne(phone)
			res.send(result)
		})

		app.post('/', async (req,res) => {
			const initalPhone = req.body;
			const result = await initalPhoneCollection.insertOne(initalPhone)
			res.send(result)
		})

		app.get('/', async (req, res) => {
			const result = await initalPhoneCollection.find().toArray()
			res.send(result)
		})

		app.get('/phone/:id', async (req, res) => {
			const id = req.params.id;
			const quary = { _id: new ObjectId(id) };
			const result = await phoneCollection.findOne(quary)
			res.send(result)
		})

		app.put('/phone/:id', async (req, res) => {
			const editedData = req.body;
			const id = req.params.id;
			const filterEdit = { _id: new ObjectId(id) }
			const options = { upsert: true };
			const updatedPhone = {
				$set: {
					"amount" : editedData.amount
				}
			}
			const result = await phoneCollection.updateOne(filterEdit, updatedPhone, options)
			res.send(result)
		})

		app.delete('/phone/:id', async (req, res) => {
			const id = req.params.id;
			const quary = { _id: new ObjectId(id) };
			const result = await phoneCollection.deleteOne(quary)
			res.send(result)
		})


		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {}
}
run().catch(console.dir);


app.listen(port, () => console.log("Server is running in port :", port));