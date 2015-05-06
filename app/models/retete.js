var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//define all in one place for now, to handle interdependencies
//TODO: separate each schema in their own file model
var IngredienteSchema = new Schema({
    nume: {
        type: String,
        required: true
    },
    comentariu: String,
    cantitate: Number,
    um: String,
    categorie: {
        type: String,
        required: true
    }
});

var InstructiuniSchema = new Schema({
    ordine: Number,
    text: {
        type: String,
        required: true
    },
});

//Retete schema
var ReteteSchema = new Schema({
    nume: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    origine: String,
    origine_url: String,
    ingrediente: [IngredienteSchema],
    intructiuni: [InstructiuniSchema]
}, {
    collection: "retete"
});

//recipies for each day
var ReteteZileSchema = new Schema({
    index: String, //Monday = 1, Tuesday = 2... , Sunday = 7
    abreviatie: String, //letter designating each recipe within a meal plan
    retete: {
        nume: {
            type: String,
            required: true,
            index: {
                unique: true
            }
        },
        origine: String,
        origine_url: String,
        ingrediente: [IngredienteSchema],
        intructiuni: [InstructiuniSchema]
    },
    categorie: String //category for each recipe. A recipe might be a "Side dish" one week and a "Main course" the next
});


//meal plan for each week
var PlanuriSchema = new Schema({
    nume: String, //name of the plan, typically "Plan #week"
    saptamana: Number, //week # of the year
    prima_zi: Date, //first day of the plan
    ultima_zi: Date, //last day of the plan, usually prima_zi + 6
    an: Number, //year of the plan
    zile: [ReteteZileSchema]
}, {
    collection: "plan"
});

//prepare to export all models from this file
var Plan = mongoose.model("Planuri", PlanuriSchema);
var Reteta = mongoose.model("Retete", ReteteSchema);
module.exports = {
    Plan: Plan,
    Reteta: Reteta
}