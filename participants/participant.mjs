import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.2/+esm';

const client=createClient('https://lpsudmemxqkywkpixgae.supabase.co',"sb_publishable_TF8t3aEV8EJWoVVCyKKrFA_tLo_-0e0",{
 auth:{flowType:'pkce',detectSessionInUrl:false,storageKey:'restart.participant.staging.auth.v1'}
});
const {auth}=client;
const callback=new URL('./',location.href).href;
const el=id=>document.getElementById(id);
const notice=message=>{el('status').textContent=message;};
let recovery=false;
const recoveryKey='restart.participant.recovery.user';
let accessRevision=0;
function show(mode){
 for(const id of ['gate','login','recover','recovery-code','password','account']){
  el(id).hidden=mode==='login'?!['gate','login','recover','recovery-code'].includes(id):id!==mode;
 }
 const revision=++accessRevision;
 el('retreat-access').textContent='';
 if(mode==='account') void refreshAccess(revision);
}

async function refreshAccess(revision){
 const target=el('retreat-access');
 target.textContent='Проверяем доступ к ретриту…';
 try{
  const identity=await auth.getUser();
  if(identity.error || !identity.data.user) throw new Error('Authentication required');
  const user=identity.data.user.id;
  const [membership,admission]=await Promise.all([
   client.from('restart_retreat_members').select('cohort_id').eq('user_id',user).eq('role','participant'),
   client.from('restart_retreat_admissions').select('status').eq('applicant_id',user).order('submitted_at',{ascending:false}).limit(1)
  ]);
  if(revision!==accessRevision) return;
  if(membership.error || admission.error) throw new Error('Access check failed');
  const cohorts=membership.data.map(row=>row.cohort_id);
  if(!cohorts.length){
   target.textContent=admission.data[0]?.status==='pending'?'Ваша заявка на рассмотрении.':'Закрытая программа доступна после одобрения заявки наставником.';
   return;
  }
  const programme=await client.from('restart_retreat_programme_items')
   .select('title,description,starts_at').in('cohort_id',cohorts).eq('published',true).order('starts_at').limit(100);
  if(revision!==accessRevision) return;
  if(programme.error) throw programme.error;
  target.textContent=programme.data.length?'Ваша программа ретрита':'Доступ подтверждён. Закрытое расписание пока не опубликовано.';
  if(!programme.data.length) return;
  const formatter=new Intl.DateTimeFormat('ru',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Baku'});
  const list=document.createElement('ul');
  for(const item of programme.data){
   const row=document.createElement('li');
   row.textContent=formatter.format(new Date(item.starts_at))+' · '+item.title;
   if(item.description){const text=document.createElement('p');text.textContent=item.description;row.append(text);}
   list.append(row);
  }
  target.append(list);
 }catch{
  if(revision===accessRevision) target.textContent='Не удалось проверить доступ. Обновите страницу и попробуйте снова.';
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
  if(failed){show('login');notice('Ссылка устарела или уже использована. Если в письме есть код, введите его ниже. Иначе запросите новое письмо и используйте только самое свежее.');return;}
  const flowId=url.searchParams.get('sb_flow_id');
  const {data,error}=await auth.exchangeCodeForSession(code,flowId===null?undefined:{flowId});
  if(error){show('login');notice('Подтверждение могло пройти. Войдите или запросите новое письмо в этом браузере.');return;}
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
guard('login',async ({email,password})=>{
 const {error}=await auth.signInWithPassword({email,password});
 if(error){notice(error.code==='email_not_confirmed'?'Подтвердите email по ссылке из письма.':'Проверьте email и пароль.');return;}
 sessionStorage.removeItem(recoveryKey);
 el('login').reset();show('account');notice('');
});
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
el('logout').onclick=async ()=>{
 const {error}=await auth.signOut({scope:'local'});
 if(error){notice('Не удалось завершить сеанс. Повторите попытку.');return;}
 sessionStorage.removeItem(recoveryKey);show('login');notice('Вы вышли из аккаунта.');
};
initialize().catch(()=>notice('Не удалось загрузить форму. Обновите страницу.'));
