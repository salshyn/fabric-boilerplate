app.controller("MasterController", ["things", "$localStorage", "$location", "ThingsService", function (things, $localStorage, $location, ThingsService) {

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
    };

    vm.removeThing = function(thing) {
        console.log(thing);
        $localStorage.thingToRemove = thing;
        ThingsService.removeThing();
    }
}]);
