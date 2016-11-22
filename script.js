$(document).ready(function(){

	console.log("ready");

	$('#loginBtn').click( function() {
		var userEmail = $('#usr').val();
		var userPassword = $('#pwd').val();

		$.ajax({
		    cache: false,
		    type: "POST",
		    url: "login.php",
		    data: {action: 'login', email: userEmail, password: userPassword},
		    success: function(msg)
		    {
		        //$('#calling').html((msg));
		        console.log("SUCCESS: " + msg);
		    }
		}); // Ajax Call
	}); //event handler

});