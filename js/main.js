// holds all the loaded images
let imgs = {};
// the canvas
let canvas = undefined;
// context for the canvas
let ctx = undefined;
// holds the values for pressed keyboard keys
let kKeys = {};
// player data
let player = {
    pos: {
        x:10,
        y:10
    }
}
let camera = {
    pos: {
        x:0,
        y:0
    }
}

// function that loads an image
function loadImage(file)
{
    // create an image element
    let img = document.createElement("img");
    // set its source
    img.src = file;
    // give it back
    return img;
}

// initialise the game
function initialise()
{
    // create a canvas
    canvas = document.createElement("canvas");
    canvas.style = "border:2px solid #000000;"
    canvas.width = 1375;
    canvas.height = 632;
    camera.pos.x=-(canvas.width-50)/2
    camera.pos.y= -(canvas.height-50)/2

    document.body.appendChild(canvas);

    // get its context
    ctx = canvas.getContext("2d");
    
    // create an image and add it to the list of loaded images
    imgs["theFirst"] = loadImage("img/theFirst.png");
    imgs["background"] = loadImage("img/BackgroundN1.png");
}

function cameraDraw(image,x,y){
    x-=camera.pos.x
    y-=camera.pos.y
    ctx.drawImage(image, x, y);
}

let lastTime = 0;
function mainLoop(time)
{
    // get the elapsed time between frames
    let deltaT = time - lastTime;
    // convert from ms to s
    deltaT = deltaT / 1000;
    // set the time to be used in the next cycle
    lastTime = time;

    // UPDATING (we should probably move this code to a separate function later):

    // check pressed keys
    if (kKeys["W".charCodeAt(0)]) {
        player.pos.y -= 150 * deltaT;
        camera.pos.y -= 150 * deltaT;
    }
    if (kKeys["S".charCodeAt(0)]) {
        player.pos.y += 150 * deltaT;
        camera.pos.y += 150 * deltaT;
    }
    if (kKeys["A".charCodeAt(0)]) {
        player.pos.x -= 150 * deltaT;
        camera.pos.x -= 150 * deltaT;
    }
    if (kKeys["D".charCodeAt(0)]) {
        player.pos.x += 150 * deltaT;
        camera.pos.x += 150 * deltaT;
    }

    // DRAWING (we should probably move this code to a separate function later):

    // clear the canvas
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // draw the image we created
    //ctx.drawImage(imgs["theFirst"], player.pos.x, player.pos.y, 100, 100);
    cameraDraw(imgs["background"], -2220 , -3000)
    cameraDraw(imgs["theFirst"], player.pos.x, player.pos.y);

    // OTHER:

    // After everything is done, run the loop again, as soon as we can
    window.requestAnimationFrame(mainLoop);
}

// when the window loads, initialise and start the main loop
window.onload = function() {
    initialise();
    mainLoop();
}

// detect pressed keys
window.onkeyup = function(e) { kKeys[e.keyCode] = false; }
window.onkeydown = function(e) { kKeys[e.keyCode] = true; }