from extentions import *
from models import *
from methods import permission_required, parse_request_json, get_settings
from flask import Blueprint, session, request, send_file
from settings import Response, Macro, Test_Status, global_vars
import datetime, time, uuid, qrcode
from conf import qrcode_url
from io import BytesIO
from sqlalchemy.orm import sessionmaker


manage_bp = Blueprint('manage',__name__)

#创建一个test
@manage_bp.route('/test_permission_required',methods=['GET'])
@permission_required(Permissions.ADMIN)
def test_permissoin_required():
    return "test successfully"



#从request充提取test_info和test_content

def extract_test_info(request):
    test_name, testee_list, expire_span, remarks = parse_request_json(request, 'test_name', 'testee_list',
                                                                      'expire_span', 'remarks')
    admin_id = session['admin_id']
    create_time = datetime.datetime.fromtimestamp(time.time())
    test_id = uuid.uuid1()
    total_number = len(testee_list)

    test_info_obj = Test_Info(test_id=test_id, test_name=test_name, owner_id=admin_id, total_number=total_number, create_time=create_time, close_time=None, test_status=Test_Status.CREATED, remarks=remarks)
    test_content_obj = [Test_Content(test_id, testee_name) for testee_name in testee_list]


    return test_info_obj, test_content_obj

#创建一个test
@manage_bp.route('/test_create',methods=['POST'])
@permission_required(Permissions.ADMIN)
def test_create():
    try:
        test_info, test_content_list = extract_test_info(request)
        db.session.add(test_info)
        #这里必须要先把test_info commit进去
        #如果放在最后一起commit，test_content会因为没有主键而报错
        #test_content的test_id和test_info的test_id是主外键关系
        db.session.commit()

        for test_content in test_content_list:
            db.session.add(test_content)
        db.session.commit()
        return Response(status=Macro.STATUS_SUCCESS).r

    except Exception as e:
        app.logger.error("fail to create new test")
        app.logger.error(str(e.args))
        db.session.rollback()
        return Response(status=Macro.STATUS_EXCEPT, err_info=str(e.args)).r

#更新一个test
@manage_bp.route('/test_update',methods=['POST'])
@permission_required(Permissions.ADMIN)
def test_update():
    try:
        admin_id   = session['admin_id']
        permission = session['permission']
        #准备数据
        test_id, test_name, testee_list, remarks= parse_request_json(request, "test_id", "test_name", "testee_list", "remarks")
        test_content_list = [Test_Content(test_id,testee_name) for testee_name in testee_list]

        #判断该测评是否可以update
        # 1. 是否存在该test_id
        ret = Test_Info.query.filter_by(test_id= test_id).first()
        if ret is None:
            return Response(status=Macro.STATUS_FAIL, err_info="经查，无此测评").r
        # 2. 是否有权限修改
        # 如果当前用户不是超级管理员且不是该测评的owner，则返回
        if permission < Permissions.SUPER_ADMIN:
            if admin_id != ret.owner_id:
                return Response(status=Macro.STATUS_FAIL, err_info="没有权限修改此测评").r

        # 3. 是否已经有人投票
        test_result_list = Test_Result.query.filter_by(test_id=test_id).first()
        if test_result_list is not None:
            return Response(status=Macro.STATUS_FAIL, err_info="该测评已经有人投票，不能修改。").r

        #以下为可以update
        #创建连接到数据库的session
        #Session = sessionmaker(global_vars.db_engine)
        #db_session = Session()

        # 1. 删除Test_Content中的相关人员
        db.session.query(Test_Content).filter(Test_Content.test_id==test_id).delete()
        # 2. 加入更新后的人员名单
        [db.session.add(test_content) for test_content in test_content_list]
        # 3. 更新Test_Info
        test_info = Test_Info.query.filter_by(test_id=test_id).first()
        if test_info is None:
            return Response(status=Macro.STATUS_FAIL, err_info="没有改测评").r
        test_info.test_name = test_name
        test_info.remarks   = remarks
        test_info.total_number = len(testee_list)
        #然后GO
        db.session.commit()
        app.logger.info("success to update test: {}".format(test_id))
        return Response(status=Macro.STATUS_SUCCESS).r

    except Exception as e:
        app.logger.error("fail to update test")
        app.logger.error(str(e.args))
        db.session.rollback()
        return Response(status=Macro.STATUS_EXCEPT, err_info=str(e.args)).r

