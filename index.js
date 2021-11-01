const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bti5r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('purple-tour');
        const serviceCollection = database.collection('services');
        const orderCollection = database.collection('orders');

        //GET services API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            let services;

            services = await cursor.toArray();

            res.send({
                services
            });
        });

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.json(result)
        });
        // lOAD SINLE TOUR PACKAGE WITH ID
        app.get("/service/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleService = await serviceCollection.findOne(query);
            res.send(singleService);
        });

        // SINGLE USER ORDER API

        app.get("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { email: id };
            const singleService = await orderCollection.find(query).toArray();
            res.send(singleService);
        });
        app.get("/ordersData/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleService = await orderCollection.findOne(query);
            res.send(singleService);
        });



        // Add Orders API
        app.post("/orders", async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        });

        // GET Orders API
        app.get("/orders", async (req, res) => {
            const cursor = await orderCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        });
        //UPDATE API
        app.put("/ordersData/:id", async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    Name: updatedUser.Name,
                    Address: updatedUser.Address,
                    title: updatedUser.title,
                    id: updatedUser.id,
                    price: updatedUser.price,
                    status: "Approve",
                },
            };
            const result = await serviceCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.json(result);
        });

        // DELETE SERVICE API

        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('heroku server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})