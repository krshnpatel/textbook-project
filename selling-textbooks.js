$(document).ready(function(){

  var currentUserEmail = localStorage.getItem("_currentUserEmail");

  listTextbooksForSale();

  $('#logoutBtn').click(function() {
    localStorage.removeItem('_currentUserEmail');
  });

  function listTextbooksForSale(){

  $.ajax({
    cache: false,
    type: "POST",
    url: "login.php",
    data: {action: 'textbooksForSale'},
    success: function(msg)
    {
      msg = JSON.parse(msg);
      if(msg.length > 0){
        for(var i = 0; i < msg.length; i++)
        {
          $('#textbooksForSaleTable tr:last').after('<tr><td>' + msg[i].title + '</td><td>' + msg[i].edition + '</td><td>' + msg[i].author + '</td><td>' + msg[i].isbn + '</td><td>' + msg[i].description + '</td><td>'+ msg[i].price +'</td><td>'+
          msg[i].imagePath + '</td><td>'+ msg[i].postingTime +'</td><td>'+ msg[i].postingDate +'</td></tr>');
        }
      }
    }
  }); // Ajax Call


}

});



