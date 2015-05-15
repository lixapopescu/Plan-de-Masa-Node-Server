var mainControllerCallback = function($scope, $window, $http, $filter) {
    var vm = this;

    // var getReteteByDay = function(vm, day, $filter) {
    //     return $filter('filter')(vm.plan.zile, {
    //         index: day
    //     });
    // }

    // var getLink = function(reteta) {
    //     return '<a href="#">' + reteta.nume + '</a>';
    // }

    // $scope.planGrid = {
    //     columnDefs: [{
    //         name: "Luni",
    //         // cellTemplate: '<div> <a href="#">' + this.nume + '</a> </div>'
    //         field: "getLuni()",
    //         cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="{{row.getProperty(col.field)}}">Visible text</a></div>',
    //         enableCellEdit: false
    //     }, {
    //         field: "Marti"
    //     }, {
    //         field: "Miercuri"
    //     }]
    // };

    $http.get('/api/plan/21/lista')
        .success(function(data) {
            vm.lista = data;
            // console.log(vm.lista);
        });

    $http.get('/api/plan/21')
        .success(function(data) {
            vm.plan = data;

            // $scope.planGrid.data = [{
            //     "Luni": $filter('filter')(vm.plan.zile, {
            //         index: 1
            //     })[0].retete.nume,
            //     "getLuni": function() {
            //         var reteta = getReteteByDay(vm, 1, $filter)[0].retete;
            //         return reteta.nume;
            //     }
            // }];
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