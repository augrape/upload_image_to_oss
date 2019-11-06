import json, oss2, uuid
from django.http import JsonResponse
from aliyunsdkcore import client
from aliyunsdkcore.profile import region_provider
from aliyunsdksts.request.v20150401 import AssumeRoleRequest

from picture.settings import OSS_AK, OSS_KS, ENDPOINT_OUT, BUCKET_NAME


def oss(image_key, image_path):
    auth = oss2.Auth(OSS_AK, OSS_KS)
    bucket = oss2.Bucket(auth, ENDPOINT_OUT, BUCKET_NAME, connect_timeout=30)
    bucket.put_object_from_file(image_key, image_path)


def to_oss(image_path):
    image_name, path = ''.join([str(uuid.uuid4()), '.jpg']), image_path
    oss(image_name, path)
    return ENDPOINT_OUT + image_name


def sts_token():
    REGINID = 'cn-hangzhou'
    ENDPOINT = 'sts.cn-hangzhou.aliyuncs.com'
    region_provider.add_endpoint('Sts',
                                 REGINID,
                                 ENDPOINT)
    clt = client.AcsClient('LTAI4FkADLN4QNaZTfHYKFUe',
                           'sYIVOqB6N89QetONUCgE8iMki5bK5j',
                           REGINID)
    req = AssumeRoleRequest.AssumeRoleRequest()
    req.set_RoleArn('acs:ram::1326113423888889:role/heijinzi')
    req.set_RoleSessionName('ceshi')
    body = clt.do_action_with_exception(req)
    response = json.loads(body)
    print(response)
    token = dict(status='200',
                 AccessKeyId=response['Credentials']['AccessKeyId'],
                 AccessKeySecret=response['Credentials']['AccessKeySecret'],
                 SecurityToken=response['Credentials']['SecurityToken'],
                 Expiration=response['Credentials']['Expiration'])
    str_token = json.dumps(token)
    return str_token


class HttpCode(object):
    Ok=200
    Error=400
    UnknownVerification=401
    MethodError=405
    ServerError=500


def result(code=HttpCode.Ok, message="", data=None, kwargs=None):

    __dict = {
        "code": code,
        "message": message,
        "data": data
    }
    if kwargs and isinstance(kwargs, dict) and kwargs.keys():
        __dict.update(kwargs)
    response = JsonResponse(__dict)
    response['Access-Control-Allow-Origin'] = '*'  # 解决一个跨站问题，有好的方式欢迎留言!
    return response
