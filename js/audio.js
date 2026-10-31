
var audioCtx=null, soundOn=true;
function initAudio(){
  if(!audioCtx){
    try{
      audioCtx=new (window.AudioContext||window.webkitAudioContext)();
      if(audioCtx.state==='suspended') audioCtx.resume();
    }catch(e){}
  }else{
    if(audioCtx.state==='suspended'){ try{ audioCtx.resume(); }catch(e){} }
  }
}
function playTone(f,d,t,v){
  if(!soundOn) return;
  initAudio();
  if(!audioCtx) return;
  try{
    if(audioCtx.state==='suspended') audioCtx.resume();
    var o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.type=t||'sine'; o.frequency.value=f;
    o.connect(g); g.connect(audioCtx.destination);
    g.gain.setValueAtTime(v||0.3, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime+d);
    o.start(); o.stop(audioCtx.currentTime+d);
  }catch(e){ console.error('Audio error', e); }
}
function playTick(){ playTone(800,0.1,'sine',0.15); }
function playCorrect(){ playTone(523,0.15,'sine',0.4); setTimeout(function(){playTone(659,0.15,'sine',0.4)},120); setTimeout(function(){playTone(784,0.3,'sine',0.5)},240); }
function playWrong(){ playTone(200,0.4,'sawtooth',0.3); }
function playFlip(){ playTone(600,0.08,'triangle',0.2); }
function playTrophy(){ playTone(400,0.2,'sine',0.5); setTimeout(function(){playTone(600,0.2,'sine',0.5)},150); setTimeout(function(){playTone(800,0.4,'sine',0.6)},300); }
function playTimerLow(){ playTone(300,0.2,'square',0.2); }
function toggleSound(){ soundOn=!soundOn; var b=document.getElementById("soundBtn"); if(b) b.innerText=soundOn?"🔊":"🔇"; if(soundOn){initAudio(); playCorrect();} localStorage.setItem("soundOn", soundOn?"1":"0"); }
var savedSound=localStorage.getItem("soundOn"); if(savedSound==="0"){ soundOn=false; }
