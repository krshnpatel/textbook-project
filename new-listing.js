$(document).ready(function(){
  console.log("ready");

  var currentUserEmail = localStorage.getItem("_currentUserEmail");

  var _isSelling = true;
  var _validIsbn = false;



  hideTextbookInputs();




  $('#submitListingBtn').click(function(){

    var _textbook = $('#textbookTxt').val();
    var _author = $('#authorTxt').val();
    var _edition = $('#editionTxt').val();
    var _price = $('#priceTxt').val();
    var _description = $('#descriptionTxt').val();

    if(validTextbook(_textbook) && validAuthor(_author) && validEdition(_edition) && validPrice(_price)){
      $.ajax({
        cache: false,
        type: "POST",
        url: "login.php",
        data: {action: 'addListing', email: currentUserEmail, textbook: _textbook, author: _author, edition: _edition, isSelling: _isSelling, validIsbn: _validIsbn, price: _price, description: _description},
        success: function(msg)
        {
          console.log(msg);
        }
      }); // Ajax Call
    }
  });


  $('input[name="optradio"]').change(function(){
    //alert(this.value);
    if(this.value == 1){
      _isSelling = false;
      $('#lblPrice').hide();
      $('#priceTxt').hide();
    }
    else{
      _isSelling = true;
      $('#lblPrice').show();
      $('#priceTxt').show();
    }

  });



  $('#checkIsbnBtn').click(function(){
    var _isbn = $('#isbnText').val();
    if(isbnValid(_isbn)){
      $.ajax({
        cache: false,
        type: "POST",
        url: "login.php",
        data: {action: 'checkIsbn', isbn: _isbn},
        success: function(msg)
        {
          if(msg){
            $('#bottomDiv').show();
            $('#checkIsbnBtn').hide();
            $("checkIsbnBtn").prop('disabled', true);
            _validIsbn = true;
          }
          else{
            $('#inputDiv').show();
            $('#bottomDiv').show();
            $('#checkIsbnBtn').hide();
            $("checkIsbnBtn").prop('disabled', true);
            _validIsbn = false;
          }
        }
      }); // Ajax Call
    }

  });



  function validEdition(edition){

    if(_validIsbn){
      return true;
    }

    if(edition.length == 0){
      $('#errorTag').text("Edition field is empty");
      return false;
    }

    for(var i = 0; i < edition.length; i++){
      if(edition.charCodeAt(i) < 48 || edition.charCodeAt(i) > 57){
        $('#errorTag').text("Invalid edition number");
        return false;
      }
    }
    $('#errorTag').text("");
    return true;


  }


  function validPrice(price){

    var dotCount = 0;

    if(price.length == 0){
      $('#errorTag').text("Price field is empty");
      return false;
    }

    for( var i = 0; i < price.length; i++){
      if(price.charCodeAt(i) == 46){
        dotCount++;
      }

      if(((price.charCodeAt(i) < 48 || price.charCodeAt(i) > 57) && price.charCodeAt(i) != 46) || dotCount > 1){
        $('#errorTag').text("Invalid price");
        return false;
      }
    }


    $('#errorTag').text("");
    return true;
  }


  function validAuthor(author){
    if(_validIsbn){
      return true;
    }
    else if(author.length == 0){
      $('#errorTag').text("Author field is empty");
      return false;
    }
    $('#errorTag').text("");
    return true;
  }





  function validTextbook(textbook){
    if(_validIsbn){
      return true;
    }
    if(textbook.length == 0){
      $('#errorTag').text("Textbook field is empty");
      return false;
    }
    $('#errorTag').text("");
    return true;
  }




  function hideTextbookInputs(){
    $('#inputDiv').hide();
    $('#bottomDiv').hide();

  }




  function isbnValid(isbn){

    if(isbn.length != 13){
      $('#errorTag').text("ISBN needs to be 13 numbers long");
      return false;
    }

    for(var i = 0; i < isbn.length; i++){
      if(isbn.charCodeAt(i) < 48 || isbn.charCodeAt(i) > 57){
        $('#errorTag').text("Invalid ISBN");
        return false;
      }
    }
    $('#errorTag').text("");
    return true;
  }


});
