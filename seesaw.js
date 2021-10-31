var alpha = 0;
var buttonClicked = 0;


function Battle() {

    function moveToTx(x,y,Tx){
        var res=vec2.create();
        vec2.transformMat3(res,[x,y],Tx);
        context.moveTo(res[0],res[1]);
    }

    function lineToTx(x,y,Tx){
        var res=vec2.create();
        vec2.transformMat3(res,[x,y],Tx);
        context.lineTo(res[0],res[1]);
    }

    function curveToTx(x1, y1, x2, y2, x, y, Tx){
        var res=vec2.create();
        var res1=vec2.create();
        var res2=vec2.create();
        vec2.transformMat3(res, [x, y], Tx);
        vec2.transformMat3(res1, [x1, y1], Tx);
        vec2.transformMat3(res2, [x2, y2], Tx);
        context.bezierCurveTo(res1[0], res1[1], res2[0], res2[1], res[0], res[1]);
    }

    function ellipseTx(x, y, rx, ry, ro, st, end, Tx){
        var res = vec2.create();
        vec2.transformMat3(res, [x, y], Tx);
        context.ellipse(res[0], res[1], rx, ry, ro, st, end)
    }

    function rectTx(x, y, w, h, Tx){
        var res = vec2.create();
        vec2.transformMat3(res, [x, y], Tx);
        context.rect(res[0], res[1], w, h);
    }

    class leaf {
        constructor() {
            this.x = Math.random() * 780 + 10;
            this.y = 0;
            this.speed = Math.random() * 4 + 1;
        }

        update(Tx) {
            this.y += this.speed;
            if (this.y >= 800) this.y = 0;
            this.draw_leaf(Tx);
        }

        draw_leaf(Tx) {
            var leafToCanvas = mat3.create();
            mat3.translate(leafToCanvas, Tx, [this.x + Math.sin(50 * alpha) * 50, this.y]);
            mat3.rotate(leafToCanvas, leafToCanvas, 1 / 2 * Math.PI);

            var leftToLeaf = mat3.create();
            mat3.scale(leftToLeaf, leftToLeaf, [1, -1]);

            var leftToCanvas = mat3.create();
            mat3.multiply(leftToCanvas, leafToCanvas, leftToLeaf);
            draw_wind_blade(leftToCanvas,"#629b3e");

            var rightToLeaf = mat3.create();
            var rightToCanvas = mat3.create();
            mat3.multiply(rightToCanvas, leafToCanvas, rightToLeaf);
            draw_wind_blade(rightToCanvas, "#73b942");

            // var rightLeafToCanvas = mat3.create();
            // mat3.multiply(rightLeafToCanvas, rightToLeaf, leafToCanvas);
            context.strokeStyle = "#82bf56";
            context.lineWidth = 4;
            context.lineCap = "round"
            context.beginPath();
            moveToTx(-4, 0, leafToCanvas);
            lineToTx(23, 0, leafToCanvas);
            context.stroke();
        }
    }

    class bird {
        constructor() {
            this.angle = 0;
            this.x = 0;
            this.y = Math.random()*390+10;
            this.speed = Math.random()*5+5;
        }
        update(Tx){
            this.draw_bird(Tx);
            this.x += this.speed;
            this.angle = (this.angle + Math.PI / 180 * this.speed) % (2*Math.PI);
            if(this.x > 800) {
                this.x = 0;
                this.speed = Math.random()*5+5; // regenerate speed
                this.y = Math.random()*390+10;
            }
        }
        draw_bird(Tx){
            var wingToCanvas = mat3.create();

            mat3.translate(wingToCanvas,Tx, [this.x, this.y]);
            mat3.scale(wingToCanvas, wingToCanvas, [1, Math.sin(this.angle)]);
            context.fillStyle = "black";
            context.beginPath();
            moveToTx(0, 0, wingToCanvas);
            lineToTx(0, 20, wingToCanvas);
            lineToTx(-10, 0, wingToCanvas);
            context.closePath();
            context.fill();


            context.fillStyle = "grey";
            context.beginPath();
            ellipseTx(this.x, this.y, 10, 10, 0, 0, 2*Math.PI, Tx);
            context.fill();
            moveToTx(this.x-5, this.y-5*Math.sqrt(3), Tx);
            lineToTx(this.x-30, this.y, Tx);
            lineToTx(this.x-5, this.y+5*Math.sqrt(3), Tx);
            context.closePath();
            context.fill();
            context.fillStyle = "yellow";
            context.beginPath();
            moveToTx(this.x+9, this.y+2, Tx);
            lineToTx(this.x+9, this.y-2, Tx);
            lineToTx(this.x+15, this.y, Tx);
            context.closePath();
            context.fill();

            context.fillStyle = "black";
            context.beginPath();
            moveToTx(0, 0, wingToCanvas);
            lineToTx(-20, 20, wingToCanvas);
            lineToTx(-10, 0, wingToCanvas);
            context.closePath();
            context.fill();


        }
    }

    var background_x = 0;
    var background_y = 0;
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var background_image = new Image(800, 800);
    var toCanvas = mat3.create();
    background_image.src = "background.jpg";
    var leaves = [
        new leaf(),
        new leaf(),
        new leaf(),
        new leaf(),
        new leaf(),
        new leaf(),
        new leaf(),
        new leaf(),
        new leaf(),
        new leaf()
    ]; // ten leaves
    var birds = [
        new bird(),
        new bird(),
        new bird(),
        new bird(),
    ]; // 4 birds

    context = context;


    function draw_seesaw_base(Tx, color) {
        context.beginPath();
        context.fillStyle = color;
        moveToTx(0, 0, Tx); // 400, 700
        lineToTx(-40, 80, Tx);
        lineToTx(40, 80, Tx);
        context.closePath();

        var leftWheelToBase = mat3.create();
        mat3.translate(leftWheelToBase, Tx, [-40, 80]);
        context.fill();
        context.beginPath();
        ellipseTx(-40, 80, 20, 20, 0, 0, 2*Math.PI, leftWheelToBase);
        context.fill();

        var rightWheelToBase = mat3.create();
        mat3.translate(rightWheelToBase, Tx, [40, 80]);
        context.fill();
        context.beginPath();
        ellipseTx(40, 80, 20, 20, 0, 0, 2*Math.PI, leftWheelToBase);
        context.fill();


    }

    function draw_seesaw_board(Tx, color) {
        context.beginPath();
        context.fillStyle = color; // 350, -7.5
        moveToTx(350, -7.5, Tx); // 750 725
        lineToTx(-350, -7.5, Tx);
        lineToTx(-350, 7.5, Tx);
        lineToTx(350, 7.5, Tx);
        context.closePath();
        context.fill();
    }

    function draw_center(Tx, color) {
        context.beginPath();
        context.fillStyle = color;
        // 400 717.5
        ellipseTx(0, 0, 5, 5, 0, 0, 2 * Math.PI, Tx);
        context.fill();
    }

    function draw_samurai(Tx) {
        // draw leg
        context.lineWidth = 5;
        context.strokeStyle = "white";
        context.beginPath();
        moveToTx(-10, 0, Tx); // draw left leg
        lineToTx(-60, 50, Tx); // -50, +50
        moveToTx(10, 0, Tx); // draw right leg
        lineToTx(20, 20, Tx); // upper part of right leg +10, +20
        lineToTx(0, 50, Tx); // lower part of right leg -20, +30
        context.stroke();
        // body
        context.fillStyle = "grey";
        context.beginPath();
        rectTx(-15, -70, 30, 70, Tx);
        context.fill();
        // head
        context.fillStyle = "#ffcc99";
        context.beginPath();
        ellipseTx(0, -100, 30, 30, 0, 0, 2 * Math.PI, Tx);
        context.fill();
        context.fillStyle = "#663300";
        context.beginPath();
        moveToTx(0, -150, Tx);
        lineToTx(-50, -120, Tx);
        lineToTx(50, -120, Tx);
        context.closePath();
        context.fill();
    }

    function draw_spin(Tx) {
        context.fillStyle = "#4b7d27";
        context.beginPath();
        ellipseTx(0, 0, 25, 25, 0, 0, 2 * Math.PI, Tx);
        context.fill();
        draw_wind_blade(Tx, "brown");

        var oneHalfPI = mat3.create();
        mat3.rotate(oneHalfPI, Tx, 1 / 2 * Math.PI);
        draw_wind_blade(oneHalfPI, "brown");

        var twoHalfPI = mat3.create();
        mat3.rotate(twoHalfPI, Tx, Math.PI);
        draw_wind_blade(twoHalfPI, "brown");

        var threeHalfPI = mat3.create();
        mat3.rotate(threeHalfPI, Tx, 3 / 2 * Math.PI);
        draw_wind_blade(threeHalfPI, "brown");
    }

    function draw_wind_blade(Tx, color) {
        context.fillStyle = color;
        context.beginPath();
        moveToTx(0, 0, Tx);
        curveToTx(5, 10, 20, 10, 25, 0, Tx);
        context.closePath();
        context.fill();
    }



    function draw_arm_kotana(Tx) {
        context.strokeStyle = "white";
        context.lineWidth = 5;
        context.beginPath();
        moveToTx(-15, 0, Tx); // draw left arm
        lineToTx(-45, 30, Tx);
        moveToTx(15, 0, Tx); // draw right arm
        lineToTx(35, 20, Tx);
        context.stroke();
        context.beginPath();
        context.strokeStyle = "gold";
        context.lineWidth = 2;
        context.fillStyle = "black";
        moveToTx(35, 20, Tx);
        lineToTx(35, 30, Tx);
        lineToTx(-65, 42.5, Tx); // -100, -12.5
        lineToTx(-65, 32.5, Tx);
        context.closePath();
        context.fill();
        moveToTx(15, 22.5, Tx);
        lineToTx(15, 32.5, Tx);
        context.stroke();

    }

    function draw_blade_kotana(Tx) {
        context.strokeStyle = "white";
        context.lineWidth = 5;
        context.beginPath();
        moveToTx(-15, 0, Tx); // draw left arm
        lineToTx(-45, 30, Tx)
        moveToTx(15, 0, Tx); // draw right arm
        lineToTx(35, -20, Tx);
        context.stroke();
        context.lineWidth = 2;
        context.strokeStyle = "gold";
        context.fillStyle = "black";
        context.beginPath();
        moveToTx(15, 22.5, Tx);
        lineToTx(15, 32.5, Tx);
        lineToTx(-65, 42.5, Tx); // -100, -12.5
        lineToTx(-65, 32.5, Tx);
        context.closePath();
        context.fill();
        var bladeToHand = mat3.create();
        mat3.translate(bladeToHand, Tx, [35, -20]);
        rectTx(0, 0, 10, 20, bladeToHand);
        context.fill();
        context.stroke();
        context.strokeStyle = "silver";
        context.fillStyle = "white";
        context.beginPath();
        rectTx(0, 20, 10, 70, bladeToHand);
        context.fill();
        context.stroke();
    }

    function draw() {
        setTimeout(function() {
            canvas.width = canvas.width;
            context.fillStyle = "#9EEE8E";
            context.beginPath();
            rectTx(0, 0, 800, 800, toCanvas);
            context.drawImage(background_image, background_x, background_y, 800, 800);
            context.drawImage(background_image, background_x + 800, background_y, 800, 800);
            background_x -= 10;
            if (background_x <= -800) background_x = 0;

            var seesawToCanvas = mat3.create();
            mat3.translate(seesawToCanvas, toCanvas, [400, 700]);
            draw_seesaw_base(seesawToCanvas, 'brown');

            // draw spins
            var leftSpinToSeesaw = mat3.create();
            mat3.translate(leftSpinToSeesaw, seesawToCanvas, [-40, 80]);
            mat3.rotate(leftSpinToSeesaw, leftSpinToSeesaw, 250 * alpha);
            draw_spin(leftSpinToSeesaw);

            var rightSpinToSeesaw = mat3.create();
            mat3.translate(rightSpinToSeesaw, seesawToCanvas, [40, 80]);
            mat3.rotate(rightSpinToSeesaw, rightSpinToSeesaw, 250 * alpha);
            draw_spin(rightSpinToSeesaw);

            var boardToSeesaw = mat3.create();
            mat3.translate(boardToSeesaw, seesawToCanvas, [0, 17.5]);
            mat3.rotate(boardToSeesaw, boardToSeesaw, (Math.asin(62.5 / 350) * Math.sin(100 * alpha)));
            draw_seesaw_board(boardToSeesaw, 'yellow');

            var leftToBoard = mat3.create();
            mat3.translate(leftToBoard, boardToSeesaw, [350, 0]);
            mat3.rotate(leftToBoard, leftToBoard, 250 * alpha);
            draw_spin(leftToBoard);

            var rightToBoard = mat3.create();
            mat3.translate(rightToBoard, boardToSeesaw, [-350, 0]);
            mat3.rotate(rightToBoard, rightToBoard, 250 * alpha);
            draw_spin(rightToBoard);

            mat3.translate(boardToSeesaw, boardToSeesaw, [0, 0]);
            draw_center(boardToSeesaw, 'orange');
            alpha = (alpha + Math.PI / 3600) % (2 * Math.PI);
            // before draw the samurai

            var samuraiToSeesaw = mat3.create();
            mat3.translate(samuraiToSeesaw, seesawToCanvas, [0, (400 * Math.pow(Math.sin(50 * alpha + 3 / 4 * Math.PI), 2) - 340)]);
            mat3.translate(samuraiToSeesaw, samuraiToSeesaw, [-200, -57.5]);
            draw_samurai(samuraiToSeesaw);

            // draw arm and kotana
            var armToSamurai = mat3.create();
            mat3.translate(armToSamurai, samuraiToSeesaw, [0, -40]);

            if (!buttonClicked) {
                draw_arm_kotana(armToSamurai);
            }
            else {
                draw_blade_kotana(armToSamurai);
            }

            var leafToSeesaw = mat3.create();
            mat3.translate(leafToSeesaw, seesawToCanvas, [-400, -640]);
            leaves.forEach(e => e.update(leafToSeesaw));
            birds.forEach(e => e.update(leafToSeesaw));

            window.requestAnimationFrame(draw);
        }, 1000/100 );

    }

    draw();

}

window.onload = Battle

function clicked() {
    buttonClicked = 1;
}

function restoreClicked() {
    buttonClicked = 0;
}