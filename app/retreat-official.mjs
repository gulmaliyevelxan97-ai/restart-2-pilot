import {schoolTimeZone} from './booking-calendar.mjs';
import {languages} from './state.mjs';

export const retreatStart='2026-11-29T16:00:00+04:00';
export const retreatEnd='2026-11-30T14:00:00+04:00';

const sessions=[
 ['WHITE','2026-11-29',[
  ["15:00","Прибытие участников","İştirakçıların gəlişi","Participant arrival"],
  ["16:00","Официальное открытие","Rəsmi açılış","Official opening"],
  ["16:15","Йога","Yoqa","Yoga"],
  ["17:00","Sound Healing","Sound Healing","Sound Healing"],
  ["18:00","Рефлексия","Düşüncə vaxtı","Reflection"],
  ["18:10","Лёгкий перекус","Yüngül qəlyanaltı","Light snack"],
  ["18:30","BBQ и общение","Manqal və ünsiyyət","BBQ and conversation"],
  ["20:30","Отдых и смена одежды","İstirahət və geyim dəyişikliyi","Rest and change of clothes"]
 ]],
 ['BLACK','2026-11-29',[
  ["21:00","Открытие","Açılış","Opening"],
  ["21:10","Дыхание дракона","Əjdaha nəfəsi","Dragon Breath",["Только после подтверждения безопасности организатором.","Yalnız təşkilatçı təhlükəsizliyi təsdiqlədikdən sonra.","Subject to the organiser’s safety approval."]],
  ["21:40","Круг откровенности","Səmimi söhbət dairəsi","Sharing circle"],
  ["22:10","Свобода движения","Hərəkət azadlığı","Freedom of movement"],
  ["22:30","Вечерняя медитация","Axşam meditasiyası","Evening meditation"],
  ["22:50","Круг благодарности","Minnətdarlıq dairəsi","Gratitude circle"],
  ["23:00","Свободное время и отдых","Sərbəst vaxt və istirahət","Free time and rest"]
 ]],
 ['REBIRTH','2026-11-30',[
  ["09:00","Пробуждение","Oyanış","Wake-up"],
  ["09:30","Утренняя медитация","Səhər meditasiyası","Morning meditation"],
  ["10:00","Завтрак","Səhər yeməyi","Breakfast"],
  ["11:00","Свободное время","Sərbəst vaxt","Free time"],
  ["13:30","Сбор личных вещей","Şəxsi əşyaların yığılması","Pack personal belongings"],
  ["14:00","Выезд","Yola düşmə","Departure"]
 ]]
];

const copy={
 programme:['Официальная программа','Rəsmi proqram','Official programme'],
 timeZone:['Время Баку','Bakı vaxtı','Baku time'],
 countdown:['До начала ретрита','Retritin başlamasına qalıb','Time until the retreat starts'],
 inProgress:['Ретрит идёт','Retrit davam edir','The retreat is underway'],
 ended:['Ретрит завершён','Retrit başa çatıb','The retreat has ended'],
 days:['д','g','d'],hours:['ч','s','h'],minutes:['мин','dəq','min'],seconds:['с','san','sec'],
 arrival:['Прибытие','Gəliş','Arrival'],
};

const languageIndex=lang=>Math.max(0,languages.indexOf(lang));

export function retreatOfficialClock(now=new Date()) {
 const current=Number(now);
 if (current>=Date.parse(retreatEnd)) return {phase:'ended'};
 if (current>=Date.parse(retreatStart)) return {phase:'inProgress'};
 const total=Math.max(0,Math.ceil((Date.parse(retreatStart)-current)/1000));
 return {phase:'countdown',days:Math.floor(total/86400),hours:Math.floor(total/3600)%24,
  minutes:Math.floor(total/60)%60,seconds:total%60};
}

function countdownText(lang,now) {
 const index=languageIndex(lang);
 const clock=retreatOfficialClock(now);
 if (clock.phase!=='countdown') return copy[clock.phase][index];
 return copy.countdown[index]+' · '+['days','hours','minutes','seconds']
  .map(key=>clock[key]+' '+copy[key][index]).join(' ');
}

export function renderRetreatOfficial(lang,{now=new Date(),summaryOnly=false}={}) {
 const index=languageIndex(lang);
 const t=key=>copy[key][index];
 const displayDay=new Intl.DateTimeFormat(languages[index],{day:'numeric',month:'long',year:'numeric',timeZone:schoolTimeZone});
 const label=day=>displayDay.format(new Date(day+'T12:00:00+04:00'));
 return '<section class="panel" aria-labelledby="retreat-official-title"><h2 id="retreat-official-title">'+t('programme')+'</h2>'+
  '<p><time datetime="'+retreatStart+'">'+label('2026-11-29')+' 16:00</time> – '+
  '<time datetime="'+retreatEnd+'">'+label('2026-11-30')+' 14:00</time> · '+t('timeZone')+'</p>'+
  '<p role="timer" aria-live="off" data-retreat-official-clock>'+countdownText(lang,now)+'</p>'+
  '<p>'+t('arrival')+' · '+label('2026-11-29')+' 15:00</p>'+
  (summaryOnly?'':
  sessions.map(([phase,day,items])=>'<section><h3>'+phase+' · '+label(day)+'</h3><ol class="history">'+
   items.map(row=>'<li><time datetime="'+day+'T'+row[0]+':00+04:00">'+row[0]+'</time><div>'+
    row[index+1]+(row[4]?'<small>'+row[4][index]+'</small>':'')+'</div></li>').join('')+'</ol></section>') .join(''))+
  '</section>';
}

export function bindRetreatOfficial(outlet,lang) {
 const timer=outlet.querySelector('[data-retreat-official-clock]');
 if (!timer) return;
 const now=new Date();
 timer.textContent=countdownText(lang,now);
 if (retreatOfficialClock(now).phase!=='countdown') return;
 const interval=setInterval(()=>{
  if (!timer.isConnected) {clearInterval(interval);return;}
  const now=new Date();
  timer.textContent=countdownText(lang,now);
  if (retreatOfficialClock(now).phase!=='countdown') clearInterval(interval);
 },1000);
 return ()=>clearInterval(interval);
}
