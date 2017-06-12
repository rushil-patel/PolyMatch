app.controller('profileController',
 ['$scope', '$state', '$http', 'login', 'notifyDlg', 'user', 'preferences',
   function($scope, $state, $http, login, nDlg, user, preferences) {
   	$scope.user = user[0];
   	$scope.preferences = preferences[0];
   	$scope.title = $state.current.data.title;


}]);