app.controller('preferencesController',
 ['$q', '$scope', '$state', 'login', 'api', '$filter', '$http', 'dormList', 
 'majorList', 'hobbyList', 'preferences', 'userHobbies',
 function($q, $scope, $state, login, api, $filter, $http, dormList, majorList, 
 hobbyList, preferences, userHobbies) {

    //Initialization code
   $scope.errors = [];

   $scope.dormList = dormList;
   $scope.dormSearch = "";
   //attach to preference

   $scope.majorList = majorList;
   $scope.majorSearch = "";
   //attach to preference

   //Hobby Chips
   $scope.selectedItem = null;
   $scope.searchText = null;
   $scope.hobbyList = hobbyList;
   $scope.newUserHobbies = [];

   if (preferences.length) {
      $scope.canUpdate = true;
      $scope.preferences = preferences[0];
      var index = 0, timeDisplay;

      while (index < $scope.dormList.length && 
       $scope.dormList[index].name !== preferences[0].dormName) {
        index++;
      }
      $scope.selectedDorm = dormList[index];
      index = 0;
      while (index < $scope.majorList.length && 
       $scope.majorList[index].name !== preferences[0].major) {
        index++;
      }
      $scope.selectedMajor = majorList[index];

      timeDisplay = $filter('timeInputFilter')(preferences[0].wakeTime)
      .split(' ');
      $scope.preferences.wakeTime = parseInt(timeDisplay[0], 10);
      $scope.wakeMeridien = timeDisplay[1];

      timeDisplay = $filter('timeInputFilter')(preferences[0].sleepTime)
      .split(' ');
      $scope.preferences.sleepTime = parseInt(timeDisplay[0], 10);
      $scope.sleepMeridien = timeDisplay[1];

      $scope.userHobbies = userHobbies;

   }
   else {
      $scope.preferences = {};
      $scope.canUpdate = false;
      $scope.preferences.quiet = false;
      $scope.preferences.greekLife = false;
      $scope.preferences.smoking = false;
      $scope.preferences.drinking = false;
      $scope.preferences.gradesRatio = 50;
      $scope.userHobbies = [];
   }


   $scope.gradesRatioUpdate = function() {
      $scope.socialRatio = 100 - $scope.preferences.gradesRatio;
   };
   $scope.socialRatio = 100 - $scope.preferences.gradesRatio;
   $scope.socialRatioUpdate = function() {
      $scope.preferences.gradesRatio = 100 - $scope.socialRatio;
   };

   $scope.sleepMeridien = "pm";
   $scope.wakeMeridien = "am";

   var normalizeInput = function() {
      var reqPrefs = Object.assign({}, $scope.preferences);

      delete reqPrefs.id;
      delete reqPrefs.userId;

      if ($scope.selectedDorm)
        reqPrefs.dormName = $scope.selectedDorm.id;
      else
        delete reqPrefs.dormName;
      if ($scope.selectedMajor)
        reqPrefs.major = $scope.selectedMajor.id;
      else
        delete reqPrefs.major;

      reqPrefs.wakeTime = 
       $filter('timeOutputFilter')($scope.preferences.wakeTime, 
       $scope.wakeMeridien);

      reqPrefs.sleepTime = 
       $filter('timeOutputFilter')($scope.preferences.sleepTime, 
       $scope.sleepMeridien);

      return reqPrefs;
   };

   var postNewHobbies = function() {
      var newHobbies;

      newHobbies = $scope.userHobbies.filter(function(hobby) {
        return hobby.id < 0;
      });
      newHobbies = newHobbies.map(function(hobbyObj) {
        return hobbyObj.name;
      });
      //if (newHobbies.length)
      return $http.post('/Hobbies', newHobbies);
   };

   var updateHobbiesForUser = function(response) {
      var newUserHobbies = $scope.newUserHobbies;

      return login.getUser().then(function(user) {
         var user = user.id;
         console.log("USER: " + user);
         newUserHobbies = newUserHobbies.concat(response.data);
         return $http.post('/Users/' + user + '/Hobbies', newUserHobbies);
      });
   }

   var clearErrorsOnSuccess = function(response) {
      $scope.errors = [];
   };

   var reqErrorHandler = function(err) {
      console.log(err.data);
      if (err.data) {
        $scope.errors = err.data;
      }
   };

   $scope.savePreferences = function() {

      login.getUser().then(function(user) {
         var user = user.id;
         postNewHobbies().then(updateHobbiesForUser)
         .then(function(response) {
            return $http.get('/Users/' + user + '/Hobbies');
         })
         .then(function(response) {
            $scope.userHobbies = response.data;
            $scope.newUserHobbies = [];
         })
         .then(function(response) {
            return $http.post('/Users/' + user + '/Prefs', normalizeInput());
         })
         .then(function(response) {
            $state.go('user');
         })
         .catch(reqErrorHandler);
      });
   };

   $scope.updatePreferences = function() {

      login.getUser().then(function(user) {
         var user = user.id

         postNewHobbies().then(updateHobbiesForUser)
         .then(function(response) {
            return $http.put('/Users/' + user + '/Prefs', normalizeInput());
         })
         .then(function(response) {
            return $http.get('/Users/' + user + '/Hobbies');
         })
         .then(function(response) {
            $scope.userHobbies = response.data;
            $scope.newUserHobbies = [];
         })
         .then(clearErrorsOnSuccess).catch(reqErrorHandler);
      });
   }

    $scope.queryDorm = function(search) {
      var filteredDorms = dormList.filter(function(item) {
         console.log($scope.dormSearch)
         return item.name.toLowerCase()
          .indexOf($scope.dormSearch.toLowerCase()) >= 0
      })
      return $q.when(filteredDorms)
   };

   $scope.queryMajor = function(search) {
      var filteredMajors = majorList.filter(function(item) {
         return item.name.toLowerCase()
          .indexOf($scope.majorSearch.toLowerCase()) >= 0
      })
      return $q.when(filteredMajors)
   };

   $scope.transformChip = function(chip, index) {
      var createChip;

      if (angular.isObject(chip)) {
         $scope.newUserHobbies.push(chip);
        return chip;
      }
      else {
        createChip = {id: -1, name: chip};
        return createChip;
      }
   };

   $scope.queryHobby = function(search) {
      var results = search ? 
       this.hobbyList.filter(this.createFilterFor(search)) : [];
      return results;
   };

   $scope.createFilterFor = function(search) {
      var lowercaseQuery = angular.lowercase(search);
      return function filterFunc(hobby) {
        return hobby.name.toLowerCase().indexOf(lowercaseQuery) >= 0;
      }
   };

   $scope.exitChip = function(chip, index) {
      login.getUser().then(function(user) {
         var user = user.id
         if (chip.id != -1) {
            $http.delete('/Users/' + user + /Hobbies/ + chip.id);
         }
      });
   };

}]);
