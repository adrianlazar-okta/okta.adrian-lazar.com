from flask import render_template, url_for, redirect, request, Blueprint

siw = Blueprint('siw', __name__)

@siw.route("/siw")
def widget():
    return render_template("siw.html", static_url_path='/static')