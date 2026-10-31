export function initSplash(){
  const splash = document.getElementById('splash');
  if(!splash) return;
  const hide = () => {
    splash.classList.add('hidden');
    setTimeout(()=>{
      splash.style.display='none';
      splash.style.pointerEvents='none';
    }, 600);
  };
  setTimeout(hide, 3200);
  splash.addEventListener('click', hide);
  splash.addEventListener('touchstart', hide, {passive:true});
  document.addEventListener('keydown', ()=>{ if(splash.style.display!=='none') hide(); }, {once:true});
}
