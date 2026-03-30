/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('CarinaRM.theme.components')
        .controller('PageTopCtrl', PageTopCtrl);

    /** @ngInject */
    /** $filter, $popover,  */
    function PageTopCtrl($scope) {
        //Passing the current user variable to the pageTop Controller
        $scope.currentUser = userName;
        $scope.currentUserRole = userRole;
    }
})();


