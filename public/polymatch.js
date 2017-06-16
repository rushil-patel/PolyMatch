
var app = angular.module('mainApp', [
   'ui.router',
   'ngMaterial',
   'ngCookies'
]);

app.constant("errMap", {
   missingField: 'Field missing from request: ',
   badValue: 'Field has bad value: ',
   notFound: 'Entity not present in DB',
   badLogin: 'Email/password combination invalid',
   dupEmail: 'Email duplicates an existing email',
   noTerms: 'Acceptance of terms is required',
   noOldPwd: 'Change of password requires an old password',
   oldPwdMismatch: 'Old password that was provided is incorrect.',
   dupEnrollment: 'Duplicate enrollment',
   forbiddenField: 'Field in body not allowed.',
   queryFailed: 'Query failed (server problem).',
   dupHobby: 'Duplicate hobbby.'
});

app.filter('tagError', ['errMap',
   function(errMap) {
      return function(err) {
         return errMap[err.tag] + " " + (err.params ? err.params[0] : "");
      };
}]);

app.filter('timeInputFilter', [function() {
   return function(time) {
      var timeDisplay = "";
      if (time > 12) {
         timeDisplay += (time - 12) + " pm";
      }
      else if (time == 0) {
         timeDisplay += 12 + " am";
      }
      else if (time == 12) {
         timeDisplay += 12 + " pm";
      }
      else {
         timeDisplay += time + " am";
      }
      return timeDisplay;
   }
}]);

app.filter('timeOutputFilter', [function() {
   return function(time, meridien) {
      var reqTime;
      if (meridien === "am" && time == 12) {
         reqTime = 0;
      }
      else if (meridien === "pm" && time != 12) {
         reqTime = time + 12;
      }
      else {
         reqTime = time;
      }
      return reqTime;
   }
}]);

app.directive('hobbyList', [function() {
   return {
      restrict: 'E',
      scope: {
         hobbies: "=userHobbies"
      },
      templateUrl: 'Util/hobbyChips.template.html'
   };
}]);

app.directive('scrollBottom', [function() {
   return {
      restrict: 'A',
      link: function(scope, element, attr) {
         element.on("click", function() {
            console.log("click");
            window.scrollTo(0, document.body.scrollHeight);
         });
      }
   };
}]);

app.directive('errorList', [function() {
   return {
      restrict: 'E',
      scope: {
         errors: "="
      },
      templateUrl: 'Util/errorList.template.html'
   };
}]);

// app.directive('cnvSummary', [function() {
//    return {
//       restrict: 'E',
//       scope: {
//          user: "=user",
//          cnvNum: "=index",
//          cnv: "=toSummarize",
//          editCnv: "&editCnv",
//          delCnv: "&delCnv"
//       },
//       templateUrl: 'Conversation/cnvSummary.template.html'
//    };
// }]);
