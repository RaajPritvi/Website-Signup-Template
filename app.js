const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const { urlToHttpOptions } = require("url");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/ba093d2de0";
    const options = {
        method: "POST",
        auth: "raaj26:c7c0bf743803d81370a05dd5f8c4103f-us14"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("failure", function(req, res) {
    res.redirect("/");
})

app.listen(3000, function() {
    console.log("Server is running on port 3000");
})


//c7c0bf743803d81370a05dd5f8c4103f-us14

// ba093d2de0