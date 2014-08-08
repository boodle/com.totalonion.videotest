(function($) {

	/**
	 * Data container for a guide answer
	 * @return void
	 */
	window.SettingsModel = Backbone.Model.extend({
		
		url:'#',

		defaults: {
			name: 		'',
			email: 		'',
			subject: 	'',
			message: 	'',
			mode: 		'email'
		},

		save: function() {
			trace('SettingsModel::save()');
			window.localStorage.setItem('messageModel',JSON.stringify(this.attributes));
		},

		load: function() {
			trace('SettingsModel::load()');
			this.set(JSON.parse(window.localStorage.getItem('messageModel')));
		},

		send: function() {
			trace('SettingsModel::send()');

			var dataTempObject = this.attributes;
			dataTempObject.collection = window.itemCollection.models;
			
			$.ajax({
				xhr: function() {
					var xhr = new window.XMLHttpRequest();
					xhr.upload.addEventListener("progress", function(evt) {
						if(evt.lengthComputable) {
							var percentComplete = Math.round((evt.loaded / evt.total)*100);
							window.backboneApp.trigger('uploadProgress',percentComplete);
						}
					}, false);

					return xhr;
				},
				type: "POST",
				url: config.apiEndpoint,
				data: JSON.stringify(dataTempObject),
				dataType: 'json',
				success: function(data, textStatus, jqXHR) {
					alert('Sent successfully.');
					window.backboneApp.trigger('uploadComplete');
				},
				error: function(jqXHR, textStatus, errorThrown) {
					alert('Sending failed: '+errorThrown);
					window.backboneApp.trigger('uploadFailed');
				}
			});
		}
	});

})(jQuery);