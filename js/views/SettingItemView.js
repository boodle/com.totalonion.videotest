(function($) {
	$(document).ready(function() {																  // inside a document ready so that the template elemenst will be available

		/**
		 * Display the home screen
		 */
		window.SettingItemView = Backbone.View.extend({

			template: _.template($('#settingItemView').html()),
			tagName: 'li',

			initialize: function() {
				_.bindAll(this,	
					'render',
					'on_remove',
					'on_keyup',
					'on_moveUp',
					'on_moveDown',
					'on_itemTypeChange'
				);
			},

			events: {
				'click .btn-removeItem':	'on_remove',
				'keyup input': 				'on_keyup',
				'click .btn-move-up': 		'on_moveUp',
				'click .btn-move-down': 	'on_moveDown',
				'change .item-type': 		'on_itemTypeChange'
			},

			on_remove: function() {
				this.collection.remove(this.model);
				this.remove();
			},

			on_keyup: function() {
				this.model.set({label:this.$('input').val()})
			},

			on_moveUp: function() {
				var currentDisplayOrder = this.model.get('displayOrder');

				if(currentDisplayOrder>1) {
					this.collection.findWhere({displayOrder:currentDisplayOrder-1}).set('displayOrder',currentDisplayOrder);
					this.model.set('displayOrder',currentDisplayOrder-1);
				}
				this.collection.trigger('orderChanged');
			},

			on_moveDown: function() {
				var currentDisplayOrder = this.model.get('displayOrder');

				if(currentDisplayOrder<this.collection.length) {
					this.collection.findWhere({displayOrder:currentDisplayOrder+1}).set('displayOrder',currentDisplayOrder);
					this.model.set('displayOrder',currentDisplayOrder+1);
				}
				this.collection.trigger('orderChanged');
			},

			on_itemTypeChange: function(e) {
				this.model.set({type:$(e.target).val()});
			},

			/**
			 * Render the screen
			 * @return View
			 */
			render: function() {
				this.$el.html(this.template(this.model.attributes));
				this.$el.addClass('list-group-item');
				
				if(this.model.get('displayOrder')==1) {
					this.$('.btn-move-up').attr("disabled", true);
				} else {
					this.$('.btn-move-up').attr("disabled", false);
				}

				if(this.model.get('displayOrder')==this.collection.length) {
					this.$('.btn-move-down').attr("disabled", true);
				} else {
					this.$('.btn-move-down').attr("disabled", false);
				}

				return this;
			}
		});
	});
})(jQuery);