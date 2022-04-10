import multiprocessing

bind                = '0.0.0.0:5000'
workers             = 1
daemon              = True
reload              = True
loglevel            = 'debug'
errorlog            = './log/error.log'
accesslog           = './log/access.log'
timeout             = 600
