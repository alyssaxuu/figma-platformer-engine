$(document).ready(function(){
   // Client ID from the Figma OAuth App
   var client = "YOUR_CLIENT_ID";
   $("#build").on("click", function(){
      if ($("#file").val() != "") {
          url = $("#file").val().split("https://www.figma.com/file/").pop().split("/")[0];
           $.ajax({
               url: "process.php", data:{file:url}, type:"POST", success: function(result){
                window.location.replace("https://www.figma.com/oauth?client_id="+client+"&redirect_uri=https://alyssax.com/x/platformer/play&scope=file_read&state="+result+"&response_type=code");
  }});
      } else {
          $("#file").addClass("error");
          $("#build").addClass("error2");
      }
   });
});