const gameData ={
    myPlacedShipsTotal: 0,
    placeShipsToStart: 4,
    p1PlacedShips: 0, 
    p2PlacedShips: 0,
    myPlayerNo: -1,
    enemyPlayerNo: -1,
    kiPlayerNo: -1,
    kiPlayerMaxShips: 4,
    gamephase: "placeShips",
    gameMode: "",
    alterGamePhase: function() {
        if (this.gamephase == "p1Wins" || this.gamephase == "p2Wins"){
            this.gamephase = "gameOver";
        }
        if (this.gamephase == "shipFight"){
            this.gamephase = "shoot";
        }
        if (this.gamephase == "placeEnemyShips"){
            this.gamephase = "shipFight";
        }
        if (this.myPlacedShipsTotal === this.placeShipsToStart && this.gamephase == "placeShips"){
            this.gamephase = "placeEnemyShips";
        }
        if (this.gamephase == "shoot"){
            if(this.p1PlacedShips == 0){
                this.gamephase = "p2Wins";
            }
            if(this.p2PlacedShips == 0){
                this.gamephase = "p1Wins";
            }
            if(this.p1PlacedShips == 0 && this.p2PlacedShips == 0){
                this.gamephase = "remis";
            } 
        }
    },
    reset: function(){
        this.gamephase = "placeShips",
        this.myPlacedShipsTotal= 0,
        this.placeShipsToStart = 4,
        this.p1PlacedShips = 0,
        this.p2PlacedShips = 0,
        this.myPlayerNo = -1,
        this.kiPlayerNo = -1
    },
    playerShipCountUp: function(playerNo, number){
        if (playerNo == 1){
            this.p1PlacedShips += number;
        }
        if (playerNo == 2){
            this.p2PlacedShips += number;
        }
        this.myPlacedShipsTotal += number;
    },
    playerShipCountDown: function(playerNo, number){
        if (playerNo == 1){
            this.p1PlacedShips -= number;
        }
        if (playerNo == 2){
            this.p2PlacedShips -= number;
        }
    },
    arrivedObj: 0
}

//!!! preload Images in shipgame.html
const fieldObjDef = gsetFieldObjects();
function gsetFieldObjects(){
    let x = 0;
    let y = 0; 
    let width = 50;
    let height = 50; 
    let tmpfieldObject = {
        empty: {src: "shipgame/assets/empty.jpg", x:x, y:y, xend:x, yend:y, width:width, height:height, destroyed: false},
        ship: {src: "shipgame/assets/ship.jpg", x:x, y:y, xend:x, yend:y, width:width, height:height, owner:"", arrived:0, arrayplace:-1, destroyed: false},
        waterpoint: {src: "shipgame/assets/waterpoint.jpg", x:x, y:y, xend:x, yend:y, width: width, height: height, destroyed: false},
        shipKilled: {src: "shipgame/assets/shipKilled.jpg", x:x, y:y, xend:x, yend:y, width:width, height:height, destroyed: false},
        xwing: {src: "shipgame/assets/xwing.jpg", x:x, y:y, xend:x, yend:y, width:width, height:height, owner:"", arrived:0, arrayplace:-1, destroyed: false},
        xwingKilled: {src: "shipgame/assets/xwingKilled.jpg", x:x, y:y, xend:x, yend:y, width:width, height:height, owner:"", arrived:0, arrayplace:-1, destroyed: false},
        laser:{src: "", xstart:0, ystart:600, xend:400, yend:150, aimx:400, aimy:500},
        mainshipE:{
            src: "shipgame/assets/mainshipE.jpg",
            x:x, y:y,
            xend:x, yend:y,
            width:400, height:100,
            destroyed: false,
            target:{src: "", xstart:5, ystart:0,  xaim:0, yaim:0} //example: xstart =xaim means laser of 0 lenght
        },
        mainshipR:{
            src: "shipgame/assets/mainshipR.jpg",
            x:x, y:y,
            xend:x, yend:y,
            width:300, height:100,
            destroyed: false,
            target:{src: "", xstart:5, ystart:100,  xaim:0, yaim:0} //example: xstart =xaim means laser of 0 lenght
        },
    }
    return tmpfieldObject
}

