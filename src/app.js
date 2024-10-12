const express = require('express');
const app = express();

app.listen(7777, () => {
    console.log('Server Chalu ho chuka hai');
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