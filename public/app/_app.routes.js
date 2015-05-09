angular.module('plandemasaRoutes', ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
        //pinterest weekly plan outline
            .when('/weeklypinterest', {
            templateUrl: 'views/pages/weeklypinterest.html',
            controller: 'pinterestController',
            controllerAs: 'pinterestCtrl'
        })
    })