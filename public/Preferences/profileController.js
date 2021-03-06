app.controller('profileController',
 ['$scope', '$state', '$http', 'login', 'notifyDlg', 'user', 'preferences',
 'hobbies',
 function($scope, $state, $http, login, nDlg, user, preferences, hobbies) {
   	$scope.user = user[0];
      $scope.prevUser = Object.assign({}, user[0]);
   	$scope.preferences = preferences[0];
    $scope.hobbies = hobbies;

      login.getUser().then(
         function(user) {
            $scope.isEditable = $scope.user.id == user.id;
         });

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
            $scope.user.picture = e.target.result;
         });
      }

      $scope.setGender = function(gender) {
         $scope.user.gender = gender;
      }

      $scope.hasSetPreferences = function() {
        return Object.keys($scope.preferences || {}).length !== 0;
     }

     $scope.hasHobbies = function() {
        return $scope.hobbies.length !== 0;
     }

      $scope.hasEditedUser = function() {
         var a = $scope.user;
         var b= $scope.prevUser;
         return !(a.age === b.age &&
          a.email === b.email &&
          a.firstName === b.firstName &&
          a.gender === b.gender &&
          a.lastName === b.lastName &&
          a.introduction === b.introduction &&
          a.picture === b.picture)
      }

      $scope.restoreUser = function() {
         $scope.user = $scope.prevUser;
         $state.reload();
      }

      $scope.saveUserChanges = function() {
         var newUser = Object.assign({}, $scope.user);
         delete newUser.pictureUrl;
         delete newUser.id;
         delete newUser.whenRegistered;
         delete newUser.email;
         delete newUser.termsAccepted;
         delete newUser.whenRegistered;

         $http.put("Users/" + $scope.user.id, newUser)
         .then(function(response) {
            Object.assign($scope.prevUser, $scope.user);
         })
         .catch(function(error) {
            console.log("failed to modify user");
            console.log(error);
         })
      }
 }]);
