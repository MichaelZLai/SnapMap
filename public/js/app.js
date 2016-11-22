angular
  .module("snapmap", [
    "ui.router"
  ])
  .config([
    "$stateProvider",
    Router
  ])

  function Router($stateProvider){
    console.log("router working")
    $stateProvider
      .state("map", {
        url: "/",
        templateUrl: "./js/ng-views/map.html"
      })
  }
