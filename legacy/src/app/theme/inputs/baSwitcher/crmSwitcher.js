/**
 * @author v.lugovsky
 * created on 10.12.2016
 */
(function () {
  'use strict';

  angular.module('CarinaRM.theme.inputs')
      .directive('crmSwitcher', crmSwitcher);

  /** @ngInject */
  function crmSwitcher() {
    return {
      templateUrl: 'app/theme/inputs/baSwitcher/crmSwitcher.html',
      scope: {
        switcherStyle: '@',
        switcherValue: '='
      }
    };
  }
})();
