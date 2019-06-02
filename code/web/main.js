let canvas;
let ctx;

// todo fix initial stutter

window.onload = async function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    load_canvas();
    await load_model();
    setInterval(predict, 100);
};
