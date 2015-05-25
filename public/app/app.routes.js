angular.module('scopeRoutes', ['ui.router', 'ct.ui.router.extras'])

.config(function($stateProvider, $stickyStateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');
    // $stickyStateProvider.enableDebug(true);

    $stateProvider
        .state('/', {
            url: '/',
            templateUrl: 'app/views/pages/home.html',
            controller: 'homeController',
            controllerAs: 'home',
            deepStateRedirect: true
        })
        .state('plan', {
            url: '/plan/:year/:month/:day',
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
        })
        .state('retetaModal', {
            url: '/plan/:year/:month/:day/:id',
            controller: 'RecipeModalInstanceCtrl',  
            params:{reteta: null,},
            // template: '<div ui-view></div>',
            resolve: {
                reteta: function($stateParams) {
                    console.log('stateParams', $stateParams);
                    return $stateParams.reteta
                }
            },
            proxy: { // Custom config processed in $stateChangeStart
                external: 'retetaModal.full',
                internal: 'retetaModal.modal'
            },
            stickyState: true
        })
        .state('retetaModal.modal', {
            views: {
                "modal@": {
                    templateUrl: 'app/views/pages/recipeModal.html',
                    controller: 'RecipeModalInstanceCtrl'
                }
            },
            isModal: true // Custom config processed in $stateChangeStart
        })
        .state('retetaModal.full', {
            views: {
                "@": {
                    templateUrl: 'app/views/pages/recipeModalFull.html',
                    controller: 'RecipeModalInstanceCtrl'
                }
            }
        });

    $locationProvider.html5Mode(true);
});
