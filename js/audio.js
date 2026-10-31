export let audioCtx=null, soundOn=true;
export function initAudio(){ if(!audioCtx){ audioCtx=new (window.AudioContext||window.webkitAudioContext)(); } }
export function playTone(f,d,t,v){ if(!soundOn) return; initAudio(); var o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.type=t||'sine'; o.frequency.value=f; o.connect(g); g.connect(audioCtx.destination); g.gain.setValueAtTime(v||0.3, audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime+d); o.start(); o.stop(audioCtx.currentTime+d); }
export function playTick(){ playTone(800,0.1,'sine',0.15); }
export function playCorrect(){ playTone(523,0.15,'sine',0.4); setTimeout(()=>playTone(659,0.15,'sine',0.4),120); setTimeout(()=>playTone(784,0.3,'sine',0.5),240); }
export function playWrong(){ playTone(200,0.4,'sawtooth',0.3); }
export function playFlip(){ playTone(600,0.08,'triangle',0.2); }
export function playTrophy(){ playTone(400,0.2,'sine',0.5); setTimeout(()=>playTone(600,0.2,'sine',0.5),150); setTimeout(()=>playTone(800,0.4,'sine',0.6),300); }
export function playTimerLow(){ playTone(300,0.2,'square',0.2); }
export function toggleSound(){ soundOn=!soundOn; document.getElementById("soundBtn").innerText=soundOn?"🔊":"🔇"; if(soundOn){initAudio(); playCorrect();} }
