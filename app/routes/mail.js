var nodemailer = require("nodemailer");
var winston = require("winston");
var config = require("../../config");

var transportGmail = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "lixapopescu@gmail.com",
        pass: "lixa200399"
    }
});

var transportLocal = nodemailer.createTransport("SMTP", {
    host: "localhost",
    port: 25,
    secureConnection: true, //SSL
    name: "popescu.eu.com",
    debug: true,
    auth: {
        user: config.mail.local.username,
        pass: config.mail.local.password
    }
});

// var transport = require("nodemailer-smtp-transport");
var transporterServer = nodemailer.createTransport({
    host: "popescu.eu.com",
    port: 25,
    // secure: true, //SSL
    requireTLS: true,
    tls: {
        rejectUnauthorized: false
    },
    name: "popescu.eu.com",
    debug: true,
    auth: {
        user: config.mail.local.username,
        pass: config.mail.local.password
    }
});



module.exports = function(app, express) {
    var mailRouter = express.Router();

    // test route to make sure everything is working 
    // accessed at GET http://localhost:8080/mail
    mailRouter.get('/', function(request, response) {
        response.json({
            message: 'Test Mail route - Success.'
        });
    });

    //'Mesaj' subroute ---------------------------------------------------------------------------------------------------------------
    // on routes that end in /reteta
    mailRouter.route('/send')
        .get(function(request, response) {

            var mailOptions = {
                from: "lixa@popescu.eu.com",
                to: "cosmin@popescu.eu.com", //request.query.to
                subject: "Hello world from Node!", //request.query.subject
                text: "Plaintext body" //request.query.text
            };
            winston.log(mailOptions);

            transporterServer.sendMail(mailOptions, function(error, responseStatus) {
                console.log("error: ");
                console.log(error);
                if (error) {
                    console.log("error: ");
                    console.log(error);
                    response.json({
                        message: "error",
                        error: error,
                        error_bool: (error == null)
                    });
                } else {
                    console.log('Success');
                    console.log(responseStatus.message); // response from the server
                    console.log(responseStatus.messageId); // Message-ID value used
                    response.send("Success");
                }
            });
            // response.send('Hi');

        });

    return mailRouter;
};