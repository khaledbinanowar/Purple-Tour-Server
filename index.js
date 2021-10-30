const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://purple-tour:wOiQNKLxAwAkcX7y@cluster0.bti5r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('purple-tour');
        const servicesCollection = database.collection('services');

        //GET services API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            let services;

            services = await cursor.toArray();

            res.send({
                services
            });
        });

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Ema jon server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})