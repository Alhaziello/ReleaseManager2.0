/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('CarinaRM.pages', [
    'ui.router',

      // Added this form section because without this SERRC Add/Delete models are not working.
      //  Need to add remove the dependiency and take off form from this list - If I remove form then rows to
    'CarinaRM.pages.home',
    'CarinaRM.pages.form',
    'CarinaRM.pages.api',
    'CarinaRM.pages.promotes',
    'CarinaRM.pages.serrcs',
    'CarinaRM.pages.admin'
    // 'CarinaRM.pages.carina'

  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/home');

    // baSidebarServiceProvider.addStaticItem({
    //   title: 'Pages',
    //   icon: 'ion-document',
    //   subMenu: [{
    //     title: 'Sign In',
    //     fixedHref: 'auth.html',
    //     blank: true
    //   }, {
    //     title: 'Sign Up',
    //     fixedHref: 'reg.html',
    //     blank: true
    //   }, {
    //     title: 'User Profile',
    //     stateRef: 'profile'
    //   }, {
    //     title: '404 Page',
    //     fixedHref: '404.html',
    //     blank: true
    //   }]
    // });
    // baSidebarServiceProvider.addStaticItem({
    //   title: 'Menu Level 1',
    //   icon: 'ion-ios-more',
    //   subMenu: [{
    //     title: 'Menu Level 1.1',
    //     disabled: true
    //   }, {
    //     title: 'Menu Level 1.2',
    //     subMenu: [{
    //       title: 'Menu Level 1.2.1',
    //       disabled: true
    //     }]
    //   }]
    // });

  }

})();
