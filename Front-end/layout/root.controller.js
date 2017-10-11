(function () {
    'use strict';
    angular.module('wca.layout')
        .controller('rootController', RootController)

    RootController.$inject = ['$state', '$window', 'authenticationService'];

    function RootController($state, $window, authenticationService) {
        'use strict';
        var vm = this;
        
        vm.$onInit = () => {
            vm.userName = localStorage.userName
        }

        vm.logout = () => {
            authenticationService.logout()
            .then(_onLogoutSuccess)
            .catch(_onError);
        }
        function _onLogoutSuccess(res) {
            localStorage.clear();
            $window.location.href = '/';
        }
        function _onError(err){
            console.log(err);
        }
    }
})();