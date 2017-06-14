app.controller('matchesController',
 ['$scope', '$state', '$http', 'login', 'notifyDlg', 'matches',
   function($scope, $state, $http, login, nDlg, matches) {

   	$scope.title = $state.current.data.title;
   	$scope.filters = ('firstName lastName major dorm gradeRatio ' +
   		'quiet greekLife smoking drinking wakeTime sleepTime ' +
   		'cleanliness').split(' ').map(function(f) {
        return {filter: f};
      });
   		console.log($scope.filters);

   	for (var match in matches) {
   		if (matches[match].pictureUrl === null) {
   			matches[match].pictureUrl = 'Images/default.png';
   		}
   	}

   	$scope.matches = matches;

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
         login.getUser().then(function(user) {
            $http.put('Users/' + user.id + '/Matches/' + matchId,
      		 {'archived': boolean}).then(function(response) {
      		 	$state.reload();
      		 }).catch(function(err) {
      		 	console.log('not hidden');
      		 });
         })
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

}]);
