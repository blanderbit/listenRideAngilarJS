angular.module('jobs').factory('JobsService', ['$q', function ($q) {
  var jobsFactory = {};
  var availableJobs = [{
    title: 'Junior Business Development Manager (M/F)',
    location: 'Berlin',
    type: 'Full time'
  },
  {
    title: 'Intern Content Marketing & Social Media (M/F)',
    location: 'Munich',
    type: 'Part time'
  },
  {
    title: 'Intern Business Development (M/F)',
    location: 'Munich',
    type: 'Part time'
  },
  {
    title: 'Intern Online Marketing (M/F)',
    location: 'Munich',
    type: 'Part time'
  },
  {
    title: 'Lead Frontend Developer (M/F)',
    location: 'Munich',
    type: 'Full time'
  }
  ];

  var jobDetails = [{
    title: 'Junior Business Development Manager (M/F)',
    role: {
      title: 'Role & Responsibilities',
      desc: [
        'Account management of existing professional listers to increase their presence',
        'Structural development of the number of professional lister accounts',
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
        '2+ years experience working in a commercial role, with a proven track record'
      ]
    },
    offer: {
      title: 'What we have',
      desc: [
        'Launched a successful bike sharing platform, now growing fast',
        'Believe in the sharing economy and technology as key facilitator',
        'Experienced leadership team, a unique vision with a global ambition',
        'A mentality always looking for “what is right” and not “who is right”',
        'Competitive remuneration and flexible working hours'
      ]
    }
  },
  {
    title: 'Intern Content Marketing & Social Media (M/F)',
    role: {
      title: 'Role & Responsibilities',
      desc: [
        'Market research for social media execution (hashtags, keywords, influencers, etc)',
        'Content creation for SEO purposes, community engagement and or social media',
        'Manage Facebook page, Instagram account, Newsletter, and Blog',
        'Optimize onsite content, add new relevant topics to make our presence more appealing',
        'Identify and connect with the leaders, celebrities, champions and influencers in the bike scene.',
        'Connect with adjacencies to increase the buzz around and adoption of listnride'
      ]
    },
    required: {
      title: 'What you have',
      desc: [
        'Studying for a Bachelor degree in Marketing or Communication science or related',
        'Relevant work experience in blogging and or social media marketing',
        'Exceptional writing skills, and bring a wide degree of creativity and analytical skills',
        'Self-starter, structured, have an independent personality with a great eye for detail',
        'Fluent in English and German, other languages such as Dutch, Spanish or Italian are a plus',
        'An internship is a compulsory part of your course of studies for 5-6 months',
        'You are excited about cycling'
      ]
    },
    offer: {
      title: 'What we have',
      desc: [
        'Launched a successful bike sharing platform, now growing fast',
        'Believe in the sharing economy and technology as key facilitator',
        'Experienced leadership team, a unique vision with a global ambition',
        'A mentality always looking for “what is right” and not “who is right”',
        'Competitive remuneration and flexible working hours'
      ]
    }
  },
  {
    title: 'Intern Business Development (M/F)',
    role: {
      title: 'Role & Responsibilities',
      desc: [
        'Structural development of the number of professional lister accounts',
        'Research, gather and structure prospect accounts in key locations',
        'Acquire new partners through email, telesales activities and or side visits',
        'Offer support onboarding new accounts to integrate their bikes',
        'Account management of existing listers to increase their activities',
        'Collect feedback from your accounts for improving product features',
        'Represent listnride on relevant events and trade shows'
      ]
    },
    required: {
      title: 'What you have',
      desc: [
        'Studying for Bachelor degree in Business Administration, Economics or related',
        'Ability to see commercial opportunities and convert these in successful business',
        'A personality that easily gains trust talking different levels of stake holders',
        'High drive for success and discipline in executing sales plan in a structured manner',
        'Eye for details when it comes to executing your plans',
        'Excellent linguistic skills: German, English and ideally Italian and or Spanish, Dutch',
        'An internship is a compulsory part of your course of studies for 5-6 months'
      ]
    },
    offer: {
      title: 'What we have',
      desc: [
        'Launched a successful bike sharing platform, now growing fast',
        'Believe in the sharing economy and technology as key facilitator',
        'Experienced leadership team, a unique vision with a global ambition',
        'A mentality always looking for “what is right” and not “who is right”',
        'Competitive remuneration and flexible working hours'
      ]
    }
  },
  {
    title: 'Intern Online Marketing (M/F)',
    role: {
      title: 'Role & Responsibilities',
      desc: [
        'Create and implement advertising copy for specific campaigns',
        'Monitor ads’ and campaigns’ performance by analysing the relevant data and KPIs',
        'Optimize ads and campaigns to meet performance goals',
        'Reach out to website owners for getting mentioned on their page (link building)',
        'Market research for advertising campaigns (keywords, search volumes, languages, etc)',
        'Evaluate different online marketing channels on performance and re-allocated budgets'
      ]
    },
    required: {
      title: 'What you have',
      desc: [
        'Studying for a Bachelor degree in Business Administration, Marketing or related',
        'Ability of handling large amounts of data and extracting results out of it',
        'Good knowledge of Excel as well as other MS-Office and internet applications',
        'Interest in social media, sharing economy and digital advertising',
        'Self-starter, structured, an independent personality with a great eye for detail',
        'Fluency in English and German, other languages such as Spanish Italian, Dutch',
        'An internship is a compulsory part of your course of studies for 5-6 months'
      ]
    },
    offer: {
      title: 'What we have',
      desc: [
        'Launched a successful bike sharing platform, now growing fast',
        'Believe in the sharing economy and technology as key facilitator',
        'Experienced leadership team, a unique vision with a global ambition',
        'A mentality always looking for “what is right” and not “who is right”',
        'Competitive remuneration and flexible working hours'
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
        'Launched a successful bike sharing platform, now growing fast',
        'Believe in the sharing economy and technology as key facilitator',
        'Experienced leadership team, a unique vision with a global ambition',
        'A mentality always looking for “what is right” and not “who is right”',
        'Competitive remuneration and flexible working hours'
      ]
    }
  }
  ];
  //   remarks: [
  //       'This position is based in Berlin or Munich, and you will report to the Head of Sales & Marketing.'
  //   ]

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