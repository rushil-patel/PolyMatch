app.controller('preferencesController',
 ['$q', '$scope', '$state', 'notifyDlg', 'api', 'dormList', 'majorList',
 function($q, $scope, $state, nDlg, api, dormList, majorList) {

    $scope.dormList = dormList;
    $scope.dormSearch = "";

    $scope.majorList = majorList;
    $scope.majorSearch = "";

    $scope.gradesRatio = 50;
    $scope.gradesRatioUpdate = function() {
      $scope.socialRatio = 100 - $scope.gradesRatio;
   }
    $scope.socialRatio = 50;
    $scope.socialRatioUpdate = function() {
      $scope.gradesRatio = 100 - $scope.socialRatio;
   }

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
   }

   $scope.queryMajor = function(search) {
      var filteredMajors = majorList.filter(function(item) {
         return item.name.toLowerCase()
          .indexOf($scope.majorSearch.toLowerCase()) >= 0
      })
      return $q.when(filteredMajors)
   }

}]);
