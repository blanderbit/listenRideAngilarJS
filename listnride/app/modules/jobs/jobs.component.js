'use strict';

angular.module('jobs', [])
  .component('jobs', {
    templateUrl: 'app/modules/jobs/jobs.template.html',
    controllerAs: 'jobs',
    controller: ['api', '$translate', 'ngMeta',
      function JobsController(api, $translate, ngMeta) {

        ngMeta.setTitle($translate.instant("jobs.meta-title"));
        ngMeta.setTag("description", $translate.instant("jobs.meta-description"));

        var jobs = this;

        api.get('/jobs/').then(function (response) {
          jobs.availableJobs = response.data;
        }, function (error) {

        });
      }
    ]
  });
  // .component('JobsDetails', {
  //   templateUrl: 'app/modules/jobs/jobs.details.template.html',
  //   require: {parent: '^jobs'},
  //   controllerAs: 'jobsDetails'
  // });

  // .controller('JobsDetailsController', ['$stateParams', '$location', '$anchorScroll',
  //   function ($stateParams, $location, $anchorScroll) {
  //     var jobs = this;
  //
  //     jobs.getJobDetails = getJobDetails;
  //
  //     /**
  //      * move the scroll to the job posts
  //      * this is to avoid showing the image
  //      * and directly show the postings
  //      */
  //     function goToTop() {
  //       // id of the div where to move the scroller
  //       var newHash = 'jobs-details';
  //       // move the scroller to the div
  //       $location.hash() !== newHash ? $location.hash('jobs-details') : $anchorScroll();
  //     }
  //
  //     /**
  //      * @param {number} positionId
  //      * @return {void}
  //      */
  //     function getJobDetails() {
  //       JobsService.getJobsDetails($stateParams.positionId - 1).then(function (response) {
  //         jobs.details = response.data;
  //         goToTop();
  //       }, function (error) {
  //       });
  //     }
  //
  //     jobs.getJobDetails();
  //   }
  // ]);
