var mainController = function($scope, $http, $filter, $stateParams) {
    console.log('in main controller, nothing to do here for now');
}

angular.module('plandemasaApp', ['scopeRoutes', 'ngTouch', 'ui.bootstrap'])
    .controller('mainController', mainController)
    .controller('homeController', planController)
    .controller('RecipeAddController', RecipeAddController)
    .controller('RecipeAddFormController', RecipeAddFormController)
    .controller('RecipeModalInstanceController', RecipeModalInstanceController)
    .controller('FlexiblePlanController', FlexiblePlanController)
    .controller('FlexiblePlanRecipeController', FlexiblePlanRecipeController)
    .run(RecipeModalState)
