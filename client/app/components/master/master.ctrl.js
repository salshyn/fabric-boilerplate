app.controller("MasterController", ["things", "$route", "$localStorage", "$location", "ThingsService", function (things, $route, $localStorage, $location, ThingsService) {

    var vm = this;

    vm.things = things;
    console.log(things);

    vm.openThing = function(thingId) {
        $localStorage.selectedThing = thingId;
        $location.path('/detail');
    };

    vm.addThing = function(thing) {
        $localStorage.thingToAdd = thing;
        ThingsService.addThing();
        //$state.reload();
        // $location.path('/master');
        // $route.reload();
    };

    vm.removeThing = function(thing) {
        $localStorage.thingToRemove = thing;
        ThingsService.removeThing();
        //$state.reload();
        // $location.path('/master');
        // $route.reload();
    }

    vm.update = function() {
        ThingsService.update();
    }
}]);
