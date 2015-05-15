var mainControllerCallback = function($scope, $window, $http, $filter) {
    var vm = this;

    vm.toggleCumparat = function(produs) {
        produs.cumparat = !produs.cumparat;
    }

    vm.countCumparate = function(produse){
        var produseCumparate = $filter('filter')(produse, {cumparat: true});
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

};

angular.module('routerApp', ['routerRoutes', 'ngTouch'])
    // create the controller and inject Angular's 
    // this will be the controller for the ENTIRE site
    .controller('mainController', ['$scope',
        '$window',
        '$http',
        '$filter',
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
    });