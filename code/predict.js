let model;

async function load_model() {
    // model = await tf.loadLayersModel("../model/rnn/rnn.json");
    show_loading_overlay();
    model = await tf.loadLayersModel("../model/cnn/json/model.json");
    await model.compile({
                      optimizer: 'adam',
                      loss: 'sparseCategoricalCrossentropy',
                      metrics: ['accuracy']
                  });
    await model.predict(extract().reshape([1, 28, 28, 1]));
    hide_loading_overlay();
}

// todo prints "don't know" when probabilities aren't obvious
async function predict() {
    if (check_if_canvas_empty()) {
        document.getElementById("result").innerHTML = "Don't Know";
        return;
    }
    let input = extract();
    display_input_tensor();
    // let output = await model.predict(input.reshape([1, 28, 28]));
    let output = await model.predict(input.reshape([1, 28, 28, 1]));
    // console.log(output);
    // console.log(output.argMax(1));
    // console.log(output.argMax(1).dataSync());
    // console.log(Array.from(output.argMax(1).dataSync()));
    let prediction = Array.from(output.argMax(1).dataSync());
    document.getElementById("result").innerHTML = prediction[0];
}

async function fit(input) {
    if (isNaN(input)) {
        alert("Not a Number");
        return;
    }
    if (check_if_canvas_empty()) {
        alert("Canvas Empty");
        return;
    }
    let tensor = extract();
    show_loading_overlay();
    await model.fit(tensor.reshape([1, 28, 28, 1]), tf.tensor(parseInt(input)).reshape([1, 1]), {
        epoch: 10
    });
    hide_loading_overlay();
    // NOTE:    silent update model unable to achieve
    //          and not much value, since user input data for digit recognition training won't
    //          result in a big shift in accuracy as it isn't very large sample
}

function extract() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return tf.tensor2d(scale(imageData));
}

function scale(imageData) {
    let imageData_grey_scaled = make_array([imageData.width, imageData.height], 0);
    for (let i = 0; i < imageData.data.length; i += 4) {
        let x = Math.floor(i / 4 / 196);
        let y = Math.floor(i / 4 % 196);
        imageData_grey_scaled[x][y] = imageData.data[i + 3];
    }
    let scaled_input = make_array([28, 28], 0);
    let scale = 196 / 28;
    for (let i = 0; i < 28; i++) {
        for (let j = 0; j < 28; j++) {
            scaled_input[i][j] = average_pixel(imageData_grey_scaled, i * scale, j * scale,
                                             (i + 1) * scale - 1, (j + 1) * scale - 1);
        }
    }
    return scaled_input;
}

function average_pixel(image, x, y, x_end, y_end) {
    let sum = 0;
    for (let i = x; i < x_end; i++) {
        for (let j = y; j < y_end; j++) {
            sum += image[i][j];
        }
    }
    return Math.floor(sum / ((x_end - x) * (y_end - y)));
}

let make_array = function (dims, arr) {
    if (dims[1] === undefined) {
        return new Array(dims[0]);
    }
    arr = new Array(dims[0]);

    for (let i = 0; i < dims[0]; i++) {
        arr[i] = new Array(dims[1]);
        arr[i] = make_array(dims.slice(1), arr[i]);
    }
    return arr;
};
