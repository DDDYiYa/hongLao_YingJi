from extentions import *
from models import *
from methods import permission_required, parse_request_json, get_settings, add_log
from flask import Blueprint, session, request, jsonify
from settings import Response, Macro
import os, uuid, datetime

from conf import conf_linkword
import platform
import logging
from logging.handlers import RotatingFileHandler
from settings import global_vars
from sqlalchemy import create_engine


auth_bp = Blueprint('auth',__name__)

@auth_bp.route('/login',methods=['POST'])
def login():
    try:
        #获取用户名和密码
        admin_id, passwd = parse_request_json(request, 'id', 'pwd')

        #验证用户是否存在
        user = User.query.filter_by(admin_id=admin_id).first()
        #如果user是None，说明密码不对
        if user is None:
            #返回异常
            log_remarks = "wrong user_id"
            add_log(admin_id, log_remarks)
            return Response(status=Macro.STATUS_FAIL, err_info='错误的用户名或密码').r

        #判断登录失败次数和时间
        setting = get_settings()
        #如果达到最大失败次数
        if user.continous_fail_times >= setting.continous_fail_times_limit:
            #计算当前时间和上次最后失败时间
            span = datetime.datetime.now() - user.last_fail_time
            # 判断是否达到冷却时间，当前时间-上次失败时间是否超过冷却时间。
            # 如果未超过，则返回失败
            # 如果超过，则继续登录流程
            if span.total_seconds() < setting.fail_cool_down_time:
                data = {'time':setting.fail_cool_down_time-int(span.total_seconds())}
                log_remarks = "not reach cool down time"
                add_log(admin_id, log_remarks)
                return Response(status=Macro.STATUS_FAIL, data=data, err_info='连续登录失败冷却时间').r


        #验证用户名和密码，如果验证失败
        if user.password != passwd:
            #增加次数和时间
            user.continous_fail_times += 1
            user.last_fail_time = datetime.datetime.now()
            db.session.commit()
            #记录错误信息
            log_remarks = "wrong password"
            add_log(admin_id, log_remarks)
            #返回错误信息
            return Response(status=Macro.STATUS_FAIL, err_info='错误的用户名或密码').r

        #清除错误信息
        user.continous_fail_times = 0
        user.last_fail_time = None
        #密码正确，给session赋值，以后访问就带着session来
        session['admin_id'] = user.admin_id
        session['permission'] = user.admin_permission
        #记录最后操作时间
        session['last_oper_time'] = datetime.datetime.now()

        log_remarks = "login success"
        add_log(admin_id,log_remarks)
        #sys_oper_log = Sys_Oper_Log(id=uuid.uuid1(), oper_url=request.path, oper_ip=request.remote_addr,
        #                            user_id=admin_id, oper_time=datetime.datetime.now())
        #db.session.add(sys_oper_log)
        #db.session.commit()

        return Response(status=Macro.STATUS_SUCCESS).r
    except Exception as e:
        return Response(status=Macro.STATUS_EXCEPT, err_info=str(e.args)).r


@auth_bp.route('/logout',methods=['GET'])
@permission_required(Permissions.USER)
def logout():
    session['admin_id'] = ""
    session['permission'] = 0
    return Response(status=Macro.STATUS_SUCCESS).r