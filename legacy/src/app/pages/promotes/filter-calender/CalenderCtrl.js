/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('CarinaRM.pages.promotes')
        .controller('CalenderCtrl', CalenderCtrl);

    /** @ngInject */
    /** $filter, $popover,  */
    function CalenderCtrl($scope, $http, $log ) {
            // moment.tz.setDefault("Pacific/Auckland");
            $scope.date = {
                startDate: moment().subtract(1, "days"),
                endDate: moment()
            };
            $scope.date2 = {
                startDate: moment().subtract(1, "days"),
                endDate: moment()
            };

            $scope.opts = {
                locale: {
                    format: 'DD/MM/YYYY',
                    separator: ' - ',
                    applyClass: 'btn-green',
                    applyLabel: "Apply",
                    fromLabel: "From",
                    toLabel: "To",
                    cancelLabel: 'Cancel',
                    customRangeLabel: 'Custom Range',
                    daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
                    firstDay: 1,
                    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                },
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 14 Days': [moment().subtract(13, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            };

            $scope.setStartDate = function () {
                $scope.date.startDate = moment().subtract(4, "days");
            };

            $scope.setRange = function () {
                $scope.date = {
                    startDate: moment().subtract(5, "days"),
                    endDate: moment()
                };
            };

            //Watch for date changes
            $scope.$watch('date', function(newDate) {
                console.log('Date Range: ', newDate);

            }, false);


        }

    })();


