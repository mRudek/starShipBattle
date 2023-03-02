function gOnPageLoad(){
    gameData.reset();
    staticObj.reset();
    movableObj.reset();
    playerShips.reset();   
    kiData.reset();
    //Ki is always P1, so human has to be p2
    gameData.gameMode = "vsKi";
    if(gameData.gameMode == "vsKi"){
        gameData.kiPlayerNo = 1;
        gameData.enemyPlayerNo = gameData.kiPlayerNo;
        gameData.myPlayerNo = 2;
    }
    setCanvasSize(750, 600);
    gsetStaticObjects();
    kiData.createMainshipTargetArray(staticObj.objNo.length-2);
    drawObjects();

}

function restartGame(){
    gOnPageLoad();
}

function gsetStaticObjects(){
    //waterpoints
    let x = 5;
    let y = 150;
    for(let j = 0; j < 2; j++ ){
        for(let i = 0; i < 7; i++){
            fieldObjDef.waterpoint.x = x;
            fieldObjDef.waterpoint.y = y;
            staticObj.add(fieldObjDef.waterpoint);
            fieldObjDef.waterpoint.y += fieldObjDef.waterpoint.height;
            staticObj.add(fieldObjDef.waterpoint);
            x += 100;
        }
        x = 5;
        y += 150;
    }
    //hide enemy waterpoints
    for(let i = 0; i < staticObj.objNo.length; i +=2 ){
        staticObj.hide(i);
    }
    //add main ships to shipsArray
    addMainShips();
}

function addMainShips(){
        //add main ships to shipsArray
        let tmpMainShip = JSON.parse(JSON.stringify(fieldObjDef.mainshipR));
        tmpMainShip.x = 0;
        tmpMainShip.y = 0;
        tmpMainShip.target.xstart += 5;
        tmpMainShip.target.ystart -=  25;
        playerShips.adMainShip(1,tmpMainShip);
        tmpMainShip = JSON.parse(JSON.stringify(fieldObjDef.mainshipE));
        tmpMainShip.x = 0;
        tmpMainShip.y = 500;
        tmpMainShip.target.ystart = tmpMainShip.y+ tmpMainShip.height;
        playerShips.adMainShip(2,tmpMainShip);
        staticObj.add(playerShips.mainShips[gameData.myPlayerNo]);
        staticObj.add(playerShips.mainShips[gameData.enemyPlayerNo]);
}

//***************** canvas Mouse ***************** 
function gmouseClick(event){
    mouse = getCanvasKoordinaten(event.clientX, event.clientY);
    document.getElementById("xPosMouseTest").value = mouse.x;
    document.getElementById("yPosMouseTest").value = mouse.y;
    executeGamephaseCommand(mouse.x, mouse.y, gameData.myPlayerNo);
    //last ship was placed in this round
    if(gameData.gamephase =="placeEnemyShips"){
        if(gameData.gameMode == "vsKi"){
            placeShipsKi(gameData.kiPlayerNo);
        }
        placeEnemies();
        gameData.alterGamePhase();
        //phase
        executeGamephaseCommand(mouse.x, mouse.y, gameData.myPlayerNo);
    }
    // console.log("clicked on Element ", staticObj.clicked(mouse.x,mouse.y))
}

function executeGamephaseCommand(xpoint, ypoint, playerNo){
    switch (gameData.gamephase) {
        case 0:
            console.log('phase 0');
            break;
        case 'placeShips':
            placeShips(xpoint, ypoint, playerNo);   
            break; 
        case 'shipFight':
            shipFight();
            gameData.alterGamePhase(); 
            if(gameData.gamephase == "remis"){
                sounds.play(3);
            }
            break; 
        case 'shoot':
            shootShips(); 
            let targets = [];
            targets.push(playerShips.getMainShipTarget(gameData.myPlayerNo));
            //toDo: bug, shoot at not clickable field
            //bei ungültigem click aimt player immer auf 
            if(validField() > -1 && validField()%2 == 0){
                if(gameData.gameMode == "vsKi"){
                    shootShipsKi(gameData.kiPlayerNo);
                    targets.push(playerShips.getMainShipTarget(gameData.enemyPlayerNo));
                }
                fireLaser(targets); 
                checkForWin(); 
            }
            break;
        default:
          console.log("error: phase not found");
    }
    gameData.alterGamePhase();
}

