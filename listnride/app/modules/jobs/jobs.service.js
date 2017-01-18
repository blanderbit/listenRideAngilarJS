angular.module('jobs').factory('JobsService', ['$q', function ($q) {
    var jobsFactory = {};
    var availableJobs = [{
            title: 'Junior Business Development Manager (M/F)',
            location: 'Berlin',
            type: 'Full time'
        },
        {
            title: 'Lead Frontend Developer (M/F)',
            location: 'Munich',
            type: 'Full time'
        },
        {
            title: 'Student Job - Content Marketing & Social Media (M/F)',
            location: 'Munich',
            type: 'Part time'
        }
    ];

    var jobDetails = [{
            title: 'Junior Business Development Manager (M/F)',
            role: {
                title: 'Role & Responsibilities',
                desc: [
                    'Account management of existing professional listers to increase their presence and or keeping them informed on new platform developments',
                    'Structural development of the number of professional lister accounts (bike shops / bike brands)',
                    'Acquire new accounts through telesales activities and or shop visits ',
                    'Research, gather and structure prospect accounts in key locations ',
                    'Collect feedback from your accounts for improving product features',
                    'Offer support onboarding new accounts to integrate their bikes',
                    'Represent listnride on relevant events and trade shows'
                ]
            },
            required: {
                title: 'What you have',
                desc: [
                    'Personal interest in the biking scene and ideally with existing relevant contacts in the industry',
                    'High drive for success and high discipline in executing sales plan in a structured manner',
                    'Senior personality that easily gains trust talking to shop owners and bike brands',
                    '2+ years experience working in a commercial role, with a proven track record',
                ]
            },
            offer: {
                title: 'What we have',
                desc: [
                    'Launched a successful bike sharing platform late 2015, now growing fast',
                    'A mentality always looking for “what is right” and not “who is right” ',
                    'Believe in the sharing economy and technology as key facilitator',
                    'Experienced leadership team, a unique vision and global ambition ',
                    'Competitive remuneration and flexible working hours',
                    'User presence in over 8 countries',
                ]
            }
        },
        {
            title: 'Lead Frontend Developer (M/F)',
            role: {
                title: 'Role & Responsibilities',
                desc: [
                    'You plan, architect, integrate and develop efficient and transferable features/systems',
                    'Pay attention to details and identify performance weak spots and/or opportunities',
                    'Responsible for the continous development and design of a new exciting product',
                    'Conduct a/b tests and gather insights on how/if certain features are used',
                    'Work closely with product management to try out new frontend ideas',
                    'As a technical lead you will manage a small frontend team'
                ]
            },
            required: {
                title: 'What you have',
                desc: [
                    '3+ years experience with JavaScript, Angular, Gulp/Grunt, HTML5 and CSS',
                    'Knowledge about when and what to test (Unit Tests, E2E Tests)',
                    'The ability to work autonomously and in a result-oriented way',
                    'Good understanding of developing responsive websites',
                    'Experience with RESTful APIs'
                ]
            },
            offer: {
                title: 'What we have',
                desc: [
                    'Launched a successful bike sharing platform late 2015, now growing fast',
                    'A mentality always looking for “what is right” and not “who is right” ',
                    'Believe in the sharing economy and technology as key facilitator',
                    'Experienced leadership team, a unique vision and global ambition ',
                    'Competitive remuneration and flexible working hours',
                    'User presence in over 8 countries',
                ]
            }
        },
        {
            title: 'Student Job - Content Marketing & Social Media (M/F)',
            role: {
                title: 'Role & Responsibilities',
                desc: [
                    'Identify and connect with the leaders and influencers in the bike scene and adjacencies',
                    'Identify leading (bike) events (bike / lifestyle) and seek ways to engage with the organisations',
                    'Compile content for communication purposes, e.g. press releases, press kit, presentations',
                    'Research, create and post of “sticky” content for our social media channels',
                    'Increase the buzz around and adoption of listnride',
                ]
            },
            required: {
                title: 'What you have',
                desc: [
                    'Exceptional writing skills, and bring a wide degree of creativity and analytical skills',
                    'Self-starter, structured, have an independent personality with a great eye for detail ',
                    'Fluent in English and German, other languages such as Dutch, Spanish are of advantage',
                    'Rlevant work experience in blogging and or social media marketing',
                    'Marketing or communication study with a Bachelor level',
                ]
            },
            offer: {
                title: 'What we have',
                desc: [
                    'Launched a successful bike sharing platform late 2015, now growing fast',
                    'A mentality always looking for “what is right” and not “who is right” ',
                    'Believe in the sharing economy and technology as key facilitator',
                    'Experienced leadership team, a unique vision and global ambition ',
                    'Competitive remuneration and flexible working hours',
                    'User presence in over 8 countries',
                ]
            }
        },
    ];

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