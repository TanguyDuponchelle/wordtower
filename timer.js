let seconds = 30;
let miliseconds = 100;
document.getElementById('countdown').innerHTML = seconds + "." + miliseconds + "s before <i class='fas fa-skull-crossbones'></i>";
const timerSeconds = setInterval(()=>{
  seconds--;
  document.getElementById('countdown').innerHTML = seconds + "." + miliseconds + "s before <i class='fas fa-skull-crossbones'></i>";
  if (seconds < 0) {
    clearInterval(timerSeconds);
    clearInterval(timerMiliseconds);
    document.getElementById('countdown').innerHTML = 0 + "." + 0 + "s before <i class='fas fa-skull-crossbones'></i>";
    gameOver=true;
  }
},1000)
const timerMiliseconds = setInterval(()=>{
  miliseconds--;
  document.getElementById('countdown').innerHTML = seconds + "." + miliseconds + "s before <i class='fas fa-skull-crossbones'></i>";
  miliseconds < 10 ? miliseconds = 100 : miliseconds = miliseconds;
  miliseconds === 0 ? miliseconds = 100 : miliseconds = miliseconds;
},1)