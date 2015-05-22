    //get current week by starting date aka Monday
    //return in format yyyy/MM/dd to query the API easier
    var currentMonday = function() {
        var today = new Date();
        console.log('today', today);
        var mondayAdjustement = (today.getDay() > 0) ? (-today.getDay() + 1) : -6; //adjust for week starting on Monday instead of Sunday
        return today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + (today.getDate() + mondayAdjustement);
    }


var planController = function($scope, $http, $filter, $modal, $routeParams) {
    console.log('home controller');
    var vm = this;

    vm.toggleCumparat = function(produs) {
        produs.cumparat = !produs.cumparat;
    }

    vm.countCumparate = function(produse) {
        var produseCumparate = $filter('filter')(produse, {
            cumparat: true
        });
        return produseCumparate.length;
    }

    vm.countCumparateReteta = function(reteta) {
        var allIngredients = _.flatten(_.pluck(vm.lista, 'ingrediente'));
        var allIngredientsBought = _.where(allIngredients, {
            cumparat: true
        });
        var count = 0;
        _.each(allIngredientsBought, function(ingred) {
            count += _.contains(ingred.reteta_abrev, reteta);
        });
        return count;
    }

    if (!!$routeParams.an && !!$routeParams.luna && !!$routeParams.zi){
        an = $routeParams.an;
        luna = $routeParams.luna;
        zi = $routeParams.zi;
        startPlan = an + '/'+ luna + '/' + zi;
        $scope.nextWeek = true;
    }
    // else console.log('an not provided', $routeParams.an);
    else startPlan = currentMonday();

    console.log('currentMonday', currentMonday());
    // $http.get('/api/plan/2015/05/18/lista')

    $http.get('api/plan/' + startPlan + '/lista')
        .success(function(data) {
            vm.lista = data;
            angular.forEach(vm.lista, function(sublista) {
                angular.forEach(sublista.ingrediente, function(produs) {
                    produs.cumparat = false;
                })
            });
        });

    $http.get('/api/plan/' + startPlan)
        .success(function(data) {
            vm.plan = data;
            angular.forEach(vm.plan.zile, function(retete_o_zi) {
                var ingrediente = _.union(_.flatten(_.pluck(retete_o_zi.retete.ingrediente, 'lista')));
                retete_o_zi.retete.numar_ingrediente = _.union(_.pluck(ingrediente, 'nume')).length;
            });
        });

    $scope.animationsEnabled = true;
    $scope.openModal = function(size, reteta) {
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'app/views/pages/recipeModal.html',
            controller: 'RecipeModalInstanceCtrl',
            size: size,
            resolve: {
                reteta: function() {
                    console.log(reteta);
                    return reteta;
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            console.info('Modal dismissed at: ' + new Date());
        });
    };
};

// var x= 2;

var mainController = function($scope, $http, $filter, $modal, $routeParams) {
    console.log('in main controller, nothing to do here for now');
}

angular.module('plandemasaApp', ['routerRoutes', 'ngTouch', 'ui.bootstrap', 'ngRoute'])
    .controller('mainController',
        mainController
    )
    .controller('homeController', 
        planController
    )
    .controller('RecipeModalInstanceCtrl', function($scope, $modalInstance, reteta) {
        var vm = this;
        $scope.reteta = reteta;

        $scope.ok = function() {
            $modalInstance.close();
        };

    })
    .controller('testController', function($routeParams){
        console.log('inside controller', $routeParams.id);
        // $scope.id =
    })
    //selected plan
    .controller('planController', function($routeParams) {
        console.log('plan controller');
    });