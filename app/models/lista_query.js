var schemas = require('./retete');
var Plan = schemas.Plan;
var Utils = require('../routes/utils');

var getListaAggregate = function(request, response, an, luna, zi) { //based on year/month/day
    // console.log('generate static shopping list: ' + sapt);
    Plan.aggregate({
                $unwind: "$zile"
            }, {
                $unwind: "$zile.retete.ingrediente"
            }, {
                $unwind: "$zile.retete.ingrediente.lista"
            }, {
                $match: {
                    // saptamana: parseInt(sapt)
                    prima_zi: Utils.getDateFromString(an, luna, zi)
                }
            },
            //unfold with no children
            {
                $project: {
                    nume: "$zile.retete.ingrediente.lista.nume",
                    cant: "$zile.retete.ingrediente.lista.cantitate",
                    um: "$zile.retete.ingrediente.lista.um",
                    comentariu: "$zile.retete.ingrediente.lista.comentariu",
                    categorie: "$zile.retete.ingrediente.lista.categorie",
                    reteta_abrev: "$zile.abreviatie",
                    zi_index: "$zile.index"
                }
            },
            //group by categorie, nume, um
            {
                $group: {
                    "_id": {
                        cat: "$categorie",
                        ing: "$nume",
                        um: "$um"
                    },
                    //comentarii: {$push: "$comentariu"},
                    reteta_abrev: {
                        $addToSet: "$reteta_abrev" //distinct values only. if not => error in angular
                    },
                    tot: {
                        $sum: "$cant"
                    }
                }
            },
            //replace "_id" with it's children
            {
                $project: {
                    "_id": false,
                    categorie: "$_id.cat",
                    ingredient: "$_id.ing",
                    total: "$tot",
                    um: "$_id.um",
                    reteta_abrev: "$reteta_abrev"
                }
            },
            //finally, group by main criteria, "$categorie"
            //and make custom element
            {
                $group: {
                    "_id": "$categorie",
                    ingrediente: {
                        $push: {
                            "nume": "$ingredient",
                            "total": "$total",
                            "um": "$um",
                            "reteta_abrev": "$reteta_abrev"
                        }
                    }
                }
            })
        .exec(function(err, lista) {//TODO: error handling
            response.json(lista);
        });

};

module.exports = getListaAggregate;