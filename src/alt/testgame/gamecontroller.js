function gOnPageLoad(){
    setCanvasSize(shipsinkCanvas, 800, 400);
    gsetStaticObjects();
    drawObjects(shipsinkCanvas);
}

function gsetStaticObjects(){
    fieldObjects.waterpoint.x = 50;
    fieldObjects.waterpoint.y = 250;
    staticObjectArray.add(fieldObjects.waterpoint);
    fieldObjects.waterpoint.x = 250;
    fieldObjects.waterpoint.y = 250;
    staticObjectArray.add(fieldObjects.waterpoint);
    fieldObjects.ship.x = 300;
    fieldObjects.ship.y = 50;
    staticObjectArray.add(fieldObjects.ship);
}

//***************** canvas Mouse ***************** 

function gmouseClick(event, canvasName){
    mouse = getCanvasKoordinaten(event.clientX, event.clientY, canvasName);
    document.getElementById("xPosMouseTest").value = mouse.x;
    document.getElementById("yPosMouseTest").value = mouse.y;
    // console.log(document.getElementById(canvasName).clientWidth)
    // console.log(document.getElementById(canvasName).clientHeight)
    if(mouse.x < document.getElementById(canvasName).clientWidth && mouse.y < document.getElementById(canvasName).clientHeight){
        loopControll();
        //''TEST
        fieldObjects.ship.x = 0;
        fieldObjects.ship.y = 0;
        fieldObjects.ship.xend = mouse.x;
        fieldObjects.ship.yend = mouse.y;   
        movableObjectArray.add(fieldObjects.ship);
        // console.log(movableObjectArray);
        drawObjects(shipsinkCanvas);
        //''TEST
        initMovePara(shipsinkCanvas);
        loopa();
    }
}


