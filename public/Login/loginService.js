app.factory("login", ["$q", "$http", '$rootScope', "$cookies",
function($q, $http, $rootScope, $cookies) {
   var user;

   return {
      loginRefresh: function() {
         var currentCookie = $cookies.get("pmAuth");
         return $http.get("Ssns/" + currentCookie)
          .then(function(response) {
              var sessionData = response.data;
              return $http.get("Users/" + sessionData.prsId)
          })
          .then(function(response) {
             return user = response.data[0];
          });
      },

      login: function(loginData) {
         return $http.post("Ssns", loginData)
         .then(function(response) {
            var location = response.headers().location.split('/');

            cookie = location[location.length - 1];
            $cookies.put("pmAuth", cookie);
            return $http.get("Ssns/" + cookie);
         })
         .then(function(response) {
            return $http.get('/Users/' + response.data.prsId);
         })
         .then(function(response) {
            user = response.data[0];
            $rootScope.user = user;
            return response.data[0];
         });
      },
      logout: function() {
         return $http.delete("Ssns/" + $cookies.get("pmAuth"))
         .then(function() {
            user = null;
            $rootScope.user = null;
            $cookies.remove("pmAuth");
         });
      },
      getUser: function() {
         if (!user && $cookies.get("pmAuth")) {
            return this.loginRefresh()
         } else {
            return $q.when(user);
         }
      }
   };
}]);
