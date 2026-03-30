/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('CarinaRM.pages.promotes', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        // .state('promotes', {
        //   url: '/promotes',
        //   template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
        //   abstract: true,
        //   title: 'Promotes',
        //   sidebarMeta: {
        //     icon: 'ion-grid',
        //     order: 300,
        //   },
        // }).state('promotes.dashboard', {
        //   url: '/dashboard',
        //   templateUrl: 'app/pages/promotes/promote-home.html',
        //   controller: 'CalenderCtrl',
        //   title: 'Dashboard',
        //   sidebarMeta: {
        //     order: 200,
        //   },

          .state('promotes', {
            url: '/promotes',
            templateUrl: 'app/pages/promotes/promote-home.html',
            controller: 'CalenderCtrl',
            title: 'Promotes',
            sidebarMeta: {
              icon: 'ion-android-document',
              order: 200
            }

          }).state('promoteDetails.update', {
            url: '/PromoteSheetUpdate',
            controller: 'PromoteSheetUpdateCtrl'

         }).state('promoteDetails', {
            url: '/details/:promoteFileID',
            templateUrl: 'app/pages/promotes/PromoteSheet.html',
            controller: 'PromoteSheetCtrl',
            title: 'promote details'
        });
    $urlRouterProvider.when('/promotes','/promotes/dashboard', 'promoteDetails', 'PromoteSheetUpdate');
  }

})();
