/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';


  angular.module('CarinaRM.pages.admin', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('admin', {
                url: '/admin',
                templateUrl: 'app/pages/admin/admin.html',
            title: 'Administrator',
            sidebarMeta: {
                icon: 'ion-android-person',
                order: 800
            }
        });
  }

})();
