<?php

	if (isset($_POST['action']))
	{
	    switch ($_POST['action']) {
	        case "login":
	            verifyUser($_POST['email'], $_POST['password']);
	            break;
	        case "register":
	        	registerUser($_POST['email'], $_POST['password'], $_POST['firstName'], $_POST['lastName'], $_POST['phoneNum'], $_POST['school']);
	        	break;
	        case "getUserInfo":
	        	returnUserInfo($_POST['email']);
	        	break;
	        case "userListings":
	        	returnUserListings($_POST['email']);
	        	break;
	        case "recommendedBooks":
	        	recommendedTextbooks($_POST['email']);
	        	break;
	        case "textbooksPeopleNeed":
	        	returnBuyingList();
	        	break;
	        case "textbooksForSale":
	        	returnSellingList();
	        	break;
	        case "matchedTextbooks":
	        	findMatches($_POST['email']);
	        	break;
	        case "checkIsbn":
	        	checkISBN($_POST['isbn']);
	        	break;
	        case "addListing":
	        	addListing($_POST['email'], $_POST['isbn'], $_POST['textbook'], $_POST['author'], $_POST['edition'], $_POST['isSelling'], $_POST['validIsbn'], $_POST['price'], $_POST['description']);
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

		$sql = "USE kriativejatabase;";

		$myConnection->query($sql);

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

			$myConnection->query($insertUserQuery);

			$insertUserSchoolQuery = "INSERT INTO UserSchool(userEmail, schoolName)
									  SELECT u.userEmail, s.schoolName
									  FROM User u, School s
									  WHERE u.schoolID = s.schoolID AND
									  		u.userEmail NOT IN (SELECT userEmail
									  	  						FROM UserSchool);";

			$myConnection->query($insertUserSchoolQuery);
			
			echo "TRUE";
		}

		$myConnection->close();
	}


	function returnUserInfo($email)
	{
		$myConnection = connect();

		$getUserInfoQuery = "SELECT u.firstName, u.lastName, u.phoneNum, s.schoolName
							 FROM User u, School s
							 WHERE u.userEmail = '" . $email . "' AND
							 	   u.schoolID = s.schoolID;";

		$userInfo = $myConnection->query($getUserInfoQuery);
		$userInfo = $userInfo->fetch_assoc();



		$data = array('firstName' => $userInfo['firstName'], 'lastName' => $userInfo['lastName'], 'phoneNum' => $userInfo['phoneNum'], 'schoolName' => $userInfo['schoolName']);
		$data = array($data);
		header('Content-Type: application/json');

		echo json_encode($data);

		$myConnection->close();
	}


	function returnUserListings($email)
	{
		$myConnection = connect();

		$getUserBuyingListQuery = "SELECT t.title, t.edition, t.author, t.isbn, l.description, l.postingTime, l.postingDate
							  	   FROM Listing l, Textbook t
							  	   WHERE l.listingID NOT IN (SELECT listingID
							  	  							 FROM sellinglist) AND
							  	   l.isbn = t.isbn AND
							  	   l.userEmail = '" . $email . "';";

		$getUserSellingListQuery = "SELECT t.title, t.edition, t.author, t.isbn, l.description, sl.price, sl.imagePath, l.postingTime, l.postingDate
									FROM Listing l, Textbook t, SellingList sl
									WHERE l.listingID = sl.listingID AND
										  l.isbn = t.isbn AND
										  l.userEmail = '" . $email . "';";


		$finalBuyingArray = array();
		$finalSellingArray = array();

		$userBuyingList = $myConnection->query($getUserBuyingListQuery);
		$userSellingList = $myConnection->query($getUserSellingListQuery);

		if ($userBuyingList->num_rows > 0)
		{
			while ($row = $userBuyingList->fetch_assoc())
			{
				$data = array('title' => $row['title'], 'edition' => $row['edition'], 'author' => $row['author'], 'isbn' => $row['isbn'], 'description' => $row['description'], 'postingTime' => $row['postingTime'], 'postingDate' => $row['postingDate']);
				array_push($finalBuyingArray, $data);
			}
		}


		if ($userSellingList->num_rows > 0)
		{
			while ($row = $userSellingList->fetch_assoc()) 
			{
				$data = array('title' => $row['title'], 'edition' => $row['edition'], 'author' => $row['author'], 'isbn' => $row['isbn'], 'description' => $row['description'], 'price' => $row['price'], 'imagePath' => $row['imagePath'], 'postingTime' => $row['postingTime'], 'postingDate' => $row['postingDate']);
				array_push($finalSellingArray, $data);
			}
		}

		$finalArray = array();

		array_push($finalArray, $finalSellingArray);
		array_push($finalArray, $finalBuyingArray);
		echo json_encode($finalArray);

		$myConnection->close();
	}


	function recommendedTextbooks($email)
	{
		$myConnection = connect();

		$userSchoolID = "SELECT schoolID
						 FROM User
						 WHERE userEmail = '" . $email . "';";

		$userSchoolID = $myConnection->query($userSchoolID);
		$userSchoolID = $userSchoolID->fetch_assoc()['schoolID'];

		$recommendedTextbooksQuery = "SELECT t.title, t.edition, t.author, t.isbn, sl.price
									  FROM Listing l, SellingList sl, User u, School s, Textbook t
									  WHERE l.listingID = sl.listingID AND
									  		u.userEmail = l.userEmail AND
									  		u.schoolID = s.schoolID AND
									  		t.isbn = l.isbn AND
									  		u.schoolID = " . $userSchoolID . " AND
									  		u.userEmail != '" . $email . "';";

		$recommendedTextbooks = $myConnection->query($recommendedTextbooksQuery);

		$finalArray = array();

		if ($recommendedTextbooks->num_rows > 0)
		{
			while ($row = $recommendedTextbooks->fetch_assoc())
			{
				$data = array('title' => $row['title'], 'edition' => $row['edition'], 'author' => $row['author'], 'isbn' => $row['isbn'], 'price' => $row['price']);
				array_push($finalArray, $data);
			}
		}

		echo json_encode($finalArray);

		$myConnection->close();
	}


	function returnBuyingList()
	{
		$myConnection = connect();

		$buyingListQuery = "SELECT t.title, t.edition, t.author, t.isbn, l.description, l.postingTime, l.postingDate
							FROM Listing l, Textbook t
							WHERE t.isbn = l.isbn AND
								  l.listingID NOT IN (SELECT listingID
								  					  FROM SellingList)
							ORDER BY l.postingDate DESC, l.postingTime DESC;";

		$buyingList = $myConnection->query($buyingListQuery);

		$finalBuyingArray = array();

		if ($buyingList->num_rows > 0)
		{
			while ($row = $buyingList->fetch_assoc())
			{
				$data = array('title' => $row['title'], 'edition' => $row['edition'], 'author' => $row['author'], 'isbn' => $row['isbn'], 'description' => $row['description'], 'postingTime' => $row['postingTime'], 'postingDate' => $row['postingDate']);
				array_push($finalBuyingArray, $data);
			}
		}

		echo json_encode($finalBuyingArray);

		$myConnection->close();
	}


	function returnSellingList()
	{
		$myConnection = connect();

		$sellingListQuery = "SELECT t.title, t.edition, t.author, t.isbn, l.description, sl.price, sl.imagePath, l.postingTime, l.postingDate
							 FROM Listing l, SellingList sl, Textbook t
							 WHERE l.listingID = sl.listingID AND
							 	   t.isbn = l.isbn
							 ORDER BY l.postingDate DESC, l.postingTime DESC;";

		$sellingList = $myConnection->query($sellingListQuery);

		$finalSellingArray = array();

		if ($sellingList->num_rows > 0)
		{
			while ($row = $sellingList->fetch_assoc())
			{
				$data = array('title' => $row['title'], 'edition' => $row['edition'], 'author' => $row['author'], 'isbn' => $row['isbn'], 'description' => $row['description'], 'price' => $row['price'], 'imagePath' => $row['imagePath'], 'postingTime' => $row['postingTime'], 'postingDate' => $row['postingDate']);
				array_push($finalSellingArray, $data);
			}
		}

		echo json_encode($finalSellingArray);

		$myConnection->close();
	}


	function findMatches($email)
	{
		$myConnection = connect();

		$matchQuery = "SELECT *
					   FROM MatchBuyerAndSeller
					   WHERE buyerEmail = '" . $email . "' OR
					   		 sellerEmail = '" . $email . "';";

		$matchList = $myConnection->query($matchQuery);

		$finalMatchingArray = array();

		if ($matchList->num_rows > 0)
		{
			while ($row = $matchList->fetch_assoc())
			{
				$data = array('isbn' => $row['isbn'], 'title' => $row['title'], 'edition' => $row['edition'], 'author' => $row['author'], 'buyerFirstName' => $row['buyerFirstName'], 'buyerLastName' => $row['buyerLastName'], 'buyerEmail' => $row['buyerEmail'], 'buyerPhoneNum' => $row['buyerPhoneNum'], 'sellerFirstName' => $row['sellerFirstName'], 'sellerLastName' => $row['sellerLastName'], 'sellerEmail' => $row['sellerEmail'], 'sellerPhoneNum' => $row['sellerPhoneNum']);
				array_push($finalMatchingArray, $data);
			}
		}

		echo json_encode($finalMatchingArray);

		$myConnection->close();
	}


	function checkISBN($isbn)
	{
		$myConnection = connect();

		$isbnQuery = "SELECT *
					  FROM Textbook
					  WHERE isbn = '" . $isbn . "';";

		$isbnQuery = $myConnection->query($isbnQuery);

		if ($isbnQuery->num_rows == 1)
			echo TRUE;
		else
			echo FALSE;

		$myConnection->close();
	}


	function addListing($userEmail, $isbn, $title, $author, $edition, $isSelling, $isIsbnValid, $price, $description)
	{
		$myConnection = connect();

		if ($isIsbnValid == "false")
		{
			$addTextbookQuery = "INSERT INTO Textbook VALUES('" . $isbn . "', '" . $title . "', " . $edition . ", '" . $author . "');";

			$myConnection->query($addTextbookQuery);
		}

		$addListingQuery = "INSERT INTO Listing(postingDate, postingTime, description, userEmail, isbn)
							SELECT CURDATE(), CURTIME(), '" . $description . "', '" . $userEmail . "', '" . $isbn . "';";

		$myConnection->query($addListingQuery);

		if ($isSelling == "true")
		{
			$findListingIDQuery = "SELECT MAX(listingID) AS listID
							  FROM Listing;";

			$listingID = $myConnection->query($findListingIDQuery);
			
			$row = $listingID->fetch_assoc();
			$listingID = $row['listID'];
			$addSellingListQuery = "INSERT INTO SellingList VALUES(" . $listingID . ", " . $price . ", NULL);";

			$myConnection->query($addSellingListQuery);
		}

		echo "done";

		$myConnection->close();
	}


	/*function changeUserInfo($email, $newPassword, $newPhoneNumber)
	{
		$myConnection = connect();

		if (strlen($newPhoneNumber) == 0 && strlen($newPassword) == 0)
		{
			echo "NO CHANGE";
		}
		
		if (!isPhoneNumValid($newPhoneNumber))
		{
			echo "PHONE";
		}

		$changeUserInfoQuery = "UPDATE User
						   		SET password = '" . $newPassword . "', phoneNum = '" . $newPhoneNumber . "'
						   		WHERE userEmail = '" . $email . "';";

		echo $changeUserInfoQuery;
		//$myConnection->query($changeUserInfoQuery);

		$myConnection->close();
	}*/


	function isPhoneNumValid($phoneNum)
	{
		if(preg_match("/^[0-9]{3}[0-9]{3}[0-9]{4}$/", $phoneNum))
		{
			return true;
		}
	}

?>