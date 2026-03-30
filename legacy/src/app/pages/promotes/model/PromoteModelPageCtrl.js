/**
 * @author a.demeshko
 * created on 18.01.2016
 */
(function () {
  'use strict';

  angular.module('CarinaRM.pages.serrcs')
    .controller('ManipulateSerrcModelCtrl', ManipulateSerrcModelCtrl);

  /** @ngInject */
  function ManipulateSerrcModelCtrl($scope, $uibModal, baProgressModal) {
    $scope.open = function (page, size) {
      $uibModal.open({
        animation: true,
        templateUrl: page,
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });
    };
    $scope.openProgressDialog = baProgressModal.open;
  }


})();
