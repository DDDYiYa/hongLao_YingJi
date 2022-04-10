from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from flask_apscheduler import APScheduler
from flask import Flask

db = SQLAlchemy()
login_manager = LoginManager()
cors = CORS()
scheduler = APScheduler()
app = Flask('GENERAL_FRAME')