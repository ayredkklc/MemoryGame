//global variables
var pattern = [];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;
var guessLeft = 3;
// global constants
var clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//for tracking time
var timer;
var gameTime = (60 * 1/60);
//Page Initialization
// Init Sound Synthesizer
//var AudioContext = (window as any).webkitAudioContext; // Default

var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0,context.currentTime);
o.connect(g);
o.start(0);

function startGame(){
    //initialize game variables
    randomPattern()
    progress = 0;
    gamePlaying = true;
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    playClueSequence()
}

function stopGame(){
    
    gamePlaying = false;
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
    timer = 0;
    clueHoldTime = 1000;
}

function randomPattern(){
  for(var i = 0;i<=8;i++){
      pattern[i]= Math.floor((Math.random() * (7) + 1));
 }
  return pattern;
}

//pattern = randomPattern();

// Sound Synthesis Functions
const freqMap = {
  1: 261.626,
  2: 293.665,
  3: 329.628,
  4: 349.228,
  5: 391.995,
  6: 440.000
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}



function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}
function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}
function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
    clueHoldTime -=20;
  }
  //clueHoldTime = clueHoldTime - 300;
}
function winGame(){
  stopGame();
  alert("Congratulations. You won!!");
  timer =0;
}
function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
  
}
/*function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  for(let i=0;i<=progress;i++){
    if(btn != pattern[i]){
      return loseGame();
    }else{
      if(guessCounter != (i - 1)){
         guessCounter += 1;
         console.log("hi")
      }else{
         if(progress == 8){
           return winGame(0);
         }else{
           progress +=1;
           console.log("hi2")
           playClueSequence();
         }
      }
    }
    
  }

  // add game logic here
}*/
function guess(btn){
  console.log("user guessed: " + btn);

  if(!gamePlaying){
    return;
  }

  if(pattern[guessCounter] == btn){
    //Guess was correct!
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        //GAME OVER: WIN!
        winGame();
      }else{
        //Pattern correct. Add next segment
        progress++;
      
        playClueSequence();
      }
    }else{
      //so far so good... check the next guess
      guessCounter++;
    }
  }else{
    //Guess was incorrect
    //GAME OVER: LOSE!
    guessLeft--;
    if(guessLeft > 0){
        alert("You lost a life. You have " + guessLeft+ " lives left");
    }else{
      loseGame();
    }
  }

}    