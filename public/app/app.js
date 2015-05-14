var mainControllerCallbackGrid = function($scope, $window, uiGridConstants, $http, $interval, $q) {
    // i18nService.setCurrentLang('ro'); //global setting
    var fakeI18n = function(title) {
        var deferred = $q.defer();
        $interval(function() {
            deferred.resolve('col: ' + title);
        }, 1000, 1);
        return deferred.promise;
    };
    $scope.gridOptions = {
        exporterMenuCsv: false,
        enableGridMenu: true,
        gridMenuTitleFilter: fakeI18n,
        columnDefs: [{
            name: 'name'
        }, {
            name: 'gender',
            enableHiding: false
        }, {
            name: 'company'
        }],
        gridMenuCustomItems: [{
            title: 'Rotate Grid',
            action: function($event) {
                this.grid.element.toggleClass('rotated');
            },
            order: 210
        }],
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            // interval of zero just to allow the directive to have initialized
            $interval(function() {
                gridApi.core.addToGridMenu(gridApi.grid, [{
                    title: 'Dynamic item',
                    order: 100
                }]);
            }, 0, 1);
            gridApi.core.on.columnVisibilityChanged($scope, function(changedColumn) {
                $scope.columnChanged = {
                    name: changedColumn.colDef.name,
                    visible: changedColumn.colDef.visible
                };
            });
        }
    };
    $http.get('bigData.json')
        .success(function(data) {
            $scope.gridOptions.data = data;
        });
};

var mainControllerCallback = function($scope, $window, uiGridConstants, $http, $interval, $q) {
    var vm = this;

    // 

    $http.get('/api/plan/21')
        .success(function(data) {
            vm.plan = data;
            console.log(vm.plan);
        });

};

angular.module('routerApp', ['routerRoutes', 'ngTouch', 'ui.grid', 'ui.grid.exporter', 'ui.grid.selection'])
    // create the controller and inject Angular's 
    // this will be the controller for the ENTIRE site
    .controller('mainController', ['$scope',
        '$window',
        'uiGridConstants',
        '$http',
        '$interval',
        '$q', //for promises
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