/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('CarinaRM.pages.serrcs')
        .controller('SerrcCtrl', SerrcCtrl);

    /** @ngInject */
    /** $filter, $popover,  */
    function SerrcCtrl($scope, $http, $log, $stateParams){

        var inputItem = $stateParams.keyword;
        $log.log(inputItem);

        $scope.filterSerrc = inputItem;
        $scope.mainOrder = 'SerrcNumber';
        $scope.reverse = true;

        $http({
            method: 'GET',
            withCredentials: true,
            url: 'http://AKL0AP319:8283/api/serrc'

        }).success(function(item){

            $scope.SerrcList = item; // get data from json
            // console.log('Data: ', $scope.SerrcList);
            $scope.Serrcs = $scope.SerrcList;

            $scope.totalSerrcItems = $scope.SerrcList.length; // Total no of items
            $scope.showSerrcItems = 25; // Set number of items to show in a page
            $scope.serrcItemPerPage = $scope.showSerrcItems;

        }).error(function(){
                alert("No List received from server");
            }
        );
    }
    })();


