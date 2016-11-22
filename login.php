<?php

	if (isset($_POST['action'])) {
	    switch ($_POST['action']) {
	        case "login":
	            verifyUser($_POST['email'], $_POST['password']);
	            break;
	        case "register":
	        	registerUser($_POST['email'], $_POST['password'], $_POST['firstName'], $_POST['lastName'], $_POST['phoneNum'], $_POST['school']);
	        	break;
	    }
	}

	function connect()
	{
		$servername = "localhost";
		$username = "root";
		$password = "textbookproject";
		$database = "kriativejatabase";

		// Create connection
		$myConnection = new mysqli($servername, $username, $password);

		// Check connection
		if ($myConnection->connect_error)
			die("Connection failed: " . $myConnection->connect_error);

		debug_to_console("Connected successfully<br/>");

		$sql = "USE kriativejatabase;";

		if ($myConnection->query($sql) === TRUE)
			debug_to_console("Using the database!");
		else
			debug_to_console("Error using database: " . $myConnection->error);

		return $myConnection;
	}

	function verifyUser($email, $password)
	{
		$myConnection = connect();

		$sql = "SELECT userEmail, password
				FROM User
				WHERE userEmail = '" . $email . "' AND password = '" . $password . "';";

		$result = $myConnection->query($sql);

		if ($result->num_rows > 0)
			echo "TRUE";
		else
			echo "FALSE";

		$myConnection->close();
	}

	function registerUser($email, $password, $firstName, $lastName, $phoneNum, $schoolName)
	{
		$myConnection = connect();

		$sql = "SELECT userEmail, password
				FROM User
				WHERE userEmail = '" . $email . "';";

		$result = $myConnection->query($sql);

		if ($result->num_rows > 0)
		{
			echo "FALSE";
		}
		else
		{
			$schoolIdQuery = "SELECT schoolID
							  FROM School
							  WHERE schoolName = '" . $schoolName . "';";

			$schoolID = $myConnection->query($schoolIdQuery);
			$schoolID = $schoolID->fetch_assoc();

			$insertUserQuery = "INSERT INTO User(userEmail, firstName, lastName, phoneNum, password, schoolID)
								VALUES('" . $email . "', '" . $firstName . "', '" . $lastName . "', '" . $phoneNum . "', '" . $password . "', " . $schoolID['schoolID'] . ");";

			//$myConnection->query($insertUserQuery);
			
			echo "TRUE: " . $insertUserQuery;
		}

		$myConnection->close();
	}

	function debug_to_console( $data )
	{
	    if ( is_array( $data ) )
	        $output = "<script>console.log( 'Debug Objects: " . implode( ',', $data) . "' );</script>";
	    else
	        $output = "<script>console.log( 'Debug Objects: " . $data . "' );</script>";

	    //echo $output;
	}
	
?>