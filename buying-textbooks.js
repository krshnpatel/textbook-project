$(document).ready(function(){
  console.log("ready");

  var currentUserEmail = localStorage.getItem("_currentUserEmail");

  listTextbooksPeopleNeed();

});



function listTextbooksPeopleNeed(){

  $.ajax({
    cache: false,
    type: "POST",
    url: "login.php",
    data: {action: 'textbooksBeingSold', email: currentUserEmail},
    success: function(msg)
    {
      msg = JSON.parse(msg);
      console.log(msg[0].title);
      if(msg.length > 0){
        for(var i = 0; i < msg.length; i++){

          $('#textbooksBeingSoldTable tr:last').after('<tr><td>' + msg[i].title + '</td><td>' + msg[i].edition + '</td><td>' + msg[i].author + '</td><td>' + msg[i].isbn + '</td><td>' + msg[i].description + '</td><td>'+ msg[i].postingTime +'</td><td>'+
          msg[i].postingDate +'</td></tr>');
        }
      }
    }
  }); // Ajax Call


}
