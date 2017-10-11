/* global angular */
(function() {
    'use strict'

    angular.module('wca.layout', ['ui.router'])
        .config(RouteConfig)

    RouteConfig.$inject = ['$stateProvider']

    function RouteConfig($stateProvider) {
        $stateProvider
            .state('app', {
                abstract: true,
                ncyBreadcrumb: {
                    skip: true // Never display this state in breadcrumb.
                },
                views: {
                    root: {
                        templateUrl: '/public/modules/layout/layout.tpl.html',
                        controller: 'rootController as rootCtrl'

                    }
                }
            })
    }
})()
