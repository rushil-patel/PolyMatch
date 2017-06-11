app.controller('navController', 
   ['$scope', '$rootScope', '$state', 'login', 'notifyDlg', 
   function($scope, $rootScope, $state, login, nDlg) {

      $scope.logout = function() {
         login.logout($scope.user)
         .then(function() {
            $rootScope.user = null;
            $state.go('home');
         })
         .catch(function() {
            nDlg.show($scope, "Couldn't find session.", "Error");
         });
      };

      $scope.changeLang = function(lang) {
         $rootScope.lang = lang;
      };
}]);
