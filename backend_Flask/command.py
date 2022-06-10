import datetime
import click
from app import app, db
from models import  *

# 自定义建表命令
@app.cli.command()
def init_db():
    db.create_all() # create tables
    db.session.commit()
    click.echo('Creates tables.')

# 生成假的变电站故障数据
@app.cli.command()
@click.option('--count', default=11635, help='Quantity of fake data, default is 11635.')
def forge1(count):
    from faker import Faker

    db.create_all() # create tables

    fake=Faker('zh_CN')
    click.echo('working......')

    for i in range(count):
        bdz_failure_tmp =  bdz_fail(
            date=fake.date_this_decade(),
            bdz_id=fake.random_int(min=0,max=163245)
        )

        db.session.add(bdz_failure_tmp)
    db.session.commit()

# 成假的变电站故障统计数据
@app.cli.command()
def forge2():
    from faker import Faker
    db.create_all() # create tables

    fake=Faker('zh_CN')
    click.echo('working......')

    city=[ '沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', 
           '营口市', '阜新市', '辽阳市', '盘锦市', '铁岭市', '朝阳市', '葫芦岛市']
    time=[ '6月上旬', '6月中旬', '6月下旬', '7月上旬', 
           '7月中旬', '7月下旬', '8月上旬', '8月中旬',
           '8月下旬', '9月上旬', '9月中旬', '9月下旬']

    for i in range(len(city)):
        tmp_table1 =  bdz_fail_count(
            city=city[i],
            count_thisYear=fake.random_int(min=0,max=100),
            count_lastYear=fake.random_int(min=0,max=100),
        )
        db.session.add(tmp_table1)

    for j in range(len(time)):
        tmp_table2 =  bdz_fail_count_thisYear(
            time=time[j],
            count=fake.random_int(min=0,max=100),
        )
        db.session.add(tmp_table2)

    for k in range(7):
        tmp_table3 =  bdz_fail_count_thisWeek(
            time=datetime.date.today()-datetime.timedelta(7-k),
            count=fake.random_int(min=0,max=10),
        )
        db.session.add(tmp_table3)

    db.session.commit()
    click.echo('Creates fake data successfully.')

# 成假的变电站故障统计数据
@app.cli.command()
def forge3():
    from faker import Faker
    db.create_all() # create tables

    fake=Faker('zh_CN')
    click.echo('working......')

    time=[ '6月上旬', '6月中旬', '6月下旬', '7月上旬', 
           '7月中旬', '7月下旬', '8月上旬', '8月中旬',
           '8月下旬', '9月上旬', '9月中旬', '9月下旬']

    for j in range(len(time)):
        tmp_table =  bdz_fail_count_difMonth(
            time=time[j],
            count_thisYear=fake.random_int(min=0,max=100),
            count_lastYear=fake.random_int(min=0,max=100),
        )
        db.session.add(tmp_table)

    db.session.commit()
    click.echo('Creates fake data successfully.')