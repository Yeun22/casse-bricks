var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var interval = setInterval(draw, 8);

let x = canvas.width/2;
let y = canvas.height-30;
let dx= 2;
let dy = -2;

let ballRadius = 10;
let colorBall = "green";

let score = 0;


//LA RAQUETTE : 
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth)/2 // on définit largeur, hauteur et point de départ de la raquette sur x

//LES TOUCHES :

var rightPressed = false;
var leftPressed = false;

//MISE EN PLACE DE VARIABLES BRIQUES :

let brickRowCount = 6;
let brickColumnCount = 10;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10; // pour pas qu'elles se touchent
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

//fonction d'affichage des briques --> Cela va parcourir les lignes et colone pour créer les briques.
let bricks = [];
for(let c=0; c<brickColumnCount; c++){
    bricks[c] = [];
    for(let r=0; r<brickRowCount; r++){
        bricks[c][r] = {x:0, y:0, status: 1}; //status va nous permettre de faire disparaitre la brique
    }
}

//Dessinons les Briques
function drawBricks(){
    for(let c=0; c<brickColumnCount; c++){
        for(let r=0; r<brickRowCount; r++){
            if(bricks[c][r].status == 1){ //si le stauts est passé à zéro il ne faut pas afficher les briques
                let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft; // Calcul pour décaler les briques et pas à chaque fois
                let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop// les dessiner à 0,0
                bricks[c][r].x= brickX;
                bricks[c][r].y= brickY;
                ctx.beginPath();
                ctx.rect(brickX,brickY,brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}


function drawBall(){
    //dessinons la balle
    ctx.beginPath();
    ctx.arc(x,y, ballRadius,0, Math.PI*2);
    ctx.fillStyle = colorBall; // Stocke une couleur qui sera récupérée par fill. fill remplit en couleur stroke seulement le contour.
    ctx.fill();
    ctx.closePath();
}


function drawPaddle(){
    //on dessine la raquette
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle ="black";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20); //on dessine sur la raquette alors on met les positions.
}



function draw(){

    //on efface la trainée précédente
    ctx.clearRect(0,0, canvas.width, canvas.height);

    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    // On detecte une collision pour inverser la balle | Enlever ballRadius permet de détecter la collison au bord et no à l'axe de la balle
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
        colorBall = "red";
    }
    if(y + dy < ballRadius) {
        dy = -dy;
        colorBall="green";
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            colorBall="yellow";
        }
        else {
            alert("Game Over ! Try Again ! " + "Your Score is : " + score)
            document.location.reload();
            clearInterval(interval);
        }
    }
    if(x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
        dx = -dx;
        colorBall = "blue";
    }
  

    
    //on bouge la raquette
    if(rightPressed && paddleX < canvas.width - paddleWidth){
        paddleX += 7;
    
    }
    else if(leftPressed && paddleX > 0){
        paddleX -=7;
    }

      //on bouge la balle
      x +=dx;
      y +=dy;
}






document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove",mouseMoveHandler,false);



function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e){
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX<canvas.width){
        paddleX = relativeX - paddleWidth/2;
    }
}



function collisionDetection(){
    for (let c=0; c<brickColumnCount; c++){
        for(r=0; r<brickRowCount; r++){
            let brickObject = bricks[c][r];
            if(brickObject.status == 1){
                //calculs 4 conditions doivent être vrai : x balle > x brique, xballe< xbrique + largeur, y balle> y brique, y balle < y brick + largeur
                if(x> brickObject.x && x < brickObject.x + brickWidth && y> brickObject.y && y < brickObject.y+ brickHeight){
                    dy= -dy;
                    brickObject.status = 0 ;
                    score++;
                    colorBall = "purple";
                    if(score == brickColumnCount*brickRowCount){
                        alert("C'est Gagné ! Félicitations !");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}


