(function($) {

	window.ItemCollection = Backbone.Collection.extend({

		model: window.ItemModel,
		currentDisplayOrder: 0,
		comparator: 'displayOrder',

		url: 'http://arqam.totalonion.com/',

		initialize: function() {
			this.on('remove',this.on_remove);
			this.on('orderChanged',this.sort);
			this.on('change:data',this.save);
			this.on('change:done',this.save);
		},

		load: function() {
			var itemCount = window.localStorage.getItem('itemCount');
			if(itemCount != null) {
				for(var i=0; i<itemCount; i++) {
					var item = JSON.parse(window.localStorage.getItem('item_'+i));
					this.add(item);
				}
			}
		},

		save: function() {
			this.delete();

			var itemCount = this.length;
			window.localStorage.setItem('itemCount',itemCount);

			for(var i=0; i<itemCount; i++) {
				window.localStorage.setItem('item_'+i,JSON.stringify(this.at(i)));
			}
		},

		/**
		 * Delete all the old itemModels from localStorage
		 */
		delete: function() {
			var itemCount = window.localStorage.getItem('itemCount');
			if(itemCount == null || itemCount == 0) return;

			for(var i=0; i<itemCount; i++) {
				window.localStorage.removeItem('item_'+i);
			}
		},

		on_remove: function(item) {
			var removedDisplayOrder = item.get('displayOrder');
			for(var i=0; i<this.length; i++) {
				var currentDisplayOrder = this.at(i).get('displayOrder')
				if(currentDisplayOrder>removedDisplayOrder) {
					this.at(i).set('displayOrder',currentDisplayOrder-1);
				}
			}
		}
	})
})(jQuery);