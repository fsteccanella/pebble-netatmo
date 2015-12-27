/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */
var UI= require('ui');
var Vector2 = require('vector2');
var Netatmo = require('netatmo-api');

var access_token = null;
var device_id = null;
var module_id = null;

var setpoint_mode = null;

var window = new UI.Window({
    fullscreen: true,
	  backgroundColor: 'black'
 });

var bgRect = new UI.Rect({
  position: new Vector2(10, 20),
  size: new Vector2(124, 128),
  backgroundColor: 'white'
});
window.add(bgRect);

var tempPanel = new UI.Rect({
  position: new Vector2(45, 40),
  size: new Vector2(54, 88),
  backgroundColor: '#d2d2d2'
});

window.add(tempPanel);

var targetTemp = new UI.Text({
    position: new Vector2(45, 50),
    size: new Vector2(54, 34),
    font: 'gothic-28-bold',
    text: '--',
	  color: 'black',
    textAlign: 'center'
  });
window.add(targetTemp);

var currentTemp = new UI.Text({
    position: new Vector2(45, 85),
    size: new Vector2(54, 34),
    font: 'gothic-24',
    text: '--',
	  color: 'black',
    textAlign: 'center'
  });
window.add(currentTemp);

var awayIndicator = new UI.Circle({
		position: new Vector2(27, 84),
  	radius: 5,
  	backgroundColor: '#d2d2d2' 
	});
window.add(awayIndicator);

window.show();


function getThermostatsDataSuccess(data){
	var thermostatData = data.body.devices[0].modules[0];

	device_id = data.body.devices[0]._id;
	module_id = data.body.devices[0].modules[0]._id;
	
	setpoint_mode = data.body.devices[0].modules[0].setpoint.setpoint_mode;
	
	if(setpoint_mode==='away'){
		awayIndicator.backgroundColor('#FF8D00');
	}

	targetTemp.text(thermostatData.measured.setpoint_temp);
	currentTemp.text(thermostatData.measured.temperature);
}




Netatmo.authenticate(function(data){
	access_token = data.access_token;
	Netatmo.getThermostatsData(access_token,getThermostatsDataSuccess);
});



window.on('click', 'down', function(e) {
	var endtime = Math.round((new Date().getTime()/1000) + (1*60*60) );
	var currentTargetTemp = parseFloat(targetTemp.text());
	var newTargetTemp=currentTargetTemp - 0.5;
	Netatmo.setThermPoint({
		access_token: access_token, 
		device_id: device_id, 
		module_id: module_id, 
		setpoint_mode: 'manual', 
		setpoint_endtime: endtime, 
		setpoint_temp: newTargetTemp
	},function(){
		targetTemp.text(newTargetTemp);
	});
});

window.on('click', 'up', function(e) {
	var endtime = Math.round((new Date().getTime()/1000) + (1*60*60) );
	var currentTargetTemp = parseFloat(targetTemp.text());
	var newTargetTemp=currentTargetTemp + 0.5;
	Netatmo.setThermPoint({
		access_token: access_token, 
		device_id: device_id, 
		module_id: module_id, 
		setpoint_mode: 'manual', 
		setpoint_endtime: endtime, 
		setpoint_temp: newTargetTemp
	},function(){
		targetTemp.text(newTargetTemp);
	});
});
window.on('click', 'select', function(e) {
	Netatmo.getThermostatsData(access_token,getThermostatsDataSuccess);
});
window.on('longClick', 'select', function(e) {
	if(setpoint_mode==='away'){
		Netatmo.setThermPoint({
				access_token: access_token, 
				device_id: device_id, 
				module_id: module_id, 
				setpoint_mode: 'program'
			},function(){
				awayIndicator.backgroundColor('#d2d2d2');
				setpoint_mode='program';
		});
	}else{
		Netatmo.setThermPoint({
				access_token: access_token, 
				device_id: device_id, 
				module_id: module_id, 
				setpoint_mode: 'away'
			},function(){
				awayIndicator.backgroundColor('#FF8D00');
				setpoint_mode='away';
		});
	}
});





