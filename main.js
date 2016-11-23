
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

        $('#sellingListingTable tr:last').after('<tr> <td>dfgdfg</td> <td>gdfg</td> <td>gdfg</td> </tr>');
        $('#buyingListingTable tr:last').after('<tr><td></td><td></td><td></td></tr>');

      }
    }); // Ajax Call

  }

});
