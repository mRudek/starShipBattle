
// ***************** loop controll *****************
function startLoop_Test(){
    startLoop();
    console.log("startStopLoop clicked ");
}

function startStopLoop_Test(){
    startStopLoop();
    console.log("startStopLoop_Test clicked ");
}

// ***************** canvas gamePhase controlls *****************
function startNewRound_Test(){
    starNewRound();
    console.log("startNewRound_Test clicked ");
}

// ***************** canvas Size controlls *****************
function setCanvasSize_Test(){
    let width = document.getElementById("widthtest").value;
    let height = document.getElementById("heighttest").value;
    setCanvasSize(width, height);
    console.log("setCanvasSize_Test clicked ", width, " ", height);
}

function setObjects_Test(){
    gsetStaticObjects();
    console.log("setObjects_Test clicked ");
}

function drawObjects_Test(){
    drawObjects();
    console.log("drawObjects_Test clicked ");
}

function deleteObjects_Test(){
    gameData.reset();
    staticObj.reset();
    movableObj.reset();
    playerShips.reset();  
    console.log("deleteObjects_Test clicked ");
}

// ***************** option Size controlls *****************
function hideGameParaDev_Test(){
    document.getElementById("gameParaDev").style.display = "none";
    console.log("hideGameParaDev_Test clicked ");
}

function showGameParaDev_Test(){
    document.getElementById("gameParaDev").style.display = "block";
    console.log("hideGameParaDev_Test clicked ");
}