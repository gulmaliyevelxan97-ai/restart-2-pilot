import {languages} from './state.mjs';

const key = 'restart.retreat.guest-intention.v1';
const limit = 500;
const copy = {
 title:['Моё намерение','Niyyətim','My intention'],
 description:[
  'Если хочешь, запиши, с каким намерением ты начинаешь практику. Запись хранится только в этой вкладке и не отправляется организатору.',
  'İstəsən, məşqə hansı niyyətlə başladığını yaz. Qeyd yalnız bu brauzer tabında qalır və təşkilatçıya göndərilmir.',
  'If you wish, write down your intention for the practice. This note stays in this tab and is never sent to the organiser.'
 ],
 hint:['Например, дать себе время на спокойное дыхание','Məsələn, sakit nəfəs almağa özümə vaxt ayırmaq','For example, give myself time to breathe calmly'],
 save:['Сохранить в этой вкладке','Bu tabda saxla','Save in this tab'],
 remove:['Удалить запись','Qeydi sil','Delete note'],
 saved:['Намерение сохранено в этой вкладке.','Niyyət bu tabda saxlanıldı.','Your intention is saved in this tab.'],
 removed:['Запись удалена.','Qeyd silindi.','Your note was deleted.'],
 failed:['Браузер не смог обновить запись.','Brauzer qeydi yeniləyə bilmədi.','The browser could not update your note.']
};

export function retreatIntentionMessage(lang, name) {
 return copy[name][Math.max(0,languages.indexOf(lang))];
}

export function readRetreatIntention(storage) {
 try {
  return ((storage ?? globalThis.sessionStorage).getItem(key) || '').slice(0,limit);
 } catch {
  return '';
 }
}

export function updateRetreatIntention(value, storage) {
 try {
  const target = storage ?? globalThis.sessionStorage;
  const text = value.slice(0,limit).trim();
  if (text) target.setItem(key,text);
  else target.removeItem(key);
  return text ? 'saved' : 'removed';
 } catch {
  return 'failed';
 }
}

export function renderRetreatIntention(lang, value, esc) {
 const t = name => retreatIntentionMessage(lang,name);
 return `<details class="panel">
 <summary>${t('title')}</summary>
 <form id="retreat-intention-form">
 <p id="retreat-intention-description">${t('description')}</p>
 <label>${t('title')}<textarea name="intention" maxlength="${limit}" rows="3" aria-describedby="retreat-intention-description" placeholder="${t('hint')}">${esc(value)}</textarea></label>
 <div class="actions"><button type="submit" value="save">${t('save')}</button><button type="submit" value="delete">${t('remove')}</button></div>
 <p role="status" data-intention-status></p>
 </form>
 </details>`;
}

const guidedCopy={
 intention:{
  title:['С каким намерением ты начинаешь свой путь?','Yola hansı niyyətlə başlayırsan?','What intention are you bringing to this journey?'],
  questions:[
   ['Что я хочу оставить в прошлом?','Keçmişdə nəyi qoymaq istəyirəm?','What do I want to leave behind?'],
   ['Что я хочу открыть в себе?','Özümdə nəyi kəşf etmək istəyirəm?','What do I want to discover in myself?'],
   ['С каким намерением я прихожу на этот ретрит?','Bu retritə hansı niyyətlə gəlirəm?','What intention am I bringing to this retreat?']
  ]
 },
 reflection:{
  title:['Итоговая рефлексия','Yekun düşüncə','Final reflection'],
  questions:[
   ['Что изменилось во мне за эти два дня?','Bu iki gündə məndə nə dəyişdi?','What changed in me over these two days?'],
   ['Что я осознал о себе?','Özüm haqqında nəyi anladım?','What did I learn about myself?'],
   ['Что я хочу оставить в прошлом?','Keçmişdə nəyi qoymaq istəyirəm?','What do I want to leave behind?'],
   ['Что я хочу привнести в свою повседневную жизнь?','Gündəlik həyatıma nəyi gətirmək istəyirəm?','What do I want to bring into my daily life?']
  ]
 }
};
const guidedLabels={
 privacy:['Черновик хранится в этой вкладке.','Qaralama bu tabda saxlanılır.','Your draft stays in this tab.'],
 next:['Далее','İrəli','Next'],
 back:['Назад','Geri','Back'],
 skip:['Пропустить','Keç','Skip'],
 done:['Сохранить и завершить','Saxla və bitir','Save and finish'],
 edit:['Вернуться к ответам','Cavablara qayıt','Return to answers'],
 saved:['Практика завершена','Praktika tamamlandı','Practice complete'],
 clear:['Удалить ответы этой практики','Bu praktikanın cavablarını sil','Delete these answers'],
 confirm:['Удалить ответы этой практики из вкладки?','Bu praktikanın cavabları tabdan silinsin?','Delete these answers from this tab?'],
 failed:['Не удалось сохранить черновик.','Qaralamanı saxlamaq mümkün olmadı.','Could not save the draft.']
};

