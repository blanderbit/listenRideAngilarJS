angular.module('jobs').factory('JobsService', ['$q', function ($q) {
    var jobsFactory = {};
    var availableJobs = [{
        title: 'Junior Business Development Manager (M/F)',
        location: 'Berlin',
        trype: 'Full time'
    }];

    var jobDetails = [{
        title: 'Junior Business Development Manager (M/F)',
        role: {
            title: 'Role & Responsibilities',
            desc: ['Structural development of the number of professional lister accounts (bike shops / bike brands)',
                'Research, gather and structure prospect accounts in key locations ',
                'Acquire new accounts through telesales activities and or shop visits ',
                'Offer support onboarding new accounts to integrate their bikes',
                'Account management of existing professional listers to increase their presence and or keeping them informed on new platform developments',
                'Collect feedback from your accounts for improving product features',
                'Represent listnride on relevant events and trade shows'
            ]
        },
        required: {
            title: 'What you have',
            desc: [
                '2+ years experience working in a commercial role, with a proven track record',
                'Personal interest in the biking scene and ideally with existing relevant contacts in the industry',
                'Senior personality that easily gains trust talking to shop owners and bike brands',
                'High drive for success and high discipline in executing sales plan in a structured manner'
            ]
        },
        offer: {
            title: 'What we have',
            desc: [
                'Launched a successful bike sharing platform late 2015, now growing fast',
                'User presence in over 8 countries',
                'Believe in the sharing economy and technology as key facilitator',
                'Experienced leadership team, a unique vision and global ambition ',
                'A mentality always looking for “what is right” and not “who is right” ',
                'Competitive remuneration and flexible working hours'
            ]
        }
    }];

// ,
//         remarks: [
//             'This position is based in Berlin or Munich, and you will report to the Head of Sales & Marketing.'
//         ]
    jobsFactory.getAvailableJobs = function () {
        var deferred = $q.defer();
        deferred.resolve({
            data: availableJobs
        });
        return deferred.promise;
    };

    jobsFactory.getJobsDetails = function (positionId) {
        // positionId should be used to fetch details from server
        var deferred = $q.defer();
        deferred.resolve({
            data: jobDetails[positionId]
        });
        return deferred.promise;
    };
    return jobsFactory;
}]);