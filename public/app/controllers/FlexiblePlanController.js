var setDayDistanceLabel = function(distance) {
    if (!!weekDistanceLabels[distance])
        return weekDistanceLabels[distance];
    else {
        return weekDistanceLabels[0] + ((distance > 0) ? ' +' : ' ') + distance;
    }
}

var fillCustomAttributesPlan = function(dailyPlans, today) {
    _.each(dailyPlans, function(dailyPlan) {
        dailyPlan.date = new Date(dailyPlan.date);
        dailyPlan.dayDistance = Math.round((dailyPlan.date - today) / millisecondsInDay);
        dailyPlan.dayLabel = getWeekDay(dailyPlan.date.getDay(), 's');
        dailyPlan.dayDistanceLabel = setDayDistanceLabel(dailyPlan.dayDistance);

        var ingredients = _.union(_.flatten(_.pluck(dailyPlan.recipe.ingredients, 'list')));
        dailyPlan.recipe.ingredientNumber = _.union(_.pluck(ingredients, 'name')).length;

        dailyPlan.recipe.url = getRecipeUrl(dailyPlan.recipe._id);
    });
    return setGlobalPlan(dailyPlans);
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


//get start_date -- end_date for current plan
//return in json format: start_year, start_month, start_day....
var getTimespan = function(today, days_before, days_after) {
    var start_date = new Date();
    var end_date = new Date();

    start_date.setDate(today.getDate() - days_before);
    end_date.setDate(today.getDate() + days_after);
    return {
        start_year: start_date.getFullYear(),
        start_month: start_date.getMonth() + 1,
        start_day: start_date.getDate(),
        end_year: end_date.getFullYear(),
        end_month: end_date.getMonth() + 1,
        end_day: end_date.getDate()
    }
}

var setGlobalPlan = function(dailyPlans) {
    console.log('set global plan attrs');
    var plan = {};

    var firstDay =
        _.chain(dailyPlans)
        .sortBy(function(d) {
            return d.date
        })
        .first()
        .value();
    var lastDay =
        _.chain(dailyPlans)
        .sortBy(function(d) {
            return d.date
        })
        .last()
        .value();
    console.log('firstDay', firstDay);
    console.log('lastDay', lastDay);
    plan.start = {
        label: firstDay.dayDistanceLabel
    }
    plan.last = {
        label: lastDay.dayDistanceLabel
    }

    return plan;
}


var FlexiblePlanController = function($http, $stateParams, $scope, $window) {
    console.log('in flex plan controller', $stateParams);

    $scope.today = new Date();
    $scope.today.setHours(0, 0, 0, 0);
    $scope.days_before = 0;
    $scope.days_after = 7;

    var apiPath;
    if (!$stateParams.start_day) {
        apiPath = jsonToPath(getTimespan($scope.today, $scope.days_before, $scope.days_after));
    } else {
        apiPath = jsonToPath($stateParams);
    }
    console.log('apiPath', apiPath);

    $http.get('api/plan' + apiPath)
        .success(function(data) {
            console.log(data);
            $scope.dailyPlans = data;
            $scope.globalPlan = fillCustomAttributesPlan($scope.dailyPlans, $scope.today);
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
    $scope.onSwipeLeft = function(ev){
        console.log('swipe left');
        $window.location.hash = '#shoppingList';
    }
}
