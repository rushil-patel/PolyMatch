app.controller('registerController',
 ['$q', '$http', '$scope', '$state', 'notifyDlg', 'api', 'login',
 function($q, $http, $scope, $state, nDlg, api, login) {
    $scope.user = {};
    $scope.confPass = null;
    $scope.errors = [];

    $scope.registerUser = function() {
      $http.post("Users", $scope.user)
      .then(function() {
         return nDlg.show($scope, "Would you like to automatically login?",
          "Login", [true, true]);
      })
      .then(function() {
         var loginData = {
            email: $scope.user.email,
            password: $scope.user.password
         }
         return login.login(loginData);
      })
      .then(function(user) {
         $scope.$parent.user = user;
         $state.go('preferences');
      })
      .catch(function(error) {
         console.log(error);
         if (error)
          $scope.errors = error.data;
         else
          $state.go('home');
      })
   }
}]);
