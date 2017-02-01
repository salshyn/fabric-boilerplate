app.service('ThingsService', ["$q", "$http", "$localStorage", function ($q, $http, $localStorage) {

    return {
        getAllThings: function () {
            var deferred = $q.defer();

            console.log("ThingsService -- Get assigned things based on userId: ", $localStorage.user.id);

            $http({
                method: 'GET',
                url: '/api/v1/thing/'
            }).then(function success(response) {
                deferred.resolve(response.data);
            }, function error(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        getThing: function () {
            var deferred = $q.defer();

            console.log("ThingsService -- Get thing with id: ", $localStorage.selectedThing);

            $http({
                method: 'GET',
                url: '/api/v1/thing/' + $localStorage.selectedThing
            }).then(function success(response) {
                deferred.resolve(response.data);
            }, function error(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        addThing: function () {
            var deferred = $q.defer();

            console.log("ThingsService -- Add thing with id: ", $localStorage.thingToAdd.id);

            $http({
                method: 'POST',
                url: '/api/v1/thing/',
                data: {
                  "id": $localStorage.thingToAdd.id,
                  "description": $localStorage.thingToAdd.description
                }
            }).then(function success(response) {
                deferred.resolve(response.data);
            }, function error(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

    }

}])
