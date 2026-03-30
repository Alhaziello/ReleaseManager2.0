/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('CarinaRM.pages.carina')
        .controller('CarinaCtrl', CarinaCtrl);

    /** @ngInject */
    /** $filter, $popover,  */
    function CarinaCtrl($scope, $http, $log, toastr, $state) {
        console.log('came here');
        $http({
            method: 'GET',
            withCredentials: true,
            url: 'http://10.1.50.73:8080/map',
            headers: {'Content-Type' : 'application/json; charset=UTF-8',
                      'Authorization' : 'NZTest:bNhf1DwuIk',
                      'Accept': 'Access-Control-Allow-Origin',

            },
            data: $.param({
                getConfigurationDataRQ: {
                    "-Description": "GETCONFIGURATIONDATA",
                    "-Transaction": "QUERY",
                    "configurationDataRequired": "baggageAllowance"
                }
            })

        }).success(function(response){

            // if (response == 'Requested carina has been added successfully!')
            //     toastr.success(response);
            // else if (response == 'carina - Already defined!')
            //     toastr.error(response);


            // $state.go('carina.list');
            console.log(response);

        }).error(function(err){
                // alert("No List received from server");
                console.log('Error: ', err);
                // $state.go('carina.list');

            }
        );

    }

})();


