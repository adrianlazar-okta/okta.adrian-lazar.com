const urlParams = new URLSearchParams(window.location.search);
const codeParam = urlParams.get('code');
const errorParam = urlParams.get('error');
window.history.pushState({}, document.title, window.location.pathname);
/*
var cid = "0oal6mfz26AjZxyrB0h7";
var cs = "6STcomfPqmHWxTRMCpVKAoaR4qKSXy4pZJz2W7WM";
var stringCreds = cid+":"+cs
const creds = btoa(stringCreds)
*/
params = {
    'client_id': '0oalodlmorsn9KQ1y0h7',
    'code_verifier':'A5uyCtm4CzVZPouivbXKNcoSOGwARWUZXW265fvLT1XT8',
    'grant_type':'authorization_code',
    'code': codeParam,
    'redirect_uri':'https://okta.adrian-lazar.com/oauth2/auth-code-pkce/callback'
  }
  const data = Object.keys(params).map((key) =>{
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&');  

async function postToken(){
    let resp = await fetch("https://adrian.oktapreview.com/oauth2/default/v1/token", {
        method:'POST', 
        mode: 'cors',
        headers: new Headers({
            'Accept':'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        credentials:'omit',
        body: data
    
    });
    let res = await resp.json();
    return res
  }
if(errorParam){
  console.log(errorParam);
  console.log('Error. This should have returned me to the custom error URL set in Okta.');
}else{
  postToken().then(res => {
    if("id_token" in res){
      console.log('it is here');
      localStorage.setItem("tokens",JSON.stringify(res));
    }
      window.location.replace("https://okta.adrian-lazar.com/oauth2/auth-code-pkce");
  })  
}

