const express = require('express');
const app = express();
const {adminAuth, userAuth} = require('./middlewares/auth');

app.get('/getUserData', (req, res, next) => {
    try {
        throw new Error("giberish");        
    } catch (error) {
       res.status(500).send(`An Error Occured: ${error.message}`);
    }
});


app.listen(7777, () => {
    console.log('Server Chalu ho chuka hai');
});


app.use("/admin", adminAuth);

app.get("/admin/logIn", (req, res) => {
    res.send("Welcome Admin!");
});

app.get("/admin/deleteAdmin", (req, res) => {
    res.send("Admin ud gya!");
});

app.get("/user", userAuth, (req, res) => {
    res.send({firstName: "Harsheit", lastName: "Mishra"});
});

app.get("/user/login", (req, res) => {
    console.log('user is logging in');
    res.send("Please log in!");
});

app.get("/user/:userId/:name/:password", (req, res) => {
    console.log(req.params);
    console.log(req.query);
    res.send("Hello Bhai, Kya chahiye?");
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
app.use("/", (err, req, res, next) => {
    if (err) {
        res.status(500).send("Something Went Wrong");
    }
});