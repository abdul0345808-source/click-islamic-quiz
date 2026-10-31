var banks = {};

function initBanks(){
  try{
    banks['ur'] = typeof allPools_ur !== 'undefined' ? allPools_ur : null;
    banks['en'] = typeof allPools_en !== 'undefined' ? allPools_en : null;
    banks['ar'] = typeof allPools_ar !== 'undefined' ? allPools_ar : null;
    banks['tr'] = typeof allPools_tr !== 'undefined' ? allPools_tr : null;
    banks['fr'] = typeof allPools_fr !== 'undefined' ? allPools_fr : null;
    banks['de'] = typeof allPools_de !== 'undefined' ? allPools_de : null;
    banks['es'] = typeof allPools_es !== 'undefined' ? allPools_es : null;
    banks['bn'] = typeof allPools_bn !== 'undefined' ? allPools_bn : null;
    banks['hi'] = typeof allPools_hi !== 'undefined' ? allPools_hi : null;
    banks['id'] = typeof allPools_id !== 'undefined' ? allPools_id : null;
  }catch(e){ console.log('banks init error', e); }
}

function getQuestionBank(lang){
  if(!banks[lang] || Object.keys(banks).length===0) initBanks();
  return banks[lang] || banks['ur'];
}

function buildAllLevels(lang){
  initBanks();
  var bank=getQuestionBank(lang);
  if(!bank){ 
    // Fallback to ur
    bank=banks['ur'];
  }
  var keys=['quran','hadith','anbiya','namaz','zakat','roza','hajj','seerat','sahaba','jannat'];
  var all=[];
  for(var L=0; L<100; L++){
    var lvl=[];
    for(var i=0;i<keys.length;i++){
      var k=keys[i];
      var pool=bank ? bank[k] : null;
      if(pool && pool[L]) lvl.push(pool[L]);
      else if(pool && pool[0]) lvl.push(pool[0]);
      else lvl.push({q:"Question",o:["1","2","3"],a:"1",cat:k});
    }
    all.push(lvl);
  }
  return all;
}

// Init banks on load
initBanks();
