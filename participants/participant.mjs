import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.2/+esm';

const client=createClient('https://lpsudmemxqkywkpixgae.supabase.co',"sb_publishable_TF8t3aEV8EJWoVVCyKKrFA_tLo_-0e0",{
 auth:{flowType:'pkce',detectSessionInUrl:false,storageKey:'restart.participant.staging.auth.v1'}
});
const {auth}=client;
const callback=new URL('./',location.href).href;
const confirmationHelp='Подтвердите email по ссылке из последнего письма RESTART, затем войдите с паролем, который создали. Если письма нет, проверьте «Спам» или отправьте письмо ещё раз.';
const el=id=>document.getElementById(id);
const notice=message=>{
 const status=el('status');
 status.textContent=message;
 if(message) status.focus();
};
let recovery=false;
const recoveryKey='restart.participant.recovery.user';
const invitationKey='restart.participant.pending-invitation.v1';
const invitationPattern=/^[a-f0-9]{64}$/;
let pendingInvitation;

function rememberInvitation(){
 const url=new URL(location.href);
 const candidate=new URLSearchParams(url.hash.slice(1)).get('invite');
 if(candidate!==null){
  if(!invitationPattern.test(candidate)) return;
  pendingInvitation=candidate;
  try{localStorage.setItem(invitationKey,candidate);}catch{}
  history.replaceState(null,'',url.pathname+url.search);
 }else{
  try{
   const saved=localStorage.getItem(invitationKey);
   if(invitationPattern.test(saved??'')) pendingInvitation=saved;
  }catch{}
 }
}
function forgetInvitation(){
 pendingInvitation=undefined;
 try{localStorage.removeItem(invitationKey);}catch{}
}
const intakePattern=/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
async function intakeCohort(){
 const {data,error}=await client.rpc('restart_public_retreat_intake');
 return !error && typeof data==='string' && intakePattern.test(data)?data:null;
}
let accessRevision=0;
function show(mode){
 for(const id of ['gate','login','recover','recovery-code','password','account']){
  el(id).hidden=mode==='login'?!['gate','login','recover','recovery-code'].includes(id):id!==mode;
 }
 el('resend-confirmation').hidden=true;
 el('register').hidden=true;
 el('invitation-note').hidden=mode!=='login'||!pendingInvitation;
 const revision=++accessRevision;
 if(mode==='login') void updateRegistration(revision);
 el('retreat-access').textContent='';
 el('retreat-access').removeAttribute('aria-busy');
 if(mode==='account') void refreshAccess(revision);
}

async function updateRegistration(revision){
 try{
  const cohort=await intakeCohort();
  if(revision===accessRevision && cohort){el('register').hidden=false;el('gate').hidden=true;}
 }catch{}
}

