require("dotenv").config();

const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("MONGODB_URI is required. Configure it in backend/.env.");
}

const client = new MongoClient(uri, {
    dbName: process.env.MONGODB_DATABASE || "SMS",
    serverSelectionTimeoutMS: 10000
});
const database = client.db(process.env.MONGODB_DATABASE || "SMS");

app.get("/students", async (req, res) => {
    const students = await database
        .collection("students")
        .find()
        .sort({ _id: -1 })
        .toArray();

    res.json(students.map(({ _id, name, roll_no, department }) => ({
        id: _id.toString(),
        name,
        roll_no,
        department
    })));
});

app.post("/students", async (req, res) => {
    const { name, roll_no, department } = req.body;
    if (![name, roll_no, department].every(value => typeof value === "string" && value.trim())) {
        return res.status(400).json({ error: "Name, roll number, and department are required." });
    }

    const student = {
        name: name.trim(),
        roll_no: roll_no.trim(),
        department: department.trim()
    };
    const result = await database.collection("students").insertOne(student);

    res.status(201).json({ message: "Student Added", id: result.insertedId.toString() });
});

app.use((err, req, res, next) => {
    console.error("Request failed:", err);
    res.status(500).json({ error: "An unexpected server error occurred." });
});

async function start() {
    await client.connect();
    console.log(`Connected to MongoDB database "${process.env.MONGODB_DATABASE || "SMS"}".`);

    const port = Number(process.env.PORT || 5000);
    app.listen(port, () => {
        console.log(`Backend running on port ${port}`);
    });
}

start().catch(error => {
    console.error("MongoDB connection failed:", error.message);
    process.exitCode = 1;
});
