from extentions import *
from models import *
from methods import permission_required, parse_request_json, get_settings
from flask import Blueprint, session, request, send_file
from settings import Response, Macro, Test_Status, Question_Type
import uuid, datetime, time


test_pf_bp = Blueprint('test_pf',__name__)

@test_pf_bp.route('/test_question_get',methods=['POST'])
def get_test_questions():
    try:
        #提取test_id
        test_id, = parse_request_json(request, "test_id")

        #包含测评内容的字典
        test_dict = {}

        # 获取test_info，并填空
        test_info = Test_Info.query.filter_by(test_id=test_id).first()
        test_dict['test_name'] = test_info.test_name
        test_dict['remarks']   = test_info.remarks
        test_dict['questions'] = []
        #获取问题列表，并填空
        question_list = Question.query.filter_by(test_id= test_id).order_by("question_index").all()
        for question in question_list:
            question_dict = question.get_dict()
            question_id = question_dict["question_id"]
            if question_dict["question_type"] == Question_Type.OP_4:
                question_dict["options"] = ["优秀","良好","一般","较差"]
            elif question_dict["question_type"] == Question_Type.OP_5:
                question_dict["options"] = ["优秀","称职","基本称职","不称职","不了解"]
            elif question_dict["question_type"] == Question_Type.OP_N:
                '''需要去option表获取选项'''
                option_list = Option.query.filter_by(test_id=test_id, question_id=question_id).all()
                question_dict["options"] = [option.option_text for option in option_list]
            else:
                return Response(status=Macro.STATUS_FAIL).r
            test_dict['questions'].append(question_dict)
        return Response(status=Macro.STATUS_SUCCESS,data=test_dict).r
    except Exception as e:
        app.logger.error("fail to get test: {}".format((test_id)))
        app.logger.error(str(e.args))
        return Response(status=Macro.STATUS_EXCEPT, err_info=str(e.args)).r

@test_pf_bp.route('/score_submit',methods=['POST'])
def score_vote():
    try:
        test_id, score_list, = parse_request_json(request, "test_id","score")
        voter_id = uuid.uuid1()
        submit_time = datetime.datetime.fromtimestamp(time.time())

        for score_tuple in score_list:
            obj = Test_Result(test_id= test_id, testee_name=score_tuple[0], score=score_tuple[1], submit_time=submit_time, voter_id=voter_id)
            db.session.add(obj)
        db.session.commit()
        return Response(status=Macro.STATUS_SUCCESS).r
    except Exception as e:
        db.session.rollback()
        return Response(status=Macro.STATUS_EXCEPT, err_info=str(e.args))