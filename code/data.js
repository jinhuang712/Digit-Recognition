function extract() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return centralize(imageData, scale(get_grey_scaled_image(imageData)));
}

function scale(image_grey_scaled) {
    let scaled_input = make_array([28, 28], 0);
    let scale = 196 / 28;
    for (let i = 0; i < 28; i++) {
        for (let j = 0; j < 28; j++) {
            scaled_input[i][j] = average_pixel(image_grey_scaled, i * scale, j * scale,
                                               (i + 1) * scale - 1, (j + 1) * scale - 1);
        }
    }
    return scaled_input;
}

// todo improve centralizing accuracy
function centralize(imageData, image) {
    let scale_ratio = 196/ 28;
    // find corners
    let corners = [28, 28, 0, 0]; // top, left, down, right
    for (let i = 0; i < 28; i++) {
        for (let j = 0; j < 28; j++) {
            if (image[i][j] !== 255) {
                continue;
            }
            if (j < corners[0]) corners[0] = j;
            if (j > corners[2]) corners[2] = j;
            if (i < corners[1]) corners[1] = i;
            if (i > corners[3]) corners[3] = i;
        }
    }
    // calculate centers
    let center_cord = find_center(corners);
    // convert to absolute coordinates
    for (let item of center_cord) {
        item = item * scale_ratio | 0;
    }
    let absolute_corner = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
        absolute_corner[i] = corners[i] * scale_ratio | 0;
    }
    let x_delta = (28 - (absolute_corner[3] - absolute_corner[1]) / scale_ratio) / 2;
    let y_delta = (28 - (absolute_corner[2] - absolute_corner[0]) / scale_ratio) / 2;
    absolute_corner[1] -= x_delta;
    absolute_corner[3] += x_delta;
    absolute_corner[0] -= y_delta;
    absolute_corner[2] += y_delta;
    let image_grey_scaled = get_grey_scaled_image(imageData);
    let image_centralized = make_array([imageData.width, imageData.height], 0);
    for (let i = absolute_corner[1] | 0, x = 0; i < absolute_corner[3] | 0; i++, x++) {
        for (let j = absolute_corner[0] | 0, y = 0; j < absolute_corner[2] | 0; j++, y++) {
            let temp = 0;
            if (i >= 0 && j >= 0 && i < image_grey_scaled.length && j < image_grey_scaled[0].length) {
                temp = image_grey_scaled[i][j];
            }
            image_centralized[x][y] = temp;
        }
    }
    return scale(image_centralized);
}

// find the center given 4 corners
function find_center(corners) {
    let result = [0, 0]; // x, y
    result[0] = corners[1] + corners[3] / 2;
    result[1] = corners[0] + corners[2] / 2;
    return result;
}

function get_grey_scaled_image(imageData) {
    let imageData_grey_scaled = make_array([imageData.width, imageData.height], 0);
    for (let i = 0; i < imageData.data.length; i += 4) {
        let x = Math.floor(i / 4 / 196);
        let y = Math.floor(i / 4 % 196);
        imageData_grey_scaled[x][y] = imageData.data[i + 3];
    }
    return imageData_grey_scaled;
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

let make_array = function(dims, arr) {
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
