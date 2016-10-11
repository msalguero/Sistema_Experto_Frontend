(function () {

'use strict';


  angular.module('InvestigationApp', ['ngAnimate', 'ui.router'])

  .config([
    '$stateProvider', 
    function($stateProvider) {
      var loginState = {
        name: 'login',
        url: '/login',
        templateUrl: "./login/login.html",
        controller: 'Login'
      };

      var mainState = {
        name: 'main',
        url: '/',
        templateUrl: "./layout/layout.html"
      }

      var investigationState = { 
        name: 'main.investigations', 
        url: 'investigations', 
        templateUrl: "./investigation/investigation.html"
      };

      var registerState = { 
        name: 'register', 
        url: '/register', 
        templateUrl: "./register/register.html",
        controller: 'Register'
      }

      $stateProvider.state(registerState);
      $stateProvider.state(loginState);
      $stateProvider.state(mainState);
      $stateProvider.state(investigationState);
    }
  ]);

}());