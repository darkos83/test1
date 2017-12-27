var app = angular.module('myApp', []);

app.controller('MyCtrl', function($scope, $window, $http, $location) {
    var vm = this;

    vm.svi_stanovi = [];
    vm.stanovi = [];
    vm.stan = null;

    vm.currentPage = 1;
    vm.itemsPerPage = 9;
    vm.totalItems = 10;
    vm.maxSize = 5;

    vm.login = function () {
        console.log(vm.username);
        if(vm.username == 'sofija' && vm.password == '1234'){
            vm.autorizovan = true;
            $window.localStorage.setItem('user', vm.username);
            $window.location.href = "index.html";
        }else{
            $scope.alerts.push({ type: 'danger', msg: 'Korisnicko ime ili sifra nisu validni' } );
            return;
        }

    }

    vm.filterStatus = function () {
        var list = [];
        for(var i in vm.stanovi){
            var stan = vm.stanovi[i];
            console.log(vm.status);
            console.log(stan.details.status);
            console.log(vm.status == stan.details.status)
            if(vm.status == stan.details.status){
                list.push(stan);
            }
        }
        vm.stanovi = list;
        vm.totalItems = list.length;
    }

    vm.filterCity = function () {
        var list = [];
        for(var i in vm.stanovi){
            var stan = vm.stanovi[i];
            if(vm.city == stan.address.city){
                list.push(stan);
            }
        }
        vm.stanovi = list;
        vm.totalItems = list.length;
    }

    vm.search = function () {
        console.log(vm.city);
        console.log(vm.status);
        console.log(vm.text);
        console.log(vm.minPrice);
        console.log(vm.maxPrice);
        console.log(vm.car_garages);

    }
    vm.reset = function () {
        vm.city = null;
        vm.status = null;
        vm.text = null;
        vm.minPrice = null;
        vm.maxPrice = null;
        vm.car_garages = null;

        vm.init();
    }
    vm.logout = function () {
        vm.autorizovan = false;
        $window.localStorage.removeItem('user');

    }
    vm.register = function () {
        if(vm.password==vm.password1){
            vm.autorizovan = true;
            $window.localStorage.setItem('user', vm.username);
            $window.location.href = "index.html";

        }else{
            $scope.alerts.push({ type: 'danger', msg: 'Korisnicko ime ili sifra nisu validni' } );
            return;
        }

    }

    vm.vratiStan = function(property_id) {
        if (property_id == null || property_id == undefined) {
            return null;
        }

        var stan = null;
        for (var i in vm.svi_stanovi) {
            if (vm.svi_stanovi[i].property_id == property_id) {
                stan = vm.svi_stanovi[i];
                break;
            }
        }
        return stan;
    }

    vm.vratiStatus = function(status) {
        switch (status) {
            case 'sale':
                return 'For Sale';
            case 'rent':
                return 'For Rent';
            default:
                return 'Undefined';
        }
    }

    vm.init = function () {
        var url = $location.$$absUrl;

        var captured = /property_id=([^&]+)/.exec(url);
        var property_id = captured !== null ? captured[1] : null;

        vm.username = $window.localStorage.getItem('user');
        if(vm.username != undefined){
            vm.autorizovan = true;
        }else{
            vm.autorizovan = false;
        }

        var req = {
            method: "GET",
            //url: "http://88.99.171.79:8080/filmovi?search="+vm.searchText
            url: "properites.json"
        }
        $http(req).then(
            function(resp){
                vm.svi_stanovi = resp.data.properties;

                vm.stanovi = vm.svi_stanovi;
                vm.totalItems = vm.svi_stanovi.length;

                vm.stan = vm.vratiStan(property_id);
                console.log(vm.stan);
            }, function(resp){
                vm.message = 'error';
            });

    }

    vm.init();
});