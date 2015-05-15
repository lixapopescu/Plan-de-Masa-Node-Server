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

    $http.get('/api/plan/21/lista')
        .success(function(data) {
            vm.lista = data;
            angular.forEach(vm.lista, function(sublista) {
                angular.forEach(sublista.ingrediente, function(produs) {
                    produs.cumparat = false;
                })
            });
        });

    $http.get('/api/plan/21')
        .success(function(data) {
            vm.plan = data;
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
    .controller('homeController', function() {
        var vm = this;
        vm.message = 'This is the home page!';
    })
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

    });;