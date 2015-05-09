angular.module('plandemasaApp', ['plandemasaRoutes'])
.controller('mainController', function() {
    var vm = this;
    vm.message = 'Angular Hello World';
})
.controller('pinterestController', function() {
    var vm = this;
    vm.message = 'Pinterest Inside';
})