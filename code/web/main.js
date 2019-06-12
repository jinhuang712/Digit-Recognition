let canvas;
let ctx;

// todo fix initial stutter

// todo update model to achieve better accuracy

// todo update save model to tfjs readable model
//      allows for model testing convenience

// todo fix initial ReferenceError: require is not defined

window.onload = async function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    load_canvas();
    await load_model();
    setInterval(predict, 100);
    let correction = document.getElementById("correction");
    correction.onclick = async function () {
        let input = prompt("What is the correct answer?");
        if (input != null) {
            await fit(input);
        }
    };
};
