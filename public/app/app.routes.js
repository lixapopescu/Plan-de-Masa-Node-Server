angular.module('routerRoutes', ['ui.router', 'ct.ui.router.extras'])

.config(function($stateProvider, $stickyStateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');
    $stickyStateProvider.enableDebug(true);

    $stateProvider
        .state('/', {
            url: '/',
            templateUrl: 'app/views/pages/home.html',
            controller: 'homeController',
            controllerAs: 'home',
            deepStateRedirect: true
        })
        .state('/plan/:an/:luna/:zi', {
            url: '/plan/:an/:luna/:zi',
            templateUrl: 'app/views/pages/home.html',
            controller: 'homeController',
            controllerAs: 'home',
            deepStateRedirect: true
        })
        .state('/plan_detalii', {
            url: '/plan_detalii',
            templateUrl: 'app/views/pages/plan_detalii.html',
            controller: 'planDetaliiController',
            controllerAs: 'planDetCtrl'
        });

    $locationProvider.html5Mode(true);
});
