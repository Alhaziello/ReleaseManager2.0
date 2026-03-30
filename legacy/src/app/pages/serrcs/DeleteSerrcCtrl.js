/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('CarinaRM.pages.serrcs')
        .controller('DeleteSerrcCtrl', DeleteSerrcCtrl);

    /** @ngInject */
    /** $filter, $popover,  */
    function DeleteSerrcCtrl($scope, $http, $log, toastr, $state) {

        var serrcNo = document.getElementById("serrcNo").value;

        $http({
            method: 'DELETE',
            withCredentials: true,
            url: 'http://AKL0AP319:8283/api/serrc/' + serrcNo,
            headers: {'Content-Type' : 'application/json, x-www-form-urlencoded, charset=UTF-8'
            }

        }).success(function(response){

            if (response == 'SERRC removed successfully from the database')
                toastr.success(response);
            else if (response == 'SERRC - Not Found')
                toastr.warning(response);

                // toastr.warning(response);
                // console.log('Requested SERRC has been removed from the database!');
                $state.go('serrcs.list');

        }).error(function(err){
                // alert("No List received from server");
                console.log('Error: ', err);
                $state.go('serrcs.list');

            }
        );
    }
})();


