app.controller('matchesController',
 ['$scope', '$state', '$http', 'login', 'notifyDlg', 'matches',
   function($scope, $state, $http, login, nDlg, matches) {

      $scope.title = $state.current.data.title;
      $scope.extraQuery = $state.current.data.extraQuery;
      $scope.filters = ('firstName lastName major dorm gradeRatio ' +
         'quiet greekLife smoking drinking wakeTime sleepTime ' +
         'cleanliness').split(' ').map(function(f) {
        return {filter: f};
      });
      
      for (var match in matches) {
         if (matches[match].pictureUrl === null) {
            matches[match].pictureUrl = 'Images/default.png';
         }
      }

      $scope.matches = matches;

      $scope.currentFilters = [];

      $scope.saveMatch = function(matchId, boolean) {

         login.getUser().then(function(user) {
            $http.put('Users/' + user.id + '/Matches/' + matchId, 
             {'saved': boolean}).then(function(response) {
               $state.reload();
             }).catch(function(err) {
               console.log('not saved');
             });
         })

         
      };

      $scope.hideMatch = function(matchId, boolean) {

         login.getUser().then(function(user)) {
            $http.put('Users/' + user.id + '/Matches/' + matchId, 
             {'archived': boolean}).then(function(response) {
               $state.reload();
             }).catch(function(err) {
               console.log('not hidden');
             });
         }
      };

      $scope.addNote = function(index) {
         matches[index].newNote = true;
      };

      $scope.submitNote = function(index, note) {
         matches[index].newNote = false;
         login.getUser().then(function(user)) {
            $http.put('Users/' + user.id + '/Matches/' + matches[index].matchId,
             {'notes': note}).then(function(response) {
               $state.reload();
             });
         }
      };

      $scope.filter = function() {
         $scope.currentFilters.push($scope.filterApplied);
         var length = Object.keys($scope.currentFilters).length;
         var query = "/Users/" + login.getUser().id + 
            "/Matches?" + $scope.extraQuery;

         for (var filter in $scope.currentFilters) {
            query += " && " + $scope.currentFilters[filter].name + "=";
            if ($scope.currentFilters[filter].name === "dorm") {

            }
            if ($scope.currentFilters[filter].name !== "gradeRatio") {
               query += "'";
            }
            query += $scope.currentFilters[filter].value;
            if ($scope.currentFilters[filter].name !== "gradeRatio") {
               query += "'";
            }
         }


         $http.get(query)
            .then(function(response) {
               $scope.matches = response.data;
            });
         $scope.filterApplied = {};
      }

      $scope.removeFilter = function(filter) {
         console.log('remove filter..');
         var index = $scope.currentFilters.indexOf(filter);
         var length = Object.keys($scope.currentFilters).length;
         console.log(index);
         var first = $scope.currentFilters.splice(0, index);
         var last = $scope.currentFilters.splice(index + 1, length);
         $scope.currentFilters = first.concat(last);
         console.log($scope.currentFilters);
         length = Object.keys($scope.currentFilters).length;

         var query = "/Users/" + login.getUser().id + 
            "/Matches?" + $scope.extraQuery;

         for (var filter in $scope.currentFilters) {
            query += " && " + $scope.currentFilters[filter].name + "=";
            if ($scope.currentFilters[filter].name !== "gradeRatio") {
               query += "'";
            }
            query += $scope.currentFilters[filter].value;
            if ($scope.currentFilters[filter].name !== "gradeRatio") {
               query += "'";
            }
         }

         $http.get(query)
            .then(function(response) {
               $scope.matches = response.data;
            });
         $scope.filterApplied = {};
      }

}]);