const sounds ={
    play: function(id){
        if (id === 0){
            let laserSound = new Audio("shipgame/assets/sounds/laser.mp3");
            laserSound.play();
        }
        if (id === 1){
            let tie = new Audio(`shipgame/assets/sounds/tiePlacement.mp3`);
            tie.play();
        }
        if (id === 2){
            let win = new Audio(`shipgame/assets/sounds/winFanFar.mp3`);
            win.play();
        }
        if (id === 3){
            let lose = new Audio(`shipgame/assets/sounds/p_lose.mp3`);
            lose.play();
        }
        if (id === 4){
            let boom = new Audio(`shipgame/assets/sounds/boom.wav`);
            boom.play();
        }
    }
}


const staticObj = {
    objNo: [],
    add: function (obj) { 
        let tmp={};
        Object.assign(tmp, obj);
        this.objNo.push(tmp);
    },
    reset: function () {
        this.objNo = []
    },
    clicked: function(x, y){
        //check if clicked inside rect of object and return arrayplace
        for(let i = 0; i < this.objNo.length; i++){
            if(x > this.objNo[i].x && y > this.objNo[i].y){ //top left coordinate
                if(x < this.objNo[i].x + this.objNo[i].width  && y < this.objNo[i].y + this.objNo[i].height){ //bottom right coordinate
                    return  i;
                }
            }
        }
        return -1;
    },
    hide: function(id){
        this.objNo[id].src = "";
    }
}

const movableObj = {
    objNo: [],
    add: function (obj) { 
        let tmp={};
        Object.assign(tmp, obj);
        this.objNo.push(tmp);
    },
    reset: function () { this.objNo = [] },
    clicked: function(x, y){
        //check if clicked inside rect of object and return arrayplace
        if(x > objNo[i].x && y > objNo[i].y){ //top left coordinate
            if(x < objNo[i].x + objNo[i].width  && y < objNo[i].y + objNo[i].height){ //bottom right coordinate
                return  i;
            }
        } else{
            return -1
        }
    }
}

const playerShips = {
    //positions are ArrayNo of staticObj.objNo
    p1ShipsPos: [],
    p2ShipsPos: [],
    allShipsPos: [], 
    mainShips: [0, 1, 2], //dummy parameter for players
    add: function (playerNo,posno) { 
        if(playerNo == 1){
            this.p1ShipsPos.push(posno);
        }
        if(playerNo == 2){
            this.p2ShipsPos.push(posno);
        }
        this.allShipsPos.push(posno);
    },
    adMainShip(playerNo,ship){
        this.mainShips[playerNo] = ship;    
    },
    setMainShipLaserTarget(playerNo, x, y){
        this.mainShips[playerNo].target.xaim = x;  
        this.mainShips[playerNo].target.yaim = y;  
    },
    getMainShipTarget(playerNo){
        return this.mainShips[playerNo].target;
    },
    reset: function () {
        this.p1ShipsPos = [];
        this.p2ShipsPos = [];
        this.allShipsPos = [];
    }
}

const kiData = {
    //positions are ArrayNo of staticObj.objNo
    targetArray: [],
    createMainshipTargetArray: function (lenght) { 
        //valid arrays = ungerade
        let arrPlaceArray = [];
        for(let i = 1; i < lenght; i +=2){
            arrPlaceArray.push(i)
        }
        //random
        arrPlaceArray = this.shuffle(arrPlaceArray);
        this.targetArray = arrPlaceArray;
    },
    getNextTarget: function(){
        try{
            return this.targetArray.pop();
        } catch {
            return -1
        }
    },
    reset: function () {
        targetArray = [];
    },
    shuffle: function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
}














