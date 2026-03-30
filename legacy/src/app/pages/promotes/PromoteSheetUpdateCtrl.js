/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('CarinaRM.pages.promotes')
        .controller('PromoteSheetUpdateCtrl', PromoteSheetUpdateCtrl);

    /** @ngInject */
    /** $filter, $popover,  */
    function PromoteSheetUpdateCtrl($scope, $http, $log, toastr, $state) {

        var loadDate = document.getElementById("loadDate").value;
        var changeNumber = document.getElementById("changeNumber").value;
        var colsolDate = document.getElementById("colsolDate").value;
        var colsolMod = document.getElementById("colsolMod").value;
        var note = document.getElementById("note").value;

        console.log('loadDate: ', loadDate);
        console.log('changeNumber: ', changeNumber);
        console.log('colsolDate: ', colsolDate);
        console.log('colsolMod: ', colsolMod);
        console.log('note: ', note);




        // var data = $.param({
        //     serrcNo: serrcNo,
        //     programName: programName,
        //     cause: cause,
        //     action: action
        // });


        // console.log('Data: ', data);

        // $http({
        //     method: 'POST',
        //     // url: 'data/' + 'SerrcData.json',
        //     url: 'http://840G35CG6193PCP:8282/api/serrc',
        //     headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
        //     },
        //     data: $.param({
        //             serrcNo: serrcNo,
        //             programName: programName,
        //             cause: cause,
        //             action: action
        //         })
        //
        // }).success(function(response){
        //
        //         if (response == 'Requested SERRC has been added successfully!')
        //             toastr.success(response);
        //         else if (response == 'SERRC - Already defined!')
        //             toastr.error(response);
        //
        //
        //         $state.go('serrcs.list');
        //         console.log(response);
        //
        // }).error(function(err){
        //         // alert("No List received from server");
        //         console.log('Error: ', err);
        //         $state.go('serrcs.list');
        //
        //     }
        // );

    }

})();


