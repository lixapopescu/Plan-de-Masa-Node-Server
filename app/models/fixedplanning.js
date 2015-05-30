var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FixedPlanningSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    name: String,
    start_date: Date,
    end_date: Date,
    pinterest_url: String,
    days: [{
        index: Number,
        abbrev: String,
        daily_planning: {
            username: String,
            date: Date,
            recipe: {
                name: String,
                origin: {
                    url: String,
                    language: String,
                    image: String,
                    copyright: String
                },
                story: String,
                labels: [String],
                dish_labels: [String],
                short_name: String,
                image: String,
                persons: Number,
                original_recipes: [Object],
                time: Number,
                level: Number,
                language: String,
                ingredients: [{
                    for_what: String,
                    list: [{
                        name: String,
                        quantity: Number,
                        um: String,
                        category: String,
                        comment: String
                    }]
                }],
                instructions: [{
                    order: Number,
                    for_what: String,
                    text: String
                }],
                comments: [{
                    username: String,
                    text: String,
                    rating: String
                }]

            }
        },
        pinterest_url: String
    }]
},{
	collection: "fixed_planning"
});

var RecipesSchema = new Schema({
    name: String,
    origin: {
        url: String,
        language: String,
        image: String,
        copyright: String
    },
    story: String,
    labels: [String],
    dish_labels: [String],
    short_name: String,
    image: String,
    persons: Number,
    original_recipes: [Object],
    time: Number,
    level: Number,
    language: String,
    ingredients: [{
        for_what: String,
        list: [{
            name: String,
            quantity: Number,
            um: String,
            category: String,
            comment: String
        }]
    }],
    instructions: [{
        order: Number,
        for_what: String,
        text: String
    }],
    comments: [{
        username: String,
        text: String,
        rating: String
    }]
},{
	collection: "recipes"
});

var FixedPlanning = mongoose.model("FixedPlanning", FixedPlanningSchema);
var Recipes = mongoose.model("Recipes", RecipesSchema);

module.exports = {
	FixedPlanning: FixedPlanning,
	Recipes: Recipes
}