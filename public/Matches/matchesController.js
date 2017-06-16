app.controller('matchesController',
 ['$scope', '$state', '$http', 'login', 'notifyDlg', 'matches', 'dormList', 
  'majorList',
  function($scope, $state, $http, login, nDlg, matches, dormList, majorList) {
  $scope.title = $state.current.data.title;
  $scope.extraQuery = $state.current.data.extraQuery;
  $scope.filters = ('firstName lastName major dormName gradeRatio ' +
     'quiet greekLife smoking drinking wakeTime sleepTime ' +
     'cleanliness').split(' ').map(function(f) {
    return {filter: f};
  });

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
     });

     
  };

  $scope.hideMatch = function(matchId, boolean) {

     login.getUser().then(function(user) {
        $http.put('Users/' + user.id + '/Matches/' + matchId, 
         {'archived': boolean}).then(function(response) {
           $state.reload();
         }).catch(function(err) {
           console.log('not hidden');
         });
     });
  };

  $scope.addNote = function(index) {
     matches[index].newNote = true;
  };

  $scope.submitNote = function(index, note) {
     matches[index].newNote = false;
     login.getUser().then(function(user) {
        $http.put('Users/' + user.id + '/Matches/' + matches[index].matchId,
         {'notes': note}).then(function(response) {
           $state.reload();
         });
     });
  };

  $scope.filter = function() {
     $scope.currentFilters.push($scope.filterApplied);
     var length = Object.keys($scope.currentFilters).length;
     var query;
     login.getUser().then(function(response){
        query = "/Users/" + response.id + 
         "/Matches?" + $scope.extraQuery;

        for (var filter in $scope.currentFilters) {
           query += " && " + $scope.currentFilters[filter].name + "=";
           if ($scope.currentFilters[filter].name === "firstName" ||
            $scope.currentFilters[filter].name === "lastName") {
              query += "'";
           }
           var value = $scope.currentFilters[filter].value;
           if ($scope.currentFilters[filter].name === "dormName") {
              for (var dorm in dormList) {
                 if (dormList[dorm].name === $scope.currentFilters[filter].value) {
                    value = dormList[dorm].id;
                    break;
                 }
              }
              if (value === $scope.currentFilters[filter].value) {
                 value = 0;
              }
           }
           else if ($scope.currentFilters[filter].name === "major") {
              for (var major in majorList) {
                 if (majorList[major].name === $scope.currentFilters[filter].value) {
                    value = majorList[major].id;
                    break;
                 }
              }
              if (value === $scope.currentFilters[filter].value) {
                 value = 0;
              }
           }
           
           query += value;
           if ($scope.currentFilters[filter].name === "firstName" ||
            $scope.currentFilters[filter].name === "lastName") {
              query += "'";
           }
        }
        console.log(query);

        $http.get(query)
           .then(function(response) {
              $scope.matches = response.data;
           });
        $scope.filterApplied = {};
     });
  }

  $scope.removeFilter = function(filter) {
     var index = $scope.currentFilters.indexOf(filter);
     var length = Object.keys($scope.currentFilters).length;
     console.log(index);
     var first = $scope.currentFilters.splice(0, index);
     var last = $scope.currentFilters.splice(index + 1, length);
     $scope.currentFilters = first.concat(last);
     console.log($scope.currentFilters);
     length = Object.keys($scope.currentFilters).length;

     login.getUser().then(function(response){
        query = "/Users/" + response.id + 
         "/Matches?" + $scope.extraQuery;

        for (var filter in $scope.currentFilters) {
           query += " && " + $scope.currentFilters[filter].name + "=";
           if ($scope.currentFilters[filter].name === "firstName" ||
            $scope.currentFilters[filter].name === "lastName") {
              query += "'";
           }
           var value = $scope.currentFilters[filter].value;
           if ($scope.currentFilters[filter].name === "dormName") {
              for (var dorm in dormList) {
                 if (dormList[dorm].name === $scope.currentFilters[filter].value) {
                    value = dormList[dorm].id;
                    break;
                 }
              }
              if (value === $scope.currentFilters[filter].value) {
                 value = 0;
              }
           }
           else if ($scope.currentFilters[filter].name === "major") {
              for (var major in majorList) {
                 if (majorList[major].name === $scope.currentFilters[filter].value) {
                    value = majorList[major].id;
                    break;
                 }
              }
              if (value === $scope.currentFilters[filter].value) {
                 value = 0;
              }
           }
           query += value;
           if ($scope.currentFilters[filter].name === "firstName" ||
            $scope.currentFilters[filter].name === "lastName") {
              query += "'";
           }
        }
        console.log(query);

        $http.get(query)
           .then(function(response) {
              $scope.matches = response.data;
           });
        $scope.filterApplied = {};
     });
  }

}]);
