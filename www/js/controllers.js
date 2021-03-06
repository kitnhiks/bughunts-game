angular.module('starter.controllers', [])

.controller('GameCtrl', function($scope, $http, Settings) {

	var tabletSize = 4;

	$scope.tablet = [];
	$scope.tommettes = ['left', 'forward', 'right', 'back', 'remove'];
	$scope.tommettesCmd = {'left': 'LE', 'forward': 'FO', 'right': 'RI', 'back': 'BA'};
	$scope.gameImage = 'https://placeholdit.imgix.net/~text?txtsize=23&txt=Chargement...&w=300&h=300';
	$scope.getTommetteUrl = function getTommetteUrl(tommette) {
		return 'img/icons/' + tommette + '.png';
	}

	$scope.clear = function clear() {
		$scope.tablet = [];
	};

	$scope.run = function run() {
		var commands = []
		for(var i = 0; i < $scope.tablet.length; ++i) {
			commands.push($scope.tommettesCmd[$scope.tablet[i].icon]);
		}
		var command = commands.join(' ');
		var url = Settings.host + '/command/' + command + '?callback=JSON_CALLBACK';
		console.log(url);
		$http.jsonp(url)
			.success(function(data) {
				$scope.gameImage = data.image;
                $scope.result = data;
			});
	}

    $scope.shareScore = function(){
        FB.ui({
            method: 'share_open_graph',
            action_type: 'games.celebrate',
            action_properties: JSON.stringify({
                victory:Settings.host + '/victory/'+$scope.result.challenge+'/'+$scope.result.command
            })
        }, function(response){});
    }

	$scope.handleTommette = function handleTommette(icon) {
		if('remove' === icon) {
			$scope.tablet.pop();
		}
		else {
			var id = 0, length = $scope.tablet.length;
			if(length > 0) {
				var prevTommette = $scope.tablet[length-1];
				id = prevTommette.gridster.row * tabletSize + prevTommette.gridster.col + 1;
			}
			if(id < tabletSize * tabletSize) {
				$scope.tablet.push({
					gridster: {
						sizeX: 1,
						sizeY: 1,
						row: Math.floor(id / tabletSize),
						col: id % tabletSize
					}, 
					icon: icon
				});
			}
		}
	};

	$scope.handleTommette('forward');
	$scope.run();

	function orderTommettes() {
		console.log('order');
		$scope.tablet.sort(function(a, b) {
			if(a.gridster.row != b.gridster.row)
				return a.gridster.row - b.gridster.row;
			return a.gridster.col - b.gridster.col;
		});
	}

	$scope.gridsterOpts = {
	    columns: tabletSize,
	    minColumns: tabletSize,
	    minRows: tabletSize,
	    maxRows: tabletSize,
	    pushing: true,
	    floating: false,
	    swapping: true,
	    margins: [5, 5],
	    outerMargin: true,
	    mobileModeEnabled: false,
	    resizable: {
	       enabled: false,
	    },
	    draggable: {
	       enabled: true,
	       stop: function(event, $element, widget) { orderTommettes(); }
	    }
	};
})

.controller('SettingsCtrl', function($scope, Settings) {
  $scope.settings = Settings;
});
