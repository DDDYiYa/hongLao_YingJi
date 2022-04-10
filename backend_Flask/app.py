from flask import Flask
from extentions import *
from models import *
from methods import permission_required, parse_request_json
from flask import session, request, jsonify
import os
from conf import conf_linkword
import platform
import logging
from logging.handlers import RotatingFileHandler
from settings import global_vars, app
from sqlalchemy import create_engine
from blueprints.auth import auth_bp
from blueprints.manage import manage_bp
from blueprints.test_pf import test_pf_bp




@app.route('/')
# @permission_required(Permissions.SUPER_ADMIN)
def hello_world():
    return jsonify('Hello World!')


#初始化logger
def initialize_logger():
    sys = platform.system()
    if sys == 'Windows':
        logFormatter = logging.Formatter("[%(asctime)s %(levelname)s %(filename)s:%(lineno)d %(funcName)s] %(message)s")
        fileHandler = RotatingFileHandler(
            "log/error.log",
            maxBytes=2 * 1024 * 1024,
            backupCount=3,
            encoding="UTF-8")
        fileHandler.setFormatter(logFormatter)
        app.logger.addHandler(fileHandler)
        app.logger.setLevel(logging.DEBUG)
    else:
        # 设置log输出方法为gunicorn，在log文件夹下
        # 使用gunicorn的logger。当使用gunicorn来调用app模块的时候，会有gunicorn.error
        gunicorn_logger = logging.getLogger('gunicorn.error')
        # 把app.logger的handler设置为gunicorn_logger的handler，在程序其他地方调用app.logger，等同于调用gunicorn_logger的handler
        app.logger.handlers = gunicorn_logger.handlers
        app.logger.setLevel(gunicorn_logger.level)
        # log输出
        app.logger.debug(sys)
        app.logger.debug("app_start")

#获取数据库的linkword
def get_linkword():
    linkword = os.getenv('LKW', default=None)
    #如果linkword为空，则从ini里读取
    if not linkword:
        linkword = conf_linkword
    return linkword

#测试数据库连同
def test_db():
    try:
        app.logger.info("testing mysql conn")
        conn = global_vars.db_engine.connect()
        sql = 'select version()'
        ret = conn.execute(sql).fetchall()
        app.logger.info("testing result: {}".format(ret))
        conn.close()
        app.logger.info("connected mysql successfully")
        return True
    except Exception as e:
        print("fail to connect to mysql")
        app.logger.error("fail to connect to mysql")
        app.logger.error(e.args[0])
        return False



#initialization
def init_app(app):
    # 跨域请求
    cors.init_app(app, resources=r'/*', supports_credentials=True)

    app.secret_key = "ACMilan1899"

    # 登录配置
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Unauthorized User'
    login_manager.login_message_category = "info"


    # 自动任务
    #scheduler.init_app(app)
    #scheduler.start()

    #sqlalchemy
    linkword = get_linkword()
    app.config["SQLALCHEMY_DATABASE_URI"] = linkword
    app.config["SQLALCHEMY_ECHO"] = True
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)

    #initial db engine and test
    global_vars.db_engine = create_engine(linkword, pool_recycle=60, pool_size=0)
    if not test_db():
        app.logger.error("fail to connect to database, exit")
        exit(-1)

    #注册bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(manage_bp, url_prefix='/manage')
    app.register_blueprint(test_pf_bp, url_prefix='/test_pf')

    return app


if __name__ != '__main__':
    print('app start')
    initialize_logger()
    app = init_app(app)
    with app.app_context():
        Setting.init_setting()
    app.run()