async function refreshAccess(revision){
 const target=el('retreat-access');
 const button=el('refresh-access');
 button.disabled=true;
 target.setAttribute('aria-busy','true');
 target.textContent='Проверяем доступ к ретриту…';
 try{
  const identity=await auth.getUser();
  if(identity.error || !identity.data.user) throw new Error('Authentication required');
  const user=identity.data.user.id;
  let invitationRejected=false;
  if(pendingInvitation){
   const {error}=await client.rpc('restart_redeem_retreat_invitation',{p_token:pendingInvitation});
   if(revision!==accessRevision) return;
   if(error && error.code!=='42501') throw error;
   invitationRejected=Boolean(error);
   forgetInvitation();
  }
  const membership=await client.from('restart_retreat_members').select('cohort_id').eq('user_id',user).eq('role','participant');
  if(revision!==accessRevision) return;
  if(membership.error) throw new Error('Access check failed');
  const cohorts=membership.data.map(row=>row.cohort_id);
  if(!cohorts.length){
   target.textContent=invitationRejected
    ?'Приглашение недействительно, использовано или предназначено для другого email. Откройте свою личную ссылку или обратитесь к организатору.'
    :'Откройте личную ссылку-приглашение в этом браузере. Доступ к программе откроется автоматически после входа.';
   return;
  }
  const [programme,details]=await Promise.all([
   client.from('restart_retreat_programme_items')
    .select('title,description,starts_at').in('cohort_id',cohorts).eq('published',true).order('starts_at').limit(100),
   client.from('restart_retreat_event_details').select('location').in('cohort_id',cohorts).eq('published',true)
  ]);
  if(revision!==accessRevision) return;
  if(programme.error) throw programme.error;
  target.textContent=programme.data.length?'Ваша программа ретрита':'Доступ подтверждён. Закрытое расписание пока не опубликовано.';
  const map=details.data?.find(row=>/^https:\/\/maps\.app\.goo\.gl\/[A-Za-z0-9]+(?:\?g_st=ac)?$/.test(row.location))?.location;
  if(map){
   const directions=document.createElement('a');
   directions.href=map;
   directions.target='_blank';
   directions.rel='noopener noreferrer';
   directions.textContent='Построить маршрут';
   target.append(directions);
  }
  const preparation=document.createElement('a');
  preparation.href='../app/#retreat/preparation';
  preparation.textContent='Открыть подготовку в приложении';
  target.append(preparation);
  if(!programme.data.length) return;
  const formatter=new Intl.DateTimeFormat('ru',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Baku'});
  const list=document.createElement('ol');
  list.className='approved-timeline';
  for(const item of programme.data){
   const row=document.createElement('li');
   row.textContent=formatter.format(new Date(item.starts_at))+' · '+item.title;
   if(item.description){const text=document.createElement('p');text.textContent=item.description;row.append(text);}
   list.append(row);
  }
  target.append(list);
 }catch{
  if(revision===accessRevision) target.textContent='Не удалось проверить доступ. Нажмите «Обновить статус и программу», чтобы повторить.';
 }finally{
  if(revision===accessRevision){
   button.disabled=false;
   target.removeAttribute('aria-busy');
  }
 }
}
function openRecovery(session){
 if(!session?.user?.id) throw new Error('Missing recovery session');
 recovery=true;
 sessionStorage.setItem(recoveryKey,session.user.id);
 show('password');
 notice('Задайте новый пароль.');
}

function guard(id,operation){
 const form=el(id);
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  const button=form.querySelector('button');
  if(button.disabled) return;
  button.disabled=true;
  try{await operation(Object.fromEntries(new FormData(form)));}
  catch{notice('Запрос не завершился. Проверьте соединение и повторите попытку.');}
  finally{button.disabled=false;}
 });
}

