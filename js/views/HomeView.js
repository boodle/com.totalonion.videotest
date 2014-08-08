(function($) {
	$(document).ready(function() {																  // inside a document ready so that the template elemenst will be available

		/**
		 * Display the home screen
		 */
		window.HomeView = Backbone.View.extend({

			template: _.template($('#homeView').html()),

			/**
			 * Set visibility for the View methods
			 * @return void
			 */
			initialize: function() {
				_.bindAll(this,	
					'render',
					'on_collectionChange',
					'on_save',
					'on_complete'
				);

				this.collection.on('change:done',this.on_collectionChange);
				window.backboneApp.on('uploadComplete',this.on_complete);
			},

			events: {
				'click .btn-save': 			'on_save'
			},

			/**
			 * Render the screen
			 * @return View
			 */
			render: function() {
				var view = this;
				this.$el.html(this.template());
				this.collection.each(function(item){
					view.render_item(item);
				});

				this.on_collectionChange();

				if(!localStorage.getItem('completedFirstRun')) {
					localStorage.setItem('completedFirstRun',true);
					this.$('#main').prepend($('#instruction3-1').html());
				}

				return this;
			},

			render_item: function(itemModel) {
				var checklistItemView = new window.ChecklistItemView({
					model: itemModel,
					collection: this.collection
				});

				this.$('#itemList').append(checklistItemView.render().el);
			},

			on_collectionChange: function() {
				trace('HomeView::on_collectionChange');
				if(this.collection.where({done:false}).length == 0) {
					this.$('.btn-save').removeAttr('disabled');
				} else {
					this.$('.btn-save').attr('disabled','disabled');
				}
			},

			on_save: function() {
				trace('HomeView::on_save');
				window.backboneApp.navigate('sending',{trigger: true});
				this.model.send();
			},

			on_complete: function() {
				trace('HomeView::on_complete()');
				this.collection.each(function(item){
					item.set({
						data: '',
						done: false
					});
				});
			}
		});
	});
})(jQuery);