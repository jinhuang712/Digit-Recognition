let painting = false;

function load_canvas() {
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", finishPainting);
    canvas.addEventListener("mousemove", draw);
    let clear = document.getElementById("clear");
    clear.onclick = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    ctx.lineWidth = 10;
    ctx.lineCap = "round";

    canvas.style.cursor="crosshair";
}

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

    let rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function check_empty() {
    let image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let sum = 0;
    for (let i = 0; i < image_data.data.length; i++) {
        sum += image_data.data[i];
    }
    return sum === 0;
}

document.onmousemove = function (e) {
    let rect = canvas.getBoundingClientRect();
    if (e.clientX >= rect.right || e.clientX <= rect.left ||
        e.clientY >= rect.bottom || e.clientY <= rect.top) {
        finishPainting();
    }
};