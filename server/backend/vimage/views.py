from django.http import HttpResponse

from backend.utils import sts_token, result

"""
 ------------------
 - backend.vimage -
 ------------------
"""


def index(request):
    return HttpResponse('<h1>welcome to v_images</h1>')


def check_sts_token(request):
    token = sts_token()
    return result(data=token)