function checkForWin(){
    gameData.alterGamePhase();
    switch (gameData.gamephase) {
        case 0:
            console.log('phase 0 checkForWin');
        case 'p1Wins':
            if(gameData.myPlayerNo == 1){
                sounds.play(4); 
            } else {
                sounds.play(3);
            }
            break;
        case 'p2Wins':
            if(gameData.myPlayerNo == 1){
                sounds.play(3); 
            } else {
                sounds.play(4);
            }
            // attackCapitalShip();
            break;
        default:
          console.log("error: phase not found");
    }
}

//***************** Phase 1 place ships *****************
//***************** canvas Mouse *****************
function placeShips(xpoint, ypoint, playerNo){
    let pShips;
    if (playerNo == 1){
        pShips = playerShips.p1ShipsPos;
    }
    if (playerNo == 2){
        pShips = playerShips.p2ShipsPos;
    }
    //click auf einem validen Feld Spieler2 unten?
    validMove = false;
    let arrPlace = validField();
    //3te Bedingung: Unteres Wasserzeichen; 4te Bedingung: darf nicht belegt sein 
    if (arrPlace > -1 && gameData.gamephase == "placeShips" && arrPlace%2 != 0 && pShips.includes(arrPlace) == false){
        validMove = true;
    }
    if(validMove == true && xpoint < document.getElementById("shipsinkCanvas").clientWidth && ypoint < document.getElementById("shipsinkCanvas").clientHeight){
        //''TEST
        sounds.play(1);
        gameData.playerShipCountUp(playerNo,1);
        fieldObjDef.ship.x = 0;
        fieldObjDef.ship.y = 500;
        fieldObjDef.ship.xend = mouse.x;
        fieldObjDef.ship.yend = mouse.y;  
        fieldObjDef.ship.arrayplace =  arrPlace;
        movableObj.add(fieldObjDef.ship);
        playerShips.add(playerNo,arrPlace);
        startLoop();       
    }
}

function placeShipsKi(playerNo){
    let arrPlaceArray = [];
    let max = staticObj.objNo.length-2;
    for(let i = 0; i < max; i +=2){
        arrPlaceArray.push(i)
    }
    arrPlaceArray = shuffle(arrPlaceArray);
    arrPlaceArray = arrPlaceArray.slice(0,gameData.kiPlayerMaxShips);
    arrPlaceArray.forEach(function (item, index) {
        playerShips.add(playerNo,item);
        gameData.playerShipCountUp(playerNo,1);
    });
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}



function shipFight(){
    for(let i = 0; i <staticObj.objNo.length-2; i +=2){
        if(playerShips.p1ShipsPos.includes(i) && playerShips.p2ShipsPos.includes(i+1)){
        //kill one ship of each player, as one is on top the other at bottom
        sounds.play(4);
        killShip(i,fieldObjDef.xwingKilled.src);
        killShip(i+1,fieldObjDef.shipKilled.src);
        //hint: gameData.playerShipCountDown(playerNo, number)
        gameData.playerShipCountDown(1,1);
        gameData.playerShipCountDown(2,1);
        }
    }
}



function shootShips(){
    let arrPlace = validField();
    if(arrPlace >= 0 && arrPlace%2 == 0){
        //all laser fired on a position of ship of p1
        if(playerShips.p1ShipsPos.includes(arrPlace)){
            //if ship is not already dead 
            if(staticObj.objNo[arrPlace].src != fieldObjDef.shipKilled.src){
                gameData.p1PlacedShips -=1;
                sounds.play(4);
                //won; all ships destroyed
                if(gameData.p1PlacedShips == 0){
                    sounds.play(2);
                }
            }
            killShip(arrPlace,fieldObjDef.xwingKilled.src);
        } else {
            staticObj.objNo[arrPlace].src = JSON.parse(JSON.stringify(fieldObjDef.empty.src));
        }
        sounds.play(0);
        playerShips.setMainShipLaserTarget(gameData.myPlayerNo,mouse.x, mouse.y);
        // fireLaser(playerShips.getMainShipTarget(gameData.myPlayerNo));
    } 
}

