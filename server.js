const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoUrlLocal = "mongodb://admin:password@mongodb:27017";
const dbName = "user_profile";

// ဟောဒီနေရာလေးကို ver-1.1 အတွက် စာသားလေး နည်းနည်း ပြင်လိုက်ရအောင်ဗျာ
app.get('/', function (req, res) {
    console.log("Request received for Version 1.1! 🚀");
    res.sendFile(path.join(__dirname, "index.html"));
});

// Profile database ထဲ ဒေတာထည့်မယ့် API
app.post('/update-profile', async function (req, res) {
    const userObj = req.body;
    let dbClient;

    try {
        dbClient = await MongoClient.connect(mongoUrlLocal);
        const db = dbClient.db(dbName);

        await db.collection("users").insertOne(userObj);

        // ဒေတာပြန်ပို့တဲ့အခါ App version လေးပါ တစ်ခါတည်း ထည့်ပေးလိုက်မယ်
        userObj.app_version = "ver-1.1";
        res.send(userObj);

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Database error occurred!" });
    } finally {
        if (dbClient) {
            dbClient.close();
        }
    }
});

app.listen(3000, function () {
    console.log("App listening on port 3000! (Running Version 1.1 🚀)");
});