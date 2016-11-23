
$(document).ready(function(){

  console.log("ready");

  var currentUserEmail = localStorage.getItem("_currentUserEmail");
  getUserProfile(currentUserEmail);









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
        if(msg[0].length > 0){
          for(var i = 0; i < msg[0].length; i++){
            $('#sellingListingTable tr:last').after('<tr><td>' + msg[0].title + '</td><td>' + msg[0].edition + '</td><td>' + msg[0].author + '</td><td>' + msg[0].isbn + '</td><td>' + msg[0].description + '</td><td>' + msg[0].author + '</td><td>'
            + msg[0].price + '</td><td>' + msg[0].image + '</td><td>'+ msg[0].postingTime +'</td><td>' + msg[0].postingDate + '</td></tr>');
          }
        }

        if(msg[1].length > 0){
          for(var i = 0; i < msg[1].length; i++){
            $('#buyingListingTable tr:last').after('<tr><td>' + msg[1].title + '</td><td>' + msg[1].edition + '</td><td>' + msg[1].author + '</td><td>' + msg[1].isbn + '</td><td>' + msg[1].description + '</td><td>' + msg[1].author + '</td><td>'
            + msg[1].image + '</td><td>'+ msg[1].postingTime +'</td><td>' + msg[1].postingDate + '</td></tr>');
          }
        }

      }
    }); // Ajax Call

  }

});
