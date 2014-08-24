angular.module('MainApp', ['ui.bootstrap','MainModule', 'ngRoute','ngAnimate', 'angularSmoothscroll', 'ngCookies'])

.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
  $rootScope.$on('$routeChangeStart', function (event) {
    console.log("loaded ...");
  });
}])

// Set the routes
.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
   $routeProvider
	.when('/', { templateUrl:function (params) {return "home.htm"} })
  .when('/menu', { templateUrl:function (params) { return "menu.htm"} })
	.when('/404', { templateUrl:"404.htm" })
	.otherwise({redirectTo:'/404'});
}])