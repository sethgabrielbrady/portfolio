
const MoveDist = 5;        //default 10
const BaseSpeed = 600;     //default 600
const BuggPopulation = 10; //default 10

let buggC = document.getElementsByClassName("bugg");
let yPos = document.getElementById("yPos");
let xPos = document.getElementById("xPos");
let windowDim = document.getElementById("windowDim");
let buggField = document.getElementById("buggField");
let winY = window.innerWidth;
let winX = window.innerHeight;
let buggCount = 0;
let startCount = 0;
let buggyCount = 0;
let newBugg;
let buggArray = [];
let collisonCount = 0;
windowDim.innerHTML = "Height:  " + winX +"  Width:  " + winY;

//Bugg Constuctor
function Bugg (name){
  buggyCount = buggyCount + 1;
  let rngSpeedModifier;
  let rngX;
  let rngy;

  rngX = rngControl(winX);
  rngY = rngControl(winY);
  buggR = rngControl(255);
  buggG = rngControl(255);
  buggB = rngControl(255);
  rngSpeedModifier = rngControl(10);
  buggSex = rngControl(2);
  buggCount = buggCount + 1;

  if (buggSex === 1){
    this.sex = 'O';
    this.buggColor = "rgb("+59+"," +70+","+ 241+");";
  }else {
    this.sex = 'X';
    this.buggColor = "rgb("+230+"," +167+","+ 26+");";
  }

  this.name = name;
  this.number = buggCount;
  this.buggSpeed = BaseSpeed * (rngSpeedModifier/10);
  this.health = rngControl(10);
  this.startXY = [rngX, rngY];
  // this.buggColor ="rgb("+buggR+","+ buggG+","+ buggB+");";


  // this.stats = name +'s stats are: Speed: ['+
  //             this.buggSpeed +'], ID:['+
  //             this.number+'], XY POS: ['+
  //             this.startXY + '],  health: ['+
  //             this.health + '], color: ['+
  //             this.buggColor +'], sex: ['+
  //             this.sex +']';
  // console.log(this.stats);
}

//RNG Controller
function rngControl(number){
  let newNum = Math.floor((Math.random() * number) + 1);
  return newNum;
}

//Controls the random movement
function buggMovement(buggID){
  let buggMade = buggID;
  buggEL = buggID;
  buggMade = new Bugg(buggID);
  let buggNew = document.getElementById(buggEL);
  let moveSpeed = buggMade.buggSpeed;
  let bColor = buggMade.buggColor;
  let buggObject = {name: buggID,xPOS: 0,yPOS: 0};
  buggArray.push(buggObject);
  //set the random position inside start
  let buggXPos = rngControl(winX);
  let buggYPos = rngControl(winY);

  setInterval(function(){
    //will update the new buggObject properties at each interval
    buggObject.xPOS = buggXPos;
    buggObject.yPOS = buggYPos;

    //keep this inside the setInterval function.
    let rngMove = rngControl(4);
    //stops everything if a bugs goes out of bounds
    if (buggXPos >= winX || buggXPos <= 0){
      return 0;
    }
    if (buggYPos >= winY || buggYPos <= 0){
      return 0;
    }

    if (rngMove === 1){
      if (buggYPos <= 50){
        buggYPos = buggYPos + MoveDist;
      }else{
        buggYPos = buggYPos - MoveDist;
      }
      buggNew.setAttribute("style","left:" + (buggYPos) + "px; top:"+ buggXPos+"px; border-left:4px solid white; background-color:"+bColor+'"');
    }else if (rngMove === 2){
      if (buggYPos >= winY - 50){
        buggYPos = buggYPos - MoveDist;
      }else{
        buggYPos = buggYPos + MoveDist;
      }
      buggNew.setAttribute("style","left:" + (buggYPos) + "px; top:"+ buggXPos+"px; border-right:4px solid white;  background-color:"+bColor+'"');
    }else if (rngMove === 3){
      if (buggXPos >= winX - 50){
        buggXPos = buggXPos - MoveDist;
      }else {
        buggXPos = buggXPos + MoveDist;
      }
      buggNew.setAttribute("style","top:" + (buggXPos) + "px; left:"+ buggYPos+"px; border-bottom:4px solid white; background-color:"+bColor+'"');
    }else if (rngMove === 4){
      if (buggXPos <= 50){
        buggXPos = buggXPos + MoveDist;
      }else{
        buggXPos = buggXPos - MoveDist;
      }
      buggNew.setAttribute("style","top:"+ (buggXPos) + "px; left:"+ buggYPos+"px; border-top:4px solid white; background-color:"+bColor+'"');
    }
    return buggArray;
  }, moveSpeed);
}

//collision detection function
function buggPositionCheck(arrayData){
  //needs much refinement
  let checkSpeed = BaseSpeed;
  let buggPop = BuggPopulation;

  setInterval(function(){
    for (i=0; i<= buggPop; i++){
      for (j=i+1; j< buggPop; j++){
         let bugg_data = ( arrayData[i].name + "[X" + arrayData[i].xPOS+",Y"+ arrayData[i].yPOS+"]," + arrayData[j].name + "[X" + arrayData[j].xPOS +",Y"+  arrayData[j].yPOS+"]" );
         console.log(bugg_data);
         // document.getElementById("bugg_data").innerHTML = bugg_data;
        if( arrayData[i].xPOS === arrayData[j].xPOS + 50 || arrayData[i].xPOS === arrayData[j].xPOS-50 ){
          if(arrayData[i].yPOS === arrayData[j].yPOS - 50 || arrayData[i].yPOS === arrayData[j].yPOS + 50 ){
            collisonCount = collisonCount + 1;
            document.getElementById("count").innerHTML = collisonCount;
            console.log("POSIITON X MATCHES");
          }
        }
      }
    }
  }, checkSpeed);
}

//Start Function
function startFunction(count){
  count = BuggPopulation;
  startCount = startCount + 1;
  if (startCount > 1 ||  startCount <1){
    console.log("You've already started.");
  }else{
     for (let i = 1; i<=count; i++){
       newBugg = '<div id="bugg' + i +  '" class="bugg"><p class="buggMark">'+i+'</p></div>';
       buggField.insertAdjacentHTML('beforeend', newBugg);
       buggMovement("bugg".concat(i));
       buggPositionCheck(buggArray);
    }
  }
}