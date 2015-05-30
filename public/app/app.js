var mainController = function($scope, $http, $filter, $stateParams) {
    console.log('in main controller, nothing to do here for now');
}

angular.module('plandemasaApp', ['scopeRoutes', 'ngTouch', 'ui.bootstrap'])
    .controller('mainController',
        mainController
    )
    .controller('homeController',
        planController
    )
    .controller('RecipeModalInstanceController', RecipeModalInstanceController)
    .run(RecipeModalState)
