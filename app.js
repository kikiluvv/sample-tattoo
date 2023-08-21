const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();
const port = 3000;

// Require and set EJS as the view engine
const ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/data/gallery.json', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'gallery.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }

        const items = JSON.parse(data);
        res.json(items);
    });
});


app.get('/gallery', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'gallery.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }

        const items = JSON.parse(data);
        res.render('gallery', { items }); // Pass the JSON data to the EJS template
    });
});




app.get('/shop', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'shop.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Shop coming soon :3');
            return;
        }

        const itemsShop = JSON.parse(data);
        res.render('shop', { itemsShop }); // Pass the JSON data to the EJS template
    });
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
