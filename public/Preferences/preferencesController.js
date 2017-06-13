app.controller('preferencesController',
 ['$q', '$scope', '$state', 'notifyDlg', 'api', 'dormList', 'majorList',
 function($q, $scope, $state, nDlg, api, dormList, majorList) {

    $scope.preferences = {};

    $scope.dormList = dormList;
    $scope.dormSearch = "";
    //attach to preference
    $scope.preferences.dorm = {id: 1, name: "test"};

    $scope.majorList = majorList;
    $scope.majorSearch = "";
    //attach to preference
    $scope.preferences.major = {};

    //Hobby Chips
    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.hobbyList = [
      {
        id: 1,
        name: "running"
      },
      {
        id: 2,
        name: "swimming"
      },
      {
        id: 3,
        name: "swearing"
      },
      {
        id: 4,
        name: "hiking"
      }];
    $scope.userHobbies = [];

    $scope.preferences.gradesRatio = 50;
    $scope.gradesRatioUpdate = function() {
      $scope.socialRatio = 100 - $scope.preferences.gradesRatio;
   };
    $scope.socialRatio = 100 - $scope.preferences.gradesRatio;
    $scope.socialRatioUpdate = function() {
      $scope.preferences.gradesRatio = 100 - $scope.socialRatio;
   };

   $scope.sleepMeridien = "pm";
   $scope.wakeMeridien = "am";
   
   $scope.savePreferences = function() {
    var preferences = {
      dormName: $scope.selectedDorm.id,
      major: $scope.selectedMajor.id,
      gradesRatio: $scope.gradesRatio,
      quiet: $scope.quiet,
      greekLife: $scope.greekLife,
      smoking: $scope.smoking,
      drinking: $scope.drinking,
      cleanliness: $scope.cleanliness
    };
    var sleep = $scope.sleepHour;
    var wake = $scope.wakeHour;

    if ($scope.sleepMeridien === "pm" && sleep != 12) {
      sleep += 12;
    }
    if ($scope.wakeMeridien === "pm" && wake != 12) {
      wake += 12;
    }
    if ($scope.wakeMeridien === "am" && wake == 12) {
      wake = wake % 12;
    }
    if ($scope.sleepMeridien === "am" && sleep == 12) {
      wake = wake % 12;
    }


   };

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

   $scope.transformChip = function(chip) {
      var createChip;

      if (angular.isObject(chip))
        return chip;
      else {
        createChip = {id: -1, name: chip};
        //$scope.userHobbies.push(createChip);
        return createChip;
      }
   };

   $scope.queryHobby = function(search) {
      var results = search ? this.hobbyList.filter(this.createFilterFor(search)) : [];
      return results;
   };

   $scope.createFilterFor = function(search) {
      var lowercaseQuery = angular.lowercase(search);
      return function filterFunc(hobby) {
        return hobby.name.toLowerCase().indexOf(lowercaseQuery) >= 0;
      }
   };

   $scope.exitChip = function(chip, index) {
      console.log(chip.name);
      console.log(chip.id);
      console.log(index);
      console.log("exit chip");
   };

}]);
