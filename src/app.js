const express = require('express');
const app = express();

app.listen(7777, () => {
    console.log('Server Chalu ho chuka hai');
});

let meraObject = {firstName: "Harsheit", lastName: "Mishra"};

app.get("/user/:userId/:name/:password", (req, res) => {
    console.log(req.params);
    console.log(req.query);
    res.send("Hello Bhai, Kya chahiye?");
})
app.get("/user", (req, res) => {
    console.log(req.query);
    res.send(meraObject);
});
app.post("/user", (req, res) => {
    console.log('Post krne jaa rhe hain!');
    res.send("Kya bhejna hai?");
});
app.delete("/user", (req, res) => {
    res.send("Delete krne jaa rhe hain!");
});

app.use("/test", (req, res) => {
    res.send('Test me aapka swagat hai');
});

app.use("/hello", (req, res) => {
    res.send('Hello Ji');
});

app.use("/", (req, res) => {
    res.send("Bhaiyon aur Beheno, Aapka Server aarambh hochuka hai...");
})