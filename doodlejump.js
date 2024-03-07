let board;
let boardWidth = 360;
let boardHeight = 576;
let context;
//doddle
let doodlerWidth = 46;
let doodlerHeight= 46;
let doodlerX=boardWidth/2-doodlerWidth/2;
let doodlerY=boardHeight*7/8-doodlerHeight;
let doodlerleftImg;
let doodlerrightImg;

let score=0;
let maxscore=0;
let gameover = false;

//velocity
let velocityX=0;
let platformArray = 0;
let platformWidth = 60;
let platformHeight = 18;
let platformImg;
let velocityY= 0;
let initialVelocityY= -8;
let gravity=0.4;

let doodler={
    img: null,
    x : doodlerX,
    y : doodlerY,
    width: doodlerWidth,
    height : doodlerHeight
}


window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.weight = boardWidth;
    context = board.getContext("2d");

    /*context.fillStyle="green";
    context.fillRect(doodler.x,doodler.y,doodler.width, doodler.width, doodler.height);*/

    doodlerrightImg = new Image();
    doodlerrightImg.src = "./doodler-right.png";
    doodler.img=doodlerrightImg;
    doodlerrightImg.onload = function(){
        context.drawImage(doodler.img,doodler.x,doodler.y,doodler.width,doodler.height);
    }
    doodlerleftImg=new Image();
    doodlerleftImg.src="./doodler-left.png";

    platformImg=new Image();
    platformImg.src="./platform.png";

    velocityY= initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
}
function update(){
    requestAnimationFrame(update);
    if (gameover){
        return;
    }
    context.clearRect(0,0, board.width,board.height);


    doodler.x += velocityX;
    if (doodler.x>boardWidth){
        doodler.x=0;
    }
    else if(doodler.x + doodler.width < 0){
        doodler.x=boardWidth;
    }
    context.drawImage(doodler.img,doodler.x,doodler.y,doodler.width,doodler.height);

    velocityY += gravity;
    doodler.y += velocityY;
    if(doodler.y>board.height){
        gameover = true;
    }
    //platform
    for(let i=0; i<platformArray.length;i++){
        let platform = platformArray[i];
        if(velocityY<0 && doodler.y < boardHeight*3/4){
            platform.y-=initialVelocityY;//slide platform down
        }
        if(detectCollision(doodler,platform)&& velocityY>=0){
            velocityY = initialVelocityY;//jump
        }
        context.drawImage(platform.img, platform.x, platform.y ,platform.width, platform.height);
    }
    while(platformArray.length >0 && platformArray[0].y>=boardHeight){
        platformArray.shift();//removes first elemtnt
        newplatform ();
    }
    updatescore();
    context.fillStyle="black";
    context.font = "16px sans-serif";
    context.fillText(score,5,20);

    if(gameover){
        context.fillText("GameOver: 'Space' to Restart", boardWidth/7,boardHeight*7/8);
    }

}

function moveDoodler(e){
    if(e.code == "ArrowRight"|| e.code=="KeyD"){
    velocityX = 4;
    doodler.img = doodlerrightImg;
    }
    else if( e.code=="ArrowLeft"|| e.code=="KeyA"){
        velocityX=-4;
        doodler.img = doodlerleftImg;
    }
    else if(e.code=="space" && gameover){
        //reset
        doodler={
            img: doodlerrightImg,
            x : doodlerX,
            y : doodlerY,
            width: doodlerWidth,
            height : doodlerHeight
        }
        velocityX=0;
        velocityY=initialVelocityY;
        score=0;
        maxscore=0;
        gameover=false;
        placePlatforms();
    }
}
function placePlatforms(){
    platformArray=[];
    let platform={
        img:platformImg,
        x: boardWidth/2,
        y: boardHeight - 50,
        width: platformWidth,
        height: platformHeight
    }
    platformArray.push(platform);
    /*platform={
        img:platformImg,
        x: boardWidth/2,
        y: boardHeight - 150,
        width: platformWidth,
        height: platformHeight
    }
    platformArray.push(platform);*/
    for(let i=0; i<6;i++){
        let randomX= Math.floor(Math.random()*boardWidth*3/4);
        let platform={
            img:platformImg,
            x: randomX,
            y: boardHeight-75*i - 150,
            width: platformWidth,
            height: platformHeight
        }
        platformArray.push(platform);
    }
}
function newplatform(){
    let randomX= Math.floor(Math.random()*boardWidth*3/4);
    let platform={
        img:platformImg,
        x: randomX,
        y: -platformHeight,
        width: platformWidth,
        height: platformHeight
    }
    platformArray.push(platform);
}

function detectCollision(a,b){
    return a.x< b.x+b.width && a.x + a.width > b.x && a.y< b.y+b.height && a.y+ a.height>b.y;
     
}
function updatescore(){
    let points = Math.floor(50*Math.random());
    if (velocityY<0){
        maxscore += points;
        if(score<maxscore){
            score=maxscore;
        }
    }
    else if(velocityY>=0){
        maxscore-= points;
    }
}
    
