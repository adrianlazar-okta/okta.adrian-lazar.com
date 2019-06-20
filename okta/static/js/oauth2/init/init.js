const whitelisted = "https://adrian.oktapreview.com"
let allowed = false; 
async function getIssuer(){
    let urlParams = new URLSearchParams(window.location.search);
    let issuer = await urlParams.get("iss")
    if(issuer){
        if(issuer === whitelisted){
            return allowed = true;
        }
    }
}
getIssuer().then(function(allowed){
    if(allowed){
        const baseUrl = 'https://adrian.oktapreview.com/oauth2/default/v1/authorize?';
        const reqUrl = 'client_id=0oal6qgrjh4eMogkU0h7&response_type=code&response_mode=query&scope=openid offline_access&state=state&nonce=nonce&redirect_uri=https://adrian-lazar.com/oauth2/auth-code-pkce/callback';
        const challengeUrl = '&code_challenge_method=S256&code_challenge=IhpeaGlepSmLZGs-YYs_MO4QN56I_Drs89kGpCoL-S8';
        window.location.replace(baseUrl+reqUrl+challengeUrl);
    }
})