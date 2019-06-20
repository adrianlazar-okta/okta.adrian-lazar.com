var signIn = new OktaSignIn({
    baseUrl: 'https://adrian.oktapreview.com',
    i18n: {
      // Overriding English properties
      en: {
        "primaryauth.title": "OIDC - Authorization Code with PKCE",
        "primaryauth.submit": "Sign In"
      },
    }
  });
  
var isSession = '';
var rez = [];
async function revokeToken(){
  var tokens = JSON.parse(localStorage.getItem("tokens"));
  var accessToken = tokens["access_token"];
  var idToken = tokens["id_token"];
  params = {
    'client_id': '0oalodlmorsn9KQ1y0h7',
    'token' : accessToken,
    'token_type_hint': 'access_token',
  }
  const data = Object.keys(params).map((key) =>{
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&');  
  localStorage.removeItem("tokens");
  return await fetch("https://adrian.oktapreview.com/oauth2/default/v1/revoke", {
    method:'POST', 
    headers: new Headers({
        'Accept':'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    }),
    body: data
  });
};
function logout(){
  return clearSession().then(revokeToken()).then(response => window.location.replace(window.location))
}

async function clearSession(){
  return await fetch("https://adrian.oktapreview.com/api/v1/sessions/me",{method: 'DELETE', credentials: 'include'});
}
async function getSession(){
  let res = await fetch('https://adrian.oktapreview.com/api/v1/sessions/me', {credentials: 'include'});
  rez = [res, await res.json()]
  return rez
}

getSession().then(rez =>  {
  switch(rez[0].status){
      case 404:
         isSession = false
          break;
      case 200:
          isSession = true
          break;
  }
  if(!isSession){
    signIn.renderEl(
      // Assumes there is an empty element on the page with an id of 'osw-container'
      {el: '#widget-container'},
      function success(res){
          if (res.status === 'SUCCESS') { 
          
              if (res.type === 'SESSION_STEP_UP') {
                  // Session step up response
                  // If the widget is not configured for OIDC and the authentication type is SESSION_STEP_UP,
                  // the response will contain user metadata and a stepUp object with the url of the resource
                  // and a 'finish' function to navigate to that url
                  console.log(res.user);
                  console.log('Target resource url: ' + res.stepUp.url);
                  res.stepUp.finish();
                  return;
                }
              const baseUrl = 'https://adrian.oktapreview.com/oauth2/default/v1/authorize?';
              const sessionToken = res.session.token;
              const reqUrl = 'client_id=0oalodlmorsn9KQ1y0h7&response_type=code&response_mode=query&scope=openid offline_access&state=state&nonce=nonce&redirect_uri=https://okta.adrian-lazar.com/oauth2/auth-code-pkce/callback&sessionToken='+sessionToken;
              const challengeUrl = '&code_challenge_method=S256&code_challenge=IhpeaGlepSmLZGs-YYs_MO4QN56I_Drs89kGpCoL-S8'
              window.location.replace(baseUrl+reqUrl+challengeUrl);      
            }
      }
  )
  }
  if(isSession){
    var tokens = JSON.parse(localStorage.getItem("tokens"));
    if(tokens){
      var accessToken = tokens["access_token"];
      var idToken = tokens["id_token"];
      var split = idToken.split(".", 3);
      var header = JSON.parse(atob(split[0]));
      var payload = JSON.parse(atob(split[1]));
      //var signature = JSON.parse(atob(split[2]));
      document.getElementById("idToken").innerHTML ="<h2>ID Token:</h2>";
      document.getElementById("idTokenPayload").innerHTML =idToken;
      var h = document.createElement('P')
      h.innerHTML = "<b>Header:</b>"
      var p = document.createElement('P')
      p.innerHTML = "<b>Payload:</b>"
      document.getElementById("idTokenPayload").appendChild(h);   
      for(i in header){
        var y = document.createElement('P')
        var x = document.createElement('code');
        x.innerHTML = i + " : "+ header[i];
        document.getElementById("idTokenPayload").appendChild(x);
        document.getElementById("idTokenPayload").appendChild(y);
      }
      document.getElementById("idTokenPayload").appendChild(p);   
      for(i in payload){
        var y = document.createElement('P')
        var x = document.createElement('code');
        x.innerHTML = i + " : "+ payload[i];
        document.getElementById("idTokenPayload").appendChild(x);
        document.getElementById("idTokenPayload").appendChild(y);
      }/*
      for(i in signature){
        var y = document.createElement('P')
        var x = document.createElement('code');
        x.innerHTML = i + " : "+ signature[i];
        document.getElementById("idTokenPayload").appendChild(x);
        document.getElementById("idTokenPayload").appendChild(y);        
      }*/
      document.getElementById("accessToken").innerHTML ="Access Token: "+accessToken;   
    }
    /*
    var rvk = document.createElement('div')
    rvk.innerHTML= "<button onclick='revokeToken()'>Revoke Token</button>";
    document.body.appendChild(btn);*/
    document.getElementById('logout').innerHTML = "<button onclick='logout()'>Log Out</button>";
    infoList = ["<b>The Logout function will delete the Okta session And Revoke the Access Token.</b>", "ID Tokens can not be revoked."]
    for(i in infoList){
      var info = document.createElement('P');
      info.innerHTML = infoList[i]
      document.getElementById("logout").appendChild(info)
    }
  }
  //localStorage.removeItem("tokens");
});
