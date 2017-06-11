app.controller('matchesController',
 ['$scope', '$state', 'notifyDlg', 'matches',
   function($scope, $state, nDlg, matches) {
   	$scope.matches = matches;
}]);
