(function($) {

	/**
	 * Data container for a guide answer
	 * @return void
	 */
	window.ItemModel = Backbone.Model.extend({
		
		url: '#',

		defaults: {
			displayOrder: 	0,
			label: 			'',
			type: 			'button',
			done: 			false,
			data: 			''
		}
	});

})(jQuery);