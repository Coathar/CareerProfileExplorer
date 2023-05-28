import express from "express";
import * as cheerio from 'cheerio';
import * as ProfileContainers from '../shared/ProfileContainers';

const multer  = require('multer');
const os  = require('os');
const fs  = require('fs');
const upload = multer({ dest: os.tmpdir() });
const app = express();
const port = 8080; // default port to listen

app.post('/upload', upload.single('file'), function(req, res)
{
    const file = req.file ;

    console.log("Processing new file " + file.originalname);

    const $ = cheerio.load(fs.readFileSync(file.path, 'utf8'));

    // Check if file contains header
    if ($("h1:contains('Battle.net Account Data')").length === 0)
    {
        res.status(500).send({ error: 'Invalid file provided' });
        return;
    }

    const returnObject = new ProfileContainers.BlizzardAccount();

    // Find BattleTag & Email
    let bnetInfoTable = $("h2:contains('Battle.net Account')").next();

    if (bnetInfoTable === undefined)
    {
        returnObject.Errors.push("Unable to find Battle.net Account info")
        console.warn("Unable to find Battle.net Account info");
    }
    else
    {
        returnObject.BattleTag = bnetInfoTable.find("td:contains('BattleTag')").next().text().trim();
        // returnObject.CreationDate = bnetInfoTable.find("td:contains('Account Create Date')").next().text().trim();
    }
    
    let orderTable = $("h2:contains('Orders')").next();

    if (orderTable === undefined)
    {
        console.warn("Unable to find order info");
    }
    else
    {

    }

    res.sendStatus(200);

});

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );