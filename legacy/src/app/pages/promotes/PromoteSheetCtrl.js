/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('CarinaRM.pages.promotes')
        .controller('PromoteSheetCtrl', PromoteSheetCtrl);

    /** @ngInject */
    /** $filter, $popover,  */

        function PromoteSheetCtrl($scope, $http, $log, $stateParams, editableOptions, editableThemes, $uibModal, baProgressModal, $timeout){

        var fileID = $stateParams.promoteFileID;
        $scope.tablePageSize = 10;
        console.log('promoteFileID: ', fileID);


        $http({
            method: 'GET',
            withCredentials: true,
            url: 'http://AKL0AP319:8283/api/promote/' + fileID

        }).success(function(fileData){

            $scope.PromoteSheetData = fileData.PromoteSheetData[0];
            $scope.PromoteProgramList = fileData.PromoteProgramList;
            $scope.PromoteProgramListSrc = fileData.PromoteProgramList;
            $scope.PromoteMacroList = fileData.PromoteMacroList;
            $scope.PromoteMacroListSrc = fileData.PromoteMacroList;
            $scope.File_ID = fileData._id;



            $scope.totalPrograms = $scope.PromoteProgramList.length ;
            console.log('totalPrograms: ', $scope.totalPrograms);
            $scope.totalMacros = $scope.PromoteMacroList.length ;
            console.log('totalMacros: ', $scope.totalMacros);

        }).error(function(){
            alert("Request item not found in the Database");
        });

        editableOptions.theme = 'bs3';
        // editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon" ><i class="ion-checkmark-round"></i></button>';
        // editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

        $scope.updateLoadDate = function(loadDate) {
            // console.log('loadDate: ', loadDate);

            if (loadDate !== '$scope.PromoteSheetData.promoteDate') {
                console.log('loadDate: ', loadDate);
                $http({
                    method: 'PUT',
                    withCredentials: true,
                    url: 'http://AKL0AP319:8283/api/promote/'+ $scope.File_ID+'/updldate/',
                    headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: $.param({
                            loadDate: loadDate
                        })

                }).error(function(err){
                    alert("Update Failed - Contact App Administrator");
                    console.log('Error: ', err);
                    // $state.go('serrcs.list');
                    }
                );
            }
        };

        $scope.updateChangeNumber = function(changeNumber) {
            if (changeNumber !== '$scope.PromoteSheetData.changeNumber') {
                $http({
                    method: 'PUT',
                    withCredentials: true,
                    url: 'http://AKL0AP319:8283/api/promote/'+ $scope.File_ID+'/updcnum/',
                    headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: $.param({
                        changeNumber: changeNumber
                    })

                }).error(function(err){
                        alert("Update Failed - Contact App Administrator");
                        console.log('Error: ', err);
                        // $state.go('serrcs.list');
                    }
                );
            }
        };
        $scope.updateColsolDate = function(colsolDate) {
            if (colsolDate !== '$scope.PromoteSheetData.colsolDate') {
                $http({
                    method: 'PUT',
                    withCredentials: true,
                    url: 'http://AKL0AP319:8283/api/promote/'+ $scope.File_ID+'/updcdate/',
                    headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: $.param({
                        colsolDate: colsolDate
                    })

                }).error(function(err){
                        alert("Update Failed - Contact App Administrator");
                        console.log('Error: ', err);
                        // $state.go('serrcs.list');
                    }
                );
            }
        };
        $scope.updateColsolMod = function(colsolMod) {
            if (colsolMod !== '$scope.PromoteSheetData.colsolMod') {
                $http({
                    method: 'PUT',
                    withCredentials: true,
                    url: 'http://AKL0AP319:8283/api/promote/'+ $scope.File_ID+'/updcmod/',
                    headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: $.param({
                        colsolMod: colsolMod
                    })

                }).error(function(err){
                        alert("Update Failed - Contact App Administrator");
                        console.log('Error: ', err);
                        // $state.go('serrcs.list');
                    }
                );
            }
        };
        $scope.updateNote = function(note) {
            if (note !== '$scope.PromoteSheetData.note') {
                $http({
                    method: 'PUT',
                    withCredentials: true,
                    url: 'http://AKL0AP319:8283/api/promote/'+ $scope.File_ID+'/updnote/',
                    headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: $.param({
                        note: note
                    })

                }).error(function(err){
                        alert("Update Failed - Contact App Administrator");
                        console.log('Error: ', err);
                        // $state.go('serrcs.list');
                    }
                );
            }
        };

        $scope.updateFallbackData = function(fbkNote) {
            if (fbkNote !== '$scope.PromoteSheetData.fbkNote') {
                $http({
                    method: 'PUT',
                    withCredentials: true,
                    url: 'http://AKL0AP319:8283/api/promote/' + $scope.File_ID,
                    headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: $.param({
                        jobStatus: "",
                        fallbackDate: "",
                        fbkGitSha: "",
                        fbkJobId: "",
                        fbkNote: fbkNote
                    })

                }).error(function(err){
                        alert("Update Failed - Contact App Administrator");
                        console.log('Error: ', err);
                        // $state.go('serrcs.list');
                    }
                );
            }
        };

        $scope.updateJobStatus = function(jobStatus, oldLocation, newLocation) {

                $http({
                    method: 'PUT',
                    withCredentials: true,
                    url: 'http://AKL0AP319:8283/api/promote/' + $scope.File_ID+'/updjobstatus/',
                    headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: $.param({
                        "jobStatus": jobStatus,
                        "oldLocation": oldLocation,
                        "newLocation": newLocation
                    })

                }).error(function(err){
                        alert("Update Failed - Contact App Administrator");
                        console.log('Error: ', err);
                        // $state.go('serrcs.list');
                    }
                );

                $http({
                    method: 'GET',
                    withCredentials: true,
                    url: 'http://Z17G4CND8021FJH:8282/api/promote/' + fileID

                }).success(function(fileData){

                    $scope.PromoteSheetData = fileData.PromoteSheetData[0];
                    $scope.PromoteProgramList = fileData.PromoteProgramList;
                    $scope.PromoteProgramListSrc = fileData.PromoteProgramList;
                    $scope.PromoteMacroList = fileData.PromoteMacroList;
                    $scope.PromoteMacroListSrc = fileData.PromoteMacroList;
                    $scope.File_ID = fileData._id;



                    $scope.totalPrograms = $scope.PromoteProgramList.length ;
                    console.log('totalPrograms: ', $scope.totalPrograms);
                    $scope.totalMacros = $scope.PromoteMacroList.length ;
                    console.log('totalMacros: ', $scope.totalMacros);

                }).error(function(){
                    alert("Request item not found in the Database");
                });
            //
            // if (jobStatus == 'UAT in Progress') {
            //     $scope.qual_load = 'true';
            // }
            // if (jobStatus == 'Ready for Production') {
            //     $scope.qual_signoff = 'true';
            // }
            // if (jobStatus == 'Loaded To Production (A0)') {
            //     $scope.prod_load = 'true';
            // }
            // if (jobStatus == 'Consolidated To A2ZDAT') {
            //     $scope.a2z_consolidation = 'true';
            // }
        };
        $scope.progressFunction = function() {
            return $timeout(function() {}, 50000);
        };

        $scope.updateSpecialRequirements = function(splreq) {

            // Resetting the edit scope to delect the check box thereby to support button hide.
            $scope.edit = '';

                $http({
                    method: 'PUT',
                    withCredentials: true,
                    url: 'http://AKL0AP319:8283/api/promote/'+ $scope.File_ID+'/updsplrequirement/',
                    headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: $.param({
                        specialRequirement: splreq
                    })

                }).error(function(err){
                        alert("Update Failed - Contact App Administrator");
                        console.log('Error: ', err);
                        // $state.go('serrcs.list');
                    }
                );
        };
    }

})();


