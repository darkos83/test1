var app = angular.module('myApp', ['ui.bootstrap']);

app.controller('MyCtrl', function($scope, $window, $http, $location) {
    var vm = this;

    vm.svi_stanovi = [];
    vm.stanovi = [];
    vm.stan = null;
    vm.moji_stanovi = [];

    vm.korisnici = [];
    vm.korisnik = null;

    vm.user = null;

    vm.currentPage = 1;
    vm.itemsPerPage = 9;
    vm.totalItems = 10;
    vm.maxSize = 5;

    vm.sortColumn = 'price';
    vm.sortClass = 'fa-sort-numeric-asc';
    vm.reverse = false;

    $scope.alerts = [
    ];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };


    vm.login = function () {
        for (var i in vm.korisnici) {
            var korisnik = vm.korisnici[i];
            console.log(korisnik);
            if (vm.username == korisnik.username && vm.password == korisnik.password) {
                vm.autorizovan = true;
                $window.localStorage.setItem('user', JSON.stringify(korisnik));
                $window.location.href = "index.html";
            }
        }
        $scope.alerts.push({ type: 'danger', msg: 'Korisnicko ime ili sifra nisu validni' } );
    }

    vm.orderByColumn = function() {
        console.log(vm.reverse);
        if (vm.reverse) {
            vm.reverse = false;
            vm.sortClass = 'fa-sort-numeric-asc';
        } else {
            vm.sortClass = 'fa-sort-numeric-desc';
            vm.reverse = true;
        }
    }
    vm.removeProperty = function (item) {
        if (confirm('Da li ste sigurni')) {
            var index = vm.stanovi.indexOf(item);
            vm.stanovi.splice(index, 1);
        }

    };

    vm.search = function () {
        if(vm.city == undefined && vm.status == undefined && vm.bedrooms == undefined && vm.bathrooms == undefined && vm.minPrice == undefined && vm.maxPrice == undefined && vm.searchText == undefined){
        vm.init();
            return;
            
        }
        
        var list = [];
        var tmp_list = [];
        if(vm.city != undefined){
            for(var i in vm.svi_stanovi){
            var stan = vm.svi_stanovi[i];
            if(vm.city == stan.address.city){
                list.push(stan);
            }
            }
        }else{
            list = vm.svi_stanovi;
        }
        
        if(vm.status != undefined){
            for(var i in list){
            var stan = list[i];
            if(vm.status == stan.details.status){
                tmp_list.push(stan);
            }
            }
            list = tmp_list;
            tmp_list = [];
        }
        if(vm.bedrooms != undefined){
              for(var i in list){
            var stan = list[i];
            if(vm.bedrooms == stan.details.bedrooms){
                tmp_list.push(stan);
            }
            }
            list = tmp_list;
            tmp_list = [];
        }
         if(vm.bathroms != undefined){
              for(var i in list){
            var stan = list[i];
            if(vm.bathroms == stan.details.bathroms){
                tmp_list.push(stan);
            }
            }
            list = tmp_list;
            tmp_list = [];
        }
        
      if(vm.minPrice != undefined){
              for(var i in list){
            var stan = list[i];
            if(stan.price >= vm.minPrice){
                tmp_list.push(stan);
            }
            }
            list = tmp_list;
            tmp_list = [];
        }
         if(vm.maxPrice != undefined){
              for(var i in list){
            var stan = list[i];
            if(stan.price <= vm.maxPrice){
                tmp_list.push(stan);
            }
            }
            list = tmp_list;
            tmp_list = [];
        }
        if(vm.searchText != undefined){
         for(var i in list){
            var stan = list[i];
            if(stan.title.toLowerCase().indexOf(vm.searchText.toLowerCase())!=-1){
                        tmp_list.push(stan);

            }
            }
            
            list = tmp_list;
            tmp_list = []; 
        }
        
        vm.stanovi = list;
        vm.totalItems = list.length;
        
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
    
    vm.orderByPrice = function() {
       var list =  vm.stanovi.sort(vm.compare);
        console.log(list);
    }
    
     vm.favorite = function(el){
        if (!vm.autorizovan) {
            $scope.alerts.push({ type: 'danger', msg: 'Morate da budete ulogovani' } );
            return;
        }
        el.favorite = !el.favorite;
        if(el.favorite == true){
            $scope.alerts.push({ type: 'success', msg: 'Film prebacen u grupu omiljenih' } )
        }else {
            $scope.alerts.push({ type: 'danger', msg: 'Film vise nije omiljen' } )
        }
     }
    
    vm.compare = function(a,b){
        if(a.price < b.price){
            return -1;
            
        }
        if(a.price > b.price){
            return 1;
        }
        return 0;
    } 
    vm.logout = function () {
        vm.autorizovan = false;
        $window.localStorage.removeItem('user');

    }

    vm.getPropertImage = function (el) {
        var index = vm.stanovi.indexOf(el) + 1;
        if (index > 6) {
            index = index % 6 + 1;
        }
        return 'assets/img/demo/property-' + index + '.jpg';
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

    vm.vratiKorisnika = function(user_id) {
        if (user_id == null || user_id == undefined) {
            return null;
        }

        var korisnik = null;
        for (var i in vm.korisnici) {
            if (vm.korisnici[i].user_id == user_id) {
                korisnik = vm.korisnici[i];
                break;
            }
        }
        return korisnik;
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

        var my_properites = /user-properties.html/.exec(url);

        vm.user = $window.localStorage.getItem('user');
        if(vm.user != undefined){
            vm.user = JSON.parse(vm.user);
            vm.autorizovan = true;
        }else{
            vm.autorizovan = false;
        }

        var req1 = {
            method: "GET",
            //url: "http://88.99.171.79:8080/filmovi?search="+vm.searchText
            url: "users.json"
        }
        $http(req1).then(
            function(resp){
                vm.korisnici = resp.data.users;
            }, function(resp){
                vm.message = 'error';
            });

        var req = {
            method: "GET",
            //url: "http://88.99.171.79:8080/filmovi?search="+vm.searchText
            url: "properites.json"
        }
        $http(req).then(
            function(resp){
                vm.svi_stanovi = resp.data.properties;
                if (vm.user != null && my_properites != null) {
                    var list = [];
                    for (var i in vm.svi_stanovi) {
                        if (vm.svi_stanovi[i].user_id == vm.user.user_id ) {
                            list.push(vm.svi_stanovi[i]);
                        }
                    }
                }
                vm.stanovi = list != undefined ? list : vm.svi_stanovi;

                vm.totalItems = vm.stanovi.length;

                vm.stan = vm.vratiStan(property_id);
                if (vm.stan != null && vm.stan.hasOwnProperty('user_id')) {
                    vm.korisnik = vm.vratiKorisnika(vm.stan.user_id);
                }
            }, function(resp){
                vm.message = 'error';
            });
    }

    vm.init();
});