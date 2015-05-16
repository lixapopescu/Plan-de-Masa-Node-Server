// inject ngRoute for all our routing needs
angular.module('routerRoutes', ['ngRoute'])

// configure our routes
.config(function($routeProvider, $locationProvider) {
    $routeProvider

        // route for the home page
        // .when('/', {
        //     templateUrl : 'app/views/pages/home.html',
        //     controller  : 'homeController',
        //     controllerAs: 'home'
        // })

        // route for the about page
        .when('/about', {
            templateUrl : 'app/views/pages/about.html',
            controller  : 'aboutController',
            controllerAs: 'about'
        })

        // route for the contact page
        .when('/contact', {
            templateUrl : 'app/views/pages/contact.html',
            controller  : 'contactController',
            controllerAs: 'contact'
        })
        .when('/plan_detalii', {
            templateUrl : 'app/views/pages/plan_detalii.html',
            controller  : 'planDetaliiController',
            controllerAs: 'planDetCtrl'
        });

    $locationProvider.html5Mode(true);
});