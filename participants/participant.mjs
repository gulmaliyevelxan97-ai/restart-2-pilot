import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.2/+esm';

const client=createClient('https://lpsudmemxqkywkpixgae.supabase.co',"sb_publishable_TF8t3aEV8EJWoVVCyKKrFA_tLo_-0e0",{
 auth:{flowType:'pkce',detectSessionInUrl:false,storageKey:'restart.participant.staging.auth.v1'}
});
const {auth}=client;
const callback=new URL('./',location.href).href;
const el=id=>document.getElementById(id);
const notice=message=>{el('status').textContent=message;};
let recovery=false;
function show(mode){
 for(const id of ['gate','login','recover','password','account']){
  el(id).hidden=mode==='login'?!['gate','login','recover'].includes(id):id!==mode;
 }
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
  if(failed){show('login');notice('Ссылка недействительна. Запросите новое письмо в этом браузере.');return;}
  const flowId=url.searchParams.get('sb_flow_id');
  const {data,error}=await auth.exchangeCodeForSession(code,flowId===null?undefined:{flowId});
  if(error){show('login');notice('Подтверждение могло пройти. Войдите или запросите новое письмо в этом браузере.');return;}
  recovery=data.redirectType==='recovery';
  show(recovery?'password':'account');
  notice(recovery?'Задайте новый пароль.':'Вход выполнен.');
  return;
 }
 const {data,error}=await auth.getSession();
 if(error) throw error;
 show(data.session?'account':'login');
 notice('');
}
guard('login',async ({email,password})=>{
 const {error}=await auth.signInWithPassword({email,password});
 if(error){notice(error.code==='email_not_confirmed'?'Подтвердите email по ссылке из письма.':'Проверьте email и пароль.');return;}
 el('login').reset();show('account');notice('');
});
guard('recover',async ({email})=>{
 const {error}=await auth.resetPasswordForEmail(email,{redirectTo:callback});
 notice(error?'Не удалось отправить письмо. Попробуйте позже.':'Если аккаунт существует, письмо придёт на этот адрес. Откройте его в том же браузере.');
});
guard('password',async ({password,confirmation})=>{
 if(!recovery) return;
 if(password!==confirmation||new TextEncoder().encode(password).length>72){notice('Пароли должны совпадать. Допустимо от 12 символов и не более 72 байт.');return;}
 const {error}=await auth.updateUser({password});
 if(error){notice('Не удалось сохранить пароль. Запросите новую ссылку или повторите попытку.');return;}
 const result=await auth.signOut({scope:'local'});
 if(result.error){notice('Пароль изменён. Закройте вкладку и войдите снова.');return;}
 recovery=false;el('password').reset();show('login');notice('Пароль изменён. Войдите с новым паролем.');
});
el('logout').onclick=async ()=>{
 const {error}=await auth.signOut({scope:'local'});
 if(error){notice('Не удалось завершить сеанс. Повторите попытку.');return;}
 show('login');notice('Вы вышли из аккаунта.');
};
initialize().catch(()=>notice('Не удалось загрузить форму. Обновите страницу.'));
