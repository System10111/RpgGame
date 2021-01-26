function initialise()
{
    var canvas = document.createElement("canvas");
    canvas.style = "border:2px solid #000000;"
    canvas.width = 500;
    canvas.height = 500;
    document.body.appendChild(canvas);
}

window.addEventListener("load", initialise);