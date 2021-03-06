jQuery(document).ready( function() {

	/** Add tree class to groups panel for AJAX loading */
	jQuery('div.groups').addClass('tree');
	jQuery('#groups-dir-list').on('click', '.item-subitem-indicator a', function(event) {

		if( jq(this).html() == '[-]' && jq(this).parents('li').has('div.subitem').length ) {
			jq(this).parent().parent().children('div.subitem').remove();
			jq(this).html('[+]');
			return false;
		}
		
		if(jq(this).html() != '[+]')
			return false;
		
		/** From BuddyPress global.js - modified for subitem loading */
		if ( jQuery(this).hasClass('no-ajax') )
			return;

		/** Find the parent list item of the selected link - this has the scope name in its ID */
		var target = jQuery(event.target).parents('li');
		target = target[0];
		
		if ( jq(target).is('li') ) {
			var css_id = jq(target).attr('id').split( '-' );
			
			/** This is "tree" - we create an AJAX hook for this and use it to build the list we want */
			var object = css_id[0];

			if ( 'activity' == object )
				return false;

			/** This is "childof_{ID}" */
			var scope = css_id[1];
			var filter = jq("#groups-order-select select").val();
			var search_terms = false;
			if ( jq('.dir-search input').length ) {
				search_terms = jq('.dir-search input').val();
			}
			
			target = jq('<div />').appendTo(target);
			target.addClass('subitem');

			bp_filter_request( object, filter, scope, target, search_terms, 1, jq.cookie('bp-' + object + '-extras') );
		}

		jq(this).html('[-]');
		return false;
	});
	
	/** Set groups scope when a tree button is clicked -- keeps "My Groups" tab from being active after a reload */
	jq('div.item-list-tabs').on( 'click', function(event) {
		if ( jq(this).hasClass('no-ajax') )
			return;

		var targetElem = ( event.target.nodeName == 'SPAN' ) ? event.target.parentNode : event.target;
		var target     = jq( targetElem ).parent();
		if ( 'LI' == target[0].nodeName && !target.hasClass( 'last' ) ) {
			var css_id = target.attr('id').split( '-' );
			var object = css_id[0];

			if ( 'tree' != object )
				return;
			
			var scope = css_id[1];
			
			jq.cookie('bp-groups-scope', scope, {
				path: '/'
			});
		}
	});

	/** Set the "selected" tab */
	jQuery(window).load(function() {
		// If the main group list is set to be replaced by the tree, we want to treat the tabs a little differently
		if ( null != jq.cookie('bp_group_hierarchy_hide_group_list') ) {
			if ( null != jq.cookie('bp-groups-scope') && jq.cookie('bp-groups-scope') == 'all' && jq('div.groups').length ) {
					jq('.item-list-tabs #tree-all').addClass('selected');
			}
		}
	});

});