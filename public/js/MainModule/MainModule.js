angular.module('MainModule', ['MainApp'])

// services
// ----------------
.service('Auth', function(){
  var user = "user";
  var my = {};

  return{
    getUser: function () {return user}
  }
})

// controllers
// -------------
.controller("MainCtrl", [ "$scope", "$http", "Auth", "$rootScope", "$location", "$timeout","$route", "$routeParams", function ($scope, $http, Auth, $rootScope, $location, $timeout, $routeParams) {
  
  // for offline testing.
  $scope.isAppLoaded = true;
  $scope.$routeParams = $routeParams;

  // Everytime route changes test and see if we are on the homepage.
  $rootScope.$on('$routeChangeStart', function () {
    $scope.isHome = ($location.url() == "/") ? (true) : (false);  
  });
  $scope.$on('$routeChangeSuccess', function() {
    $scope.isLibraryPage = ($location.url() == "/menu") ? (true) : (false);  
  });
}])
.controller("MenuCtrl", [ "$rootScope","$scope", "$http", "$q", "Auth", "$timeout", "$cookies", function ($rootScope, $scope, $http, $q, Auth, $timeout, $cookies) {

  // msg dismissed
  $scope.isDismissed = false;
  
  $scope.$watch(function() { return $cookies.test;}, function(newValue) {
    console.log('Cookie string: ' + $cookies.test)
    $scope.isDismissed = $cookies.test;
  });

  $scope.showMsg = function () {
    $timeout(function () {$cookies.test = ''}, 500);
  }

  $scope.dismiss = function () {
    $timeout(function () {$cookies.test = 'third value';}, 250);
  }

  // getting the books
  $scope.isBooksReady = false;
  
  // getting data from test local db.
  $q.all([$http({method: "GET",url: "/data"})
  ]).then(function(response) {$scope.dishes = response[0].data; $timeout(function () {$scope.isBooksReady = true},500)});
  
  // book filter
  // TODO: to be used later.
  $scope.author = { name: "" };
  $scope.bookFilter = function (b) {
    return b.author.toLowerCase().indexOf($scope.author.name.toLowerCase()) !== -1;
  };
  
 }])

// Directives
// -------------
.directive('icon', [ function () {
  return {
    scope:{glyph: "@icon", place: "@place"}, 
    restrict: "A",
    transclude: true,
    template : "<span class='glyphicon-{{glyph}} {{place}}' ng-transclude></span>",
    link:function(scope, element, attrs) {}
  };
}])

.directive('tip', function() { return function(scope, element, attrs) {
  $(element).tooltip({placement: attrs.placement,title:function(){return $(element).attr('tip')}});
}})

.directive('fullheight', [ "$timeout", function($timeout) {
  return function(scope, element, attrs) {
    $timeout(function() {
      var windowH = $(window).height();
      var wrapperH = $(element).height();
      if(windowH > wrapperH) {                            
      $(element).css({'height':($(window).height()- attrs.h || 300)+'px'});
      }
    },1000);
    $(window).resize(function(){
      var windowH = $(window).height();
      var wrapperH = $(element).height();
      var differenceH = windowH - wrapperH;
      var newH = wrapperH + differenceH;
      var truecontentH = $(element).find('js-scroll-inner').height();
      if(windowH > truecontentH) {
        $(element).css('height', (newH -  attrs.h || 300)+'px');
      }
    }) 
  }
}])

.directive('scroller', function() { return function(scope, element, attrs) {
  $(element).perfectScrollbar({wheelSpeed : 20});
}})

// filters
// ------------
.filter('paginate', function() {
  return function(d, start, pageSize, skipFilter) {
    if (!d || skipFilter) return d;
    start = +start;
    start--;
    pageSize = +pageSize;
    return  d.slice(start*pageSize, (start*pageSize)+pageSize);
  };
})