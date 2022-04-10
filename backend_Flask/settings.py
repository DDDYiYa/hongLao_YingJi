
from flask import Flask, jsonify

app = Flask(__name__)

class Macro:
    STATUS_SUCCESS = 0
    STATUS_FAIL    = 1
    STATUS_EXCEPT  = 2

class Test_Status:
    CREATED=0
    START=  1
    END=    2
    EXPIRED=3

class Permissions:
    """
    权限类
    """
    USER  = 0
    ADMIN = 10
    SUPER_ADMIN = 99

class Question_Type:
    OP_4 = 0
    OP_5 = 1
    OP_N = 2

class global_vars:
    '''sqlalchemy database engine'''
    db_engine = None


class Response:
    def __init__(self, status, data = None, err_info= None, remarks= None):
        self.r = jsonify({
            "status":status,
            "data":data,
            "err_info":err_info,
            "remkars":remarks
        })

