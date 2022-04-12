from email.policy import default
from enum import unique
from extentions import db
from settings import Permissions


class User(db.Model):
    """
    用户表
    """
    __tablename__ = "admin_table"
    admin_id = db.Column(db.Integer, primary_key=True)
    admin_name = db.Column(db.String(128), unique=True)
    password = db.Column(db.String(128))
    admin_permission = db.Column(db.Integer)
    continous_fail_times = db.Column(db.Integer)
    last_fail_time = db.Column(db.DateTime)

    def __init__(self, name, password):
        self.name = name
        self.password = password
        self.admin_type = None


class Sys_Oper_Log(db.Model):
    __tablename__ = "sys_oper_log"
    id = db.Column(db.String(100),primary_key=True)
    oper_url = db.Column(db.String(255))
    oper_ip = db.Column(db.String(255))
    oper_param = db.Column(db.String(255))
    user_id = db.Column(db.String(255))
    oper_time = db.Column(db.DateTime)
    remarks = db.Column(db.String(255))


'''

class Test_Info(db.Model):
    __tablename__ = "test_info"
    test_id = db.Column(db.String(255),primary_key=True)
    test_name = db.Column(db.String(255))
    owner_id = db.Column(db.String(255))
    total_number = db.Column(db.Integer)
    create_time = db.Column(db.DateTime)
    close_time = db.Column(db.DateTime)
    test_status = db.Column(db.Integer)
    remarks = db.Column(db.String(255))

    def __init__(self, test_id, test_name, owner_id, total_number, create_time, close_time, test_status, remarks):
        self.test_id = test_id
        self.test_name = test_name
        self.owner_id = owner_id
        self.total_number = total_number
        self.create_time = create_time
        self.close_time = close_time
        self.test_status = test_status
        self.remarks = remarks

    def get_dict(self):
        test_info = {
            "test_id": self.test_id,
            "test_name": self.test_name,
            "owner_id": self.owner_id,
            "total_number": self.total_number,
            "create_time": self.create_time,
            "close_time": self.close_time,
            "test_status": self.test_status,
            "remarks": self.remarks
        }
        return test_info

    def update_with_obj(self, test_info):
        self.total_number = test_info.total_number

class Question(db.Model):
    __tablename__ = "question"
    question_id = db.Column(db.String(255), primary_key=True)
    test_id = db.Column(db.String(255))
    question_index = db.Column(db.Integer)
    major_question = db.Column(db.String(255))
    question_sub_index = db.Column(db.Integer)
    question_stem = db.Column(db.String(255))
    question_type = db.Column(db.Integer)
    question_min = db.Column(db.Integer)
    question_max = db.Column(db.Integer)
    __mapper_args__ = {'primary_key': [test_id, question_id, question_index]}

    def __init__(self, question_id, test_id, question_index, major_question=None,
                 question_sub_index=None, question_stem=None, question_type=None, question_min=None, question_max=None):
        self.question_id = question_id
        self.test_id = test_id
        self.question_index = question_index
        self.major_question = major_question
        self.question_sub_index = question_sub_index
        self.question_stem = question_stem
        self.question_type = question_type
        self.question_min = question_min
        self.question_max = question_max

    def get_dict(self):
        question = {
            "question_id":self.question_id,
            "test_id" :self.test_id,
            "question_index" : self.question_index,
            "major_question" : self.major_question,
            "question_sub_index" : self.question_sub_index,
            "question_stem" : self.question_stem,
            "question_type" : self.question_type,
            "question_min":self.question_min,
            "question_max":self.question_max
        }
        return question


class Option(db.Model):
    __tablename__ = "option"
    option_id = db.Column(db.String(255),primary_key=True)
    test_id = db.Column(db.String(255))
    question_id = db.Column(db.String(255))
    option_text = db.Column(db.String(255))
    __mapper_args__ = {'primary_key': [test_id, question_id, option_id]}

    def __init__(self, option_id, test_id, question_id, option_text):
        self.option_id = option_id
        self.test_id = test_id
        self.question_id = question_id
        self.option_text = option_text


class Test_Result(db.Model):
    __tablename__ = "test_result"
    test_id = db.Column(db.String(255))
    testee_name = db.Column(db.String(255))
    score = db.Column(db.Integer)
    submit_time = db.Column(db.DateTime)
    voter_id = db.Column(db.String(255))
    __mapper_args__ = {'primary_key': [test_id, testee_name, score, submit_time, voter_id]}

    def __init__(self, test_id, testee_name, score, submit_time, voter_id):
        self.test_id = test_id
        self.testee_name = testee_name
        self.score = score
        self.submit_time = submit_time
        self.voter_id = voter_id


class Role(db.Model):
    """
    角色表
    """
    __tablename__ = "role"
    id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(128))
    permissions = db.Column(db.Integer)

    @staticmethod
    def init_role():
        role_name_list = ['guest','user', 'admin']
        roles_permission_map = {
            'guest': [Permissions.GUEST],
            'user':  [Permissions.GUEST, Permissions.USER],
            'admin': [Permissions.GUEST, Permissions.USER, Permissions.ADMIN]
        }
        try:
            for role_name in role_name_list:
                role = Role.query.filter_by(role_name=role_name).first()
                if not role:
                    role = Role(role_name=role_name)
                role.reset_permissions()
                for permission in roles_permission_map[role_name]:
                    role.add_permission(permission)
                db.session.add(role)
            db.session.commit()
        except Exception as e:
            print(e.args)
            db.session.rollback()
        db.session.close()

    def reset_permissions(self):
        self.permissions = 0

    def has_permission(self, permission):
        return self.permissions & permission == permission

    def add_permission(self, permission):
        if not self.has_permission(permission):
            self.permissions += permission'''


#系统配置参数
class Setting(db.Model):
    """
    配置表
    """
    __tablename__ = "setting"
    id = db.Column(db.Integer, primary_key=True)
    setting_item_1 = db.Column(db.String(256))
    continous_fail_times_limit = db.Column(db.Integer)
    fail_cool_down_time = db.Column(db.Integer)
    #in seconds
    session_keep_time = db.Column(db.Integer)

    @staticmethod
    def init_setting():
        try:
            setting = Setting.query.filter_by().first()
            if not setting:
                setting = Setting(setting_item_1 = 'test')
                db.session.add(setting)
                db.session.commit()
        except Exception as e:
            print("fail to init settings. ",e.args)
            db.session.rollback()

    @staticmethod
    def get_setting():
        try:
            setting = Setting.query.filter_by().first()
            return setting
        except Exception as e:
            return None

# ---洪涝---

# 变电站基本信息、位置信息
class bdz_info(db.Model):
    __tablename__ = "bianDianZhan_info"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), index=True)
    # type = db.Column(db.String(128))
    # 位置信息
    x = db.Column(db.Float)
    y = db.Column(db.Float)
    city = db.Column(db.String(128))
    # district = db.Column(db.String(128))

# 变电站故障信息
class bdz_failure(db.Model):
    __tablename__ = "bianDianZhan_failure"
    id = db.Column(db.Integer, primary_key=True)
    # 故障信息 故障码1~9，不同数字代表不同类型的故障。
    # failure_type = db.Column(db.Interger)   
    # failure_level = db.Column(db.Interger)   
    # The supported range is '1000-01-01' to '9999-12-31'.
    date = db.Column(db.Date)  
    bdz_name = db.Column(db.String)


# 气象数据