var arr = [];
var newimage = [];
var gems = [];
var hearts = [];
var key = 0;
var run = false;
var done = [];
var lives = 3;
var collected = 0;
var direction = 0;
var level = 1;
var enemyY = [];
var enemyX = [];
var frame = 0;
var completegame = 0;

function runCanvas() {
(function() {
  var requestAnimationFrame = window.requestAnimationFrame ||       
  window.mozRequestAnimationFrame ||  
  window.webkitRequestAnimationFrame || 
  window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();
//Initialization
var movex = true;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = 720;
var height = 450;
var player = {
    x : done[3]["Level"+level][0]["x"],
    y : done[3]["Level"+level][0]["y"],
    width : 30,
    height : 39,
    speed: 3.2,
    velX: 0,
    velY: 0,
    jumping: false,
};
var keys = [];
var friction = 0.8;
var gravity = 0.19;
 
canvas.width = width;
canvas.height = height;

function update(){
  // check keys
  if (keys[38] || keys[32]) {
    // up arrow or space
    if(!player.jumping) {
      player.jumping = true;
      player.velY = -player.speed*2;
    }
  }
  
  if (keys[39]) {
    // right arrow
    if (player.velX < player.speed && movex) {                         
      player.velX++;
      direction = 0;
    }          
  }
  
  if (keys[37] && movex) {                 
    // left arrow                  
    if (player.velX > -player.speed) {
      player.velX--;
      direction = 1;
    }
  }
  
  player.velX *= friction;
  player.velY += gravity;
  player.x += player.velX;
  player.y += player.velY;
  // Stay in the canvas
  if (player.x >= width-player.width) {
    player.x = width-player.width;
  } 
  else if (player.x <= 0) {
    player.x = 0;
  }
  if(player.y >= height-player.height){
    player.y = height - player.height;
    player.jumping = false;
  }
  // Spawn the player
  function newPlayer(x,y,w,h) {
    if (player.jumping) {
        var img = newimage[done[4].indexOf("PlayerUp")];
    } else if (direction == 1) {
        var img = newimage[done[4].indexOf("PlayerLeft")];
    } else {
        var img = newimage[done[4].indexOf("Player")];
    }
    ctx.drawImage(img,x,y,w,h);
  }
  // Spawn a floating enemy
  function spawnFloat(x,y,w,h,id,i) {
      var img = newimage[done[4].indexOf(id)];
      if (typeof enemyY[i] == 'undefined') {
          var obj = {y:y, direction:1};
        enemyY.push(obj);
      }
      ctx.drawImage(img,x,enemyY[i].y,w,h);
      if (enemyY[i].y <= y+40 && enemyY[i].direction == 1) {
          enemyY[i].y+= 1;
          if (enemyY[i].y >= y+40) {
              enemyY[i]["direction"] = 0;
              enemyY[i].y-= 1;
          }
      } else if (enemyY[i].y >= y-40 && enemyY[i].direction == 0) {
          enemyY[i].y-= 1;
          if (enemyY[i].y <= y-40) {
              enemyY[i]["direction"] = 1;
              enemyY[i].y+= 1;
          }
      }
    if(player.x+player.width>=x && player.x <=x+w && player.y<=enemyY[i].y+h && player.y+player.height>=enemyY[i].y) {
        player.y = done[3]["Level"+level][0]["y"];
      player.x = done[3]["Level"+level][0]["x"];
      player.velY = 0;
      player.velX = 0;
      lives--;
    }
  }
  // Spawn a flying enemy
  function spawnFly(x,y,w,h,id,i) {
      if (frame > 10 && frame <= 20) {
           var img = newimage[done[4].indexOf("EnemyFly2")];
      } else if (frame > 20 && frame <= 30) {
           var img = newimage[done[4].indexOf("EnemyFly3")];
      } else if (frame > 30 && frame <= 40) {
          var img = newimage[done[4].indexOf("EnemyFly2")];
            if (frame == 40) {
               frame = 0;
           }
      } else {
          var img = newimage[done[4].indexOf("EnemyFly1")];
      }
      if (typeof enemyX[i] == 'undefined') {
          var obj = {x:x, direction:1};
        enemyX.push(obj);
      }
      ctx.drawImage(img,enemyX[i].x,y,w,h);
      if (enemyX[i].x <= x+40 && enemyX[i].direction == 1) {
          enemyX[i].x+= 1;
          if (enemyX[i].x >= x+40) {
              enemyX[i]["direction"] = 0;
              enemyX[i].x-= 1;
          }
      } else if (enemyX[i].x >= x-40 && enemyX[i].direction == 0) {
          enemyX[i].x-= 1;
          if (enemyX[i].x <= x-40) {
              enemyX[i]["direction"] = 1;
              enemyX[i].x+= 1;
          }
      }
      if(player.x+player.width>=enemyX[i].x && player.x <=enemyX[i].x+w && player.y<=y+h && player.y+player.height>=y) {
        player.y = done[3]["Level"+level][0]["y"];
      player.x = done[3]["Level"+level][0]["x"];
      player.velY = 0;
      player.velX = 0;
      lives--;
    }
  }
  // Render the background
  function background(id) {
    var img = newimage[done[4].indexOf(id)];
    ctx.drawImage(img,0,0,width,height);
  }
  // Make a platform
  function newPlatform(x,y,w,h,name) {
    var img = newimage[done[4].indexOf(name)];
    ctx.drawImage(img,x,y,w,h);
    if(player.y+player.height >= y && player.y+player.height <= y+(h/2) && player.x < x+w-2 && player.x+player.width > x+2) {
      player.y = y-player.height;
      player.velY = 0;
      player.jumping = false;
    }
    if(player.y <= y+h && player.y >= y+(h/2) && player.x < x+w-2 && player.x+player.width > x+2) {
      player.y = y+h;
      player.velY = 0;
    }
  if (player.y >= y+1 && player.y <= y+h && player.x+player.width<x+2 && player.x+player.width>x-5) {
    player.x = player.x-2;
    movex = false;
    player.velX = 0;
  } else if (player.y >= y+1 && player.y <= y+h && player.x<x+w+5 && player.x>x+w-10) {
    player.x = player.x+2;
    movex = false;
    player.velX = 0;
  } else {
    movex = true; 
   }
  }
  // Make a spike
  function newSpike(x,y,w,h,id) {
      var img = newimage[done[4].indexOf(id)];
      ctx.drawImage(img,x,y,w,h);
          if(player.y+player.height >= y && player.y+player.height <= y+(h/2) && player.x < x+w-2 && player.x+player.width > x+2) {
      player.y = done[3]["Level"+level][0]["y"];
      player.x = done[3]["Level"+level][0]["x"];
      player.velY = 0;
      player.velX = 0;
      player.jumping = false;
      lives--;
    }
    if (player.x+player.width>=x && player.x <=x+w && player.y<=y+h && player.y+player.height>=y) {
        player.y = done[3]["Level"+level][0]["y"];
        player.x = done[3]["Level"+level][0]["x"];
        player.velY = 0;
        player.velX = 0;
        lives--;
    }
    
  }
  // Make a gem
  function newGem(x,y,w,h,i,id) {
      var img = newimage[done[4].indexOf(id)];
      if (typeof gems[i] == 'undefined') {
        gems.push("1");
        ctx.drawImage(img,x,y,w,h);
    } else {
        if (gems[i] == "1") {
            ctx.drawImage(img,x,y,w,h);
        }
    }
    if(gems[i] == "1" && player.x+player.width>=x && player.x <=x+w && player.y<=y+h && player.y+player.height>=y) {
        gems[i] = "0";
        collected++;
    }
  }
  // Spawn the exit
  function spawnExit(x,y,w,h,id) {
      if (key == 0) {
        var img = newimage[done[4].indexOf(id)];
      } else if (key == 1) {
        var img = newimage[done[4].indexOf("Exit")];  
      }
      ctx.drawImage(img,x,y,w,h);
      if (id.includes("Locked")) {
          if (key == 1) {
          if(player.x+player.width>=x && player.x <=x+w && player.y<=y+h && player.y+player.height>=y) {
          level++;
          gems = [];
          enemyY = [];
          enemyX = [];
          hearts = [];
          frame = 0;
          key = 0;
          if (level<=Object.keys(done[2]).length) {
              player.x = done[3]["Level"+level][0]["x"];
              player.y = done[3]["Level"+level][0]["y"];
          } else {
              level = 1;
              completegame = 1;
          }
          }
          }
      } else {
      if(player.x+player.width>=x && player.x <=x+w && player.y<=y+h && player.y+player.height>=y) {
          level++;
          key = 0;
          gems = [];
          enemyY = [];
          enemyX = [];
          hearts = [];
          frame = 0;
          if (level<=Object.keys(done[2]).length) {
              player.x = done[3]["Level"+level][0]["x"];
              player.y = done[3]["Level"+level][0]["y"];
          } else {
              level = 1;
              completegame = 1;
          }
    }
      }
  }
  // Spawn key
  function spawnKey(x,y,w,h,id) {
      var img = newimage[done[4].indexOf(id)];
      if (key == 0) {
        ctx.drawImage(img,x,y,w,h);
    }
      if(player.x+player.width>=x && player.x <=x+w && player.y<=y+h && player.y+player.height>=y) {
          key = 1;
      }
  }
  // Spawn heart
  function newHeart(x,y,w,h,id,i) {
      var img = newimage[done[4].indexOf(id)];
      if (typeof hearts[i] == 'undefined') {
        hearts.push("1");
        ctx.drawImage(img,x,y,w,h);
    } else {
        if (hearts[i] == "1") {
            ctx.drawImage(img,x,y,w,h);
        }
    }
    if(hearts[i] == "1" && playerx+player.width>=x && player.x <=x+w && player.y<=y+h && player.y+player.height>=y) {
        hearts[i] = "0";
        if (lives < 3) {
            lives++;
        }
    }
  }
  // Show GUI
  function makeGUI() {
      var img = newimage[done[4].indexOf("Heart")];
      if (lives >= 1) {
        ctx.drawImage(img,width-70,10,60,60);
      }
      if (lives >= 2) {
        ctx.drawImage(img,width-110,10,60,60);
      }
      if (lives >= 3) {
        ctx.drawImage(img,width-150,10,60,60);
      }
      var img2 = newimage[done[4].indexOf("Container")];
      ctx.drawImage(img2, 0,0,179,68);
      var img3 = newimage[done[4].indexOf("Gem")];
      ctx.drawImage(img3,25,20,24,22);
      ctx.font = "30px Ilisarniq Black";
      ctx.fillStyle = "#FFF";
      ctx.fillText(collected,60,42);
  }
  // Game over text
  function gameOver() {
      var img = newimage[done[4].indexOf("Game Over")];
      ctx.drawImage(img,0,0,width,height);
  }
  // Next level
  function complete() {
      var img = newimage[done[4].indexOf("Complete")];
      ctx.drawImage(img,0,0,width,height);
  }
   ctx.clearRect(0,0,width,height);
   if (lives == 0) {
       ctx.fillStyle = "#54447B";
       ctx.fillRect(0,0,width, height);
       gameOver();
   } else if (completegame == 1) {
       ctx.fillStyle = "#54447B";
       ctx.fillRect(0,0,width, height);
       complete();
   } else {
       background(done[2]["Level"+level][(done[2]["Level"+level].findIndex(element => element["name"].includes("Background")))]["name"]);
       var o = 0;
       var u = 0;
       var d = 0;
       var w = 0;
       frame++;
           for (var i = 0; i < done[2]["Level"+level].length; i++) {
               if (completegame != 1) {
               if (done[2]["Level"+level][i]["name"].includes("Tile")) {
                    newPlatform(done[2]["Level"+level][i]["x"],done[2]["Level"+level][i]["y"],58,58, done[2]["Level"+level][i]["name"]);
               } else if (done[2]["Level"+level][i]["name"].includes("Spikes") || done[2]["Level"+level][i]["name"].includes("Fluid")) {
                   newSpike(done[2]["Level"+level][i]["x"], done[2]["Level"+level][i]["y"], done[2]["Level"+level][i]["width"], done[2]["Level"+level][i]["height"],done[2]["Level"+level][i]["name"]);
               } else if (done[2]["Level"+level][i]["name"].includes("Gem")) {
                   newGem(done[2]["Level"+level][i]["x"], done[2]["Level"+level][i]["y"], done[2]["Level"+level][i]["width"], done[2]["Level"+level][i]["height"], o,done[2]["Level"+level][i]["name"]);
                   o++;
               } else if (done[2]["Level"+level][i]["name"].includes("Exit") || done[2]["Level"+level][i]["name"].includes("Locked")) {
                   spawnExit(done[2]["Level"+level][i]["x"], done[2]["Level"+level][i]["y"], done[2]["Level"+level][i]["width"], done[2]["Level"+level][i]["height"],done[2]["Level"+level][i]["name"]);
               } else if (done[2]["Level"+level][i]["name"].includes("Key")) {
                   spawnKey(done[2]["Level"+level][i]["x"], done[2]["Level"+level][i]["y"], done[2]["Level"+level][i]["width"], done[2]["Level"+level][i]["height"],done[2]["Level"+level][i]["name"]);
               } else if (done[2]["Level"+level][i]["name"].includes("EnemyFloat")) {
                   spawnFloat(done[2]["Level"+level][i]["x"], done[2]["Level"+level][i]["y"], done[2]["Level"+level][i]["width"], done[2]["Level"+level][i]["height"],done[2]["Level"+level][i]["name"],u);
                   u++;
               } else if (done[2]["Level"+level][i]["name"].includes("EnemyFly")) {
                   spawnFly(done[2]["Level"+level][i]["x"], done[2]["Level"+level][i]["y"], done[2]["Level"+level][i]["width"], done[2]["Level"+level][i]["height"],done[2]["Level"+level][i]["name"],d, frame);
                   d++;
               } else if (done[2]["Level"+level][i]["name"].includes("HeartItem")) {
                   newHeart(done[2]["Level"+level][i]["x"], done[2]["Level"+level][i]["y"], done[2]["Level"+level][i]["width"], done[2]["Level"+level][i]["height"],done[2]["Level"+level][i]["name"],w);
                   w++;
               }
               } else {
                   break;
               }
           }
    if (completegame != 1) {       
      newPlayer(player.x, player.y, player.width, player.height);
      makeGUI();
    }
   requestAnimationFrame(update);
   }
}

document.body.addEventListener("keydown", function(e) {
  keys[e.keyCode] = true;
});
 
document.body.addEventListener("keyup", function(e) {
  keys[e.keyCode] = false;
});

  update();
}

$(document).ready(function(){

if ($("#code").val() != "0" && $("#state").val() != "0") {
    var code = $("#code").val();
    var state = $("#state").val();
    $.ajax({
        url: "request.php",
        type:"post",
        data:{code:code, state:state},
        success: function(result){
            console.log(result.toString());
            done = JSON.parse(result);
            for (var i = 0; i<done[1].length; i++) {
                newimage[i] = new Image();
		        newimage[i].onload = function (e) {
		            arr.push(e.target);
		            if (arr.length == done[1].length) {
		                run = true;
		                $("#canvas").addClass("running");
		                runCanvas();
		            }
		        }
		        newimage[i].src = done[0][done[1][i]];
            };
        }
    });
}
 
});
