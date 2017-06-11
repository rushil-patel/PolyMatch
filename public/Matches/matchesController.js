app.controller('matchesController',
 ['$scope', '$state', '$http', 'login', 'notifyDlg', 'matches',
   function($scope, $state, $http, login, nDlg, matches) {
   	$scope.matches = matches;

   	for (var match in matches) {
   		console.log(matches[match]);
   		if (matches[match].pictureUrl === null) {
   			matches[match].pictureUrl = 'Images/default.png';
   		}
   	}

   	$scope.saveMatch = function(matchId) {
   		console.log('saving');

   		$http.put('Users/' + login.getUser().id + '/Matches/' + matchId, 
   		 {'saved': true}).then(function(response) {
   		 	console.log('going back');
   		 	$state.reload();
   		 }).catch(function(err) {
   		 	console.log('not saved');
   		 });
   	};

   	$scope.hideMatch = function(matchId) {
   		console.log('hiding');

   		$http.put('Users/' + login.getUser().id + '/Matches/' + matchId, 
   		 {'archived': true}).then(function(response) {
   		 	console.log('going back');
   		 	$state.reload();
   		 }).catch(function(err) {
   		 	console.log('not hidden');
   		 });
   	};
}]);
