var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Retete = require('./retete');

//recipies for each day
var ReteteZileSchema = new Schema({
    index: String, //Monday = 1, Tuesday = 2... , Sunday = 7
    abreviatie: String, //letter designating each recipe within a meal plan
    retete: Retete,
    /*retete: {
        type: Schema.Types.ObjectId,
        ref: 'Retete'
    },*/
    categorie: String //category for each recipe. A recipe might be a "Side dish" one week and a "Main course" the next
});


//meal plan for each week
var PlanSchema = new Schema({
    nume: String, //name of the plan, typically "Plan #week"
    saptamana: Number, //week # of the year
    prima_zi: Date, //first day of the plan
    ultima_zi: Date, //last day of the plan, usually prima_zi + 6
    an: Number, //year of the plan
    zile: [ReteteZileSchema]
}, {
    collection: "plan"
});

module.exports = mongoose.model('Plan', PlanSchema);