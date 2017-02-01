app.controller("MasterController", ["things", "$localStorage", "$location", function (things, $localStorage, $location) {

    var vm = this;

    vm.things = things;
    console.log(things);

    vm.openThing = function(thingId){

        $localStorage.selectedThing = thingId;
        $location.path('/detail');
    }

    vm.addThing = function(thing){
        $localStorage.thingToAdd = thing;
        console.log(thing);
    }
}]);
