let gamemodel = gsetFieldObjects();
function gsetFieldObjects(){
    let x = 0;
    let y = 0; 
    let width = 50;
    let height = 50; 
    let tmpfieldObject = {
        empty: {src: "shipgame/assets/empty.jpg", x:x, y:y, xend:x, yend:y, width:width, height:height},
        ship: {src: "shipgame/assets/ship.jpg", x:x, y:y, xend:x, yend:y, width:width, height:height},
        waterpoint: {src: "shipgame/assets/waterpoint.jpg", x:x, y:y, xend:x, yend:y, width:width, height:height},
        shipKilled: {src: "shipgame/assets/shipKilled.jpg", x:x, y:y, xend:x, yend:y, width:width, height:height}
    }
    return tmpfieldObject
}







