from extentions import db
from models import User, Sys_Oper_Log, Setting
from flask import abort, session, current_app, request
from functools import wraps
import datetime
import uuid
from settings import *

def permission_can(current_user, permission):
    """
    检测用户是否有特定权限
    :param current_user
    :param permission
    :return:
    """
    role_id = current_user.role_id
    role = db.session.query(Role).filter_by(id=role_id).first()
    ret = (role.permissions & permission) == permission
    return ret


def permission_required(permission):
    """
    权限认证装饰器
    :param permission:
    :return:
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                admin_id = session.get('admin_id')
                current_user = User.query.filter_by(admin_id=admin_id).first()
                # 如果没有admin_id
                if current_user is None:
                    log_remarks = "not found the given id"
                    add_log(admin_id, log_remarks)
                    return Response(status=Macro.STATUS_EXCEPT, err_info="not found login user").r
                # 如果权限不够
                if current_user.admin_permission < permission:
                    log_remarks = "not enough permission"
                    add_log(admin_id, log_remarks)
                    return Response(status=Macro.STATUS_EXCEPT, err_info="not enough permission").r

                last_oper_time = session.get('last_oper_time')

                #如果last_oper_time空
                if last_oper_time is None:
                    log_remarks = "last oper time is None"
                    add_log(admin_id, log_remarks)
                    return Response(status=Macro.STATUS_FAIL, err_info='未获取最后活动时间').r
                #如果last_oper_time不空
                if last_oper_time is not None:
                    #判断当前时间到上次最后操作是否超时
                    curr_time = datetime.datetime.now()
                    span = curr_time-last_oper_time
                    setting = get_settings()
                    if span.total_seconds() > setting.session_keep_time:
                        log_remarks = "beyond session keep time"
                        add_log(admin_id, log_remarks)
                        return Response(status=Macro.STATUS_FAIL, err_info='未活动超时').r

                add_log(admin_id)
                return f(*args, **kwargs)
            except Exception as e:
                #发生了异常
                if len(e.args) > 0:
                    eargs = str(e.args[0])
                else:
                    eargs = 'no exception information'
                log_remarks = "excp: " + eargs[0:200]
                add_log(admin_id, log_remarks)
                print(e.args)
                return Response(status=Macro.STATUS_EXCEPT, err_info=eargs).r
                abort(403)
        return decorated_function
    return decorator

def parse_request_json(request,*keys):
    if request.is_json is not True:
        raise Exception("no json is posted")

    data = request.json
    value_list = []
    for key in keys:
        value = data.get(key)
        if value is None:
            raise Exception("key %s does not exist"%(key))
        else:
            #可以在这里对value进行合法性判断
            value_list.append(value)

    return tuple(value_list)

def get_settings():
    settings = Setting.query.filter_by().first()
    return settings

def write_dict(engine, dict, table_name):
    values = []
    for k,v in dict.items():
        if isinstance(v,str):
            values.append('\'%s\''%(v,))
        else:
            values.append(str(v))
    col_str = ",".join(dict.keys())
    value_str=",".join(values)
    sql = 'insert into %s (%s) values (%s)' % (table_name,col_str,value_str)
    current_app.logger.debug("write_dict_mysql. sql:{}".format(sql))

    conn = engine.connect()
    conn.execute(sql)
    conn.close()

def add_log(admin_id, remarks=None):
    sys_oper_log = Sys_Oper_Log(id=uuid.uuid1(), oper_url=request.path, oper_ip=request.remote_addr,
                                user_id=admin_id, oper_time=datetime.datetime.now(),remarks=remarks)
    db.session.add(sys_oper_log)
    db.session.commit()