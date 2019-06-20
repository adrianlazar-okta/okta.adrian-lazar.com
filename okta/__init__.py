from flask import Flask
from okta.config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(Config)

    from okta.main.routes import main
    from okta.siw.routes import siw
    from okta.oauth2.routes import oauth2

    app.register_blueprint(main)
    app.register_blueprint(siw)
    app.register_blueprint(oauth2)

    return app