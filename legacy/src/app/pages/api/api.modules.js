/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('CarinaRM.pages.api', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('api', {
              url: '/api',
              templateUrl: 'app/pages/api/api.html',
          title: 'About',
          sidebarMeta: {
              icon: 'ion-information',
              order: 900
          }
          });
  }

})();
