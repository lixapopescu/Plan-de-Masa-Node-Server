//get current week by starting date aka Monday
//return in format yyyy/MM/dd to query the API easier
var path = '/';
var daysPerWeek = 7; //days

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

Date.prototype.toJson = function() {
    return {
        year: this.getFullYear(),
        month: this.getMonth() + 1,
        day: this.getDate()
    }
}

var dateToPath = function(date) {
    return date.year + path + date.month + path + date.day;
}

var currentMonday = function() {
    var today = new Date();
    var mondayAdjustement = (today.getDay() > 0) ? (-today.getDay() + 1) : -6; //adjust for week starting on Monday instead of Sunday
    today.addDays(mondayAdjustement);
    return today.toJson();
};

var nextMonday = function() {
        var thisMonday = currentMonday();
        var nextMondayDate = new Date(thisMonday.year, thisMonday.month - 1, thisMonday.day).addDays(daysPerWeek);
        console.log('nextMondayDate', dateToPath(nextMondayDate.toJson()));
        return dateToPath(nextMondayDate.toJson());
    }


var planController = function($scope, $http, $filter, $modal, $stateParams) {
    console.log('home controller');
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

    vm.countCumparateReteta = function(reteta) {
        var allIngredients = _.flatten(_.pluck(vm.lista, 'ingrediente'));
        var allIngredientsBought = _.where(allIngredients, {
            cumparat: true
        });
        var count = 0;
        _.each(allIngredientsBought, function(ingred) {
            count += _.contains(ingred.reteta_abrev, reteta);
        });
        return count;
    }

    $scope.nextMonday = nextMonday();

    if (!!$stateParams.year && !!$stateParams.month && !!$stateParams.day) {
        // an = $stateParams.an;
        // luna = $stateParams.luna;
        // zi = $stateParams.zi;
        // startPlan = an + path + luna + path + zi;
        startPlan = dateToPath($stateParams);
        $scope.nextWeek = true;
    } else startPlan = dateToPath(currentMonday());

    $http.get('api/plan/' + startPlan + '/lista')
        .success(function(data) {
            vm.lista = data;
            angular.forEach(vm.lista, function(sublista) {
                angular.forEach(sublista.ingrediente, function(produs) {
                    produs.cumparat = false;
                })
            });
        });

    $http.get('/api/plan/' + startPlan)
        .success(function(data) {
            vm.plan = data;
            angular.forEach(vm.plan.zile, function(retete_o_zi) {
                var ingrediente = _.union(_.flatten(_.pluck(retete_o_zi.retete.ingrediente, 'lista')));
                retete_o_zi.retete.numar_ingrediente = _.union(_.pluck(ingrediente, 'nume')).length;
            });
            var today = new Date();
            $scope.today = {
                an: today.getFullYear(),
                luna: today.getMonth(),
                zi: today.getDate()
            };
            $scope.start_date = {
                an: parseInt($filter('date')(vm.plan.prima_zi, 'yyyy')),
                luna: parseInt($filter('date')(vm.plan.prima_zi, 'MM')) - 1,
                zi: parseInt($filter('date')(vm.plan.prima_zi, 'dd'))
            };
            $scope.isToday = function(start_date, index, today) {
                return (start_date.zi + parseInt(index) - 1 == today.zi);
            }
        });

    $scope.animationsEnabled = true;
    $scope.openModal = function(size, reteta) {
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'app/views/pages/recipeModal.html',
            controller: 'RecipeModalInstanceCtrl',
            size: size,
            resolve: {
                reteta: function() {
                    // console.log(reteta);
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

// var x= 2;

var mainController = function($scope, $http, $filter, $modal, $stateParams) {
    console.log('in main controller, nothing to do here for now');
}

angular.module('plandemasaApp', ['routerRoutes', 'ngTouch', 'ui.bootstrap', 'ngRoute'])
    .controller('mainController',
        mainController
    )
    .controller('homeController',
        planController
    )
    .controller('RecipeModalInstanceCtrl', function($scope, $modalInstance, reteta) {
        var vm = this;
        $scope.reteta = reteta;

        $scope.ok = function() {
            $modalInstance.close();
        };

    })
    .controller('testController', function($stateParams) {
        console.log('inside controller', $stateParams.id);
        // $scope.id =
    })
    //selected plan
    .controller('planController', function($stateParams) {
        console.log('plan controller');
    });
