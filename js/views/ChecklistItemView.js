(function($) {
	$(document).ready(function() {																  // inside a document ready so that the template elemenst will be available

		/**
		 * Display the home screen
		 */
		window.ChecklistItemView = Backbone.View.extend({

			template: _.template($('#checklistItemView').html()),
			tagName: 'tr',

			initialize: function() {
				_.bindAll(this,	
					'render',
					'on_tick',
					'on_untick',
					'on_cameraSuccess',
					'on_cameraError'
				);

				this.model.on('change:done',this.render);
			},

			events: {
				'click .btn-tick':		'on_tick',
				'click .btn-untick': 	'on_untick'
			},

			on_tick: function() {
				switch(this.model.get('type')) {
					case 'button':
						this.model.set({done:true});
						break;

					case 'photo':
						navigator.camera.getPicture(
							this.on_cameraSuccess, 
							this.on_cameraError, { 
								quality: 50,
    							destinationType: Camera.DestinationType.DATA_URL
							}
						);
						break;
				}
			},

			on_untick: function() {
				this.model.set({done:false});
			},

			on_cameraSuccess: function(imageData) {
				this.model.set({
					done: true,
					data: imageData
				});
			},

			on_cameraError: function(message) {
				alert('Failed because: ' + message);
			},

			/**
			 * Render the screen
			 * @return View
			 */
			render: function() {
				this.$el.html(this.template(this.model.attributes));
				return this;
			}
		});
	});
})(jQuery);