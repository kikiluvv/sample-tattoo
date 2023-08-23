const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');


const express = require('express');
const app = express();
const port = 3000;

// Require and set EJS as the view engine
const ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));



/*------------/
/    Routes   /
/------------*/

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post('/test-webhook', (req, res) => {
    console.log('Test Webhook Received:', req.body);
    res.sendStatus(200);
});


app.get('/gallery', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'gallery.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }

        const images = JSON.parse(data);
        res.render('gallery', { images }); // Pass the JSON data to the EJS template
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



app.post('/jotform-webhook', (req, res) => {
    // Extract flashId from the form submission data
    const flashIdFromJotForm = req.body.flashid; // Use 'q20_flashId'
    console.log('Flash ID:', flashIdFromJotForm);

    console.log('Webhook Payload:', req.body);
    try {
        const jsonFilePath = path.join(__dirname, 'data', 'gallery.json');
        const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
        const flashArray = JSON.parse(jsonContent);

        // Find and update the flash in your JSON array
        const flashToUpdate = flashArray.find(flash => flash.id === flashIdFromJotForm);
        if (flashToUpdate) {
            console.log('Updating flash:', flashToUpdate);
            flashToUpdate.claimed = true; // Update the "claimed" value
            console.log('Updated flash:', flashToUpdate);
        }

        

        // Write the updated JSON array back to the file
        fs.writeFileSync(jsonFilePath, JSON.stringify(flashArray, null, 2));
        console.log('JSON written to file:', jsonFilePath);

        res.sendStatus(200); // Send a success response
        console.log('Sent response:', 200);
    } catch (error) {
        console.error('Error retrieving form submission data', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/jotform-webhook', (req, res) => {
    res.render('webhook');

})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
