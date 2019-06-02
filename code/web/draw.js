let clear;

function load_canvas() {
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", finishPainting);
    canvas.addEventListener("mousemove", draw);
    clear = document.getElementById("clear");
    clear.onclick = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
}

// todo move mouse away from canvas stops painting

function startPainting(e) {
    painting = true;
    draw(e);
}

function finishPainting() {
    painting = false;
    ctx.beginPath();
}

function draw(e) {
    if (!painting) return;

    ctx.lineWidth = 10;
    ctx.lineCap = "round";

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
}

function check_empty() {
    let image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let sum = 0;
    for (let i = 0; i < image_data.data.length; i++) {
        sum+= image_data.data[i];
    }
    return sum === 0;
}