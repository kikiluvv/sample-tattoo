const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const bcrypt = require('bcrypt');
require('dotenv').config();
const session = require('express-session');
const helmet = require('helmet');
const multer = require('multer');


const express = require('express');
const app = express();
const port = 3000;

/*----------------/
/    Middleware   /
/----------------*/
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", 'blob:'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
            scriptSrc: [
                "'self'",
                'https://ajax.googleapis.com',
                'https://code.jquery.com',
                'https://unpkg.com',
            ],
        },
    })
);

app.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: true,
    })
);

function requireAuth(req, res, next) {
    if (req.session && req.session.authenticated) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assetts/shop');
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const filename = Date.now() + extension; // Generate a unique filename
        cb(null, filename);
    },
});

// Create the multer upload middleware
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    },
    onError: (err, next) => {
        console.error(err);
        next(err); // Pass the error to the next middleware
    }
});


/*------------/
/    Routes   /
/------------*/


app.get('/contact', (req, res) => {
    res.render('contact');
});


//make this the home page
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'gallery.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }

        const images = JSON.parse(data);
        res.render('gallery', { images }); 
    });
});

app.get('/events', (req, res) => {
    res.render('events')
});

app.get('/color', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'gallery.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }

        const images = JSON.parse(data);
        res.render('color', { images }); 
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



app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/logout', (req, res) => {
    req.session.authenticated = false;
    res.redirect('/login');
});



const whitelistedIPs = ['127.0.0.1', '::1', 'your_friend_ip_here'];

function logLoginAttempt(username, ip, success, message, flagged) {
    const logMessage = `${new Date().toISOString()} - Username: ${username}, IP: ${ip}, Login Success: ${success}, Message: ${message}, IP Flagged: ${flagged}\n`;

    fs.appendFile('login_attempts.log', logMessage, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}


app.post('/authenticate', async (req, res) => {
    const { username, password } = req.body;
    const clientIP = req.ip; // Get the client's IP address
    const isWhitelisted = whitelistedIPs.includes(clientIP);

    try {
        const hashedUsername = process.env.HASHED_USERNAME;
        const hashedPassword = process.env.HASHED_PASSWORD;

        const usernamesMatch = await bcrypt.compare(username, hashedUsername);
        const passwordsMatch = await bcrypt.compare(password, hashedPassword);

        if (usernamesMatch && passwordsMatch) {
            req.session.authenticated = true;
            res.redirect('dashboard');
            logLoginAttempt(username, clientIP, true, 'Successful login', isWhitelisted);
        } else {
            // ... (same as before)
            logLoginAttempt(username, clientIP, false, 'Failed login attempt', isWhitelisted);
            res.redirect('login');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/jotform-webhook', (req, res) => {
    // Extract flashId from the form submission data
    const flashIdFromJotForm = req.body.flashid; // Use 'q20_flashId'
    console.log('Flash ID: ', flashIdFromJotForm, ' claimed on Jotform');
    try {
        const jsonFilePath = path.join(__dirname, 'data', 'gallery.json');
        const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
        const flashArray = JSON.parse(jsonContent);

        // Find and update the flash in your JSON array
        const flashToUpdate = flashArray.find(flash => flash.id === flashIdFromJotForm);
        if (flashToUpdate) {
            console.log('Old flash JSON:', flashToUpdate);
            flashToUpdate.claimed = true; // Update the "claimed" value
            console.log('New flash JSON:', flashToUpdate);
        }
        // Write the updated JSON array back to the file
        fs.writeFileSync(jsonFilePath, JSON.stringify(flashArray, null, 2));
        console.log('JSON written to file:', jsonFilePath);

        console.log('Flash update successful. Sent response:', 200);
        res.redirect(`/jotform-success?flashId=${flashIdFromJotForm}`); // Redirect to the success page
        console.log('Redirecting to success page.');
    } catch (error) {
        console.error('Error retrieving form submission data', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/jotform-success', (req, res) => {
    const flashIdFromJotForm = req.query.flashId; // Use 'flashId' here
    console.log('Flash ID from query parameter:', flashIdFromJotForm);

    try {
        const jsonFilePath = path.join(__dirname, 'data', 'gallery.json');
        const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
        const flashArray = JSON.parse(jsonContent);

        // Find the matching flash object in the JSON array
        const matchedFlash = flashArray.find(flash => flash.id === flashIdFromJotForm);
        console.log('Matched flash:', matchedFlash);

        if (matchedFlash) {
            res.render('success', { flashImage: matchedFlash.image });
        } else {
            res.render('success', { flashImage: null }); // No matching flash found
        }
    } catch (error) {
        console.error('Error retrieving flash data', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.get('/dashboard', requireAuth, (req, res) => {
    res.render('admin/dashboard');
});

app.get('/dashboard/add', requireAuth, (req, res) => {
    res.render('admin/add');
});

app.get('/dashboard/remove', requireAuth, (req, res) => {
    res.render('admin/remove');
});

app.get('/dashboard/edit', requireAuth, (req, res) => {
    const filePath = path.join(__dirname, 'data', 'gallery.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }
        const images = JSON.parse(data);
        res.render('admin/edit', { images }); // Pass the JSON data to the EJS template
    });
});

// Add item route
app.post('/dashboard/add-item', requireAuth, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'measure', maxCount: 1 },
]), (req, res) => {
    // Retrieve the item details from the request body
    const { id, title, size, claimed, } = req.body;

    // Retrieve the filenames of the uploaded files
    console.log('req.files:', req.files);
    const image = req.files['image'][0].filename;

    // Create the new item object
    const newItem = {
        id,
        title,
        size,
        image: `assetts/shop/${image}`,
        claimed,
    };

    // Call the updateItems function to update the items.json file
    updateItems(newItem);

    res.redirect('/dashboard');
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




