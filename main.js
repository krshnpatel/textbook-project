
$(document).ready(function(){

  console.log("ready");


  getUserProfile();






  $('#row1').click( function() {
    console.log("clicked")
  }); //event handler loginBtn click
});


function getUserProfile(){



  $.ajax({
    cache: false,
    type: "POST",
    url: "login.php",
    data: {action: 'login', email: userEmail},
    success: function(msg)
    {
      //$('#calling').html((msg));
      console.log("SUCCESS: " + msg);

    }
  }); // Ajax Call
}//end getUserProfile
