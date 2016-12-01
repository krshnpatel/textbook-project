$(document).ready(function(){

	$('#registerBtn').click( function() {
		window.location.href = "register.php";
	});




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
				if(msg == "TRUE")
				{
				//--------------------------------GO TO MAIN PAGE-------------------------
				localStorage.setItem('_currentUserEmail', userEmail);
				window.location.href = "main.html";
				}
				else
				{
					$('#invalidUser').text("Invalid email or password");
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

		if(isEmailValid(userEmail) &&isPasswordValid(userPassword) && isNameValid(userFirstName) && isNameValid(userLastName) && isPhoneNumValid(userPhoneNum)){

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
				complete: function(msg)
				{
					if (msg.responseText == "TRUE")
					{
						localStorage.setItem('_currentUserEmail', userEmail);
						window.location.href = "main.html";
					}
					else
					{
						$('#errorTag').text("Email already exists");
					}
				}
			}); // Ajax Call
		}
	}); //event handler loginBtn click







	function isPhoneNumValid(phoneNum){
		for(var i = 0; i < phoneNum.length; i++)
		{
			if(phoneNum.charCodeAt(i) < 48 || phoneNum.charCodeAt(i) > 57){
				$('#errorTag').text("invalid phone number");
				return false;
			}
		}
		if(phoneNum.length != 10){
			$('#errorTag').text("Phone number must be 10 numbers long");
			return false;
		}

		$('#errorTag').text("");
		return true;
	}






	function formatPhoneNum(phoneNum){
		var phoneNum = phoneNum.slice(0,3) + "-" + phoneNum.slice(3,6) + "-" +phoneNum.slice(6);
		return phoneNum;
	}






	function isEmailValid(userEmail){
		var period = false;
		var atSign = false;

		for(var i = 0; i < userEmail.length; i++){
			if(userEmail.charCodeAt(i) == 46){
				period = true;
			}
			if(userEmail.charCodeAt(i) == 64){
				atSign = true;
			}
			if(atSign && period){
				return true;
			}
		}

		$('#errorTag').text("Invalid email");
		return false;
	}


	function convertToSQLString(schoolName)
	{
		var name = schoolName;
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


	function isPasswordValid(password)
	{
		if (password.length < 6)
		{
			$('#errorTag').text("Password must be more than 6 characters");
			return false;
		}
		return true;
	}

	function isNameValid(name)
	{
		if (name.length <= 0)
		{
			$('#errorTag').text("Please enter your first name and last name");
			return false;
		}
		return true;
	}


});
