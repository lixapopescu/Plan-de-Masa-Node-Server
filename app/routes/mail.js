var email = require("nodemailer");
var winston = require("winston");
var config = require("../../config");


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
    mailRouter.route('/mesaj')
        .get(function(request, response) {
            winston.info("/mail/mesaj route");
            email.send({
                    host: "localhost", // smtp server hostname
                    port: "25", // smtp server port
                    domain: "localhost", // domain used by client to identify itself to server
                    to: "lixapopescu@gmail.com",
                    from: config.mail.local.from,
                    subject: "node_mailer test email",
                    body: "Hello! This is a test of the node_mailer.",
                    authentication: "login", // auth login is supported; anything else is no auth
                    username: (new Buffer("config.mail.local.username")).toString("base64"), // Base64 encoded username
                    password: (new Buffer("config.mail.local.password")).toString("base64") // Base64 encoded password
                },
                function(err, result) {
                    if (err) {
                        console.log(err);
                        response.json({
                            message: 'Test Mail/mesaj route - Success.'
                        });
                    } else {
                        response.json({
                            message: 'Test Mail/mesaj route - Success.'
                        });
                    }
                });
        });


    return mailRouter;
};