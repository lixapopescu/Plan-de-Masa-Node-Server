// inject ngRoute for all our routing needs
angular.module('routerRoutes', ['ngRoute'])

// configure routes. Some names optimizied for indexing
.config(function($routeProvider, $locationProvider) {
    $routeProvider

        //route for the home page
        .when('/', {
            templateUrl : 'app/views/pages/home.html',
            controller  : 'homeController',
            controllerAs: 'home'
        })
        // .when('/ce_gatesc_saptamana_viitoare', {
        //     templateUrl : 'app/views/pages/saptamana_viitoare.html',
        //     controller  : 'homeController',
        //     controllerAs: 'home'
        // })
        .when('/plan/:an/:luna/:zi', {
            templateUrl: 'app/views/pages/home.html',
            controller: 'homeController',
            controllerAs: 'home'
        })

        // route for the contact page
        .when('/test/:id', {
            templateUrl : 'app/views/pages/test.html',
            controller  : 'testController',
            controllerAs: 'test'
        })
        .when('/plan_detalii', {
            templateUrl : 'app/views/pages/plan_detalii.html',
            controller  : 'planDetaliiController',
            controllerAs: 'planDetCtrl'
        });

    $locationProvider.html5Mode(true);
});