function readGuided(kind,storage) {
 try {
  const value=JSON.parse(storage.getItem(key+'.'+kind));
  const answers=guidedCopy[kind].questions.map((_,i)=>typeof value?.answers?.[i]==='string'?value.answers[i].slice(0,limit):'');
  const step=Number.isInteger(value?.step)?Math.min(answers.length,Math.max(0,value.step)):0;
  return {answers,step};
 } catch {
  return {answers:guidedCopy[kind].questions.map(()=>''),step:0};
 }
}

export function renderRetreatGuided(lang,kind,esc,storage=globalThis.sessionStorage) {
 const language=Math.max(0,languages.indexOf(lang));
 const t=name=>guidedLabels[name][language];
 const {questions,title}=guidedCopy[kind];
 const {step,answers}=readGuided(kind,storage);
 const complete=step===questions.length;
 return '<section class="panel retreat-panel retreat-guided" data-retreat-guided="'+kind+'"><h2>'+title[language]+'</h2>'+
  '<p class="muted">'+t('privacy')+'</p>'+
  '<progress aria-label="'+title[language]+'" value="'+(complete?step:step+1)+'" max="'+questions.length+'"></progress>'+
  (complete?'<p role="status">'+t('saved')+'</p><button type="button" data-guided-action="edit">'+t('edit')+'</button>':
   '<p class="eyebrow">'+(step+1)+' / '+questions.length+'</p>'+
   '<label>'+questions[step][language]+'<textarea rows="4" maxlength="'+limit+'">'+esc(answers[step])+'</textarea></label>'+
   '<div class="actions">'+(step?'<button type="button" data-guided-action="back">'+t('back')+'</button>':'')+
   '<button type="button" data-guided-action="skip">'+t('skip')+'</button><button type="button" data-guided-action="next">'+
   t(step===questions.length-1?'done':'next')+'</button></div>')+
  '<button type="button" data-guided-action="clear">'+t('clear')+'</button>'+
  '<p role="status" data-guided-status></p></section>';
}

export function bindRetreatGuided(outlet,lang,esc) {
 const panel=outlet.querySelector('[data-retreat-guided]');
 if (!panel) return;
 const kind=panel.dataset.retreatGuided;
 const initial=readGuided(kind,globalThis.sessionStorage);
 const field=panel.querySelector('textarea');
 const save=state=>{
  try {
   globalThis.sessionStorage.setItem(key+'.'+kind,JSON.stringify(state));
   return true;
  } catch {
   panel.querySelector('[data-guided-status]').textContent=guidedLabels.failed[Math.max(0,languages.indexOf(lang))];
   return false;
  }
 };
 if (field) field.oninput=()=>{
  initial.answers[initial.step]=field.value.slice(0,limit);
  save(initial);
 };
 for (const button of panel.querySelectorAll('[data-guided-action]')) button.onclick=()=>{
  const action=button.dataset.guidedAction;
  if (action==='clear') {
   if (!confirm(guidedLabels.confirm[Math.max(0,languages.indexOf(lang))])) return;
   if (!save({answers:initial.answers.map(()=>''),step:0})) return;
  } else {
   const next=action==='edit'?0:initial.step+(action==='back'?-1:1);
   if (!save({...initial,step:next})) return;
  }
  panel.outerHTML=renderRetreatGuided(lang,kind,esc);
  bindRetreatGuided(outlet,lang,esc);
  outlet.querySelector('[data-retreat-guided] textarea, [data-retreat-guided] button')?.focus();
 };
}
