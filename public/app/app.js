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

var jsonToDate = function(dateJson) {
    return new Date(dateJson.year, dateJson.month, dateJson.day);
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
        $scope.startPlan = $stateParams;
    } else $scope.startPlan = currentMonday();
    startPlanPath = dateToPath($scope.startPlan);

    $http.get('api/plan/' + startPlanPath + '/lista')
        .success(function(data) {
            vm.lista = data;
            angular.forEach(vm.lista, function(sublista) {
                angular.forEach(sublista.ingrediente, function(produs) {
                    produs.cumparat = false;
                })
            });
        });

    $http.get('/api/plan/' + startPlanPath)
        .success(function(data) {
            $scope.plan = data;
            angular.forEach($scope.plan.zile, function(retete_o_zi) {
                var ingrediente = _.union(_.flatten(_.pluck(retete_o_zi.retete.ingrediente, 'lista')));
                retete_o_zi.retete.numar_ingrediente = _.union(_.pluck(ingrediente, 'nume')).length;

                retete_o_zi.retete.url = retete_o_zi.retete.nume.replace(/ /g, "_");
            });

            $scope.start_date = {
                year: parseInt($filter('date')($scope.plan.prima_zi, 'yyyy')),
                month: parseInt($filter('date')($scope.plan.prima_zi, 'MM')) - 1,
                day: parseInt($filter('date')($scope.plan.prima_zi, 'dd'))
            };
            $scope.thisWeek = (today >= jsonToDate($scope.start_date) && today < jsonToDate($scope.start_date).addDays(daysPerWeek));
        });

    var today = new Date();
    $scope.today = {
        year: today.getFullYear(),
        month: today.getMonth(),
        day: today.getDate()
    };


    $scope.isToday = function(start_date, index, today) {
        return (start_date.day + parseInt(index) - 1 == today.day);
    }

    $scope.animationsEnabled = true;
};

// var x= 2;

var mainController = function($scope, $timeout, $mdSidenav, $mdUtil, $log) {
    console.log('in main controller, nothing to do here for now');
    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
        var debounceFn = $mdUtil.debounce(function() {
            $mdSidenav(navID)
                .toggle()
                .then(function() {
                    $log.debug("toggle " + navID + " is done");
                });
        }, 300);

        return debounceFn;
    }
};

angular.module('plandemasaApp', ['scopeRoutes', 'ngTouch', 'ui.bootstrap', 'ngMaterial'])
    .controller('mainController',
        mainController
    )
    .controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function() {
            $mdSidenav('left').close()
                .then(function() {
                    $log.debug("close LEFT is done");
                });

        };
    })
    .controller('homeController',
        planController
    )
    .controller('RecipeModalInstanceCtrl', function($http, $scope, reteta, $stateParams) {
        if (!!reteta) {
            //modal display
            $scope.reteta = reteta;
        } else {
            //full display
            $http.get('api/plan' + path + dateToPath($stateParams) + path + "reteta" + path + $stateParams.id)
                .success(function(data) {
                    $scope.reteta = data[0].reteta;
                });
            $scope.year = $stateParams.year;
            $scope.month = $stateParams.month;
            $scope.day = $stateParams.day;
        }
    })
    .run(function($rootScope, $state, $modal) { //http://plnkr.co/edit/Qi1UDcFgTEeJmKa4liK2?p=preview
        var stateBehindModal = {},
            modalInstance = null;

        $rootScope.$on("$stateChangeStart", function(evt, toState, toStateParams, fromState, fromStateParams) {

            //
            // Implementing "proxy": redirect to the state according to where it's from.
            //
            if (toState.proxy) {
                evt.preventDefault();

                if (fromState.name === '' || fromState.name === toState.proxy.external) {
                    // Visiting directly via URL or from the external state,
                    // redirect to external (full) state.
                    $state.go(toState.proxy.external, toStateParams); // PINTEREST behaviour
                    // $state.go(toState.proxy.internal, toStateParams);
                } else {
                    // Visiting from another state, redirect to internal (modal) state
                    $state.go(toState.proxy.internal, toStateParams);
                }

                return;
            }

            // Implementing "isModal":
            // perform the required action to transitions between "modal states" and "non-modal states".
            //

            if (!fromState.isModal && toState.isModal) {
                //
                // Non-modal state ---> modal state
                //

                stateBehindModal = {
                    state: fromState,
                    params: fromStateParams
                };

                // Open up modal
                // modalInstance = $modal.open({
                //     template: '<div ui-view="modal"></div>'
                // });

                modalInstance = $modal.open({
                    // templateUrl: 'modal1.html',
                    template: '<div ui-view="modal"></div>',
                    // backdrop: 'static',
                    controller: function($modalInstance, $scope) {
                        $scope.close = function() {
                            $modalInstance.dismiss('close');
                        };
                    }
                });

                modalInstance.result.finally(function() {
                    // Reset instance to mark that the modal has been dismissed.
                    modalInstance = null

                    // Go to previous state
                    $state.go(stateBehindModal.state, stateBehindModal.params);
                });

            } else if (fromState.isModal && !toState.isModal) {
                //
                // Modal state ---> non-modal state
                //

                // Directly return if the instance is already dismissed.
                if (!modalInstance) {
                    return;
                }

                // Dismiss the modal, triggering the reset of modalInstance
                modalInstance.dismiss();
            }
        });
    });
