
app.config(['$stateProvider', '$urlRouterProvider',
   function($stateProvider, $router) {

      //redirect to home if path is not matched
      $router.otherwise("/");

      $stateProvider
      .state('home',  {
         url: '/',
         templateUrl: 'Home/home.template.html',
         controller: 'homeController',
      })
      .state('login', {
         url: '/login',
         templateUrl: 'Login/login.template.html',
         controller: 'loginController',
      })
      .state('register', {
         url: '/register',
         templateUrl: 'Register/register.template.html',
         controller: 'registerController',
      })
      .state('cnvOverview', {
         url: '/cnvs',
         templateUrl: 'Conversation/cnvOverview.template.html',
         controller: 'cnvOverviewController',
         resolve: {
            cnvs: ['$q', '$http', function($q, $http) {
               return $http.get('/Cnvs')
               .then(function(response) {
                  return response.data;
               });
            }]
         }
      })
      .state('myCnv', {
         url: '/myCnvs',
         templateUrl: 'Conversation/cnvOverview.template.html',
         controller: 'cnvOverviewController',
         resolve: {
            cnvs: ['$q', '$http', '$rootScope', 
             function($q, $http, $rootScope) {
               return $http.get('/Cnvs?owner=' + $rootScope.user.id)
               .then(function(response) {
                  return response.data;
               });
            }]
         }
      })
      .state('cnvDetail', {
         url: '/cnvs/:cnvId',
         templateUrl: 'Conversation/cnvDetail.template.html',
         controller: 'cnvDetailController',
         resolve: {
            cnvTitle: ['$http', '$stateParams', 
             function($http, $stateParams) {
               return $http.get('/Cnvs/' + $stateParams.cnvId)
               .then(function(response) {
                  return response.data.title;
               });
            }],
            msgs: ['$http', '$stateParams', 
             function($http, $stateParams) {
               return $http.get('/Cnvs/' + $stateParams.cnvId + '/Msgs')
               .then(function(response) {
                  return response.data;
               });
            }]
         }
      });
   }]);