function shootShipsKi(){
    //valid arrays = ungerade
    let arrPlaceArray = [];
    // let max = staticObj.objNo.length-2;
    // for(let i = 1; i < max; i +=2){
    //     arrPlaceArray.push(i)
    // }
    //random
    // arrPlaceArray = shuffle(arrPlaceArray);
    // arrPlaceArray = arrPlaceArray.slice(0,1);

    arrPlaceArray = kiData.getNextTarget();
    //tpDo: später ändern, da nur kopiert
    let arrPlace = arrPlaceArray;
    if(arrPlace >= 0 && arrPlace%2 != 0){
        //all laser fired on a position of ship of p1
        if(playerShips.p2ShipsPos.includes(arrPlace)){
            //if ship is not already dead 
            if(staticObj.objNo[arrPlace].src != fieldObjDef.shipKilled.src){
                gameData.p2PlacedShips -=1;
                sounds.play(4);
            }
            killShip(arrPlace,fieldObjDef.shipKilled.src);
        } else {
            staticObj.objNo[arrPlace].src = JSON.parse(JSON.stringify(fieldObjDef.empty.src));
        }
        sounds.play(0);
        playerShips.setMainShipLaserTarget(gameData.enemyPlayerNo,staticObj.objNo[arrPlace].x, staticObj.objNo[arrPlace].y);
    } 
}

function killShip(arrPlace, src){
    staticObj.objNo[arrPlace].src = JSON.parse(JSON.stringify(src));
}

//nachher weg
function validField(){
    let valid = -1;
    for(let i= 0; i <staticObj.objNo.length - 2; i++){ //letzten 2 sind basen
        //im viereck
        if(mouse.x >= staticObj.objNo[i].x && mouse.y >= staticObj.objNo[i].y){
            if(mouse.x <= staticObj.objNo[i].x + staticObj.objNo[i].width  && mouse.y <= staticObj.objNo[i].y + staticObj.objNo[i].height){
                valid = i;
                // console.log("place ship at ", i);
            }
        } else {
            // console.log("error", i);
        }
    }
    return valid;
}

function placeEnemies(){
    gsetShootStaticObjects();
}

function gsetShootStaticObjects(){
    // show enemy waterpoints
    for(let i = 0; i < staticObj.objNo.length; i +=2 ){
        staticObj.objNo[i].src = JSON.parse(JSON.stringify(fieldObjDef.waterpoint.src));
    }
    //hide own enemy waterpoints
    for(let i = 1; i < staticObj.objNo.length; i +=2 ){
        if(!playerShips.allShipsPos.includes(i)){
            staticObj.objNo[i].src = "";
        }
    }
    addMainShips();
    drawObjects();
}


//Momentan nicht implementiert
// function attackCapitalShip(xpoint, ypoint, playerNo){
function attackCapitalShip(){
    let tmpShip;
    if (gameData.gamephase = "p1Wins"){
        tmpShip =  JSON.parse(JSON.stringify(fieldObjDef.xwing));
        tmpShip.x = 0;
        tmpShip.y = 0;
        tmpShip.xend = 100;
        tmpShip.yend = 300;  
    }
    if (gameData.gamephase == "p2Wins"){
        tmpShip =  JSON.parse(JSON.stringify(fieldObjDef.ship));
        tmpShip.x = 0;
        tmpShip.y = 500;
        tmpShip.xend = 50;
        tmpShip.yend = 50;  
    }
    //''TEST
    sounds.play(1);
    // fieldObjDef.ship.arrayplace =  arrPlace;
    movableObj.add(tmpShip);
    // playerShips.add(playerNo,arrPlace);
    startLoop();       
}


