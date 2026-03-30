/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('CarinaRM.pages.serrcs')
        .controller('AddSerrcCtrl', AddSerrcCtrl);

    /** @ngInject */
    /** $filter, $popover,  */
    function AddSerrcCtrl($scope, $http, $log, toastr, $state) {

        var serrcNo = document.getElementById("serrcNo").value;
        var programName = document.getElementById("programName").value;
        var cause = document.getElementById("cause").value;
        var action = document.getElementById("action").value;

        // var data = $.param({
        //     serrcNo: serrcNo,
        //     programName: programName,
        //     cause: cause,
        //     action: action
        // });


        // console.log('Data: ', data);

        $http({
            method: 'POST',
            withCredentials: true,
            url: 'http://AKL0AP319:8283/api/serrc',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: $.param({
                    serrcNo: serrcNo,
                    programName: programName,
                    cause: cause,
                    action: action
                })

        }).success(function(response){

                if (response == 'Requested SERRC has been added successfully!')
                    toastr.success(response);
                else if (response == 'SERRC - Already defined!')
                    toastr.error(response);


                $state.go('serrcs.list');
                console.log(response);

        }).error(function(err){
                // alert("No List received from server");
                console.log('Error: ', err);
                $state.go('serrcs.list');

            }
        );

    }

})();


