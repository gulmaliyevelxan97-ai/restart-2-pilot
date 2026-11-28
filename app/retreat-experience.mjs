import {renderRetreatHeroClock,renderRetreatOfficial} from './retreat-official.mjs';
import {retreatChecklistCount} from './retreat-preparation.mjs';
import {readRetreatLetter} from './retreat-letter.mjs';
import {readRetreatIntention} from './retreat-intention.mjs';
import {languages} from './state.mjs';

import {renderRetreatOpening} from './retreat-opening.mjs';

const title = 'RESTART RETREAT';
const media = './retreat-media/';
const copy = {
 entry:['Открыть раздел ретрита','Retrit bölməsini aç','Explore the retreat'],
 welcome:['Добро пожаловать','Xoş gəlmisən','Welcome'],
 philosophy:[
  'Пространство, чтобы замедлиться, прислушаться к телу и яснее понять своё намерение.',
  'Yavaşlamaq, bədənini dinləmək və niyyətini daha aydın anlamaq üçün bir məkan.',
  'A space to slow down, listen to your body and find clarity about your intention.'
 ],
 journey:['Твой путь','Sənin yolun','Your journey'],
 journeyIntro:['Выбери, с чего начать. К любому этапу можно вернуться.','Haradan başlayacağını seç. İstənilən mərhələyə qayıda bilərsən.','Choose where to begin. You can return to any stage.'],
 before:['До ретрита','Retritdən əvvəl','Before the retreat'],
 live:['Во время ретрита','Retrit zamanı','During the retreat'],
 integrate:['После ретрита','Retritdən sonra','After the retreat'],
 awaken:['Пробуждение','Oyanış','Awakening'],
 immerse:['Погружение','Dərinləşmə','Immersion'],
 awareness:['Осознание','Dərk etmə','Awareness'],
 integration:['Интеграция','Gündəlik həyata dönüş','Integration'],
 journal:['Мой дневник','Gündəliyim','My journal'],
 nextStep:['Продолжить путь','Yola davam et','Continue the journey'],
 letter:['Письмо себе','Özümə məktub','Letter to myself'],
 overview:['Обзор','İcmal','Overview'],
 mentorWelcome:['Приветствие наставника','Mentorun salamı','A welcome from your mentor'],
 opening:['Начало пути','Yolun başlanğıcı','The beginning of the journey'],
 preparation:['Подготовка','Hazırlıq','Preparation'],
 after:['После ретрита','Retritdən sonra','After the retreat'],
 myIntention:['Моё намерение','Niyyətim','My intention'],
 mentor:['Мой наставник','Mentorum','My mentor'],
 pool:['Бассейн виллы','Villanın hovuzu','Villa pool'],
 villa:['Фотография виллы','Villanın fotosu','Villa photograph'],
 lounge:['Гостиная виллы','Villanın qonaq otağı','Villa lounge'],
 illustration:['Концептуальная визуализация','Konsept vizualı','Concept illustration'],
 attire:['WHITE EXPERIENCE — белая одежда. BLACK EXPERIENCE — чёрная одежда. Плавки или купальник — по желанию.','WHITE EXPERIENCE üçün ağ, BLACK EXPERIENCE üçün qara geyim. Çimərlik geyimi istəyə bağlıdır.','White clothing for WHITE EXPERIENCE, black clothing for BLACK EXPERIENCE. Swimwear is optional.'],
 rules:['Участие и личные границы','İştirak və şəxsi sərhədlər','Participation and personal boundaries'],
 principles:['Практики добровольны. Можно отказаться или остановиться в любой момент. Уважайте личные границы и конфиденциальность. Прикосновения, фото и видео требуют предварительного согласия.','Praktikalar könüllüdür. İstənilən vaxt imtina edə və ya dayana bilərsiniz. Şəxsi sərhədlərə və məxfiliyə hörmət edin. Toxunuş, foto və video çəkilişi üçün əvvəlcədən razılıq alınmalıdır.','Practices are optional. You may decline or stop at any time. Respect personal boundaries and confidentiality. Touch, photos and video require prior consent.'],
 registration:['Регистрация','Qeydiyyat','Registration'],
 readiness:['Забота о себе','Özünə qayğı','Self-care'],
 currentState:['Оценка текущего состояния','Hazırkı halın qiymətləndirilməsi','Current-state check-in'],
 selfDiscovery:['Встреча с собой','Özünlə görüş','Meet yourself'],
 meditation:['Пятиминутная медитация «Начало пути»','Beş dəqiqəlik «Yolun başlanğıcı» meditasiyası','Five-minute “Beginning of the journey” meditation'],
 checklist:['Организационный чек-лист','Hazırlıq siyahısı','Preparation checklist'],
 formsAccess:['Анкеты доступны, когда наставник назначит их в приложении.','Mentor anketləri təyin etdikdə onları tətbiqdə görə bilərsiniz.','Forms appear in the app once the mentor assigns them.'],
 nav:['Разделы ретрита','Retrit bölmələri','Retreat sections'],
 concept:['Две стороны ретрита','Retritin iki tərəfi','Two sides of the retreat'],
 white:['Свет, осознанность и открытость.','İşıq, fərqindəlik və açıqlıq.','Light, awareness and openness.'],
 black:['Тишина, глубина и внутреннее исследование.','Sükut, dərinlik və özünü kəşf.','Stillness, depth and inner exploration.'],
 pending:['Подробности появятся после утверждения организатором.','Təfərrüatlar təşkilatçı təsdiqlədikdən sonra burada görünəcək.','Details will appear here after the organiser confirms them.'],
 afterIntro:['Самое важное — то, что ты унесёшь с собой.','Ən vacibi özünlə aparacağındır.','What matters most is what you take with you.'],
 afterTitle:['Это только начало','Bu hələ başlanğıcdır','This is only the beginning'],
 closing:['Сила тела. Ясность разума. Гармония внутри.','Bədənin gücü. Zehnin aydınlığı. Daxili harmoniya.','Strength of body. Clarity of mind. Harmony within.'],
 followup:['Можно вернуться к своим ответам через 24 часа, 3 дня или 7 дней.','Cavablarına 24 saat, 3 gün və ya 7 gün sonra qayıda bilərsən.','Return to your answers in 24 hours, 3 days or 7 days.'],
 date:['Дата и время','Tarix və saat','Date and time'],
 programme:['Полная программа','Tam proqram','Full programme'],
 location:['Место проведения','Keçirildiyi yer','Location'],
 dress:['Дресс-код','Geyim qaydası','Dress code'],
 packing:['Что взять с собой','Özünlə nə götürməli','What to bring'],
 prepare:['Добровольные практики перед ретритом','Retritdən əvvəl könüllü məşqlər','Optional preparation'],
 breathe:['Спокойное дыхание','Sakit nəfəs','Gentle breathing'],
 meditate:['Медитация','Meditasiya','Meditation'],
 personal:['Мой ретрит','Retritim','My retreat'],
 intention:['Анкеты и «Моё намерение»','Anketlər və «Niyyətim»','Forms and “My intention”'],
 tasks:['Задания','Tapşırıqlar','Tasks'],
 connect:['Наставник и объявления','Mentor və elanlar','Mentor and announcements'],
 guest:['Программа группы, индивидуальные задания, переписка и рекомендации доступны после входа и допуска в группу.','Qrup proqramı, fərdi tapşırıqlar, yazışmalar və tövsiyələr giriş və qrupa qəbuldan sonra açılır.','The cohort programme, individual tasks, messages and recommendations are available after sign-in and approval.'],
 back:['На экран «Сегодня»','«Bu gün» bölməsinə','Back to Today']
};

