app.controller('loginController',
 ['$scope', '$state', "$rootScope", 'login', 'notifyDlg',
 function($scope, $state, $rootScope, login, nDlg) {
   $scope.login = function() {
      login.login($scope.user)
      .then(function(user) {
         $state.go('preferences');
      })
      .catch(function(error) {
         console.log(error);
         nDlg.show($scope, "That name/password is not in our records",
          "Error", [true, false]);
      });
   };
}]);
