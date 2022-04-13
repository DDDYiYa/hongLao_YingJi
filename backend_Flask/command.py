import click
from app import app, db
from models import  bdz_failure

# 自定义建表命令
@app.cli.command()
def init_db():
    db.create_all() # create tables
    db.session.commit()
    click.echo('Creates tables.')

# 生成假的变电站故障数据
@app.cli.command()
@click.option('--count', default=11635, help='Quantity of fake data, default is 11635.')
def forge(count):
    from faker import Faker

    db.create_all() # create tables

    fake=Faker('zh_CN')
    click.echo('working......')

    for i in range(count):
        bdz_failure_tmp =  bdz_failure(
            date=fake.date_this_decade(),
            bdz_id=fake.random_int(min=0,max=116352)
        )

        db.session.add(bdz_failure_tmp)
    db.session.commit()
    click.echo('Creates %d faker messages.'%count)