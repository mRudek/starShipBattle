let myInterval;
let startstop = 1;
let runLoop = false;
let canvasBackground = "black";
let canvas = document.getElementById("shipsinkCanvas");
let ctx = canvas.getContext("2d");
ctx.fillStyle = "#FF0000";

//place Objects on Field
function setCanvasSize(width, height){
    document.getElementById("shipsinkCanvas").width = width;
    document.getElementById("shipsinkCanvas").height = height;
}

function drawImageOnField(fieldObject){
    let imga = new Image();
    imga.src = fieldObject.src;
    ctx.drawImage(imga, fieldObject.x, fieldObject.y, fieldObject.width, fieldObject.height);
    // requestAnimationFrame(drawImageOnField);  
}

function drawObjects(){
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawBackground();
    //draw every static Object
    for(let i=0; i < staticObj.objNo.length; i++){
        drawImageOnField(staticObj.objNo[i]);
    }
    //draw every movable Object
    for(let i=0; i < movableObj.objNo.length; i++){
        ctx.beginPath();
        drawImageOnField(movableObj.objNo[i]);
    }
    ctx.font = "20px Times New Roman";
    ctx.fillStyle = "white";
    ctx.fillText("Schiffe", 450, 20);
    ctx.fillText("Rebellen", 400, 50);
    ctx.fillText(gameData.p1PlacedShips, 400, 70);
    ctx.fillText("Imperium", 500, 50);
    ctx.fillText(gameData.p2PlacedShips, 500, 70);
}

function drawBackground(){
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = canvasBackground;
    ctx.fill();
}


function moveObject(){
    drawObjects();  
}
//manipulate Objects
function updatePositions(){
    let speed = 50;
    let movobj = movableObj.objNo;
    // fieldObjectArray.objects[objectArrayNo].x += 1;
    gameData.arrivedObj = 0;
    for(let i = 0; i < movobj.length; i++){
        if(movobj[i].x < movobj[i].xend){
            movobj[i].x += speed;
        }
        if(movobj[i].y > movobj[i].yend){
            movobj[i].y -= speed;
        }
        if(movobj[i].x > movobj[i].xend && movobj[i].y < movobj[i].yend){
            // console.log("aa " , movobj[i].arrayplace);
            if(movobj[i].arrived != 1){
                //bug: last placed ship will erase destroyed ship, so the if
                if(staticObj.objNo[movobj[i].arrayplace].src == fieldObjDef.waterpoint.src){
                    staticObj.objNo[movobj[i].arrayplace].src = JSON.parse(JSON.stringify(movobj[i].src));
                }
            }
            movobj[i].src ="";
            movobj[i].arrived = 1;
        }
        gameData.arrivedObj += movobj[i].arrived;
    }
    // console.log(movobj.length, " ", gameData.arrivedObj)
    //switch to stop when at goal
    if(movobj.length == gameData.arrivedObj){
        startStopLoop();
    }
}


function fireLaser(targetArr){
    drawObjects();
    targetArr.forEach(function (target, index) {
        ctx.beginPath();
        ctx.moveTo(target.xstart, target.ystart);
        ctx.lineTo(target.xaim, target.yaim);
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 10;
        ctx.stroke();
    });
}


// start loop animation / refresh screen
let winAnimationTimer = 0;
function loop(){
    updatePositions();
    moveObject();
//code to controll, if loop ist running. Runing without stopong causes Memory leak
    winAnimationTimer++;
    if (winAnimationTimer > 100){
        winAnimationTimer = 0;
        startStopLoop();
    }
    document.getElementById("loopStatustxt").value = winAnimationTimer; 
//code for win animition at bot
    // !!IMPORTANT!! Stops wining animation after wining. Memory leak without this
    // winAnimationTimer++;
    // //Destroy Rebell Ship
    // if (winAnimationTimer > 70){
    //     staticObj.objNo[staticObj.objNo.length-1].src = "";
    // }
    // if (winAnimationTimer > 100){
    //     winAnimationTimer = 0;
    //     startStopLoop();
    // }
    // document.getElementById("loopStatustxt").value = winAnimationTimer; 
}



//start/stop animation controll
let intevalTimer = 50;
function startStopLoop(){
    if (runLoop == false){
        runLoop = true;
        myInterval = setInterval(loop, intevalTimer);
    } else {
        clearInterval(myInterval);
        runLoop = false;
    }
}

function startLoop(){
    if(runLoop == false){
        runLoop = true;
        myInterval = setInterval(loop, intevalTimer);
    }
}


//********* Canvas Coordinaten innerhalb des Canvas, unabhängig von Abständen der Seite OBEN und UNTEN*/
function getCanvasKoordinaten(event_clientX, event_clientY){
    let offsetYa;
    offsetYa=canvas.getBoundingClientRect();
    let coordinates = {
        x: event_clientX - offsetYa.left,
        y: event_clientY - offsetYa.top
    }; 
    return coordinates;
}