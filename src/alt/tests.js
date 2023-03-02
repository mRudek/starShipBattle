function onLoadTest (){
    document.getElementById("test1").value = "js läuft";
    document.getElementById("test2").value = loadControllerTest();
    document.getElementById("test3").value = loadGuiTest();
    document.getElementById("test4").value = loadModelTest();
    document.getElementById("test5").value = globalVarsTest();
}

//***************** canvas border controlls *****************
function borderTest(){
    document.getElementById("borderTest").width = document.getElementById("widthtest").value;
    document.getElementById("borderTest").height = document.getElementById("heighttest").value;
}
function borderTestReset(){
    document.getElementById("borderTest").width = 10;
    document.getElementById("borderTest").height = 10;
}


//***************** canvas move controlls *****************
//https://blog.thejaytray.com/canvas-basics-03-moving-object/
//--static rect
function btndrawTestObject() {
    //create Canvas
    canvas = document.getElementById("moveTest");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.beginPath();
    mybox.x = 0;
    mybox.y = 0;
    ctx.fillRect(mybox.x, mybox.y, mybox.width, mybox.height);
}
//--moving rect
function drawRectTest(){
    //create Canvas
    canvas = document.getElementById("moveTest");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    //draw Objects
    drawRectTestdraw();
}
    //draw Objects
function drawRectTestdraw() {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.fillRect(mybox.x, mybox.y, mybox.width, mybox.height);
}
    //manipulate Objects
function update(){
    mybox.x += 1;
}
    //start loop animation / refresh screen
function loop(){
    update();
    drawRectTest();
}
    //start/stop animation controll
function loopControllTest(){
    if (startstop == 0){
        clearInterval(myInterval);
        startstop = 1;
    } else {
        startstop = 0;
        myInterval = setInterval(loop, 50);
    }
}
//--- TEST move to point x 
function moveToPosTest(){
    mybox.x = 0;
    mybox.y = 0;
    loopController_ToPosTest();
}
    //new Coordinates
function updateMove(){
    let x = document.getElementById("xPosTest").value;
    let y = document.getElementById("yPosTest").value;
    if(mybox.x != x)
        mybox.x += 1;
    if(mybox.y != y)
        mybox.y += 1;
}
//redraw loopToPos
function loopToPos(){
    updateMove();
    drawRectTest();
}
function loopController_ToPosTest(){
    if (startstop == 0){
        clearInterval(myInterval);
        startstop = 1;
    } else {
        startstop = 0;
        myInterval = setInterval(loopToPos, 50);
    }
}
//***************** canvas Mouse ***************** 
function clickOnMoveTestMouse(event, canvasName){
    mouse = getCanvasKoordinaten(event.clientX, event.clientY, canvasName);
    document.getElementById("xPosMouseTest").value = mouse.x;
    document.getElementById("yPosMouseTest").value = mouse.y;
    let canvasBorderRight = document.getElementById(canvasName).clientWidth;
    let canvasBorderBottom = document.getElementById(canvasName).clientHeight;
    if(startstop == 1 && (mouse.x < canvasBorderRight && mouse.y < canvasBorderBottom)){
        loopController_ToMouseTest();
    }
}
function drawTestObject(){
    canvas = document.getElementById("moveTestMouse");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.fillRect(mybox.x, mybox.y, 10, 10);
}
function updateMoveMouse(){
    let x = mouse.x;
    let y = mouse.y;
    if(mybox.x != x){
        if(mybox.x < x){
            mybox.x += 1;
        } else {
            mybox.x -= 1
        }
    } 
    if(mybox.y != y){
        if(mybox.y < y){
            mybox.y += 1;
        } else {
            mybox.y -= 1
        }
    } 
    //switch to stop when at goal
    if(mybox.x == x && mybox.y == y){
        loopController_ToMouseTest();
    }
}
function loopToMousePos(){
    updateMoveMouse();
    drawTestObject();
}
function loopController_ToMouseTest(){
    if (startstop == 0){
        clearInterval(myInterval);
        startstop = 1;
    } else {
        startstop = 0;
        myInterval = setInterval(loopToMousePos, 5);
    }
}


