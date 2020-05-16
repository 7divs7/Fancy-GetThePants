
let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");  //to fill in the canvas ctx is your screen
let curtain_img = document.getElementById("curtain");
let start_img = document.getElementById("start");
let boy_img = document.getElementById("boy");
let pants_img = document.getElementById("pants");


canvas.addEventListener("click", onCanvasClick, false);

  function onCanvasClick(e) {
      var x; 
      var y;
      [x,y] = getCursorPosition(e);
      if(x >= 289 && x<= 476 && y>= 340 && y<= 420)
      {
        window.location.href = "plat.html";
      }
  }

  function getCursorPosition(e) {
  	var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
	x = e.pageX;
	y = e.pageY;
    }
    else {
	x = e.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
	y = e.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    
    //window.location.href = "plat.html";

return [x,y];
  }


const display_width = 800;
const display_height = 600;



let lastTime = 0;

function gameLoop(timestamp)
{
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.drawImage(curtain_img,0,0, display_width,display_height); 
    ctx.drawImage(start_img,display_width/2 - 120,display_height/2 + 30 , 200, 100);
    ctx.drawImage(boy_img,0,40, 150, 200);
    ctx.drawImage(pants_img,630,15, 100, 100); 
   

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop); 






    


