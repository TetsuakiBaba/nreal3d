
var s1 = function (sketch) {
    sketch.setup = function () {
        let canvas1 = sketch.createCanvas(sketch.windowWidth / 2, sketch.windowHeight, sketch.WEBGL);
        canvas1.position(0, 0);

    }
    sketch.draw = function () {
        //for canvas 1
        sketch.clear(0)
        sketch.rotateX(sketch.frameCount * 0.01);
        sketch.rotateY(sketch.frameCount * 0.01);
        sketch.box(50);
        sketch.camera(
            -10, 0, 200,
            0, 0, 0,
            0, 1, 0);
    }
};

// create a new instance of p5 and pass in the function for sketch 1
new p5(s1);

var s2 = function (sketch) {

    sketch.setup = function () {
        let canvas2 = sketch.createCanvas(sketch.windowWidth / 2, sketch.windowHeight, sketch.WEBGL);
        canvas2.position(sketch.windowWidth / 2, 0);
    }
    sketch.draw = function () {
        //for canvas 2
        sketch.clear(0)
        sketch.rotateX(sketch.frameCount * 0.01);
        sketch.rotateY(sketch.frameCount * 0.01);
        sketch.box(50);

        sketch.camera(
            10, 0, 200,
            0, 0, 0,
            0, 1, 0);

    }
};

// create the second instance of p5 and pass in the function for sketch 2
new p5(s2);


