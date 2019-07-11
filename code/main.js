let canvas;
let ctx;

// todo fix initial slow painting response

// todo update model to achieve better accuracy

// todo fix initial ReferenceError: require is not defined

// todo fix vague definition of empty canvas

window.onload = async function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    load_canvas();
    await load_model();
    setInterval(predict, 100);
    let correction = document.getElementById("correction");
    correction.onclick = async function() {
        let input = prompt("What is the correct answer?");
        if (input != null) {
            // todo fit show overlay still unresponsive
            await fit(input);
        }
    };
};
