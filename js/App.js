/**
 * OCD prevention app for the beautiful missus.
 *
 * @author Ben Broadhurst
 * @copyright Total Onion Ltd
 */
var app = {

	initialize: function() {
		
		if(typeof navigator.connection != 'undefined') var mode = 'app';
		else var mode = 'web';

		trace('starting app. Mode: '+mode);

		switch(mode) {
			case 'app':
				document.addEventListener('deviceready', app.onDeviceReady, false);
				break;

			case 'web':
				$(document).ready(function() {
					app.onDeviceReady();
				});
		}
	},
	
	onDeviceReady: function() {
		trace('app.onDeviceReady()');
		var BackboneApp = Backbone.Router.extend({
			path: [],
			appHeight: 0,
			isSending: false,

			routes: {
				'': 				'home',
				'home':				'home',
				'settings': 		'settings',
				'sending': 			'sending',
				'firstRunStep1':	'firstRunStep1',
				'firstRunStep2':	'firstRunStep2'
			},

			initialize: function() {
				trace('Router --> initialize');
				window.itemCollection = new ItemCollection();
				window.itemCollection.load();

				window.settingsModel = new SettingsModel();
				window.settingsModel.load();
			},
			
			firstRunStep1: function() {
				trace('Router --> firstRunStep1');

				window.firstRunStep1 = new FirstRunStep1({
					model: window.settingsModel,
					collection: window.itemCollection
				});
				$('body').html(window.firstRunStep1.render().el);
			},

			firstRunStep2: function() {
				trace('Router --> firstRunStep2');

				window.firstRunStep2 = new FirstRunStep2({
					model: window.settingsModel
				});
				$('body').html(window.firstRunStep2.render().el);
			},
			
			home: function() {
				if(this.checkSetupIsComplete()) {
					trace('Router --> home');
					window.homeView = new HomeView({
						model: window.settingsModel,
						collection: window.itemCollection
					});
					$('body').html(window.homeView.render().el);
				}
			},

			settings: function() {
				trace('Router --> settings');
				window.settingsItemCollection = new ItemCollection();
				this.copyItemCollection(window.itemCollection,window.settingsItemCollection);

				window.settingsView = new SettingsView({
					model: window.settingsModel,
					collection: window.settingsItemCollection
				});
				$('body').html(window.settingsView.render().el);
			},

			sending: function() {
				trace('Router --> sending');
				window.sendingView = new SendingView();
				$('body').append(window.sendingView.render().el);
			},

			/**
			 * Check we have gone through the first
			 * run process to setup the initial
			 * checklist and email settings. If they
			 * haven't then redirect to the setup.
			 * 
			 * @return boolean
			 */
			checkSetupIsComplete: function() {
				if(localStorage.getItem('setupComplete')) return true;											// have we finished setup?

				if(!localStorage.getItem('setupStep')) {
					localStorage.setItem('setupStep',1);
				}

				switch(localStorage.getItem('setupStep')) {
					case "1":
						window.backboneApp.navigate('firstRunStep1',{trigger: true});							// navigate to the first setup step
						return false;
						break;

					case "2":
						window.backboneApp.navigate('firstRunStep2',{trigger: true});							// go to the second setup screen
						return false;
						break;
				}
				
				// TODO - report an error if we get here
				return false;
			},

			/**
			 * Utility function to shallow clone a
			 * collection of settings. Used so we can
			 * have a "save / cancel" option in the
			 * settings page.
			 * 
			 * @param  collection from
			 * @param  collection to
			 * @return void
			 */
			copyItemCollection: function(from,to) {
				to.reset();
				for(var i=0; i<from.length; i++) {
					var item = from.at(i);
					to.add({
						displayOrder: item.get('displayOrder'),
						label: item.get('label'),
						type: item.get('type'),
						done: item.get('done'),
						data: item.get('data')
					});
				}
			}
		});

		window.backboneApp = new BackboneApp();
		Backbone.history.start();
	}
};

/**
 * Fuck-up prevention; checks to see if the console exists before posting to it,
 * so that console.log messages that are accidentally left in do not break a
 * page when run live. Called "trace" as I have been doing a lot of AS3 today
 * and I keep typing it anyway
 * @param message
 * @return void
 */
function trace(message,highlight) {
	if(typeof(console) != 'undefined' && typeof(console.log) == 'function') {
		if(window.app.mode=='app') {
			console.log('##' + message);
		} else {
			console.log(message);
		}
	}
}