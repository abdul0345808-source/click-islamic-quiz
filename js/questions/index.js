import * as ur from './ur.js';
import * as en from './en.js';
import * as ar from './ar.js';
import * as tr from './tr.js';
import * as fr from './fr.js';
import * as de from './de.js';
import * as es from './es.js';
import * as bn from './bn.js';
import * as hi from './hi.js';
import * as id from './id.js';

const banks = { ur, en, ar, tr, fr, de, es, bn, hi, id };

export function getQuestionBank(lang){
  if(!banks[lang]) lang='en';
  return banks[lang].allPools;
}

export function getCategories(lang){
  return banks[lang]?.categories || banks['en'].categories;
}

// Production: 100 Levels, 10 questions per level, no expandPool duplicates
export function buildAllLevels(lang){
  const bank = getQuestionBank(lang);
  const keys = ['quran','hadith','anbiya','namaz','zakat','roza','hajj','seerat','sahaba','jannat'];
  const allLevels=[];
  for(let L=0; L<100; L++){
    const level=[];
    for(let k of keys){
      const pool = bank[k];
      if(pool && pool[L]) level.push(pool[L]);
      else level.push(pool[0]);
    }
    allLevels.push(level);
  }
  return allLevels;
}
