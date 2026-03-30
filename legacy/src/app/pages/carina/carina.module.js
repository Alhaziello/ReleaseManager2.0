/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('CarinaRM.pages.carina', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('carinaServices', {
            url: '/carinaServices',
            templateUrl: 'app/pages/carina/baggageAllowanceTable.html',
            controller: 'CarinaCtrl',
            title: 'Carina POC',
            sidebarMeta: {
                order: 100
            }
            });
            // $urlRouterProvider.when('/serrcs, /serrcs/list, /serrcs/add');
        }
 })();
