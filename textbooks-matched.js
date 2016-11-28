$(document).ready(function(){

  console.log("ready");

  var currentUserEmail = localStorage.getItem("_currentUserEmail");
  matchedTextbooks();

  $('#logoutBtn').click(function() {
    localStorage.removeItem('_currentUserEmail');
  });

  function matchedTextbooks(){

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

          $('#matchedTextbookTable tr:last').after('<tr><td>' + msg[i].isbn + '</td><td>' + msg[i].title + '</td><td>' + msg[i].edition + '</td><td class = "dataRightBorder">' + msg[i].author + '</td><td>' + msg[i].buyerFirstName + '</td><td>'+ msg[i].buyerLastName +'</td><td>'+
          msg[i].buyerEmail +'</td><td class = "dataRightBorder">'+ msg[i].buyerPhoneNum +'</td><td>'+ msg[i].sellerFirstName +'</td><td>'+ msg[i].sellerLastName +'</td><td>'+ msg[i].sellerEmail +'</td><td>'+ msg[i].sellerPhoneNum +'</td></tr>');
        }
      }
    }
  }); // Ajax Call
}

});
