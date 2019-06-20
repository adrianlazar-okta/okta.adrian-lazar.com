from flask import render_template, url_for, redirect, request, Blueprint

oauth2 = Blueprint('oauth2', __name__)

@oauth2.route("/oauth2")
def oauth():
    return redirect(url_for("oauth2.auth_code_pkce"))

@oauth2.route("/oauth2/auth-code-pkce")
def auth_code_pkce():
    return render_template("auth_code_pkce.html", static_url_path='/static', title="Auth Code with PKCE")

@oauth2.route("/oauth2/auth-code-pkce/callback")
def auth_code_pkce_callback():
    return render_template("auth_code_pkce_callback.html", static_url_path='/static', title="Redirecting")

@oauth2.route("/oauth2/init")
def init():
    return render_template("init.html", static_url_path='/static', title="Initializing...")