
var allLevels=[];
var curLevelIdx=0, curQIdx=0, score=0, timeLeft=10, timerInt=null;
var unlocked=parseInt(localStorage.getItem("noor_mixed_final")||"1"); if(isNaN(unlocked)||unlocked<1) unlocked=1;

function initSplash(){
  var s=document.getElementById('splash'); if(!s) return;
  var hide=function(){ s.classList.add('hidden'); setTimeout(function(){ s.style.display='none'; s.style.pointerEvents='none'; },600); };
  setTimeout(hide,3200); s.addEventListener('click',hide); s.addEventListener('touchstart',hide,{passive:true});
}

function applyLanguage(lang){
  if(!uiText[lang]) lang="ur";
  var t=uiText[lang]; var splash=splashText[lang]||splashText.ur;
  var st=document.getElementById("splashTitle"); if(st) st.innerHTML=splash[0];
  var ss=document.getElementById("splashSubtitle"); if(ss) ss.textContent=splash[1];
  localStorage.setItem("appLang",lang);
  document.documentElement.lang=lang;
  document.documentElement.dir=(lang==="ur"||lang==="ar")?"rtl":"ltr";
  var ls=document.getElementById("langSwitcher"); if(ls) ls.value=lang;
  var ht=document.getElementById("homeTitle"); if(ht) ht.innerHTML=t.title;
  var htopics=document.getElementById("homeTopics"); if(htopics) htopics.textContent=t.topics;
  var hl=document.getElementById("homeLevels"); if(hl) hl.textContent=t.levels;
  var hd=document.getElementById("homeDesc"); if(hd) hd.textContent=t.desc;
  var sb=document.getElementById("startBtn"); if(sb) sb.textContent="▶️ "+t.start;
  var ab=document.getElementById("allLevelsBtn"); if(ab) ab.textContent="🎮 "+t.all;
  var rb=document.getElementById("resetBtn"); if(rb) rb.textContent=t.reset;
  var lt=document.getElementById("levelsTitle"); if(lt) lt.textContent=t.levelTitle;
  // Footer translations
  var fp=document.getElementById("fPrivacy"); if(fp) fp.textContent=t.privacy;
  var ft=document.getElementById("fTerms"); if(ft) ft.textContent=t.terms;
  var fa=document.getElementById("fAbout"); if(fa) fa.textContent=t.about;
  var fc=document.getElementById("fContact"); if(fc) fc.textContent=t.contact;
  // Back button text
  var bb=document.getElementById("backBtn"); if(bb) bb.setAttribute("title", t.back);
  // Rebuild questions for this language - CRITICAL FIX
  try{
    if(typeof buildAllLevels !== 'undefined'){
      allLevels=buildAllLevels(lang);
      console.log("✅ Language switched to", lang, "First question:", allLevels[0] && allLevels[0][0] ? allLevels[0][0].q : "none");
    }
  }catch(e){ console.error("buildAllLevels error", e); }
}

function changeLang(l){ 
  try{ initAudio(); }catch(e){}
  applyLanguage(l); 
}

var pageContent={privacy:{titleKey:"privacyTitle",key:"privacy"},terms:{titleKey:"termsTitle",key:"terms"},about:{titleKey:"aboutTitle",key:"about"},contact:{titleKey:"contactTitle",key:"contact"}};
function openPage(n){
  var lang=localStorage.getItem("appLang")||"ur"; var t=uiText[lang]||uiText.ur; var d=pageContent[n]; if(!d) return;
  var f=policyText[lang]||policyText.ur;
  document.getElementById("modalTitle").textContent=t[d.titleKey];
  document.getElementById("modalText").textContent=f[d.key]||policyText.ur[d.key];
  document.getElementById("pageModal").style.display="flex";
  try{ playFlip(); }catch(e){}
}
function closePage(){ document.getElementById("pageModal").style.display="none"; try{ playFlip(); }catch(e){} }

