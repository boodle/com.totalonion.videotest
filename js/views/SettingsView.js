(function($) {
	$(document).ready(function() {																  // inside a document ready so that the template elemenst will be available

		/**
		 * Display the home screen
		 */
		window.SettingsView = Backbone.View.extend({

			template: _.template($('#settingsView').html()),

			/**
			 * Set visibility for the View methods
			 * @return void
			 */
			initialize: function() {
				_.bindAll(this,	
					'render',
					'render_item',
					'on_addNewRow',
					'on_save'
				);

				this.collection.on('add', this.render_item);
				this.collection.on('orderChanged',this.render);
			},

			events: {
				'click #addNewRow': 		'on_addNewRow',
				'click .btn-cancel': 		'on_cancel',
				'click .btn-save': 			'on_save'
			},

			/**
			 * Render the screen
			 * @return View
			 */
			render: function() {
				var view = this;
				this.$el.html(this.template(this.model.attributes));
				this.collection.each(function(item){
					view.render_item(item);
				});
				return this;
			},

			render_item: function(itemModel) {
				var itemView = new window.SettingItemView({
					model: itemModel,
					collection: this.collection
				});

				this.$('#settingsItemList').append(itemView.render().el);
			},

			/**
			 * Add a new row to the collection
			 * @param event
			 */
			on_addNewRow: function(event) {
				event.preventDefault();
				
				var newDisplayOrder;
				if(this.collection.length>0) {
					newDisplayOrder = this.collection.at(this.collection.length-1).get('displayOrder');
				} else {
					newDisplayOrder = 0;
				}
				
				this.collection.add({
					displayOrder: newDisplayOrder+1
				});
			},

			on_save: function(event) {
				this.model.set({
					name: 		this.$('.message-to').val(),
					email: 		this.$('.message-email').val(),
					subject: 	this.$('.message-subject').val(),
					message: 	this.$('.message-message').val()
				});
				
				this.model.save();																	// save the email, subject, message etc

				window.backboneApp.copyItemCollection(												// copy the collection from the temp one here, to the master one
					this.collection,
					window.itemCollection
				);

				window.itemCollection.save();														// and save it
				window.backboneApp.navigate('',{trigger: true});									// navigate back to the main screen
			}
		});
	});
})(jQuery);