app.factory("api", ["$http",
function($http) {

   return {
      getDorms: function() {
         return $http.get("Dorms/")
          .then(function(response) {
             return response.data;
          })
          .catch(function(error) {
             return [
                {
                   id: 1,
                   name: "North Mountain"
                },
                {
                   id: 2,
                   name: "Poly Canyon Village"
                }
             ]
          });
      },

      getMajors: function() {
         return $http.get("Majors/")
          .then(function(response) {
             return response.data;
          })
          .catch(function(error) {
             return [
                {
                   id: 1,
                   name: "Software Engineering"
                },
                {
                   id: 2,
                   name: "Computer Engineering"
                },
                {
                   id: 3,
                   name: "Poultry Management"
                }
             ]
          });
      },

      register: function(newUser) {
         return $http.post("User", newUser)
          .then(function(response) {
             return response.data;
          });
      },

      getHobbies: function() {
        return $http.get("Hobbies/")
         .then(function(response) {
            return response.data;
         });
      }
   };
}]);
