$(document).ready(function(){

  console.log("ready");

  var currentUserEmail = localStorage.getItem("_currentUserEmail");



  function listTextbooksPeopleNeed(){

  $.ajax({
    cache: false,
    type: "POST",
    url: "login.php",
    data: {action: 'matchedTextbooks', email: currentUserEmail},
    success: function(msg)
    {
      msg = JSON.parse(msg);
      console.log(msg[0].title);
      if(msg.length > 0){
        for(var i = 0; i < msg.length; i++){

          $('#matchedTextbookTable tr:last').after('<tr><td>' + msg[i].isbn + '</td><td>' + msg[i].title + '</td><td>' + msg[i].edition + '</td><td class = "dataRightBorder">' + msg[i].author + '</td><td>' + msg[i].bFirstName + '</td><td>'+ msg[i].bLastName +'</td><td>'+
          msg[i].bEmail +'</td><td>'+ msg[i].bPhoneNum +'</td><td class = "dataRightBorder">'+ msg[i].sFirstName +'</td><td>'+ msg[i].sLastName +'</td><td>'+ msg[i].sEmail +'</td><td>'+ msg[i].sPhoneNum +'</td></tr>');
        }
      }
    }
  }); // Ajax Call


});
