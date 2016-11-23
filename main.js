
$(document).ready(function(){

  console.log("ready");

  var currentUserEmail = localStorage.getItem("_currentUserEmail");
  getUserProfile();
  getUserListing();
  getRecommendedBooks();








  function getUserProfile(){
    console.log("get user profile 1" + currentUserEmail);
    $.ajax({
      cache: false,
      type: "POST",
      url: "login.php",
      data: {action: 'getUserInfo', email: currentUserEmail},
      success: function(msg)
      {
        $('#email').text("E-mail: "+ currentUserEmail);
        $('#fName').text("First name: " + msg[0].firstName + "");
        $('#lName').text("Last name: " + msg[0].lastName + "");
        $('#phoneNum').text("Phone number: " + msg[0].phoneNum + "");
        $('#school').text("School: " + msg[0].schoolName + "");
        //console.log("get user profile" + msg[0]);
      }
    }); // Ajax Call
  }//end getUserProfile




  function getUserListing(){

    $.ajax({
      cache: false,
      type: "POST",
      url: "login.php",
      data: {action: 'userListings', email: currentUserEmail},
      success: function(msg)
      {
        msg = JSON.parse(msg);

        console.log(msg[1][0].title);

        if(msg[0].length > 0){
          for(var i = 0; i < msg[0].length; i++){
            $('#sellingListingTable tr:last').after('<tr><td>' + msg[0][i].title + '</td><td>' + msg[0][i].edition + '</td><td>' + msg[0][i].author + '</td><td>' + msg[0][i].isbn + '</td><td>' + msg[0][i].description + '</td><td>'
            + msg[0][i].price + '</td><td>' + msg[0][i].imagePath + '</td><td>'+ msg[0][i].postingTime +'</td><td>' + msg[0][i].postingDate + '</td></tr>');
          }
        }

        if(msg[1].length > 0){
          for(var i = 0; i < msg[1].length; i++){
            $('#buyingListingTable tr:last').after('<tr><td>' + msg[1][i].title + '</td><td>' + msg[1][i].edition + '</td><td>' + msg[1][i].author + '</td><td>' + msg[1][i].isbn + '</td><td>' + msg[1][i].description + '</td><td>'+ msg[1][i].postingTime +'</td><td>' + msg[1][i].postingDate + '</td></tr>');
          }
        }

      }
    }); // Ajax Call

  }//end getUserListing





  function getRecommendedBooks(){

    $.ajax({
      cache: false,
      type: "POST",
      url: "login.php",
      data: {action: 'recommendedBooks', email: currentUserEmail},
      success: function(msg)
      {
        msg = JSON.parse(msg);
        console.log(msg[0].title);
        if(msg.length > 0){
          for(var i = 0; i < msg.length; i++){
            //$('#recommendedTextbooks tr:last').after('<tr><td>gjgjgyg</td></tr>');

            $('#recommendedTextbooks tr:last').after('<tr><td>' + msg[i].title + '</td><td>' + msg[i].edition + '</td><td>' + msg[i].author + '</td><td>' + msg[i].isbn + '</td><td>' + msg[i].price + '</td></tr>');
          }
        }
      }
    }); // Ajax Call

  }

});