async function initialize(){
 const url=new URL(location.href);
 const code=url.searchParams.get('code');
 const fragment=new URLSearchParams(url.hash.slice(1));
 const failed=url.searchParams.has('error')||url.searchParams.has('error_code')||fragment.has('error')||
  fragment.has('error_code')||fragment.has('access_token')||fragment.has('refresh_token');
 if(code||failed){
  history.replaceState(null,'',url.pathname);
  if(failed){
   show('login');
   el('resend-confirmation').hidden=false;
   if(fragment.get('type')==='signup' && fragment.has('access_token') && !fragment.has('error') && !fragment.has('error_code')){
    notice('После перехода по ссылке войдите с паролем, который вы создали при регистрации.');
   }else{
    notice('Ссылка устарела или уже использована. Если email уже подтверждён, войдите. Иначе запросите новое письмо подтверждения. Код восстановления вводится отдельно.');
   }
   return;
  }
  const flowId=url.searchParams.get('sb_flow_id');
  const {data,error}=await auth.exchangeCodeForSession(code,flowId===null?undefined:{flowId});
  if(error){show('login');el('resend-confirmation').hidden=false;notice('Если вы уже нажали ссылку в письме, попробуйте войти с паролем. Если email ещё не подтверждён, отправьте письмо повторно и откройте его в этом браузере.');return;}
  if(data.redirectType==='recovery') openRecovery(data.session);
  else {sessionStorage.removeItem(recoveryKey);show('account');notice('Вход выполнен.');}
  return;
 }
 const {data,error}=await auth.getSession();
 if(error) throw error;
 if(data.session && sessionStorage.getItem(recoveryKey)===data.session.user.id) {openRecovery(data.session);return;}
 sessionStorage.removeItem(recoveryKey);
 show(data.session?'account':'login');
 notice('');
}
function validName(name){
 return name.length>0 && name.length<=160 && !/[\u0000-\u001f\u007f-\u009f]/u.test(name);
}
guard('register',async ({firstName,lastName,email,password,confirmation,consent})=>{
 const name=firstName.trim()+' '+lastName.trim();
 if(!validName(firstName.trim()) || !validName(lastName.trim()) || !validName(name) || consent!=='yes'){
  notice('Проверьте имя, фамилию и согласие.');return;
 }
 if(password!==confirmation || Array.from(password).length<12 || new TextEncoder().encode(password).length>72){
  notice('Пароли должны совпадать. Допустимо от 12 символов и не более 72 байт.');return;
 }
 if(!await intakeCohort()){show('login');notice('Регистрация пока закрыта.');return;}
 const {data,error}=await auth.signUp({email,password,options:{emailRedirectTo:callback,data:{full_name:name,registration_data_consent_version:1}}});
 if(error){notice(error.status===429?'Слишком много запросов. Подождите и проверьте последнее письмо.':'Регистрация не завершилась. Проверьте данные или обратитесь к организатору.');return;}
 el('register').reset();
 if(data.session){await auth.signOut({scope:'local'});show('login');notice('Регистрация временно недоступна. Обратитесь к организатору.');return;}
 el('login').elements.email.value=email;
 el('resend-confirmation').hidden=false;
 notice('Запрос на регистрацию принят. Откройте последнее письмо RESTART в этом браузере и подтвердите email. Затем войдите со своим паролем.');
});
guard('login',async ({email,password})=>{
 const {error}=await auth.signInWithPassword({email,password});
 if(error){
  if(error.code==='email_not_confirmed'){
   el('resend-confirmation').hidden=false;
   notice(confirmationHelp);
  }else if(error.status===429) notice('Слишком много попыток. Подождите перед повторным входом.');
  else if(error.code==='invalid_credentials'){
   el('recover').elements.email.value=email;
   notice('Email или пароль не совпадают. Проверьте, что используете данные регистрации. Если забыли пароль, нажмите «Восстановить пароль» и введите код из письма.');
  }else notice('Не удалось войти. Проверьте соединение и попробуйте снова.');
  return;
 }
 sessionStorage.removeItem(recoveryKey);
 el('login').reset();show('account');notice('');
});
el('resend-confirmation').onclick=async ()=>{
 const action=el('resend-confirmation');
 const email=el('login').elements.email;
 if(!email.reportValidity() || action.disabled) return;
 action.disabled=true;
 try{
  const {error}=await auth.resend({type:'signup',email:email.value.trim(),options:{emailRedirectTo:callback}});
  if(error){notice(error.status===429?'Письмо уже запрашивали недавно. Подождите и проверьте последнее письмо RESTART.':'Не удалось повторно отправить письмо. Попробуйте позже.');return;}
  notice('Если адрес ожидает подтверждения, на него придёт письмо RESTART. Откройте самую свежую ссылку в этом браузере.');
 }catch{
  notice('Не удалось отправить запрос. Проверьте соединение и попробуйте снова.');
 }finally{
  action.disabled=false;
 }
};
guard('recover',async ({email})=>{
 const {error}=await auth.resetPasswordForEmail(email,{redirectTo:callback});
 if(error){
  notice(error.status===429?'Запросы отправляются слишком часто. Подождите перед повтором и используйте последнее письмо.':'Не удалось отправить письмо. Попробуйте позже.');
  return;
 }
 el('recovery-code').elements.email.value=email;
 notice('Если аккаунт существует, письмо придёт на этот адрес. Введите код из письма. Если в письме только ссылка, откройте её в том же браузере.');
});
guard('recovery-code',async ({email,code})=>{
 if(!/^[0-9]{6,10}$/.test(code)) {notice('Введите код из последнего письма.');return;}
 const {data,error}=await auth.verifyOtp({email,token:code,type:'recovery'});
 if(error){notice(error.status===429?'Слишком много попыток. Подождите перед повтором.':'Код недействителен или истёк. Используйте код из самого свежего письма.');return;}
 el('recovery-code').reset();
 openRecovery(data.session);
});
guard('password',async ({password,confirmation})=>{
 if(!recovery) return;
 if(password!==confirmation||new TextEncoder().encode(password).length>72){notice('Пароли должны совпадать. Допустимо от 12 символов и не более 72 байт.');return;}
 const {error}=await auth.updateUser({password});
 if(error){notice('Не удалось сохранить пароль. Запросите новую ссылку или повторите попытку.');return;}
 const result=await auth.signOut({scope:'local'});
 if(result.error){notice('Пароль изменён. Закройте вкладку и войдите снова.');return;}
 recovery=false;sessionStorage.removeItem(recoveryKey);el('password').reset();show('login');notice('Пароль изменён. Войдите с новым паролем.');
});
el('refresh-access').onclick=()=>{
 if(!el('account').hidden && !el('refresh-access').disabled) void refreshAccess(++accessRevision);
};
el('logout').onclick=async ()=>{
 const {error}=await auth.signOut({scope:'local'});
 if(error){notice('Не удалось завершить сеанс. Повторите попытку.');return;}
 forgetInvitation();
 sessionStorage.removeItem(recoveryKey);show('login');notice('Вы вышли из аккаунта.');
};
rememberInvitation();
initialize().catch(()=>notice('Не удалось загрузить форму. Обновите страницу.'));
