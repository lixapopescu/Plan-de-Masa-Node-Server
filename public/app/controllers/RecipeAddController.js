var RecipeAddController = function($scope, $http, $stateParams) {
    console.log('RecipeAddController');
    // $scope.recipe = {};
    // console.log($scope.recipe);
    $scope.ingredientListCount = 1;
    $scope.ingredientCount = [];
    $scope.ingredientCount[$scope.ingredientListCount - 1] = 1;
    $scope.instructionCount = 1;

    $scope.getNumber = function(num) {
        return new Array(num);
    }

    $scope.addIngredient = function(index) {
        console.log('addIngredient ', index, $scope.ingredientCount[index]);
        $scope.ingredientCount[index]++;
    }

    $scope.addIngredientList = function() {
        console.log('addIngredientList', $scope.ingredientListCount);
        $scope.ingredientListCount++;
        $scope.ingredientCount[$scope.ingredientListCount - 1] = 1;
    }

    $scope.addInstruction = function() {
        $scope.instructionCount++;
    }

    //recipe defaults
    $scope.recipe = {};
    $scope.recipe.origin = {};
    $scope.recipe.origin.language = "en";
    $scope.recipe.level = 1;
    $scope.recipe.persons = 4;
    $scope.recipe.language = "ro";
    $scope.recipe.ingredients = [];
    $scope.recipe.instructions = [];

    $scope.add = function(recipe) {
        if (!!recipe.labels) recipe.labels = recipe.labels.split(",").trim();
        if (!!recipe.dish_labels) recipe.dish_labels = recipe.dish_labels.split(",");
        console.log('add', recipe);
        $http.put('/api/admin/recipe', {
                recipe: recipe
            })
            .success(function(data, status, headers, config) {
                console.log('put successful', data, headers());
            })
            .error(function(data, status, headers, config) {
                console.log('put error', data, headers);
            });
    }
}
