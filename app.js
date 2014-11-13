angular.module('app',['ngMaterial','firebase'])

.run(function($log) {
    
    $log.debug('Running!')
    
    
})

.controller('test',function($scope,$firebase,$firebaseSimpleLogin,$log) {


    var fb = new Firebase('https://bandwidth-monitor.firebaseio.com');

    $scope.auth = null;

    $scope.loginObj = $firebaseSimpleLogin(fb);

    $scope.loginObj.$getCurrentUser().then(function(user) {
        if(user===null) {
            $scope.auth=false;
        }
    });
    
    $scope.$on('$firebaseSimpleLogin:login',function(e,user) {
        if(user) {

            $scope.auth = true;

            $scope.byHour    = $firebase(fb.child('aggregates/router:hodey:com/hour')).$asArray();
            $scope.today     = $firebase(fb.child('aggregates/router:hodey:com/day/'+moment.utc().startOf('day').valueOf())).$asObject();
            $scope.thisWeek  = $firebase(fb.child('aggregates/router:hodey:com/week/'+moment.utc().startOf('week').valueOf())).$asObject();
            $scope.thisMonth = $firebase(fb.child('aggregates/router:hodey:com/month/'+moment.utc().startOf('month').valueOf())).$asObject();
            $scope.thisYear  = $firebase(fb.child('aggregates/router:hodey:com/year/'+moment.utc().startOf('year').valueOf())).$asObject();

        } else {
            $scope.auth = false;
        }
    });

    $scope.$on('$firebaseSimpleLogin:logout',function(e,user) {
        $scope.auth = false;
    });
    
})