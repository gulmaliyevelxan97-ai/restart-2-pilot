import {renderRetreatOfficial} from './retreat-official.mjs';
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
 afterIntro:['Вернись сюда после ретрита, чтобы осмыслить свой опыт.','Təcrübəni dəyərləndirmək üçün retritdən sonra bura qayıt.','Come back after the retreat to reflect on your experience.'],
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

const welcomeMessage = [
 [`Дорогие мои,`,`Впереди у нас два особенных дня. Два дня, посвящённых не внешнему миру, а нашему внутреннему пространству.`,
  `Мы будем двигаться, чувствовать, познавать себя, встречаться со своими эмоциями, светом и тенью.`,
  `Здесь вам не нужно никому ничего доказывать. Позвольте себе быть настоящими.`,
  `Приходите с открытым сердцем, доверием к себе и готовностью услышать свой внутренний голос.`,
  `Я буду рядом с вами на этом пути.`,`С любовью и уважением, ваш наставник.`],
 [`Əzizlərim,`,`Qarşıda bizi iki xüsusi gün gözləyir. Bu iki günü xarici dünyaya deyil, daxili aləmimizə həsr edəcəyik.`,
  `Hərəkət edəcəyik, hiss edəcəyik, özümüzü tanıyacaq, duyğularımızla, işığımızla və kölgəmizlə üzləşəcəyik.`,
  `Burada heç kimə heç nə sübut etməli deyilsiniz. Özünüz kimi olmağa icazə verin.`,
  `Açıq ürəklə, özünüzə güvənərək və daxili səsinizi eşitməyə hazır olaraq gəlin.`,
  `Bu yolda yanınızda olacağam.`,`Sevgi və hörmətlə, mentorunuz.`],
 [`Dear friends,`,`Two special days lie ahead. Two days devoted to our inner world rather than the world outside.`,
  `We will move, feel, get to know ourselves, and meet our emotions, our light and our shadow.`,
  `Here, you have nothing to prove to anyone. Give yourself permission to be who you are.`,
  `Come with an open heart, trust in yourself and a willingness to hear your inner voice.`,
  `I will be alongside you on this journey.`,`With love and respect, your mentor.`]
];

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
 const nav=sections.filter(([id])=>section || id!=='opening' && id).map(([id,label])=>'<a href="#retreat'+(id?'/'+id:'')+'"'+
  (id===section?' aria-current="page"':'')+'>'+t(label)+'</a>').join('');
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
  opening:()=>panel('opening','<div class="retreat-villa-gallery">'+photo('villa-lounge.webp','lounge')+'</div>'+
    '<p>'+t('attire')+'</p>')+panel('rules','<p>'+t('principles')+'</p>')+
    '<section id="retreat-checklist" class="panel retreat-panel"><h2>'+t('checklist')+'</h2>'+preparation+'</section>'+renderRetreatOpening(lang),
  preparation:()=>flow+panel('mentorWelcome',welcomeMessage[Math.max(0,languages.indexOf(lang))].map(line=>'<p>'+line+'</p>').join(''))+
    panel('prepare','<div class="actions">'+link('retreat/opening','opening')+link('practice/breathing','breathe')+link('practice/meditation','meditate')+'</div>'),
  intention:()=>signedIn?panel('intention',link('retreat-forms','intention')):intention,
  mentor:()=>panel('mentor',signedIn?'<div class="actions">'+link('retreat-tasks','tasks')+link('retreat-connect','connect')+'</div>':restricted),
  letter:()=>letter,
  after:()=>panel('after','<p>'+t('afterIntro')+'</p>'+link('retreat/intention','myIntention')+link('retreat/letter','letter')+reflection+'<div class="retreat-next-step"><h3>'+t('nextStep')+'</h3><div class="actions">'+link('journal','journal')+link('practice/meditation','meditate')+'</div></div>'+
    (signedIn?'<div class="actions">'+link('retreat-forms','intention')+link('retreat-connect','connect')+'</div>':''))
 };
 return '<a class="link" href="#today">'+t('back')+'</a><header class="retreat-feature retreat-hero">'+
  '<span class="eyebrow">BODY · MIND · SPIRIT</span><h1>RESTART RETREAT</h1><p class="retreat-edition">WHITE &amp; BLACK EXPERIENCE</p>'+
  (section?'':'<img class="retreat-photo retreat-cover" src="'+media+'villa.webp" alt="'+t('villa')+'" fetchpriority="high" decoding="async">'+
   renderRetreatOfficial(lang,{summaryOnly:true})+link('retreat/opening','opening'))+'</header>'+
  '<nav class="retreat-nav" aria-label="'+t('nav')+'">'+nav+'</nav>'+content[retreatSection(section)]();
}
