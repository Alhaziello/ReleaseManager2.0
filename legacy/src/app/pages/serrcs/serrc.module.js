/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('CarinaRM.pages.serrcs', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('serrcs', {
          url: '/serrcs',
          template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          // templateUrl: 'app/pages/serrcs/serrc-home.html',
          controller: 'SerrcCtrl',
          title: 'Carina Serrcs',
          sidebarMeta: {
              icon: 'ion-android-desktop',
              order: 100
          }
            }).state('serrcs.list', {
              url: '/list',
              templateUrl: 'app/pages/serrcs/serrc-home.html',
              controller: 'SerrcCtrl',
              title: 'View',
              sidebarMeta: {
                order: 100
              }
            }).state('serrcs.add', {
                url: '/addSerrc',
                templateUrl: 'app/pages/serrcs/model/SerrcAddModal.html',
                title: 'Add',
                sidebarMeta: {
                    order: 200
                }
            }).state('serrcs.delete', {
                url: '/deleteSerrc',
                templateUrl: 'app/pages/serrcs/model/SerrcDeleteModal.html',
                title: 'Delete',
                sidebarMeta: {
                    order: 300
                }
            }).state('serrcs.insert', {
                url: '/insertSerrc',
                controller: 'AddSerrcCtrl'

            }).state('serrcs.remove', {
                url: '/removeSerrc',
                controller: 'DeleteSerrcCtrl'

        });
    // $urlRouterProvider.when('/serrcs, /serrcs/list, /serrcs/add');
  }
})();
