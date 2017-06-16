app.controller('navController',
 ['$scope', '$rootScope', '$state', '$cookies', '$location', 'login', 
 'notifyDlg',
 function($scope, $rootScope, $state, $cookies, $location, login, nDlg) {
   login.getUser()
   .then(function(user) {
      $rootScope.user = user;
      $scope.user = $rootScope.user;
   })
   .catch(function(error) {
      console.log("error getting user nav")
   })

   $scope.isLoggedIn = function() {
      return $rootScope.user;
   }


   $rootScope.$on('$stateChangeSuccess', function() {
      $scope.selectedNavItem = $state.current.name;
      console.log($scope.selectedNavItem);
   });

   $rootScope.getSelectedNavItem = function() {
      console.log("getting nav item")
      return $scope.selectedNavItem || "home";
   }

   $scope.logout = function() {
      login.logout($scope.user)
      .then(function() {
         $scope.user = null;
         $rootScope.user = null;
         $state.go('home');
      })
      .catch(function(error) {
         console.log(error);
         nDlg.show($scope, "Couldn't find session.", "Error");
      });
   };

   $scope.changeLang = function(lang) {
      $rootScope.lang = lang;
   };
}]);