const translator = lang => key => copy[key][Math.max(0,languages.indexOf(lang))];

export function renderRetreatCard(lang) {
 const t=translator(lang);
 return '<a class="retreat-feature" href="#retreat"><span class="eyebrow">BODY · MIND · SPIRIT</span>'+
  '<strong>'+title+'</strong><span>'+t('entry')+' <span aria-hidden="true">→</span></span></a>';
}

const sections = [
 ['', 'overview'], ['opening','opening'], ['preparation','preparation'],
 ['intention','myIntention'], ['programme','programme'], ['mentor','mentor'], ['letter','letter'], ['after','after']
];

export function retreatSection(id) {
 return sections.some(([section])=>section===id) ? id : '';
}

export function renderRetreatExperience(lang,{section='',signedIn=false,intention='',preparation='',reflection='',letter=''}={}) {
 const t=translator(lang);
 const link=(route,label)=>'<a class="button" href="#'+route+'">'+t(label)+'</a>';
 const panel=(key,body)=>'<section class="panel retreat-panel"><h2>'+t(key)+'</h2>'+body+'</section>';
 const restricted='<p>'+t('guest')+'</p>';
 const language=Math.max(0,languages.indexOf(lang));
 const prepCount=retreatChecklistCount();
 const descriptions=[
  ['Место, правила и вещи','Məkan, qaydalar və əşyalar','Venue, guidelines and packing'],
  ['Твои шаги до встречи','Görüşə qədər addımların','Your steps before we meet'],
  ['Вопросы для себя','Özün üçün suallar','Questions for yourself'],
  ['Все события по времени Баку','Bakı vaxtı ilə bütün tədbirlər','Every session in Baku time'],
  ['Задания, связь и обратная связь','Tapşırıqlar, əlaqə və rəy','Tasks, messages and feedback'],
  ['Сохрани слова для будущего себя','Gələcək özünə sözlərini saxla','Keep a note for your future self'],
  ['Возьми опыт с собой','Təcrübəni özünlə apar','Carry the experience with you']
 ];
 const icons=['◈','✓','◇','◷','↔','✉','☀'];
 const saved=['Сохранено','Saxlanılıb','Saved'][language];
 const statuses=[prepCount===6?saved:prepCount?prepCount+' / 6':'', '',readRetreatIntention()?saved:'',
  '', '',readRetreatLetter().text?saved:'',''];
 const back=section?'<a class="link retreat-home-link" href="#retreat">'+t('overview')+'</a>':'';
 const nav=section?'':'<nav class="retreat-route" aria-label="'+t('nav')+'"><ol>'+
  sections.slice(1).map(([id,label],i)=>'<li><a href="#retreat/'+id+'"><span class="retreat-step-number" aria-hidden="true">'+
   String(i+1).padStart(2,'0')+'</span><span class="retreat-step-icon" aria-hidden="true">'+icons[i]+'</span><span><strong>'+
   t(label)+'</strong><small>'+descriptions[i][language]+'</small>'+(statuses[i]?'<small class="retreat-step-status">'+statuses[i]+'</small>':'')+
   '</span><span aria-hidden="true">›</span></a></li>').join('')+'</ol></nav>';
 const photo=(file,label)=>'<img class="retreat-photo" src="'+media+file+'" alt="'+t(label)+'" loading="lazy" decoding="async">';
 const conceptImage=file=>'<figure>'+photo(file,'illustration')+'<figcaption>'+t('illustration')+'</figcaption></figure>';
 const flow=panel('preparation','<ol class="retreat-stages"><li><a href="https://gulmaliyevelxan97-ai.github.io/restart-2-pilot/participants/">'+t('registration')+'</a></li>'+
  ['readiness','currentState','selfDiscovery'].map(key=>'<li>'+(signedIn?'<a href="#retreat-forms">'+t(key)+'</a>':t(key))+'</li>').join('')+
  '<li><a href="#retreat/opening">'+t('meditation')+'</a></li>'+
  '<li><a href="#retreat/intention">'+t('myIntention')+'</a></li><li><a href="#retreat/opening">'+t('checklist')+'</a></li></ol><p>'+t('formsAccess')+'</p>');
 const concept=panel('concept','<p>WHITE &amp; BLACK EXPERIENCE</p><div class="retreat-experiences">'+
  '<details class="retreat-white"><summary>WHITE EXPERIENCE</summary><p>'+t('white')+'</p>'+conceptImage('white-concept.webp')+'</details>'+
  '<details class="retreat-black"><summary>BLACK EXPERIENCE</summary><p>'+t('black')+'</p>'+conceptImage('black-concept.webp')+'</details></div>');
 const content={
  '':()=>panel('welcome','<p>'+t('philosophy')+'</p>')+ (signedIn?'<div id="retreat-event-details-outlet"></div>':'')+concept,
  programme:()=>renderRetreatOfficial(lang)+(signedIn?panel('programme',link('retreat-programme','programme')):'')+concept,
  opening:()=>panel('opening','<div class="retreat-villa-gallery">'+photo('villa.webp','villa')+photo('villa-pool.webp','pool')+photo('villa-lounge.webp','lounge')+'</div>'+
    '<p>'+t('attire')+'</p>'+renderRetreatOfficial(lang,{summaryOnly:true})+
    (signedIn?'<div id="retreat-event-details-outlet"></div>':'<p>'+['Маршрут доступен в кабинете после одобрения заявки.','Marşrut müraciət təsdiqləndikdən sonra kabinetdə görünür.','Directions appear in your account after approval.'][language]+'</p>'))+panel('rules','<p>'+t('principles')+'</p>')+
    '<section id="retreat-checklist" class="panel retreat-panel"><h2>'+t('checklist')+'</h2>'+preparation+'</section>'+renderRetreatOpening(lang),
  preparation:()=>flow+
    panel('prepare','<div class="actions">'+link('retreat/opening','opening')+link('practice/breathing','breathe')+link('practice/meditation','meditate')+'</div>'),
  intention:()=>intention+(signedIn?panel('intention',link('retreat-forms','intention')):''),
  mentor:()=>panel('mentor',signedIn?'<div class="actions">'+link('retreat-tasks','tasks')+link('retreat-connect','connect')+'</div>':restricted+'<a class="button" href="https://gulmaliyevelxan97-ai.github.io/restart-2-pilot/participants/">'+['Войти или зарегистрироваться','Daxil ol və ya qeydiyyatdan keç','Sign in or register'][language]+'</a>'),
  letter:()=>letter,
  after:()=>'<section class="panel retreat-horizon"><span aria-hidden="true">◯</span><h2>'+t('afterTitle')+'</h2><p>'+t('afterIntro')+'</p></section>'+reflection+
   panel('after','<p>'+t('followup')+'</p>'+link('retreat/intention','myIntention')+link('retreat/letter','letter')+'<div class="retreat-next-step"><h3>'+t('nextStep')+'</h3><div class="actions">'+link('journal','journal')+link('practice/meditation','meditate')+'</div></div>'+
    (signedIn?'<div class="actions">'+link('retreat-forms','intention')+link('retreat-connect','connect')+'</div>':'')+'<p>'+t('closing')+'</p>')
 };
 return '<a class="link" href="#today">'+t('back')+'</a>'+back+'<header class="retreat-feature retreat-hero retreat-hero--edition">'+
  '<h1>RESTART RETREAT</h1><p class="retreat-edition">WHITE &amp; BLACK EXPERIENCE</p><span class="eyebrow">BODY · MIND · SPIRIT</span>'+
  (section?'':renderRetreatHeroClock(lang)+'<img class="retreat-photo retreat-cover" src="'+media+'villa.webp" alt="'+t('villa')+'" fetchpriority="high" decoding="async">'+
   renderRetreatOfficial(lang,{summaryOnly:true})+'<div class="retreat-primary">'+link('retreat/opening','opening')+'</div>'+
   '<div class="retreat-check-progress"><label for="retreat-home-progress">'+t('checklist')+' · '+prepCount+' / 6</label>'+
   '<progress id="retreat-home-progress" value="'+prepCount+'" max="6"></progress></div>')+'</header>'+
  nav+content[retreatSection(section)]();
}
