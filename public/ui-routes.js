
app.config(['$stateProvider', '$urlRouterProvider',
   function($stateProvider, $router) {

      //redirect to home if path is not matched
      $router.otherwise("/");

      $stateProvider
      .state('home',  {
         url: '/',
      })
      .state('register', {
      	url: '/register',
      	templateUrl: '/Register/register.template.html'
      })
   }]);