#更新一个test
@manage_bp.route('/test_delete',methods=['POST'])
@permission_required(Permissions.ADMIN)
def test_delete():
    try:
        admin_id   = session['admin_id']
        permission = session['permission']
        #准备数据
        test_id, = parse_request_json(request, "test_id")

        #判断该测评是否可以update
        # 1. 是否存在该test_id
        ret = Test_Info.query.filter_by(test_id= test_id).first()
        if ret is None:
            return Response(status=Macro.STATUS_FAIL, err_info="经查，无此测评").r
        # 2. 是否有权限修改
        # 如果当前用户不是超级管理员且不是该测评的owner，则返回
        if permission < Permissions.SUPER_ADMIN:
            if admin_id != ret.owner_id:
                return Response(status=Macro.STATUS_FAIL, err_info="没有权限删除此测评").r

        # 3. 是否已经有人投票
        test_result_list = Test_Result.query.filter_by(test_id=test_id).first()
        if test_result_list is not None:
            return Response(status=Macro.STATUS_FAIL, err_info="该测评已经有人投票，不能删除。").r

        #以下为可以删除
        # 1. 删除Test_Content中的相关人员
        db.session.query(Test_Content).filter(Test_Content.test_id==test_id).delete()
        # 2. 删除Test_Info
        db.session.query(Test_Info).filter(Test_Info.test_id==test_id).delete()
        #然后GO
        db.session.commit()
        app.logger.info("success to delete test: {}".format(test_id))
        return Response(status=Macro.STATUS_SUCCESS).r

    except Exception as e:
        app.logger.error("fail to delete test")
        app.logger.error(str(e.args))
        db.session.rollback()
        return Response(status=Macro.STATUS_EXCEPT, err_info=str(e.args)).r



#获得二维码
@manage_bp.route('/qrcode_create',methods=['POST'])
@permission_required(Permissions.ADMIN)
def get_qrcode():
    try:
        test_id, = parse_request_json(request, "test_id")
        test_info = Test_Info.query.filter_by(test_id=test_id).first()

        # generate a qrcode into
        _url = ''.join([qrcode_url, test_info.test_id])
        qrcode_img = qrcode.make(_url)
        # convert qrcode img into BytesIO, and send it
        qr_png = BytesIO()
        qrcode_img.save(qr_png, 'PNG')
        qr_png.seek(0)
        return send_file(qr_png, mimetype='image/png')
    except Exception as e:
        return Response(status=Macro.STATUS_EXCEPT, err_info=str(e.args)).r

#根据用户名获取测评
@manage_bp.route('/tests_get',methods=['GET'])
@permission_required(Permissions.ADMIN)
def get_tests():
    try:
        admin_id = session['admin_id']
        admin_permission = session['permission']
        #如果是超级管理员，则获取所有
        if admin_permission >= Permissions.SUPER_ADMIN:
            test_info_list = Test_Info.query.filter_by().all()
        #否则就是普通管理员，只能获取本人创建的测评
        else:
            test_info_list = Test_Info.query.filter_by(owner_id=admin_id).all()
        #把查询结果组装成数据
        ret = [test_info.get_dict() for test_info in test_info_list]
        app.logger.info('success to get tests')
        return Response(status=Macro.STATUS_SUCCESS,data=ret).r
    except Exception as e:
        app.logger.error("fail to get test")
        app.logger.error(str(e.args))
        return Response(status=Macro.STATUS_EXCEPT, err_info=str(e.args)).r

