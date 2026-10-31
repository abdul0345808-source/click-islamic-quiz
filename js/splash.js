export function initSplash(){
  const splash = document.getElementById('splash');
  if(!splash) return;
  
  // Fix: Ensure splash hides after 3.2s and does not block clicks
  const hide = () => {
    splash.classList.add('hidden');
    setTimeout(()=>{
      splash.style.display='none';
      splash.style.pointerEvents='none';
    }, 600);
  };
  
  // Auto hide after 3.2s (CSS animation duration)
  setTimeout(hide, 3200);
  
  // Allow user to tap/click to skip
  splash.addEventListener('click', hide);
  splash.addEventListener('touchstart', hide, {passive:true});
  
  // Keyboard skip
  document.addEventListener('keydown', (e)=>{
    if(splash.style.display!=='none') hide();
  }, {once:true});
}
