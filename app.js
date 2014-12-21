angular.module('app',['ngMaterial','firebase'])

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

            $scope.byHour = $firebase(fb.child('aggregates/router:hodey:com/hour')).$asArray();
            
            $scope.lastTenRaw = $firebase(fb.child('snmpData').orderByChild('host').startAt('router.hodey.com').endAt('router.hodey.com').limitToLast(60)).$asArray();
            
            $scope.lastTen = [];

            $scope.lastTenRaw.$watch(function(data) {

                var lastTenMinutes = _.reduce($scope.lastTenRaw,function(memo,item) {
                    
                    var time = moment(item.time).startOf('minute').valueOf();
                    
                    if(!memo[time]) {
                        memo[time] = {
                            time: time,
                            inOctet: 0,
                            outOctet: 0
                        }
                    }
                    
                    memo[time].inOctet += item.inOctetsDelta;
                    memo[time].outOctet += item.outOctetsDelta;
                    
                    return memo;
                    
                },{});
                
                angular.copy(_.toArray(lastTenMinutes),$scope.lastTen);

            });


            $scope.periods = [
                [
                    "Today",
                    $firebase(fb.child('aggregates/router:hodey:com/day/'+moment.utc().startOf('day').valueOf())).$asObject(),
                    $firebase(fb.child('aggregates/router:hodey:com/day/'+moment.utc().subtract(1,'day').startOf('day').valueOf())).$asObject(),
                ],

                [
                    "Week",
                    $firebase(fb.child('aggregates/router:hodey:com/week/'+moment.utc().startOf('week').valueOf())).$asObject(),
                    $firebase(fb.child('aggregates/router:hodey:com/week/'+moment.utc().subtract(1,'week').startOf('week').valueOf())).$asObject()
                ],

                [
                    "Month",
                    $firebase(fb.child('aggregates/router:hodey:com/month/'+moment.utc().startOf('month').valueOf())).$asObject(),
                    $firebase(fb.child('aggregates/router:hodey:com/month/'+moment.utc().subtract(1,'month').startOf('month').valueOf())).$asObject()
                ],

                ["Year",$firebase(fb.child('aggregates/router:hodey:com/year/'+moment.utc().startOf('year').valueOf())).$asObject()]

            ];

        } else {
            $scope.auth = false;
        }
    });

    $scope.$on('$firebaseSimpleLogin:logout',function(e,user) {
        $scope.auth = false;
    });
    
})