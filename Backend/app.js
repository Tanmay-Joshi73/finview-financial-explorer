import express from "express";
const app = express();
app.get('/', (req, res) => {
    res.send("Hello My Friends Bro Hello My Friends");
});
app.listen(8000, '127.0.0.1', () => {
    console.log("Hello World");
});
