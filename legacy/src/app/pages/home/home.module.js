/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('CarinaRM.pages.home', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: 'app/pages/home/home.html',
          controller: 'HomeCtrl',
          title: 'Home',
          sidebarMeta: {
            icon: 'ion-android-home',
            order: 0
          },
        });
  }

})();
