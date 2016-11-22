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
						//--------------------------------GO TO MAIN PAGE-------------------------
		    }
		}); // Ajax Call
	}); //event handler loginBtn click


	$('#signupBtn').click( function() {
		var userEmail = $('#signupUsr').val();
		var userPassword = $('#signupPwd').val();
		var userFirstName = $('#firstName').val();
		var userLastName = $('#lastName').val();
		var userSchool = $('#school').val();

		$.ajax({
				cache: false,
				type: "POST",
				url: "login.php",
				data: {
							action: 'register',
				 			email: userEmail,
							password: userPassword,
							firstName: userFirstName,
							lastName: userLastName,
							school: userSchool
						},
				success: function(msg)
				{
						//$('#calling').html((msg));
						console.log("REGISTERED: " + msg);
				}
		}); // Ajax Call
	}); //event handler loginBtn click



});
