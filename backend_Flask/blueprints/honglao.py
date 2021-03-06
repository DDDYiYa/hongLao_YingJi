from flask import Blueprint, request, jsonify
from settings import *
from methods import *
from extentions import db


honglao_bp = Blueprint('honglao',__name__)


# 测试
@honglao_bp.route('/test',methods=['GET'])
def test():
    return "test successfully"

# 查询各地市变电站今年和去年得故障次数
@honglao_bp.route('/lefttop', methods=['GET'])
def bdz_fail_lefttop():
    try:
        sql = 'select city,count_thisYear,count_lastYear from bdz_fail_count'
        result = []
        ret = execute_sql(global_vars.db_engine, sql)
        for item in ret:
            ret_dict = convert_tuple_dict(item, ['city', 'count_thisYear','count_lastYear'])
            result.append(ret_dict)
        return jsonify({'status': Macro.STATUS_SUCCESS, 'data': result})
    except Exception as e:
        print('except in bdz_lefttop.')
        app.logger.error('except in bdz_lefttop. ')
        # app.logger.exception(e)
        return jsonify({'status': Macro.STATUS_FAIL})



# 查询变电站本年度各个月份的故障次数
@honglao_bp.route('/leftbottom', methods=['GET'])
def bdz_fail_leftbottom():
    try:
        sql = 'select time,count_thisYear,count_lastYear from bdz_fail_count_difMonth'
        result = []
        ret = execute_sql(global_vars.db_engine, sql)
        for item in ret:
            ret_dict = convert_tuple_dict(item, ['time', 'count_thisYear','count_lastYear'])
            result.append(ret_dict)
        return jsonify({'status': Macro.STATUS_SUCCESS, 'data': result})
    except Exception as e:
        print('except in bdz_fail_leftbottom.')
        app.logger.error('except in bdz_fail_leftbottom. ')
        # app.logger.exception(e)
        return jsonify({'status': Macro.STATUS_FAIL})



# 查询变电站本年度近一周的故障次数
@honglao_bp.route('/rightbottom', methods=['GET'])
def bdz_fail_rightbottom():
    try:
        sql = 'select time,count from bdz_fail_count_thisWeek'
        result = []
        ret = execute_sql(global_vars.db_engine, sql)
        for item in ret:
            ret_dict = convert_tuple_dict(item, ['time', 'count'])
            result.append(ret_dict)
        return jsonify({'status': Macro.STATUS_SUCCESS, 'data': result})
    except Exception as e:
        print('except in bdz_fail_rightbottom.')
        app.logger.error('except in bdz_fail_rightbottom. ')
        # app.logger.exception(e)
        return jsonify({'status': Macro.STATUS_FAIL})



# 查询变电站数量
@honglao_bp.route('/bdz_map', methods=['GET'])
def bdz_map():
    try:
        sql = 'select city,count from bdz_count'
        result = []
        ret = execute_sql(global_vars.db_engine, sql)
        for item in ret:
            ret_dict = convert_tuple_dict(item, ['name', 'value'])
            result.append(ret_dict)
        return jsonify({'status': Macro.STATUS_SUCCESS, 'data': result})
    except Exception as e:
        print('except in bdz_map.')
        app.logger.error('except in bdz_map. ')
        # app.logger.exception(e)
        return jsonify({'status': Macro.STATUS_FAIL})



# 查询今日故障变电站信息
@honglao_bp.route('/bdz_fail_map', methods=['GET'])
def bdz_fail_map():
    try:
        sql = 'select name,coding,x,y,city from bdz_fail_today'
        result = []
        ret = execute_sql(global_vars.db_engine, sql)
        for item in ret:
            ret_dict = convert_tuple_dict(item, ['name', 'coding','x','y','city'])
            result.append(ret_dict)
        return jsonify({'status': Macro.STATUS_SUCCESS, 'data': result})
    except Exception as e:
        print('except in bdz_fail_map.')
        app.logger.error('except in bdz_fail_map. ')
        # app.logger.exception(e)
        return jsonify({'status': Macro.STATUS_FAIL})



# 按地区查询发生故障变电站的名称、经纬度
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
        # app.logger.exception(e)
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
        # app.logger.exception(e)
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
        # app.logger.exception(e)
        return jsonify({'status': Macro.STATUS_FAIL})


