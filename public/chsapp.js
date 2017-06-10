
var app = angular.module('mainApp', [
   'ui.router',
   'ui.bootstrap'
]);

app.constant("errMaps", {
   "english" : 
   {
      missingField: 'Field missing from request: ',
      badValue: 'Field has bad value: ',
      notFound: 'Entity not present in DB',
      badLogin: 'Email/password combination invalid',
      dupEmail: 'Email duplicates an existing email',
      noTerms: 'Acceptance of terms is required',
      forbiddenRole: 'Role specified is not permitted.',
      noOldPwd: 'Change of password requires an old password',
      oldPwdMismatch: 'Old password that was provided is incorrect.',
      dupTitle: 'Conversation title duplicates an existing one',
      dupEnrollment: 'Duplicate enrollment',
      forbiddenField: 'Field in body not allowed.',
      queryFailed: 'Query failed (server problem).'
   },
   "spanish" :
   {
      missingField: '[ES] Field missing from request: ',
      badValue: '[ES] Field has bad value: ',
      notFound: '[ES] Entity not present in DB',
      badLogin: '[ES] Email/password combination invalid',
      dupEmail: '[ES] Email duplicates an existing email',
      noTerms: '[ES] Acceptance of terms is required',
      forbiddenRole: '[ES] Role specified is not permitted.',
      noOldPwd: '[ES] Change of password requires an old password',
      oldPwdMismatch: '[ES] Old password that was provided is incorrect.',
      dupTitle: '[ES] Conversation title duplicates an existing one',
      dupEnrollment: '[ES] Duplicate enrollment',
      forbiddenField: '[ES] Field in body not allowed.',
      queryFailed: '[ES] Query failed (server problem).'
   }
});

app.filter('tagError', ['errMaps', '$rootScope', 
   function(errMaps, $rootScope) {
      return function(err) {
         return errMaps[$rootScope.lang || 'english'][err.tag] + 
          (err.params && err.params.length ? err.params[0] : "");
      };
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
