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
    lookingRight: true,
    // the animations of the player
    anims: {
        time: 0.0,
        stand: undefined,
        walk: undefined,
        attack: undefined
    },
    currentAnim: "stand",
    pos: {
        x: 20,
        y: 20
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
    return anim.frames[Math.min(Math.floor(t), anim.frames.length - 1)];
}

// update the canvas size and everything associated with it
function updateCanvasSize()
{
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    
    camera.pos.x= player.pos.x -(canvas.width)/2 + 25
    camera.pos.y= player.pos.y -(canvas.height)/2 + 25
}

// initialise the game
function initialise() {
    // create a canvas
    canvas = document.createElement("canvas");
    // canvas.style = "border:2px solid #000000;"
    document.body.style = "width: 100%; height: 100%; margin: 0; overflow: hidden;";

    updateCanvasSize();

    document.body.appendChild(canvas);
    
    

    // get its context
    ctx = canvas.getContext("2d");
    
    // create an image and add it to the list of loaded images
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
    player.anims.attack = createAnimation([
        "img/sword-human.png",
        "img/sword-human-1.png",
        "img/sword-human-2.png",
        "img/sword-human-3.png",
    ], 10, true); 
}

function cameraDraw(image, x, y, mirrorH = false) {
    x-=camera.pos.x
    y-=camera.pos.y
    if (mirrorH) {
        ctx.save(); // Save the current state
        ctx.scale(-1, 1); // Set scale to flip the image
        ctx.drawImage(image, -x, y, image.width*-1, image.height);
        ctx.restore(); // Restore the last saved state
    } else {
        ctx.drawImage(image, x, y);
    }
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
    if(player.currentAnim == "attack") {
        if(player.anims.time > player.anims.attack.frames.length / player.anims.attack.fps)
            player.currentAnim = "stand"
    } else {
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
            player.lookingRight = false;
            walking = true;
        }
        if (kKeys["D".charCodeAt(0)]) {
            player.pos.x += 150 * deltaT;
            camera.pos.x += 150 * deltaT;
            player.lookingRight = true;
            walking = true;
        }
        if (kKeys["F".charCodeAt(0)]) {
            player.currentAnim = "attack";
            player.anims.time = 0.0
        } else {
            if(walking) {
                player.currentAnim = "walk"
            } else {
                // !!!TEMPORARY!!! when it starts walking it should be from the beginning
                player.anims.time = 0.0
                // !!!TEMPORARY!!!
                player.currentAnim = "stand"
            }
        }
    }

    // DRAWING (we should probably move this code to a separate function later):

    // clear the canvas
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // draw the image we created
    //ctx.drawImage(imgs["theFirst"], player.pos.x, player.pos.y, 100, 100);
    cameraDraw(imgs["background"], -2220 , -3000, false)
    
    cameraDraw( animationFrame(player.anims[player.currentAnim], player.anims.time), player.pos.x, player.pos.y, !player.lookingRight);

    // OTHER:

    // After everything is done, run the loop again, as soon as we can
    window.requestAnimationFrame(mainLoop);
}

// when the window loads, initialise and start the main loop
window.onload = function() {
    initialise();
    mainLoop(0.0);
}

window.onkeyup = function(e) { kKeys[e.keyCode] = false; }
window.onkeydown = function(e) { kKeys[e.keyCode] = true; }
window.onresize = updateCanvasSize;
// detect pressed keys