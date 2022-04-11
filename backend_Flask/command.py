# import click
# from app import app, db
# from models import bdz_info

# # 自定义命令，用faker生成假数据。
# # 生成表‘bdz_info’中的status和date
# @app.cli.command()
# @click.option('--count', default=20, help='Quantity of fake data, default is 20.')
# def forge(count):
#     from faker import Faker

#     db.create_all() # create tables

#     fake=Faker('zh_CN')
#     click.echo('working......')

#     for i in range(count):
#         bdz_info_tmp = bdz_info(
#             # name=fake.name(),
#             # type = fake.random_int(min=0,max=3),
#             # x = fake.latitude(),
#             # y = fake.longitude(),
#             # city = fake.city_suffix(),
#             status=fake.random_int(min=0,max=9),
#             date=fake.date_this_decade()
#         )

#         db.session.add(bdz_info_tmp)
#     db.session.commit()
#     click.echo('Creates %d faker messages.'%count)