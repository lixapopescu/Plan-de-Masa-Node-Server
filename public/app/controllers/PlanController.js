var planController = function($scope, $http, $filter, $modal, $stateParams) {
    console.log('home/plan controller');
    var vm = this;

    vm.toggleBought = function(produs) {
        produs.bought = !produs.bought;
    }

    vm.countBought = function(produse) {
        var productsBought = $filter('filter')(produse, {
            bought: true
        });
        return productsBought.length;
    }

    vm.countBoughtForRecipe = function(recipe) {
        var allIngredients = _.flatten(_.pluck(vm.list, 'ingredients'));
        var allIngredientsBought = _.where(allIngredients, {
            bought: true
        });
        var count = 0;
        // console.log(allIngredientsBought);
        _.each(allIngredientsBought, function(ingred) {
            count += _.contains(ingred.recipe_abbrev, recipe);
        });
        return count;
    }

    $scope.nextMonday = nextMonday();
    $scope.getWeekDay = function (index, style){
        return getWeekDay(index, style)
    }

    if (!!$stateParams.year && !!$stateParams.month && !!$stateParams.day) {
        $scope.startPlan = $stateParams;
    } else $scope.startPlan = currentMonday();
    startPlanPath = dateToPath($scope.startPlan);

    $http.get('api/plan/' + startPlanPath + '/lista')
        .success(function(data) {
            vm.list = data;
            angular.forEach(vm.list, function(sublist) {
                angular.forEach(sublist.ingredients, function(product) {
                    product.bought = false;
                })
            });
            console.log(vm.list);
        });

    $http.get('/api/plan/' + startPlanPath)
        .success(function(data) {
            $scope.plan = data;
            angular.forEach($scope.plan.days, function(recipe_one_day) {
                var ingrediente = _.union(_.flatten(_.pluck(recipe_one_day.daily_planning.recipe.ingredients, 'list')));
                recipe_one_day.daily_planning.recipe.ingredient_number = _.union(_.pluck(ingrediente, 'name')).length;

                recipe_one_day.daily_planning.recipe.url = getRecipeUrl(recipe_one_day.daily_planning.recipe._id);
            });

            $scope.start_date = {
                year: parseInt($filter('date')($scope.plan.start_date, 'yyyy')),
                month: parseInt($filter('date')($scope.plan.start_date, 'MM')) - 1,
                day: parseInt($filter('date')($scope.plan.start_date, 'dd'))
            };
            $scope.thisWeek = (today >= jsonToDate($scope.start_date) && today < jsonToDate($scope.start_date).addDays(daysPerWeek));
            console.log("plan", $scope.plan);
        });

    var today = new Date();
    $scope.today = {
        year: today.getFullYear(),
        month: today.getMonth(),
        day: today.getDate()
    };


    $scope.isToday = function(start_date, index, today) {
        return (start_date.day + parseInt(index) == today.day);
    }

    $scope.animationsEnabled = true;
};
