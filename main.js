
$(document).ready(function(){

  $('#editProfileDiv').hide();
  var open = false;
  console.log("ready");

  var currentUserEmail = localStorage.getItem("_currentUserEmail");
  getUserProfile();
  getUserListing();
  getRecommendedBooks();


  $('#logoutBtn').click(function() {
    localStorage.removeItem('_currentUserEmail');
  });


  $('#editBtn').click(function(){
    //var phoneNumber = $('#phoneNum').text();
    if(!open){
      //$('#editPhoneNumInput').val();
      $('#editProfileDiv').show();
      $('#editBtn').text("Cancel Edit");
      open = true;
    }
    else{
      $('#editProfileDiv').hide();
      $('#editBtn').text("Edit Profile");
      $('#editPhoneNumInput').val("");
      $('#editPasswordInput').val("");
      $('#errorTag').text("");
      open = false;
    }


  });



  $('#submitEditBtn').click(function(){

    var userPhoneNumber = $('#editPhoneNumInput').val();
    var userPassword = $('#editPasswordInput').val();

    $.ajax({
      cache: false,
      type: "POST",
      url: "login.php",
      data: {action: 'editProfile', email: currentUserEmail, phoneNum: userPhoneNumber, password: userPassword},
      success: function(msg)
      {
        $('#errorTag').text("Successfully edited profile");
        $('#editProfileDiv').hide();
        $('#editBtn').text("Edit Profile");
        $('#editPhoneNumInput').val("");
        $('#editPasswordInput').val("");
        $('#errorTag').text(msg);
        open = false;
      }
    }); // Ajax Call


  });


$('#addListingBtn').click(function(){

  window.location.href = "new-listing.html";


});





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

});
