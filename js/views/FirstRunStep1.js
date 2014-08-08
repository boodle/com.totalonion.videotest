(function($) {
	$(document).ready(function() {																  // inside a document ready so that the template elemenst will be available

		/**
		 * Display the home screen
		 */
		window.FirstRunStep1 = Backbone.View.extend({

			template: _.template($('#settings-checklist').html()),

			/**
			 * Set visibility for the View methods
			 * @return void
			 */
			initialize: function() {
				_.bindAll(this,	
					'render',
					'render_item',
					'on_addNewRow',
					'on_save',
					'on_labelUpdated'
				);

				this.collection.on('add', this.render_item);
				this.collection.on('orderChanged',this.render);
				this.collection.on('change:type',window.itemCollection.save);

				if(!localStorage.getItem('setup1Step')) {
					localStorage.setItem('setup1Step',1);
				}
			},

			events: {
				'click #addNewRow': 		'on_addNewRow',
				'click .btn-save': 			'on_save',
				'keyup input': 				'on_labelUpdated'
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

				//this.$('#main').prepend($('#instruction-container').html());

				switch(localStorage.getItem('setup1Step')) {												// which instruction should we be displaying
					case "1":
						this.$('#instruction-text').html($('#instruction1').html());
						break;

					case "2":
						this.$('#instruction-text').html($('#instruction2').html());
						break;

					case "3":
						this.$('.btn-save').removeAttr('disabled');
						this.$('#instruction-text').html($('#instruction3').html());
						break;
				}

				window.itemCollection.save();
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

				if(localStorage.getItem('setup1Step') == 1) {
					localStorage.setItem('setup1Step',2);
					this.$('#instruction-text').html($('#instruction1-2').html());
				}
				
				var newDisplayOrder;
				if(this.collection.length>0) {
					newDisplayOrder = this.collection.at(this.collection.length-1).get('displayOrder');
				} else {
					newDisplayOrder = 0;
				}
				
				this.collection.add({
					displayOrder: newDisplayOrder+1
				});

				window.itemCollection.save();
			},

			on_save: function(event) {
				window.itemCollection.save();														// save the collection (we work directly on the master one here, no need to copy)
				localStorage.setItem('setupStep',2);												// we're on to step 2 of the setup now
				window.backboneApp.navigate('firstRunStep2',{trigger: true});						// navigate to the next step of setup
			},

			on_labelUpdated: function(event) {
				if(localStorage.getItem('setup1Step') == 2) {
					this.$('.btn-save').removeAttr('disabled');
					localStorage.setItem('setup1Step',3);
					this.$('#instruction-text').html($('#instruction1-3').html());
				}
				window.itemCollection.save();
			}
		});
	});
})(jQuery);