from flask import render_template, url_for, redirect, request, Blueprint

main = Blueprint('main', __name__)

@main.route("/")
def home():
    return render_template("home.html", static_url_path='/static')