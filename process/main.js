$(document).ready(function(){
   var client = ""; //THE CLIENT ID OF YOUR FIGMA APP
   var redirect = "http://localhost/figma-platformer-engine/"; //THE URL TO YOUR GAME

   $("#build").on("click", function(){
      if ($("#file").val() != "") {
          url = $("#file").val().split("https://www.figma.com/file/").pop().split("/")[0];
           $.ajax({
               url: "process.php", data:{file:url}, type:"POST", success: function(result){
                window.location.replace("https://www.figma.com/oauth?client_id="+client+"&redirect_uri="+redirect+"&scope=files:read&state="+result+"&response_type=code");
  }});
      } else {
          $("#file").addClass("error");
          $("#build").addClass("error2");
      }
   });
});