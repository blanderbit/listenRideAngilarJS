'use strict';

angular.module('jobs', [])
    .controller('JobsListController', ['JobsService', '$translate', 'ngMeta',
        function (JobsService, $translate, ngMeta) {

            ngMeta.setTitle($translate.instant("jobs.meta-title"));
            ngMeta.setTag("description", $translate.instant("jobs.meta-description"));

            var jobs = this;
            JobsService.getAvailableJobs().then(function (response) {
                jobs.availableJobs = response.data;
            }, function (error) {});
        }
    ])

    .controller('JobsDetailsController', ['$stateParams', '$location', '$anchorScroll', 'JobsService',
        function ($stateParams, $location, $anchorScroll, JobsService) {
            var jobs = this;

            jobs.getJobDetails = getJobDetails;
            /**
             * move the scroll to the job posts
             * this is to avoid showing the image
             * and directly show the postings
             */
            function goToTop() {
                // id of the div where to move the scroller
                var newHash = 'jobs-details';
                // move the scroller to the div
                $location.hash() !== newHash ? $location.hash('jobs-details') : $anchorScroll();
            }
            /**
             * @param {number} positionId
             * @return {void}
             */
            function getJobDetails() {
                JobsService.getJobsDetails($stateParams.positionId - 1).then(function (response) {
                    jobs.details = response.data;
                    goToTop();
                }, function (error) {});
            }
            jobs.getJobDetails();
        }
    ]);
