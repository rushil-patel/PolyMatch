app.controller('profileController',
 ['$scope', '$state', '$http', 'login', 'notifyDlg', 'user', 'preferences',
   function($scope, $state, $http, login, nDlg, user, preferences) {
   	$scope.user = user[0];
   	$scope.preferences = preferences[0];
      $scope.imageUpload = function(event) {
         var files = event.target.files;
         var file = files[files.length-1];
         $scope.file = file;
         var reader = new FileReader();
         reader.onload = $scope.imageIsLoaded;
         reader.readAsDataURL(file);
      }

      $scope.imageIsLoaded = function(e) {
         $scope.$apply(function() {
            $scope.profileImageData = e.target.result;
         })
      }

      $scope.setGender = function(gender) {
         $scope.user.gender = gender;
      }
 }]);
