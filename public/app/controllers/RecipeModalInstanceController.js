var RecipeModalInstanceController = function($http, $scope, recipe, $stateParams) {
    var groupIngredientList = function(list) {
        return _.groupBy(list, function(item) {
            return item.category
        });
    }

    console.log('RecipeModalInstanceController', recipe);
    if (!!recipe) {
        //modal display
        $scope.recipe = recipe;
        //TODO
        // console.log('list', recipe.ingredients[0].list);
        // console.log(groupIngredientList(recipe.ingredients[0].list));
        // $scope.category_list = groupIngredientList(recipe.ingredients[0].list);
    } else {
        //full display
        $http.get('api/plan' + path + dateToPath($stateParams) + path + "recipe" + path + $stateParams.url)
            .success(function(data) {
                console.log('got recipe data', $stateParams);
                $scope.recipe = data[0].recipe;
            });
        $scope.year = $stateParams.year;
        $scope.month = $stateParams.month;
        $scope.day = $stateParams.day;
    }
}
