var bodyParser = require('body-parser');
var config = require('../../config');

module.exports = function(app, express) {
    var adminRouter = express.Router();

    adminRouter.get('/', function(request, response) {
        response.json({
            message: 'Test Admin route - Success.'
        });
    });

    adminRouter.route('/recipe')
        .put(function(request, response) {
            response.json({
                message: 'Adding a recipe'
            });
        });

    return adminRouter;
}
