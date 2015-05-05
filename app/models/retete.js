var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var IngredienteSchema = new Schema({
	nume: {type: String, required: true},
	comentariu: String,
	cantitate: Number,
	um: String,
	categorie: {type: String, required: true}
});

var InstructiuniSchema = new Schema({
	ordine: Number,
	text: {type: String, required: true},
});

//Retete schema
var ReteteSchema = new Schema({
    nume: {type: String, required: true, index: { unique: true }},
    origine: String,
    origine_url: String,
    ingrediente: [IngredienteSchema],
    intructiuni: [InstructiuniSchema]
},{
	collection: "retete"
});

module.exports = mongoose.model('Retete', ReteteSchema);