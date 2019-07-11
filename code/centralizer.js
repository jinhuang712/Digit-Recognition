function centralize(imageData, scaled_image) {
    let scale_ratio = canvas.width / 28;
    let corners = find_corners(scaled_image);

    // convert to absolute coordinates
    for (let i = 0; i < 4; i++) {
        corners[i] = (corners[i] * scale_ratio) | 0;
    }

    // expand
    let expanded_corners = expand_absolute_corners(corners);
    let width = expanded_corners[3] - expanded_corners[1];
    let height = expanded_corners[2] - expanded_corners[0];
    let image_grey_scaled = get_grey_scaled_image(imageData);
    let image_centralized = make_array([width, height], 0);
    for (let i = expanded_corners[1] | 0, x = 0; i < (expanded_corners[3] | 0); i++, x++) {
        for (let j = expanded_corners[0] | 0, y = 0; j < (expanded_corners[2] | 0); j++, y++) {
            let temp = 0;
            if (i >= 0 && j >= 0 && i < image_grey_scaled.length && j < image_grey_scaled[0].length) {
                temp = image_grey_scaled[i][j];
            }
            image_centralized[x][y] = temp;
        }
    }

    // scale to 28 x 28 input
    return scale(image_centralized);
}

function find_corners(image) {
    let corners = [28, 28, 0, 0]; // top, left, down, right
    for (let i = 0; i < 28; i++) {
        for (let j = 0; j < 28; j++) {
            if (image[i][j] === 0) {
                continue;
            }
            if (j < corners[0]) corners[0] = j;
            if (j > corners[2]) corners[2] = j;
            if (i < corners[1]) corners[1] = i;
            if (i > corners[3]) corners[3] = i;
        }
    }
    if (corners.toString() === [28, 28, 0, 0].toString())
        corners = [3, 3, 25, 25];
    corners[2] += 1;
    corners[3] += 1;
    return corners;
}

function expand_absolute_corners(absolute_corner) {
    let radius = 0;
    if (absolute_corner[3] - absolute_corner[1] > absolute_corner[2] - absolute_corner[0])
        radius = absolute_corner[3] - absolute_corner[1];
    else
        radius = absolute_corner[2] - absolute_corner[0];
    radius = radius + 2 * radius / 22 * 3;
    let x_delta = (radius - (absolute_corner[3] - absolute_corner[1])) / 2;
    let y_delta = (radius - (absolute_corner[2] - absolute_corner[0])) / 2;
    absolute_corner[1] -= x_delta;
    absolute_corner[3] += x_delta;
    absolute_corner[0] -= y_delta;
    absolute_corner[2] += y_delta;
    for (let i = 0; i < absolute_corner.length; i++) {
        absolute_corner[i] = parseInt(absolute_corner[i], 10);
    }
    return absolute_corner;
}
