var fillCustomAttributesPlan = function(dailyPlans, today) {
    _.each(dailyPlans, function(dailyPlan) {
        dailyPlan.date = new Date(dailyPlan.date);
        dailyPlan.dayDistance = Math.round((dailyPlan.date - today) / millisecondsInDay) + 1;
        dailyPlan.dayLabel = getWeekDay(dailyPlan.date.getDay(), 's');
        if (!!weekDistanceLabels[dailyPlan.dayDistance])
            dailyPlan.dayDistanceLabel = weekDistanceLabels[dailyPlan.dayDistance];
        else {
            var dist = weekDistanceLabels[0] + ((dailyPlan.dayDistance > 0) ? ' +' : ' ') + dailyPlan.dayDistance;
            dailyPlan.dayDistanceLabel = dist;
        }

        var ingredients = _.union(_.flatten(_.pluck(dailyPlan.recipe.ingredients, 'list')));
        dailyPlan.recipe.ingredientNumber = _.union(_.pluck(ingredients, 'name')).length;

        dailyPlan.recipe.url = getRecipeUrl(dailyPlan.recipe._id);
    });
}

var fillCustomAttributesList = function(list) {
    _.each(list, function(categ) {
        _.each(categ, function(item) {
            item.bought = false;
        })
        categ.folded = true;
    });
}

var attachAbbrevToPlan = function(dailyPlans) {
    _.each(_.sortBy(dailyPlans, 'date'), function(dailyPlan, index) {
        dailyPlan.abbrev = String.fromCharCode(65 + index);
    })
}

var attachAbbrevToList = function(dailyPlans, list) {
    //wait until both are retrieved from server
    if (!!dailyPlans && !!list) {
        _.each(list, function(categ) {
            _.each(categ.ingredients, function(item) {
                _.each(item.details, function(detail) {
                    //gather abbrevs from recipes
                    detail.abbrev = _.chain(dailyPlans)
                        .filter(function(plan) {
                            return plan.recipe._id == detail.recipe_id
                        })
                        .first()
                        .value()
                        .abbrev;
                });
                item.unfoldable = _.filter(item.details, function(detail) {
                    return !!detail.quantity || !!detail.comment || !!detail.um;
                }).length == 0;
                // console.log(item.name, item.unfoldable);
            })
        })
    }
}

var toggleBought = function(product) {
    product.bought = !product.bought;
}

var toggleFolded = function(category) {
    // console.log('folded toggle', category._id, category.folded);
    category.folded = !category.folded;
}

var countBought = function(products) {
    return _.filter(products, {
        bought: true
    }).length;;
}

var countBoughtForRecipe = function(recipe, list) {
    var allIngredients = _.flatten(_.pluck(list, 'ingredients'));
    var allIngredientsBought = _.where(allIngredients, {
        bought: true
    });
    var count = 0;
    // console.log('allIngredientsBought', allIngredientsBought, recipe._id);
    _.each(allIngredientsBought, function(ingred) {
        count += _.contains(ingred.recipe_ids, recipe._id);
    });
    // console.log('count', count);
    return count;
}

var FlexiblePlanController = function($http, $stateParams, $scope) {
    console.log('in flex plan controller', $stateParams);
    var apiPath = jsonToPath($stateParams);

    $scope.today = new Date();

    $http.get('api/plan' + apiPath)
        .success(function(data) {
            console.log(data);
            $scope.dailyPlans = data;
            fillCustomAttributesPlan($scope.dailyPlans, $scope.today);
            attachAbbrevToPlan($scope.dailyPlans);
            attachAbbrevToList($scope.dailyPlans, $scope.list);
        });

    $http.get('api/plan' + apiPath + '/list')
        .success(function(data) {
            console.log(data);
            $scope.list = data;
            fillCustomAttributesList($scope.list);
            attachAbbrevToList($scope.dailyPlans, $scope.list);
        });

    $scope.toggleBought = toggleBought;
    $scope.toggleFolded = toggleFolded;
    $scope.countBought = countBought;
    $scope.countBoughtForRecipe = countBoughtForRecipe;
}