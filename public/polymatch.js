
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
      var timeDisplay = {};
      if (time >= 12) {
         timeDisplay.time = time - 12;
         timeDisplay.meridien = "pm";
      }
      else if (time == 0) {
         timeDisplay.time = 12;
         timeDisplay.meridien = "am";
      }
      else {
         timeDisplay.time = time;
         timeDisplay.meridien = "am";
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

app.directive('cnvSummary', [function() {
   return {
      restrict: 'E',
      scope: {
         user: "=user",
         cnvNum: "=index",
         cnv: "=toSummarize",
         editCnv: "&editCnv",
         delCnv: "&delCnv"
      },
      templateUrl: 'Conversation/cnvSummary.template.html'
   };
}]);
