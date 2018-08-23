'use strict';

angular.module('jobs', [])
  .component('jobs', {
    templateUrl: 'app/modules/jobs/jobs.template.html',
    controllerAs: 'jobs',
    controller: ['$translatePartialLoader', '$state', '$location', '$translate', '$stateParams', 'api', 'ENV', 'ngMeta',
      function JobsController($tpl, $state, $location, $translate, $stateParams, api, ENV, ngMeta) {

        ngMeta.setTitle($translate.instant("jobs.meta-title"));
        ngMeta.setTag("description", $translate.instant("jobs.meta-description"));

        var jobs = this;
        jobs.showJobDetails = false;
        jobs.chosenJob = {};

        $tpl.addPart(ENV.staticTranslation);

        jobs.$onInit =  function () {
          jobs.positionId = $stateParams.position;
          jobs.positionIdChange = positionIdChange;
        };

        jobs.showDetails = function(job) {
          jobs.showJobDetails = true;
          jobs.chosenJob = job;
          goToTop();
        };

        jobs.hideDetails = function() {
          jobs.showJobDetails = false;
          jobs.chosenJob = {};

          $state.go(
            $state.current,
            {position: ''},
            { notify: false }
          )
        };

        api.get('/jobs/').then(function (response) {
          jobs.availableJobs = response.data;

          if (!!jobs.positionId) {
            var job = _.find(jobs.availableJobs, ['id', _.toInteger(jobs.positionId)]);
            jobs.showDetails(job);
          }
        }, function (error) {

        });

        function positionIdChange (positionId) {
          jobs.positionId = positionId;
        }

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
      }
    ]
  });
