var createPostTextArea = function() {
    $('#create-post').find('textarea').bind('keydown', function() {
	var max = 750;
	var counter = $('#create-post').find('div.post-char-count');
	var count = max - $(this).val().length;
	counter.html(count);
	
	if (count < 0) {
	    counter.addClass('danger');
	    counter.removeClass('warning');
	}
	else if (count < 50) {
	    counter.removeClass('danger');
	    counter.addClass('warning');
	} 
	else {
	    counter.removeClass('danger');
	    counter.removeClass('warning');
	}
    });
    
    $('#create-post').find('textarea').bind('blur', function() {
	if (jQuery.trim($(this).val()).length === 0) {
	    $('#create-post').removeClass('expanded');
	}
    });

    $('#create-post').find('input').bind('focus', function() {
	$('#create-post').addClass('expanded');
	$('#create-post').find('textarea').trigger('focus');
    });

};

var batucada = {
    splash: {
	onload: function() {
	}
    },
    dashboard: {
	onload: function() {
	    createPostTextArea();
	    $('#post-update').bind('click', function() {
		$('#post-status-update').submit();
	    });
	    $('a.activity-delete').bind('click', function(e) {
		$(e.target).parent().submit();
		return false;
	    });
	}
    },
    project_landing: {
	onload: function() {
	    createPostTextArea();
	    $('#post-project-update').bind('click', function() {
		$('#post-project-status-update').submit();
	    });
	}
    },
    user_profile: {
	onload: function() {
		createPostTextArea();
	    $('#post-user-update').bind('click', function() {
		$('#post-user-status-update').submit();
	    });
	}
    },
    inbox: {
	onload: function() {
	    $('a#inbox_more').bind('click', function(e) {
		e.preventDefault();
		var template = $('#message-template');
		var page = template.attr('page');
		var npages = template.attr('npages');
		$.getJSON('/en-US/messages/inbox/' + page + '/', function(data) {
		    $(data).each(function(i, value) {
			var msg = template.tmpl(value);
			msg.hide();
			$('#posts').append(msg);
			$('li.post-container:last').fadeIn();
		    });
		});
		next_page = parseInt(page) + 1;
		template.attr('page', next_page);
		if (next_page > parseInt(npages)) {
		    $('a#inbox_more').hide();
		}
	    });
	}
    }
};

$(document).ready(function() {
    // dispatch per-page onload handlers 
    var ns = window.batucada;
    var body_id = document.body.id;
    if (ns && ns[body_id] && (typeof ns[body_id].onload == 'function')) {
	ns[body_id].onload();
    }

    // attach handlers for elements that appear on most pages
    $('#user-nav').find('li.menu').bind('click', function(event) {
	$(this).toggleClass('open');
    });

    // find submit buttons and bind them to an event that submits their form
    $('.submit-button').bind('click', function(e) {
	$(e.target).parent('form[method="post"]').first().submit();
    });
});












