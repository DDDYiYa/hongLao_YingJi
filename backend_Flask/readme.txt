1. 配合该模板使用，需要一个新建数据表sys_oper_log，具体表结构，见models.py中的class Sys_Oper_Log

2. 主要更新，1）在methods.py 37-41行，将操作写入sys_oper_log；2）blueprints/auth.py中31-34行

3. 需要在conf.py中配置数据库的连接串，并至少包括user和sys_oper_log表，表结构见models.py
