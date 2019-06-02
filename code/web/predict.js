let model;

async function load_model() {
    // model = await tf.loadLayersModel("../../model/rnn/rnn.json");
    model = await tf.loadLayersModel("../../model/cnn/cnn.json");
}

async function predict() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (check_empty()) {
        document.getElementById("result").innerHTML = "Don't Know";
        return;
    }
    let input = tf.tensor2d(scale(imageData));
    // let output = await model.predict(input.reshape([1, 28, 28]));
    let output = await model.predict(input.reshape([1, 28, 28, 1]));
    let prediction = Array.from(output.argMax(1).dataSync());
    document.getElementById("result").innerHTML = prediction[0];
}

function scale(imageData) {
    let grey_scaled_data = make_array([imageData.width, imageData.height], 0);
    for (let i = 0; i < imageData.data.length; i += 4) {
        let coordinate_x = Math.floor(i / 4 / 196);
        let coordinate_y = Math.floor(i / 4 % 196);
        grey_scaled_data[coordinate_x][coordinate_y] = imageData.data[i + 3];
    }
    let input_data = make_array([28, 28], 0);
    let scale = 196 / 28;
    for (let i = 0; i < 28; i++) {
        for (let j = 0; j < 28; j++) {
            input_data[i][j] = average_pixel(grey_scaled_data, i * scale, j * scale,
                                             (i + 1) * scale - 1, (j + 1) * scale - 1)
        }
    }
    return input_data;
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