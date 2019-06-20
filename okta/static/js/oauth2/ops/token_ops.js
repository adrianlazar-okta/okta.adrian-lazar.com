/* 
Simple JS file for testing token revoke and introspect. Can be used in conjuction with okta-auth-js.

I have made these function due to the fact that they are not available in the above mentioned library. 

**** DISCLAIMER ****
************************************************************************************************
The script is provided AS IS without warranty of any kind. Okta disclaims all implied warranties 
including, without limitation, any implied warranties of fitness for a particular purpose. 
We highly recommend testing scripts in a preview environment if possible.
************************************************************************************************

Access Token should be obtained via any methods available.

In this sample I am obtaining it from the local storage. -- NOT SAFE. 

*/
var tokens = JSON.parse(localStorage.getItem("tokens"));
if(tokens){
  var accessToken = tokens["access_token"];
  var idToken = tokens["id_token"];
  var baseUrl = 'https://adrian.oktapreview.com/oauth2/default'
  var client_id = '0oal6qgrjh4eMogkU0h7'
  var client_secret = '{CLIENT_SECRET_HERE}' // Only available for Web Apps. 
  var params = {
    'client_id': client_id, // Necessary only for Native apps.
    'token' : accessToken, // obtained via any methods possible, declared above. 
    'token_type_hint': 'access_token',
  }
  var requestHeaders = new Headers({
    //'Authorization':'Basic '+btoa(client_id)+':'+btoa(client_secret), // required for Web Apps (frontend + backend),
    // Do not include the Authorization header for Native apps. 
    'Accept':'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  })
  async function revokeToken(){
    const data = Object.keys(params).map((key) =>{
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');  
    localStorage.removeItem("tokens");
    return await fetch(baseUrl+'/v1/revoke', {
      method:'POST', 
      headers: requestHeaders,
      body: data
    })
  }
  async function introspectToken(){
    const data = Object.keys(params).map((key) =>{
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');  
    localStorage.removeItem("tokens");
    let res =  await fetch(baseUrl+'/v1/introspect', {
      method:'POST', 
      headers: requestHeaders,
      body: data
    })
    return await res.json()
  }
  function revoke(){
    revokeToken().then(res => {
      switch(res.status){
        case 200:
          console.log(res)
          console.log('Token Revoked!')
          break
        case 400:
          console.log(res)
          console.log('Bad Request')
          break
        default:
          console.log(res)
      }
  })
  }
  function introspect(){
    introspectToken().then(res =>{
      switch(res['active']){
        case false:
          console.log(res)
          console.log('Token is no longer active')
          break
        case true:
          console.log(res)
          console.log('Token is still active')
      }
    })
  }
  
  // the bellow assumes you have two empty <div> ellemnts with ids revoke and instrospect. 
  document.getElementById('revoke').innerHTML = "<button onclick='revoke()'>revoke</button>"
  document.getElementById('introspect').innerHTML = "<button onclick='introspect()'>introspect</button>"
}


// author: Adrian Lazar. 