'use strict';

angular.module('jobs', [])
    .controller('JobsListController', ['JobsService',
        function (JobsService) {
            var jobs = this;
            JobsService.getAvailableJobs().then(function (response) {
                jobs.availableJobs = response.data;
            }, function (error) {});
        }
    ])

    .controller('JobsDetailsController', ['$stateParams', 'JobsService',
        function ($stateParams, JobsService) {
            var jobs = this;
            jobs.getJobDetails = getJobDetails;
            /**
             * @param {number} positionId
             * @return {void}
             */
            function getJobDetails() {
                JobsService.getJobsDetails($stateParams.positionId-1).then(function (response) {
                    jobs.details = response.data;
                }, function (error) {});
            }
            jobs.getJobDetails();
        }
    ]);