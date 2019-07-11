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
    await model.predict(tf.tensor2d(extract()).reshape([1, 28, 28, 1]));
    hide_loading_overlay();
}

// todo prints "don't know" when probabilities aren't obvious
async function predict() {
    if (check_if_canvas_empty()) {
        document.getElementById("result").innerHTML = "Don't Know";
        return;
    }
    let input = tf.tensor2d(extract());
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
    let tensor = tf.tensor2d(extract());
    show_loading_overlay();
    await model.fit(tensor.reshape([1, 28, 28, 1]), tf.tensor(parseInt(input)).reshape([1, 1]), {
        epoch: 10
    });
    hide_loading_overlay();
    // NOTE:    silent update model unable to achieve
    //          and not much value, since user input data for digit recognition training won't
    //          result in a big shift in accuracy as it isn't very large sample
}
