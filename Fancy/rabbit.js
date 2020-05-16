class Game
{
    constructor(display_width, display_height)
    {
        this.display_width = display_width;
        this.display_height = display_height;
    }

    start()
    {
        this.player = new Player(this.display_width, this.display_height);
        
        this.platforms = [];

        for(let i = -1; i < 4; i++)
        {
            let pos = (Math.random()*200) + 200;
            this.platforms.push(new Platform(pos,0 + 200*i, '#0f0',this.display_width, this.display_height));
        }
       
        
        
        new InputHandler(this.player);

        
    }
    
    
    

    update(deltaTime)
    {   
        
        this.platforms.forEach((object) => object.update(deltaTime));
        this.player.update(deltaTime);
        collision(this.player, this.platforms);
        
        this.platforms.forEach((object,index1) => {
            if(object.y > 570)
            {
                this.platforms.splice(index1,1);
                let pos = (Math.random()*200) + 200;
                
                this.platforms.push(new Platform(pos,-400, '#0f0',this.display_width, this.display_height));
                this.player.count += 1;
                console.log(this.player.count);
            }
        });
        
    }

    draw(ctx)
    {
        if(this.player.count < 3)
        {
            draw_base();
        }

            
        this.platforms.forEach((object, index) => {
            if(this.player.count == 15 && index == 2) 
            {
                object.draw_pants(ctx);
                object.color = '#00f';
            }
            else{
                object.draw(ctx);
            }
        })
                
        this.player.draw(ctx);
    }
}

class InputHandler
{
    constructor(player)
    {
        document.addEventListener("keydown", event => {
            
            switch(event.keyCode)
            {
                case 37: player.move_left();
                break;
                case 39: player.move_right();
                break;
                case 32: player.jump();
                break;
            }
        });
        
        document.addEventListener("keyup", event => {
            
            switch(event.keyCode)
            {
                case 37: if(player.x_vel<0) player.stop();
                break;
                case 39: if(player.x_vel>0) player.stop();
                break;
                case 32: player.dont_jump();
            }
        });
        
    }
}


class Player
{
    constructor(display_width, display_height)
    {
        this.image = document.getElementById("boy");

        this.t = false;
        this.count = 0;

        this.display_width = display_width;
        this.display_height = display_height;

        this.width = 45;
        this.height = 60;

        this.x_vel = 0;
        this.y_vel = 0;

        this.jumping = false;
        
        this.position = {
            x: 30,
            y: 0
        };
        
        this.poy = 0;
        this.pox = 0;
    }
    
    draw(ctx)
    {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    move_left()
    {
        this.x_vel = -5;
        
    }

    move_right()
    {
       this.x_vel = 5;
       
    }

    stop()
    {
        this.x_vel = 0;    
    }

    jump()
    {
        this.t = true;
        
    }
    dont_jump()
    {
        this.t = false;
    }

    update(deltaTime)
    {
        if(this.t && this.jumping == false)
        {
            
            this.y_vel -=35;
            this.jumping = true;
        }        

        this.y_vel += 1.5; //gravity

        this.pox = this.position.x; // old x pos
        this.poy = this.position.y; // old y pos
        this.position.x += this.x_vel;
        this.position.y += this.y_vel; 
        this.y_vel *= 0.95; //friction

        //falling below floor
        if(this.position.y > 520 && this.count <= 2)
        {
            this.jumping = false;
            this.position.y = 520;
            this.y_vel = 0;
        }
        
        if(this.position.y > 520 && this.count > 2)
        {
            //alert("gameover");
            window.location.href = "plat_play.html";
        }

        //check boundaries
        
        if(this.position.x < 0)
        {
            this.x_vel = 0;
            this.position.x = 0;
        }
        if(this.position.x + this.width > this.display_width)
        {
            this.x_vel = 0;
            this.position.x = this.display_width - this.width;
        }
        
        
        
        
    }
}

class Platform
{
    constructor(x,y,color,display_width, display_height)
    {
        this.image = document.getElementById("platpic");
        this.image2 = document.getElementById("pants");

        this.x = x;
        this.y = y;
        this.rotation = 0;
        this.width = 95;
        this.height = 25;
        this.vx = 0;
        this.vy = 0;
        this.ox = 0;
        this.oy = 0;
        this.color = color;

        this.display_height = display_height;
        this.display_width = display_width;
    }

    moveY()
    {
        this.rotation += 0.01;
        this.ox = this.x;
        this.vx = this.x + Math.cos(this.rotation) - this.x;
        this.x += this.vx;

        this.oy = this.y; 
        //this.vy = this.y + Math.cos(this.rotation) - this.y;
        this.vy = 0.5;
        this.y += this.vy;
        //this.y = this.y % display_height;
    }

    
    update(deltaTime)
    {
        this.moveY();
    }
    
    draw(ctx)
    {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    draw_pants(ctx)
    {
        ctx.drawImage(this.image2, this.x, this.y-50, 50, 50);
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}


function collision(player, platforms)
{
    
    for(let i = 0; i<platforms.length; i++)
    {
        let platform = platforms[i];

        
        if(player.position.x + player.width/2 > platform.x && player.position.x < platform.x + platform.width)
        {
            if(player.position.y + player.height > platform.y &&
                player.poy + player.height <= platform.oy)
            {
                
                player.position.y = platform.y - player.height;
                player.y_vel = 0;
                player.jumping = false;
                player.x_vel += (platform.vx - player.x_vel)*0.1;
                if(platform.color == '#00f')
                {
                    //alert("you won");
                    window.location.href = "plat_play.html";
                }
            }
        }
            
    }
}

function draw_base()
{
  ctx.drawImage(grass_img,0,520, display_width,80); 
}
//////////////////////////////////////
//////////////////////////////////////////
///////////////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////////
///////////////////////////////////////////////



let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");  //to fill in the canvas ctx is your screen
let cloud_img = document.getElementById("clouds");
let grass_img = document.getElementById("grass");

const display_width = 800;
const display_height = 600;


let game = new Game(display_width, display_height);
game.start();

let lastTime = 0;

function gameLoop(timestamp)
{
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    
    ctx.drawImage(cloud_img,0,0, display_width,display_height); 


    



    game.update(deltaTime);
    game.draw(ctx);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop); 
