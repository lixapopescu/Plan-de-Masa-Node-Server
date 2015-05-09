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

        .when('/pinterestWeekly', {
        	templateUrl: 'app/views/pages/pinterestweekly.html',
        	controller: 'pinterestWeeklyController',
        	controllerAs: 'pin'
        })

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
        });

    $locationProvider.html5Mode(true);
});