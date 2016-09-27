'use strict';

angular.module('home').component('home', {
  templateUrl: 'app/modules/home/home.template.html',
  controllerAs: 'home',
  controller: [ 'api',
    function HomeController(api) {
      var home = this;

      home.testimonials = [
        {name: "John Stag", content: "Bacon ipsum dolor amet meatball jerky salami leberkas tenderloin flank hamburger venison shank. Pork belly filet mignon porchetta meatloaf picanha jowl. Andouille brisket boudin ham hock ground round, shankle beef ribs salami turkey fatback turducken capicola t-bone. Pig flank sirloin porchetta burgdoggen boudin. Cupim pig andouille leberkas rump, sirloin shoulder."},
        {name: "Jack Jr. Deer", content: "Short loin tri-tip meatloaf shoulder. Fatback frankfurter sirloin, bresaola beef ribs short loin ham hock filet mignon landjaeger capicola tail chuck bacon beef pork. Pastrami jowl biltong beef ribs. Salami tri-tip ribeye ham cupim shoulder bresaola meatball chuck tenderloin short ribs pork chop. Meatloaf jerky kevin, pork loin filet mignon spare ribs salami prosciutto leberkas turducken meatball alcatra pork pastrami."},
        {name: "Joanna Doe", content: "trip steak nulla flank salami quis. Ham cow landjaeger, adipisicing chicken filet mignon irure shank do fugiat ribeye cupim et. Veniam fugiat sint strip steak in, excepteur nulla anim dolore sunt salami. Ham sirloin beef meatloaf. Qui ut turducken tongue short loin short ribs."}
      ];

      api.get("/featured").then(function(response) {
        home.featuredBikes = response.data.slice(0,6);
      });
    }
  ]
});