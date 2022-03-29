const express = require('express');
const bodyParser = require('body-parser');


const {google}=require('googleapis');

const app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 



const auth = new google.auth.GoogleAuth({
    keyFile:"cred.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
});
    const spreadsheetId = '1R3HDP2-JrnCMirhx71nD0PLQV2rniwYplmubvCj8Oqw';



app.get("/api/getinfo/googlesheets",async (req, res) => {
    
    //creaigng a client instance
    const client = await auth.getClient();
    
    const googleSheets = google.sheets({version:'v4', auth:client}); 
    const metadata = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    });
    res.send({"spreadsheetId":metadata.data.spreadsheetId,
"Sheet name":metadata.data.properties.title});
})

app.post("/api/send/googlesheets",async (req, res) => {
   

    //creaigng a client instance
    const client = await auth.getClient();
    const googleSheets = google.sheets({version:'v4', auth:client}); 
    
    var data = [
        req.body.Typeoflead?req.body.Typeoflead:"",
        req.body.Name?req.body.Name:"",
        req.body.RMNumber?req.body.RMNumber:" ",
        req.body.Queries?req.body.Queries:" ",
        req.body.Pincode?req.body.Pincode:" ",
        req.body.Address?req.body.Address:" ",
    ]

    
        const pushdataa = await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range:"data!A:F",
            valueInputOption: "USER_ENTERED",
            resource :{
                values:[
                    data,
                 ]}    
        });
        console.log(`the data has completed...............`)
        res.send({"success code":"200", "message":"The data received successfully"});
})


app.listen(5000,(req, res) => {console.log("listening on port 5000")})