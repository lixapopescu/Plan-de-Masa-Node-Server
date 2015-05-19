    //get current week by starting date aka Monday
    //return in format yyyy/MM/dd to query the API easier
    var currentMonday = function() {
        var today = new Date();
        var mondayAdjustement = (today.getDay() > 0) ? (-today.getDay() + 1) : -6; //adjust for week starting on Monday instead of Sunday
        return today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + (today.getDate() + mondayAdjustement);
    }


var mainControllerCallback = function($scope, $window, $http, $filter, $modal) {
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


    // $http.get('/api/plan/2015/05/18/lista')
    $http.get('api/plan/' + currentMonday() + '/lista')
        .success(function(data) {
            vm.lista = data;
            angular.forEach(vm.lista, function(sublista) {
                angular.forEach(sublista.ingrediente, function(produs) {
                    produs.cumparat = false;
                })
            });
        });

    $http.get('/api/plan/' + currentMonday())
        .success(function(data) {
            vm.plan = data;
            angular.forEach(vm.plan.zile, function(retete_o_zi) {
                var ingrediente = _.union(_.flatten(_.pluck(retete_o_zi.retete.ingrediente, 'lista')));
                retete_o_zi.retete.numar_ingrediente = _.union(_.pluck(ingrediente, 'nume')).length;
            });
        });

    $scope.items = ['item1', 'item2', 'item3'];
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

angular.module('plandemasaApp', ['routerRoutes', 'ngTouch', 'ui.bootstrap'])
    // create the controller and inject Angular's 
    // this will be the controller for the ENTIRE site
    .controller('mainController', ['$scope',
        '$window',
        '$http',
        '$filter',
        '$modal',
        mainControllerCallback
    ])
    .controller('pinterestWeeklyController', ['$scope',
        '$window',
        function($scope, $window) {
            var vm = this;
            vm.message = 'pinterest widget';
            //parse Pinterest board 
            var element = $("pinBoard");
            $window.parsePins(element.parent()[0]);
        }
    ])
    // home page specific controller
    .controller('homeController', ['$scope',
        '$window',
        '$http',
        '$filter',
        '$modal',
        mainControllerCallback
    ])
    // about page controller
    .controller('aboutController', function() {
        var vm = this;
        vm.message = 'Look! I am an about page.';
    })
    // contact page controller
    .controller('contactController', function() {
        var vm = this;
        vm.message = 'Contact us! JK. This is just a demo.';
    })
    .controller('RecipeModalInstanceCtrl', function($scope, $modalInstance, reteta) {
        var vm = this;
        $scope.reteta = reteta;

        $scope.ok = function() {
            $modalInstance.close();
        };

    })
    .controller('PlanController', function($scope) {});