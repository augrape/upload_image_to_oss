function local_file_url(sourceId) {
    let url;
    if (navigator.userAgent.indexOf("MSIE")>=1) {
        url = document.getElementById(sourceId).value;
    } else if (navigator.userAgent.indexOf("Firefox")>0) {
        url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
    } else if (navigator.userAgent.indexOf("Chrome")>0) {
        url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
    }
    return url;
};

function timestamp () {
    const time = new Date();  
    const y = time.getFullYear();  
    const m = time.getMonth()+1;  
    const d = time.getDate();  
    const h = time.getHours();  
    const mm = time.getMinutes();  
    const s = time.getSeconds();  
    return ""+y+fill(m)+fill(d)+fill(h)+fill(mm)+fill(s); 
};

function fill (num) {
    return num < 10 ? '0' + num : num;
};

function convertImgToBase64(url, callback, outputFormat){
    var canvas = document.createElement('CANVAS'),
    ctx = canvas.getContext('2d'),
    img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img,0,0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        canvas = null;
    };
    img.src = url;
};

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
};


let store_as;
const _load_btn = document.getElementById("thumbnail-btn");
_load_btn.onchange = function () {
    const file = local_file_url(this.id);
    const suffix = this.value.substr(this.value.indexOf('.'));
    const _timestamp = timestamp();
    store_as = _timestamp + suffix;

    convertImgToBase64(file, function (base64img) {
        document.querySelector("img").setAttribute('src', base64img);   // 赋值（预览）
    });
};

/*
// localStorageAPI 它可以将数据存储在浏览器中供后续使用；setIterm()函数创建一个name数据项；
let my_name = prompt("请输入你的名字.");  // 需要输入值，功能与alert类似；
localStorage.setItem('name', my_name);
localStorage.getItem('name')
_.innerHTML = "Chrome, " + my_name;
*/

document.getElementById("ajax_button").addEventListener('click', makeUrl);

function makeUrl () {
    const base64img = document.getElementById("picturePreview").getAttribute('src');
    if (base64img === 'src/image/firefox-icon.png') {
        alert("未选择图片!");
    } else {
        let blob = dataURLtoBlob(base64img);
        let reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onload = function (event) {
            abc(event, function(data) {
                const AccessKeySecret = data.AccessKeySecret;
                const AccessKeyId = data.AccessKeyId;
                const SecurityToken = data.SecurityToken;

                const client = new OSS.Wrapper({
                    region: 'oss-cn-hangzhou',
                    accessKeyId: AccessKeyId,
                    accessKeySecret: AccessKeySecret,
                    stsToken: SecurityToken,
                    bucket: 'heijinzi'
                });
                const buffer = new OSS.Buffer(event.target.result);
                client.put(store_as, buffer);
                alert("https://heijinzi.oss-cn-hangzhou.aliyuncs.com/" + store_as);
            });
        };
    };
};

function abc (event, func) {
    let httpRequest;
    makeRequest();
    function makeRequest () {
        httpRequest = new XMLHttpRequest();

        if (!httpRequest) {
            alert("Giving up :( Cannot create an XMLHTTP instance.");
            return false;
        };
        httpRequest.onreadystatechange = alertContents;
        httpRequest.open("GET", "http://127.0.0.1:8000/image/check_token/");
        httpRequest.send(null);
    };

    function alertContents () {
        try {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    let obj = JSON.parse(httpRequest.responseText);
                    if (obj.code === 200) {
                        const data = JSON.parse(obj.data);
                        func(data);
                    } else {
                        alert("数据获取失败");
                    };
                } else {
                    alert("There was a problem with the request.");
                };
            };
        } catch (e) {
            alert("Caught Exception:" + e.description);
        };
    };
};
