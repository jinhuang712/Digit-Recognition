let canvas;
let ctx;
let painting = false;

window.onload = function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    load_canvas();
    load_model();
    setInterval(predict, 100);
};