function hideAll(){ ["homePage","levelPage","quizPage","trophy","pageModal"].forEach(function(id){ var e=document.getElementById(id); if(e) e.style.display="none"; }); }
function showHome(){ hideAll(); var e=document.getElementById("homePage"); if(e) e.style.display="flex"; try{ playFlip(); }catch(e){} }
function showLevels(){
  hideAll(); var g=document.getElementById("levelGrid"); if(!g) return; g.innerHTML="";
  for(var i=0;i<100;i++){
    var d=document.createElement("div"); d.className="levelCard "+(i===0?"firstLevel":(i+1<=unlocked?"unlocked":"locked"));
    d.innerHTML="<span>"+(i+1)+"</span>";
    if(i+1<=unlocked){ (function(idx){ d.onclick=function(){ startLevel(idx); }; })(i); }
    g.appendChild(d);
  }
  document.getElementById("levelPage").style.display="flex";
  try{ playFlip(); }catch(e){}
}
function startLevel(idx){ curLevelIdx=idx; curQIdx=0; score=0; hideAll(); document.getElementById("quizPage").style.display="flex"; showQ(); try{ initAudio(); playCorrect(); }catch(e){} }
function resetProgress(){
  var lang=localStorage.getItem("appLang")||"ur";
  if(confirm(uiText[lang].resetConfirm)){ localStorage.removeItem("noor_mixed_final"); unlocked=1; alert(uiText[lang].resetDone); showLevels(); }
}
function showQ(){
  if(!allLevels[curLevelIdx] || !allLevels[curLevelIdx][curQIdx]){ console.error("No question data for", curLevelIdx, curQIdx); return; }
  var data=allLevels[curLevelIdx][curQIdx];
  var lang=localStorage.getItem("appLang")||"ur";
  document.getElementById("levelNo").textContent=curLevelIdx+1;
  document.getElementById("qCount").textContent=(curQIdx+1)+"/10";
  var qEl=document.getElementById("q"); if(qEl) qEl.textContent=data.q;
  var box=document.getElementById("list"); box.innerHTML="";
  timeLeft=10; var timer=document.getElementById("timer"); if(timer) timer.innerText=timeLeft;
  var bar=document.getElementById("bar"); if(bar){ bar.style.width="100%"; }
  clearInterval(timerInt);
  timerInt=setInterval(function(){ timeLeft--; if(timer) timer.innerText=timeLeft; if(bar) bar.style.width=(timeLeft*10)+"%"; if(timeLeft<=3 && timeLeft>0){ try{ playTimerLow(); }catch(e){} } if(timeLeft<=0){ clearInterval(timerInt); autoNext(); } },1000);
  for(var i=0;i<data.o.length;i++){
    var el=document.createElement("div"); el.className="opt";
    el.innerHTML="<span>"+data.o[i]+"</span><span style='background:#e2e8f0;min-width:30px;height:30px;border-radius:50%;display:flex;justify-content:center;align-items:center;font-size:13px;font-weight:bold;'>"+(i+1)+"</span>";
    el.setAttribute("data-v",data.o[i]);
    el.onclick=(function(v, elem){
      return function(){
        var correct=allLevels[curLevelIdx][curQIdx].a;
        var all=document.getElementsByClassName("opt");
        for(var k=0;k<all.length;k++){ all[k].style.pointerEvents="none"; if(all[k].getAttribute("data-v")===correct) all[k].classList.add("ok"); }
        if(v===correct){ elem.classList.add("ok"); score++; try{ playCorrect(); }catch(e){} } else { elem.classList.add("wrong"); try{ playWrong(); }catch(e){} }
        clearInterval(timerInt); setTimeout(function(){ autoNext(); },900);
      };
    })(data.o[i], el);
    box.appendChild(el);
  }
  try{ playFlip(); }catch(e){}
}
function autoNext(){ curQIdx++; if(curQIdx<10) showQ(); else showTrophy(); }
function showTrophy(){
  hideAll(); document.getElementById("trophy").style.display="flex";
  document.getElementById("tLevel").textContent=curLevelIdx+1;
  document.getElementById("tScore").textContent=score;
  if(score>=6){ if(curLevelIdx+2>unlocked){ unlocked=curLevelIdx+2; localStorage.setItem("noor_mixed_final",unlocked); } }
  try{ playTrophy(); }catch(e){}
}
function closeTrophy(){ if(curLevelIdx+1<100) startLevel(curLevelIdx+1); else showLevels(); }

window.addEventListener('load', function(){
  initSplash();
  try{ if(typeof initBanks !== 'undefined') initBanks(); }catch(e){}
  try{ allLevels=buildAllLevels(localStorage.getItem("appLang")||"ur"); }catch(e){ console.error(e); }
  applyLanguage(localStorage.getItem("appLang")||"ur");
  showHome();
  // Enable audio on first interaction
  document.body.addEventListener('click', function initAudioOnClick(){ try{ initAudio(); if(audioCtx && audioCtx.state==='suspended') audioCtx.resume(); }catch(e){} document.body.removeEventListener('click', initAudioOnClick); }, {once:true});
});

window.changeLang=changeLang; window.showHome=showHome; window.showLevels=showLevels; window.startLevel=startLevel; window.resetProgress=resetProgress; window.openPage=openPage; window.closePage=closePage; window.closeTrophy=closeTrophy;
