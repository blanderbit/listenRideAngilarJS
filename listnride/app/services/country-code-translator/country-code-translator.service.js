'use strict';

angular.module('listnride')
  .factory('countryCodeTranslator', function ($translate) {

    var data = [
      {
        "countryCode": "DE",
        "countryNames": ["Alamagn","Alemaña","Alemanha","Alémani","Alemania","Alemanne","Alemantlān","Alemanya","Alimaña","Alimanya","Allemagne","Allemangne","Allemogne","yr Almaen","Alman","Almānīya","Almaniya","Almanya","Almayn","Ashkenaz","אשכנז","Däitschland","Daytshland","דײַטשלאַנד","Déguó","德國","德国","Deitschland","Deutän","Deutschland","Déyìzhì","德意志","Ditschlånd","Dogil","Togil","독일","Doitsu","ドイツ","独逸","獨乙","dotygu'e","Đức Quốc or Đức","Duiska","Duitsland","Dútslân","Düütschland","Duutslaand","Duutsland","Ǧarman","ጀርመን","German","Герман","Germani","Германи","Germania","Գերմանիա","Germania","გერმანია","Germanía","Γερμανία","Germania","Germània","Zermània","Germanija","Германија","Germanio","Germaniya","Гepмaния","Germaniya","גרמניה","Germaniya","Ӂермания","Gérmaniye","گېرمانىيە","германийә","il-Ġermanja","Germany","a' Ghearmailt","an Ghearmáin","Ghirmânii","Girmania","Gjermania","Gjermanie","Jaamaluvik","Jarmal","Jarmaniya","ජර්මනිය","Jemani","Jermani","Jerman","Jérman","Jermani","Jeureuman","Nemačka","Немачка","Nemčija","Německo","Nemecko","Németország","Niemcy","Nimechchyna","Німеччина","Nimska","Njamiechchyna","Нямеччына","Njemačka","Saksa","Saksamaa","S'aksamaa","Siaman or Siamani","Švapska","Швапска","Tek-kok","Terra Tudestga","Þēodiscland","Þýskaland","Tiamana","Tôitšhi","Tyskland","Týskland","Ujerumani","Vācija","Vokietija","Yoeramani","เยอรมนี","ஜெர்மனி","Germany","جرمنی","জার্মানি","Jarmani"]
      },
      {
        "countryCode": "AT",
        "countryNames": ["Afstría","Αυστρία","An Ostair","Áo","Àodìlì","奧地利","奥地利","Àoguó","奧國","奥国","Aostria","Oshtriya","অস্ট্রিয়া","Āsṭriyā","ఆస్ట్రియా","Āsṫriyā","اسٹریا","Austri","Austria","Àustria","Áustria","Austrija","Austrija","Аустрија","Aŭstrio","Aŭstrujo","Aŭstryja","Аўстрыя","Austurríki","Ausuturia","Ausztria","Autriche","Avstria","Ավստրիա","Avstria","ავსტრია","Avstrija","Avstrija","Австрия","Avstrija","Австрија","Avstriya","Австрія","Avusturya","Awstiriya","Awstria","l-Awstrija","Awstriska","Eastenryk","Estraykh","עסטרײַך","Eysturríki","Itävalta","Nimsā","النمسا","Oostenrijk","Oostenryk","Öösterriek","Oseuteuria","Osŭt'ŭria","오스트리아","Österreich","Østerrike","Österrike","Ostria","ออสเตรีย","Østrig","Osṭriyā","ઓસ્ટ્રિયા","Ostriya","אוסטריה","Osṭriyā","ओस्ट्रिया","Ostriyawa","ඔස්ට්රියාව","Ōsutoria","オーストリア","Ōsutorī","オーストリー","Otrish","اتریش","Rakousko","Rakúsko","Rakuzy","ஆஸ்திரியா","Astria","আস্ট্রিয়া"]
      }
    ];

    var countryCodeFor = function (countryName) {
      var countryCode = undefined;
      _(data).each(function (el) {
        if (el.countryNames.indexOf(countryName) > -1) {
          countryCode = el.countryCode;
          return;
        }
      });
      return countryCode;
    };

    return {
      countryCodeFor: countryCodeFor
    }

  });
