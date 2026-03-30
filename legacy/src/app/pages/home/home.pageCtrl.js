/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('CarinaRM.pages.home')
        .controller('HomeCtrl', HomeCtrl);

    /** @ngInject */
    /** $filter, $popover,  */
    function HomeCtrl($scope) {

        $scope.currentUser = userName;
        $scope.currentUserRole = userRole;

        // console.log('JSON: ', userName);
    }
})();


