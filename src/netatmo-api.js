function json2Urlparam(obj){
	return Object.keys(obj).map(function(key){ 
		return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]); 
	}).join('&');
}
var Netatmo = {
	authData : {
		grant_type: 'password',
		client_id: 'xxxxx',
		client_secret:  'xxxxx',
		username: 'xxxxx,
		password: 'xxxxx',
		scope: 'read_thermostat write_thermostat'
	},
	
	authenticate: function(success, error){
		var req = new XMLHttpRequest();
		var post = json2Urlparam(this.authData);
		
		req.open('POST', 'https://api.netatmo.net/oauth2/token');
		
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.onload = function(e) {
			if (req.readyState == 4) {
				console.log(req.responseText);
				var response = JSON.parse(req.responseText);
				if(req.status == 200) {
					if(success){
		      	success(response);
					}
				} else { 
					if(error){
						error(response); 
					}
				}
			}
		};
		req.send(post);
	},
	getThermostatsData: function(access_token,success,error){
		var req = new XMLHttpRequest();
		req.open('GET', 'https://api.netatmo.com/api/getthermostatsdata?access_token='+access_token);
		req.onload = function(e) {
						if (req.readyState == 4) {
				console.log(req.responseText);
				var response = JSON.parse(req.responseText);
				if(req.status == 200) {
					if(success){
		      	success(response);
					}
				} else { 
					if(error){
						error(response); 
					}
				}
			}
		};
		req.send(null);
	},
	setThermPoint: function(data, success, error){		
		var req = new XMLHttpRequest();
		var post = json2Urlparam(data);
		
		req.open('POST', 'https://api.netatmo.com/api/setthermpoint');
		
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.onload = function(e) {
			if (req.readyState == 4) {
				console.log(req.responseText);
				var response = JSON.parse(req.responseText);
				if(req.status == 200) {
					if(success){
		      	success(response);
					}
				} else { 
					if(error){
						error(response); 
					}
				}
			}
		};
		req.send(post);
	}
	
};

this.exports = Netatmo; 
