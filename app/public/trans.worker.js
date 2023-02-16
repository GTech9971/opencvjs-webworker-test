function waitForOpencv(callbackFn, waitTimeMs = 30000, stepTimeMs = 100) {
    // eslint-disable-next-line no-undef
    if (cv.Mat) callbackFn(true)

    let timeSpentMs = 0
    const interval = setInterval(() => {
        const limitReached = timeSpentMs > waitTimeMs
        if (cv.Mat || limitReached) {
            clearInterval(interval)
            return callbackFn(!limitReached)
        } else {
            timeSpentMs += stepTimeMs
        }
    }, stepTimeMs)
}

self.onmessage = (event) => {
    const { type, data } = event.data;
    switch (type) {
        case 'init': {
            self.importScripts('./opencv.js');
            waitForOpencv(success => {
                self.postMessage({ type: type, data: `init :${success}` });
            });
            break;
        } case 'putImg': {
            const img = cv.matFromImageData(data);
            const dst = new cv.Mat();

            cv.cvtColor(img, dst, cv.COLOR_BGR2RGB, 4)

            const imgData = mat2ImgData(dst);
            img.delete();
            dst.delete();
            self.postMessage({ type: type, data: imgData });
            break;
        }
        case 'trans': {
            const src = cv.matFromImageData(data);
            const fourCorners = [{ x: 249, y: 113 }, { x: 822, y: 177 }, { x: 798, y: 514 }, { x: 222, y: 550 }];
            const dst = transform(src, fourCorners);

            const imgData = mat2ImgData(dst);
            src.delete();
            dst.delete();

            self.postMessage({ type: type, data: imgData });
            break;
        } default: {
            break;
        }
    }
}

const mat2ImgData = (src) => {
    return new ImageData(
        new Uint8ClampedArray(src.data),
        src.cols,
        src.rows
    );
}

const transform = (src, fourCorners) => {
    const ratio = 1.2;
    const p0 = fourCorners[0]
    const p1 = fourCorners[1];
    const p2 = fourCorners[2];
    const p3 = fourCorners[3];

    let width = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
    width = Math.floor(width * ratio);

    let height = Math.sqrt(Math.pow(p2.x - p0.x, 2) + Math.pow(p2.y - p0.y, 2));
    height = Math.floor(height * ratio);

    // (data32F[0], data32F[1]) is the top left
    // (data32F[2], data32F[3]) is the top right
    // (data32F[4], data32F[5]) is the bottom left
    // (data32F[6], data32F[7]) is the bottom right
    const srcQuad = cv.matFromArray(4, 1, cv.CV_32FC2, [p0.x, p0.y, p1.x, p1.y, p3.x, p3.y, p2.x, p2.y]);
    const dstQuad = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, width, 0, 0, height, width, height]);

    const wrapMat = cv.getPerspectiveTransform(srcQuad, dstQuad);

    const dst = new cv.Mat();
    cv.warpPerspective(src, dst, wrapMat, new cv.Size(width, height), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

    srcQuad.delete();
    dstQuad.delete();
    wrapMat.delete();

    return dst;
}