app.controller('preferencesController',
 ['$q', '$scope', '$state', 'notifyDlg', 'api', 'dormList', 'majorList',
 function($q, $scope, $state, nDlg, api, dormList, majorList) {

    $scope.dormList = dormList;
    $scope.dormSearch = "";

    $scope.majorList = majorList;
    $scope.majorSearch = "";

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

    $scope.gradesRatio = 50;
    $scope.gradesRatioUpdate = function() {
      $scope.socialRatio = 100 - $scope.gradesRatio;
   };
    $scope.socialRatio = 50;
    $scope.socialRatioUpdate = function() {
      $scope.gradesRatio = 100 - $scope.socialRatio;
   };

   $scope.quite = false;
   $scope.greekLife = false;
   $scope.smoking = false;
   $scope.drinking = false;

   $scope.sleepHour = 11;
   $scope.wakeHour = 9;
   $scope.sleepMeridien = "pm";
   $scope.wakeMeridien = "am";
   $scope.cleanliness = 3;


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
        return hobby.name.toLowerCase().indexOf(lowercaseQuery) === 0;
      }
   };

   $scope.exitChip = function(chip, index) {
      console.log(chip.name);
      console.log(chip.id);
      console.log(index);
      console.log("exit chip");
   };

}]);
