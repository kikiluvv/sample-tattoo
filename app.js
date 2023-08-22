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
app.use(bodyParser.json());


/*------------/
/    Routes   /
/------------*/

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/contact', (req, res) => {
    res.render('contact');
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


app.post('/jotform-webhook', async (req, res) => {
    // Extract claimed tattoo details from req.body (adjust based on your JotForm structure)
    const claimedTattoo = req.body.data;

    try {
        // Make an API call to JotForm to retrieve form submission data
        const jotformAPIKey = process.env.JOTFORM_API_KEY;
        const formID = process.env.JOTFORM_FORM_ID;
        const submissionID = claimedTattoo.submissionId;

        const response = await axios.get(`https://api.jotform.com/form/${formID}/submission/${submissionID}`, {
            headers: {
                'Authorization': `Bearer ${jotformAPIKey}`
            }
        });

        const submissionData = response.data;

        // Update your JSON array with the claimed tattoo information
        const jsonFilePath = path.join(__dirname, 'data', 'claimedTattoos.json');
        const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
        const jsonArray = JSON.parse(jsonContent);

        // Find the tattoo by ID and mark it as claimed
        const tattooToUpdate = jsonArray.find(tattoo => tattoo.id === claimedTattoo.id);
        if (tattooToUpdate) {
            tattooToUpdate.claimed = true;
        }

        // Save the updated JSON array
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2));

        // Respond to the JotForm webhook
        res.json({ message: 'Tattoo claimed successfully' });
    } catch (error) {
        console.error('Error retrieving form submission data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
