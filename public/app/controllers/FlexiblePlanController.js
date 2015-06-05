var fillCustomAttributesPlan = function($scope, dailyPlans) {
    _.each(dailyPlans, function(dailyPlan) {
        dailyPlan.date = new Date(dailyPlan.date);
        dailyPlan.dayDistance = Math.round((dailyPlan.date - $scope.today) / millisecondsInDay);
        dailyPlan.dayLabel = getWeekDay(dailyPlan.date.getDay(), 's');
        if (!!weekDistanceLabels[dailyPlan.dayDistance])
            dailyPlan.dayDistanceLabel = weekDistanceLabels[dailyPlan.dayDistance];
        else {
            var dist = weekDistanceLabels[0] + ((dailyPlan.dayDistance > 0) ? '+' : '') + dailyPlan.dayDistance;
            dailyPlan.dayDistanceLabel = dist;
        }
    });
}

var FlexiblePlanController = function($http, $stateParams, $scope) {
    console.log('in flex plan controller', $stateParams);
    var apiPath = jsonToPath($stateParams);

    $scope.today = new Date();

    $http.get('api/plan' + apiPath)
        .success(function(data) {
            console.log(data);
            fillCustomAttributesPlan($scope, data);
            $scope.dailyPlans = data;
        });
}
