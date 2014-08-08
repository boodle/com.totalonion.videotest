(function($) {
	$(document).ready(function() {																  // inside a document ready so that the template elemenst will be available

		/**
		 * Display the home screen
		 */
		window.SendingView = Backbone.View.extend({

			template: _.template($('#sendingView').html()),
			tagName: 'div',
			className: '',
			id: 'page_sending',

			/**
			 * Set visibility for the View methods
			 * @return void
			 */
			initialize: function() {
				_.bindAll(this,	
					'render',
					'on_progress',
					'on_complete'
				);

				window.backboneApp.on('uploadProgress',this.on_progress);
				window.backboneApp.on('uploadComplete',this.on_complete);
			},

			/**
			 * Render the screen
			 * @return View
			 */
			render: function() {
				this.$el.html(this.template());
				
				return this;
			},

			on_progress: function(progress) {
				trace('SendingView::on_progress('+progress+')');
				this.$('.progress-bar')
					.width(progress+'%')
					.attr('aria-valuenow',progress)
					.html(progress+'%');
			},

			on_complete: function() {
				trace('SendingView::on_complete()');
				this.undelegateEvents();
				this.$el.removeData().unbind(); 
				this.remove();  
				Backbone.View.prototype.remove.call(this);
				window.backboneApp.navigate('',{trigger: true});
			}
		});
	});
})(jQuery);