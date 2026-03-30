/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('CarinaRM.pages.promotes')
        .controller('PromoteListCtrl', PromoteListCtrl, PromoteSwitchCtrl);

    /** @ngInject */
    /** $filter, $popover,  */
        function PromoteListCtrl($scope, $http, $log, $stateParams, editableOptions, editableThemes){


        // var FilteredObj = $stateParams.programmer;
        // var searchData = $stateParams.searchValue;
        // console.log('JSON: ', $scope.userName);
        // console.log('JSON: ', userName);
        // $log.log("Search Data: " + $scope.searchData);
        // $log.log("Search Value: " + $scope.searchValue);

        $scope.promoteTablePageSize = 10;


        //  Need this for animated popover.
        // $scope.popover = {title: '  ', content: '  '};

        //  Define input object inside scope for controller use.
        // $scope.FilteredItem = FilteredObj;
        // $scope.searchItem = searchData;

        //  Need this for table sorting.
        // $scope.NameOrder = 'programmer';
        // $scope.mainOrder = 'jenkinsJobId';
        // $scope.reverse = true;

        //  Need this for pagination.
        // $scope.proViewby = 15; //Number of items to show in a page
        // $scope.proCurrentPage = 1;
        // $scope.itemsPerPagePro = $scope.proViewby;
        // $scope.proMaxSize = 10; //Number of pager buttons to show
        //
        // $scope.setPage = function (pageNo) {
        //     $scope.proCurrentPage = pageNo;
        // };
        //
        // $scope.pageChanged = function () {
        //     console.log('Page changed to: ' + $scope.proCurrentPage);
        // };

        //    $scope.query = {}
        //    $scope.queryBy = '$'
        //$log.log("Query: " + $scope.query);
        //$log.log("FilteredItem: " + $scope.FilteredItem);

        $http({
            method: 'GET',
            withCredentials: true,
            url: 'http://AKL0AP319:8283/api/promote'

        }).success(function(item){
            // Returns all promotes in "{{ProList}}" angular variable

            $scope.ProList = [];
            $scope.tableData = [];
            $scope.tableCollections = [];
            angular.forEach(item, function(iterateLevelOne) {

                // var jsonArray1 = iterateLevelOne.PromoteSheetData;
                // var jsonArray2 = pro_id: iterateLevelOne._id;
                // jsonArray1 = jsonArray1.concat(jsonArray2);

                // iterateLevelOne.PromoteSheetData.splice(1, 0,
                //     {pro_id: iterateLevelOne._id}
                // );
                // var proSheet = iterateLevelOne.PromoteSheetData[0].concat(iterateLevelOne.PromoteSheetData[1]);
                // $scope.tableData.push(PromoteIndex);
                // iterateLevelOne.PromoteSheetData.create('pro_id: iterateLevelOne._id');
                angular.forEach(iterateLevelOne.PromoteSheetData, function(promoteDetails) {

                    var PromoteIndex = {};
                        PromoteIndex['pro_id'] = iterateLevelOne._id;
                        PromoteIndex['ticketNo'] = promoteDetails.ticketNo;
                        PromoteIndex['programmer'] = promoteDetails.programmer;
                        // PromoteIndex['project'] = promoteDetails.project;
                        // PromoteIndex['description'] = promoteDetails.description;
                        PromoteIndex['jenkinsJobId'] = promoteDetails.jenkinsJobId;
                        // PromoteIndex['gitSha'] = promoteDetails.gitSha;
                        // PromoteIndex['testerName1'] = promoteDetails .testerName1;
                        // PromoteIndex['testerName2'] = promoteDetails.testerName2;
                        // PromoteIndex['fallbackOption'] = promoteDetails.fallbackOption;
                        PromoteIndex['loadModule'] = promoteDetails.loadModule;
                        PromoteIndex['promoteDate'] = promoteDetails.promoteDate;
                        PromoteIndex['jobStatus'] = promoteDetails.jobStatus;

                    $scope.tableData.push(PromoteIndex);


                    $scope.tableCollections.push(PromoteIndex);
                    // $scope.tableData.push(promoteDetails);
                    $scope.ProList.push(PromoteIndex);

                    // $scope.ProList.push({"id": "iterateLevelOne._id"});
                    // angular.forEach(promoteDetails, function(data) {
                    //     // $scope.outPut.push(data);
                    //     console.log('Data: ', data);
                    //     return function (promoteDetails) {
                    //         var result = (data.promoteDate >= dateRange.startDate.format("YYYY-MM-DD") && data.promoteDate <= dateRange.endDate.format("YYYY-MM-DD"));
                    //         // ****** Can be activated to see the filter result in the browser console  *****
                    //         console.log('Data: ', data);
                    //         console.log('TimeZone: ', dateRange);
                    //         console.log('Start: ', dateRange.startDate.format('YYYY-MM-DD'));
                    //         console.log('End: ', dateRange.endDate.format('YYYY-MM-DD'));
                    //         return result
                    //     }
                    //
                    // });
                });
            });

            // $scope.tableCollections = $scope.ProList; // get data from json
            // $scope.editableTableData = $scope.ProList.slice(0, 36);
            // $log.log("ProList: " + $scope.ProList);
            // $scope.tableData = $scope.ProList;
            // console.log('tableData: ', $scope.tableData);
            $scope.totalPromotes = $scope.tableCollections.length ; // Total no of promote items
            // console.log('Value: ', $scope.ProList.length);
            // console.log('Resulted Value: ', $scope.totalPromotes);
            // $scope.editableTableData = $scope.promoteTableData.slice(0, 36);


        }).error(function(){
            alert("No List received from server");
        });

    //     $scope.myDateRange = {
    //         endDate: moment().add('days', 1),
    //         startDate: moment()
    // };


        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
        // :::::  Custom Filter : This filter returns "{{proItem}}" whatever falls under date range set by Calendar Controller  ::::: //
        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

        $scope.dateRangeFilter = function (data, dateRange) {

                return function (item) {
                    var result = (item.promoteDate >= dateRange.startDate.format("YYYY-MM-DD") && item.promoteDate <= dateRange.endDate.format("YYYY-MM-DD"));
                    // ****** Can be activated to see the filter result in the browser console  *****
                    var dataCount = result.size;
                        // console.log('Count: ', result);
                        // console.log('TimeZone: ', dateRange);
                        // console.log('Start: ', dateRange.startDate.format('YYYY-MM-DD'));
                        // console.log('End: ', dateRange.endDate.format('YYYY-MM-DD'));
                    return result
                }
        };

        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
        // :::::  Custom Filter : Returns "{{proItem}}" fileterd by assist no starts with JRB (basically Reservation Changes)   ::::: //
        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

        $scope.FilterRES = function(items) {

            return function(jira) {
                return /^JRB/.test(jira.ticketNo)
            }
        };

        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
        // :::::  Custom Filter : Returns "{{proItem}}" fileterd by assist no starts with JRP (basically All Project Changes)   ::::: //
        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

        $scope.FilterProject = function(items) {

            return function(project) {
                return /^JRP|^JDP|^ETI/.test(project.ticketNo)
            }
        };

        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
        // :::::  Custom Filter : Returns "{{proItem}}" fileterd by assist no starts with I (basically DCS Chanegs)   ::::: //
        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

        $scope.FilterDCS = function(list) {
            return function(assist) {
                return /^JDB/.test(assist.ticketNo)
            }
        };

        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
        // :::::  Custom Filter : Returns "{{proItem}}" fileterd by specific program name provided by Header Page button        ::::: //
        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

        $scope.FilterProgrammer = function(items) {

            return function(prolist) {
                var result = ( prolist.programmer == $scope.FilteredItem );
                // $log.log(result)
                return result

            }
        };

        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
        // :::::  Custom Filter : Returns "{{proItem}}" fileterd by status matches 'Ready For Production'        ::::: //
        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

        $scope.FilterReady4Prod = function(list) {
            return function(r4p) {
                return /^Ready\sfor\sProduction/.test(r4p.jobStatus)
                // var result = ( r4p.jobStatus == "Ready for Production" );
                // $log.log(result)
                // return result;
            }


        };


        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
        // :::::  Custom Filter : Returns "{{proItem}}" fileterd by status matches 'Loaded To Production (A0)'            ::::: //
        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

        $scope.FilterReady4Cons = function(list) {
            return function(r4con) {
                $log.log(list)
                // $log.log(r4con.jobStatus)
                return /^Loaded\sTo\sProduction\s.A0./.test(r4con.jobStatus)
                // var result = ( r4con.jobStatus == "Loaded To Production (A0)" );
                // $log.log(result)
            }
        };


        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
        // :::::  Custom Filter : Returns "{{proItem}}" fileterd by specific program name provided by Header Page button        ::::: //
        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

        $scope.FilterSearchAny = function(items) {

            var searchItemUpper = $scope.searchItem.toUpperCase();
            $log.log(searchItemUpper)

            return function(prolist) {
                var result = (  prolist.date == $scope.searchItem || prolist.programmer == $scope.searchItem ||
                prolist.ticketNo == searchItemUpper || prolist.jenkinsJobId == $scope.searchItem ||
                prolist.jobStatus == $scope.searchItem );
                //$log.log(result)
                return result

            }
        };
        editableOptions.theme = 'bs3';
        editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
        editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

    }


        function PromoteSwitchCtrl() {
            var promoteToggle = this;
            promoteToggle.switch = {
                calender:true,
                bau: false,
                project:false,
                res:false,
                dcs:false
            };
        }


})();


