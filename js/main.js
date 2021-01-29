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
    // the animations of the player
    anims: {
        time: 0.0,
        stand: undefined,
        walk: undefined
    },
    pos: {
        x: 10,
        y: 10
    }
}
let camera = {
    pos: {
        x: 0,
        y: 0
    }
}


// function that loads an image
function loadImage(file) {
    // create an image element
    let img = document.createElement("img");
    // set its source
    img.src = file;
    // give it back
    return img;
}
// function that creates an animation object from a list of frames
function createAnimation(files, fps, loop) {
    let frames = [];
    for(let i = 0; i < files.length; i++) {
        // convert each file to image, if its a string
        if (typeof files[i] === "string") {
            frames.push(loadImage(files[i]))
        } else {
            // else it's an already existing image so add it to the list
            frames.push(files[i]);
        }
    }
    // create the result
    let res = {
        frames: frames,
        fps: fps,
        loop: loop
    }
    // return it
    return res;
}

function animationFrame(anim, t) {
    // t is time in seconds
    // scale t with fps to get frame time
    t *= anim.fps;
    // loop the animation if looping is enabled
    if(anim.loop) {
        t %= anim.frames.length;
    }
    // get the correct frame
    return anim.frames[Math.floor(t)];
}

// initialise the game
function initialise() {
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
    // load the animations for the player
    player.anims.time = 0.0;
    player.anims.stand = createAnimation([
        "img/human1-move-0.png"
    ], 7, true); 
    player.anims.walk = createAnimation([
        "img/human1-move-0.png",
        "img/human1-move-1.png",
        "img/human1-move-2.png",
        "img/human1-move-3.png",
        "img/human1-move-4.png",
        "img/human1-move-5.png",
    ], 7, true); 
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

    // increment the animation time for the player
    player.anims.time += deltaT;

    // !!!TEMPORARY!!! we use it to decide which animation to display
    let walking = false;
    // !!!TEMPORARY!!!

    // check pressed keys
    if (kKeys["W".charCodeAt(0)]) {
        player.pos.y -= 150 * deltaT;
        camera.pos.y -= 150 * deltaT;
        walking = true;
    }
    if (kKeys["S".charCodeAt(0)]) {
        player.pos.y += 150 * deltaT;
        camera.pos.y += 150 * deltaT;
        walking = true;
    }
    if (kKeys["A".charCodeAt(0)]) {
        player.pos.x -= 150 * deltaT;
        camera.pos.x -= 150 * deltaT;
        walking = true;
    }
    if (kKeys["D".charCodeAt(0)]) {
        player.pos.x += 150 * deltaT;
        camera.pos.x += 150 * deltaT;
        walking = true;
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
    if(walking) {
        cameraDraw( animationFrame(player.anims.walk, player.anims.time), player.pos.x, player.pos.y);
    } else {
        // !!!TEMPORARY!!! when it starts walking it should be from the beginning
        player.anims.time = 0.0
        // !!!TEMPORARY!!!
        cameraDraw( animationFrame(player.anims.stand, player.anims.time), player.pos.x, player.pos.y);
    }

    // OTHER:

    // After everything is done, run the loop again, as soon as we can
    window.requestAnimationFrame(mainLoop);
}

// when the window loads, initialise and start the main loop
window.onload = function() {
    initialise();
    mainLoop(0.0);
}

// detect pressed keys
window.onkeyup = function(e) { kKeys[e.keyCode] = false; }
window.onkeydown = function(e) { kKeys[e.keyCode] = true; }