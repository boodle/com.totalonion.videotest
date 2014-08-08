(function($) {
	$(document).ready(function() {																  // inside a document ready so that the template elemenst will be available

		/**
		 * Display the home screen
		 */
		window.FirstRunStep2 = Backbone.View.extend({

			template: _.template($('#settings-email').html()),

			/**
			 * Set visibility for the View methods
			 * @return void
			 */
			initialize: function() {
				_.bindAll(this,	
					'render',
					'on_save'
				);

				if(!localStorage.getItem('setup2Step')) {
					localStorage.setItem('setup2Step',1);
				}
			},

			events: {
				'click .btn-save': 			'on_save',
				'keyup input': 				'on_infoChanged',
				'keyup textarea': 			'on_infoChanged'
			},

			/**
			 * Render the screen
			 * @return View
			 */
			render: function() {
				var view = this;
				this.$el.html(this.template(this.model.attributes));

				switch(localStorage.getItem('setup2Step')) {												// which instruction should we be displaying
					case "1":
						this.$('#instruction-text').html($('#instruction2-1').html());
						break;
				}

				if(this.validate_info()) {
					this.$('.btn-save').removeAttr('disabled');
				}

				return this;
			},

			validate_info: function() {
				if(!this.model.get('email')) return false;
				var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    			if(!re.test(this.model.get('email'))) return false;

    			if(!this.model.get('name')) return false;
    			if(!this.model.get('subject')) return false;

    			return true;
			},

			on_infoChanged: function(event){
				this.model.set({
					name: 		this.$('.message-to').val(),
					email: 		this.$('.message-email').val(),
					subject: 	this.$('.message-subject').val(),
					message: 	this.$('.message-message').val()
				});

				this.model.save();

				if(this.validate_info()) {
					this.$('.btn-save').removeAttr('disabled');
				}
			},

			on_save: function(event) {
				this.model.set({
					name: 		this.$('.message-to').val(),
					email: 		this.$('.message-email').val(),
					subject: 	this.$('.message-subject').val(),
					message: 	this.$('.message-message').val()
				});
				
				this.model.save();																	// save the email, subject, message etc
				localStorage.setItem('setupComplete',true);											// flag the setup as complete
				window.backboneApp.navigate('',{trigger: true});									// navigate back to the main screen
			}
		});
	});
})(jQuery);