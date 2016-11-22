$(document).ready(function(){

	console.log("ready");
	var currentUserEmail;






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
				if(msg == "TRUE"){
				//--------------------------------GO TO MAIN PAGE-------------------------
				currentUserEmail = userEmail;
				window.location.href = "main.html";
				getUserProfile(currentUserEmail);
				}
			}
		}); // Ajax Call
	}); //event handler loginBtn click






	$('#signupBtn').click( function() {
		var userEmail = $('#signupUsr').val();
		var userPassword = $('#signupPwd').val();
		var userFirstName = $('#firstName').val();
		var userLastName = $('#lastName').val();
		var userPhoneNum = $('#phoneNumber').val();
		var userSchool = $('#schoolDropdown').val();

		if (userSchool.indexOf("'") != -1)
		{
			userSchool = convertToSQLString(userSchool);
		}


		if(isPhoneNumValid(userPhoneNum) && isEmailValid(userEmail)){

			userPhoneNum = formatPhoneNum(userPhoneNum);

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
					phoneNum: userPhoneNum,
					school: userSchool
				},
				success: function(msg)
				{
					//$('#calling').html((msg));
					console.log("REGISTERED: " + msg);
					currentUserEmail = userEmail;
					window.location.href = "main.html";
					getUserProfile(currentUserEmail);
				}
			}); // Ajax Call
		}
	}); //event handler loginBtn click







	function isPhoneNumValid(phoneNum){
		for(var i = 0; i < phoneNum.length; i++){
			console.log(phoneNum.charCodeAt(i));
			if(phoneNum.charCodeAt(i) < 48 || phoneNum.charCodeAt(i) > 57){
				$('#errorTag').text("invalid phone number");
				return false;
			}
		}
		if(phoneNum.length != 10){
			$('#errorTag').text("Must be 10 numbers long");
			return false;
		}

		$('#errorTag').text("");
		return true;
	}






	function formatPhoneNum(phoneNum){
		var phoneNum = phoneNum.slice(0,3) + "-" + phoneNum.slice(3,6) + "-" +phoneNum.slice(6);
		return phoneNum;
	}






	function isEmailValid(email){
		var period = false;
		var atSign = false;
		for(var i = 0; i < email.length; i++){
			if(email.charCodeAt(i) == 46){
				period = true;
			}
			if(email.charCodeAt(i) == 64){
				atSign = true;
			}
			if(atSign && period){
				return true;
			}
		}
		$('#errorTag').text("invalid email");
		return false;
	}






	function convertToSQLString(schoolName)
	{
		var name = schoolName; // hello''s world's
		for (var i = 0; i < name.length; i++)
		{
			if (name.charCodeAt(i) == 39)
			{
				name = name.slice(0,i) + "'" + name.slice(i);
				i++;
			}
		}
		return name;
	}






	function getUserProfile(){

	  $.ajax({
	    cache: false,
	    type: "GET",
	    url: "login.php",
	    data: {action: 'login', email: currentUserEmail},
	    success: function(msg)
	    {
				$('#email').text(currentUserEmail);
				$('#fName').text(msg.firstName);
				$('#lName').text(msg.lastName);
				$('#phoneNum').text(msg.phoneNum);
				$('#school').text(msg.schoolName);

	    }
	  }); // Ajax Call
	}//end getUserProfile





});
