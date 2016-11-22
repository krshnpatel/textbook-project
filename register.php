<!DOCTYPE html>
<html>
<head>
  <!-- Latest compiled and minified CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <!-- jQuery library -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <!-- Latest compiled JavaScript -->
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

  <link rel = "stylesheet" href = "register.css" />
  <script type="text/javascript" src="script.js"></script>

  <title>Textbook Buy/Sell</title>

</head>


<body>

  <div class="page-header" id = "title">
    <h1 >Textbook Buy/Sell</h1>
  </div>


  <div id = "registerContent">

      <label for="signupUsr">Email:</label>
      <input type="text" id="signupUsr" />

      <label for="signupPwd">Password:</label>
      <input type="password" id="signupPwd" />

      <label for="firstName">First name:</label>
      <input type="text" id="firstName" />

      <label for="lastName">Last name:</label>
      <input type="text" id="lastName" />

      <label for="phoneNumber" >Phone number:</label>
      <input type="text" id="phoneNumber" />

      <label for="school">School:</label>


      <select name="schools" id = "schoolDropdown">
        <?php
          $servername = "localhost";
          $username = "root";
          $password = "textbookproject";
          $database = "kriativejatabase";

          // Create connection
          $myConnection = new mysqli($servername, $username, $password);

          $sql = "USE kriativejatabase;";

          mysqli_query($myConnection, $sql);

          $schoolNameQuery = "SELECT schoolName FROM School;";

          $schoolNames = mysqli_query($myConnection, $schoolNameQuery);
          
          while ($row = $schoolNames->fetch_assoc())
          {
            echo '<option value="' . $row['schoolName'] . '">' . $row['schoolName'] . '</option>';
          }

        ?>
      </select>

  </div>

  <div id = "errorText">
    <p id = "errorTag"></p>
  </div>

  <div class = "container" id = "signup">
    <button type="button" class="btn btn-primary btn-lg" id = "registerBtn" onclick="location.href='index.html';">Back</button>
    <button type="button" class="btn btn-primary btn-lg" id = "signupBtn" onclick="location.href='main.html';">Sign Up</button>
  </div>

</body>


</html>
