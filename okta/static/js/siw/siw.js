const urlParams = new URLSearchParams(window.location.search);
const stateToken = urlParams.get('stateToken');
const fromURI = urlParams.get('fromURI');
var stateAuth = false;
var config = {
    baseUrl: 'https://adrian.oktapreview.com',
    helpLinks: {
        help: 'https://google.com'
    },
    features:{
        idpDiscovery: true
    }
    
}
if(stateToken){
    config.stateToken = stateToken;
    stateAuth = true
}
const signIn = new OktaSignIn(config)
switch(stateAuth){
    case true:
        signIn.renderEl(
            // Assumes there is an empty element on the page with an id of 'okta-sign-in'
            {el: '#widget-container'},
            function success(res){
                if (res.status === 'SUCCESS') { 
                    if (res.type === 'SESSION_STEP_UP') {
                        // Session step up response
                        // If the widget is not configured for OIDC and the authentication type is SESSION_STEP_UP,
                        // the response will contain user metadata and a stepUp object with the url of the resource
                        // and a 'finish' function to navigate to that u
                        console.log(res.type);
                        console.log(res.user);
                        console.log('Target resource url: ' + res.stepUp.url);
                        res.stepUp.finish();
                       return;
                    }
                }
                else if (res.status === 'IDP_DISCOVERY') {
                    var username = document.getElementById("idp-discovery-username").value;
                    var xhttp = new XMLHttpRequest();
                    var orgUrl = "https://adrian.oktapreview.com/";
                    var webFingerUrl = orgUrl+".well-known/webfinger?resource="+encodeURIComponent("okta:acct:"+username);
                    var finalRedirectUrl = orgUrl+'/home/salesforce-fedid/0oajzqim70lZJg8ft0h7/1277';
                    xhttp.open("GET", webFingerUrl, true);
                    xhttp.responseType = "json";
                    xhttp.send();
                    xhttp.onload = function(){
                      var response = xhttp.response;
                      var link = response.links[0].href;
                      var idp = link.slice(0, (link.length - 1)); // slincing is required to remove the '#' from the end of the idp link. 
                      window.location.href = idp+"&fromURI="+encodeURIComponent(finalRedirectUrl);
                    } 
                }
                else{console.log(res.status)}
            },
            function error(err){
                console.log(err)
            });
        break;
    case false:
        signIn.session.get(function (res){
            if(res.status === 'INACTIVE'){
                signIn.renderEl(
                    // Assumes there is an empty element on the page with an id of 'osw-container'
                    {el: '#widget-container'},
                    function success(res){
                        if (res.status === 'SUCCESS') {
                            if(!fromURI){
                                res.session.setCookieAndRedirect("/");
                            }else{
                                res.session.setCookieAndRedirect(fromURI);
                            }
                        }
                        else if (res.status === 'IDP_DISCOVERY') {
                            var username = document.getElementById("idp-discovery-username").value;
                            var xhttp = new XMLHttpRequest();
                            var orgUrl = "https://adrian.oktapreview.com/";
                            var webFingerUrl = orgUrl+".well-known/webfinger?resource="+encodeURIComponent("okta:acct:"+username);
                            var finalRedirectUrl = orgUrl+'/home/salesforce-fedid/0oajzqim70lZJg8ft0h7/1277';
                            xhttp.open("GET", webFingerUrl, true);
                            xhttp.responseType = "json";
                            xhttp.send();
                            xhttp.onload = function(){
                              var response = xhttp.response;
                              var link = response.links[0].href;
                              var idp = link.slice(0, (link.length - 1)); // slincing is required to remove the '#' from the end of the idp link. 
                              window.location.href = idp+"&fromURI="+encodeURIComponent(finalRedirectUrl);
                            }
                        }
                        else{console.log(res.status)}
                    },
                    function error(err){
                        console.log(err);
                    });
            }else if(res.status === 'ACTIVE'){
                console.log(res);
                console.log("https://adrian.oktapreview.com/login/signout");
                window.open("https://adrian.oktapreview.com/login/signout");
                window.location.reload();
            }
        });
        break;
}