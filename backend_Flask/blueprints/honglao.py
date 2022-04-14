from flask import Blueprint, request, jsonify
from settings import *
from methods import *
from extentions import db


honglao_bp = Blueprint('honglao',__name__)


# 测试
@honglao_bp.route('/test',methods=['GET'])
def test():
    return "test successfully"

# 按地区查询变电站发生故障的次数
@honglao_bp.route('/bdz_fail/list', methods=['POST'])
def bdz_fail_List():
    try:
        # 所属城市
        city, = parse_request_json(request, 'city')
        where_clause = "where city = '{}'".format(str(city)[0:len(str(city)) - 1])
        sql = 'select name, x, y from bdz_fail join bdz_info \
               on bdz_fail.bdz_id=bdz_info.id {}'.format(where_clause)
        result = []
        ret = execute_sql(global_vars.db_engine, sql)
        for r in ret:
            ret_dict = convert_tuple_dict(r, ['bdz_name', 'bdz_x', 'bdz_y'])
            ret_dict['bdz_name'] = ret_dict['bdz_name'].split('/')[-1]
            ret_dict['bbdz_xdz_x'] = float(ret_dict['bdz_x'])
            ret_dict['bdz_y'] = float(ret_dict['bdz_y'])
            result.append(ret_dict)
        return jsonify({'status': Macro.STATUS_SUCCESS, 'data': result})
    except Exception as e:
        print('except in bdz_list.')
        app.logger.error('except in bdz_list. ')
        app.logger.exception(e)
        return jsonify({'status': Macro.STATUS_FAIL})

# 查询每个市的变电站故障次数
@honglao_bp.route('/bdz_fail/count', methods=['GET'])
def bdz_fail_Count():
    try:
        sql = 'select city, count(bdz_fail.id) as c\
               from bdz_fail join bdz_info \
               on bdz_fail.bdz_id=bdz_info.id \
               group by city order by c desc'
        result = []
        ret = execute_sql(global_vars.db_engine, sql)
        for item in ret:
            ret_dict = convert_tuple_dict(item, ['CityName', 'BDZ_Count'])
            if ret_dict['CityName'] != '' and ret_dict['CityName'] is not None:
                if ret_dict['CityName'] == '葫芦':
                    ret_dict['CityName'] = '葫芦岛市'
                else:
                    ret_dict['CityName'] = str(ret_dict['CityName']) + '市'
                result.append(ret_dict)
        return jsonify({'status': Macro.STATUS_SUCCESS, 'data': result})
    except Exception as e:
        print('except in bdz_count.')
        app.logger.error('except in dbz_count. ')
        app.logger.error(sql)
        app.logger.exception(e)
        return jsonify({'status': Macro.STATUS_FAIL})

# 查询本年度每个市的变电站故障次数
@honglao_bp.route('/bdz_fail/count_thisYear', methods=['GET'])
def bdz_fail_Count_thisYear():
    try:
        sql = 'select city, count(bdz_fail.id) as c\
               from bdz_fail join bdz_info \
               on bdz_fail.bdz_id=bdz_info.id \
               and YEAR(date)=YEAR(NOW()) \
               group by city order by c desc '
        result = []
        ret = execute_sql(global_vars.db_engine, sql)
        for item in ret:
            ret_dict = convert_tuple_dict(item, ['CityName', 'BDZ_Count'])
            if ret_dict['CityName'] != '' and ret_dict['CityName'] is not None:
                if ret_dict['CityName'] == '葫芦':
                    ret_dict['CityName'] = '葫芦岛市'
                else:
                    ret_dict['CityName'] = str(ret_dict['CityName']) + '市'
                result.append(ret_dict)
        return jsonify({'status': Macro.STATUS_SUCCESS, 'data': result})
    except Exception as e:
        print('except in bdz_count.')
        app.logger.error('except in dbz_count. ')
        app.logger.error(sql)
        app.logger.exception(e)
        return jsonify({'status': Macro.STATUS_FAIL})