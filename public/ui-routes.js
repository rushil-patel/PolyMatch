
app.config(['$stateProvider', '$urlRouterProvider',
   function($stateProvider, $router) {

      //redirect to home if path is not matched
      $router.otherwise("/");

      $stateProvider
      .state('home',  {
         url: '/',
      })
      .state('login', {
         url: '/login',
         templateUrl: 'Login/login.template.html',
         controller: 'loginController'
      })
      .state('matches', {
         url: '/matches',
         templateUrl: 'Matches/matches.template.html',
         controller: 'matchesController'
      })
   }]);
