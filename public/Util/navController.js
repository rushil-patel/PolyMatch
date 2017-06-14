app.controller('navController',
   ['$scope', '$rootScope', '$state', '$cookies', 'login', 'notifyDlg',
   function($scope, $rootScope, $state, $cookies, login, nDlg) {

      $scope.logout = function() {
         login.logout($scope.user)
         .then(function() {
            $rootScope.user = null;
            $cookies.pmAuth = null;
            $state.go('home');
         })
         .catch(function() {
            nDlg.show($scope, "Couldn't find session.", "Error");
         });
      };

      $scope.changeLang = function(lang) {
         $rootScope.lang = lang;
      };


      var refresh = function() {
         var cookie = $cookies.get("PMAuth");
         console.log("got user: ");
         console.log(user)
         $http.get("Ssns/" + cookie)
          .then(function(response) {
              var sessionData = response.data;
              return $http.get("Users/" + sessionData.prsId)
          })
          .then(function(response) {
             var user = response.data[0];
             console.log("got user: ");
             console.log(user)
             $rootScope.user = user;
          })
          .catch(function(error) {
             $rootScope.user = nul;
          })
      }
      refresh();
}]);

app.run(function( $rootScope, $cookies, $http) {
      var cookie = $cookies.pmAuth;
      console.log($cookies.pmAuth)
      $http.get("Ssns/" + cookie)
       .then(function(response) {
           var sessionData = response.data;
           return $http.get("Users/" + sessionData.prsId)
       })
       .then(function(response) {
          var user = response.data[0];
          console.log("got user: ");
          console.log(user)
          $rootScope.user = user;
       })
       .catch(function(error) {
          console.log("failed to auto fetch login")
          $rootScope.user = null;
       })
    });
