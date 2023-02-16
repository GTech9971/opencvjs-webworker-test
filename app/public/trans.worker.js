function waitForOpencv(callbackFn, waitTimeMs = 30000, stepTimeMs = 100) {
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
    self.importScripts('./opencv.js');
    waitForOpencv(success => {
        //self.postMessage(success);
        const img = cv.matFromImageData(event.data);
        const dst = new cv.Mat();

        cv.cvtColor(img, dst, cv.COLOR_BGR2RGB, 4)
        console.log(dst.channel);

        const imgData = new ImageData(
            new Uint8ClampedArray(dst.data),
            dst.cols,
            dst.rows
        );
        img.delete();
        dst.delete();
        self.postMessage(imgData);
    });
    console.log(event);
}



// const transform = (src: Mat, fourCorner: Point[]): Mat => {
//     const ratio: number = 1.2;
//     const p0: Point = fourCorner[0];
//     const p1: Point = fourCorner[1];
//     const p2: Point = fourCorner[2];
//     const p3: Point = fourCorner[3];

//     let width: number = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
//     width = Math.floor(width * ratio);

//     let height: number = Math.sqrt(Math.pow(p2.x - p0.x, 2) + Math.pow(p2.y - p0.y, 2));
//     height = Math.floor(height * ratio);

//     // (data32F[0], data32F[1]) is the top left
//     // (data32F[2], data32F[3]) is the top right
//     // (data32F[4], data32F[5]) is the bottom left
//     // (data32F[6], data32F[7]) is the bottom right
//     const srcQuad: Mat = cv.matFromArray(4, 1, cv.CV_32FC2, [p0.x, p0.y, p1.x, p1.y, p3.x, p3.y, p2.x, p2.y]);
//     const dstQuad: Mat = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, width, 0, 0, height, width, height]);

//     const wrapMat: Mat = cv.getPerspectiveTransform(srcQuad, dstQuad);

//     const dst: Mat = new cv.Mat();
//     cv.warpPerspective(src, dst, wrapMat, new cv.Size(width, height), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

//     srcQuad.delete();
//     dstQuad.delete();
//     wrapMat.delete();

//     return dst;
// }