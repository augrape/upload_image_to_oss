(function () {
    var httpRequest;
    document.getElementById("ajax_button").addEventListener('click', makeRequest);

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
                    var obj = JSON.parse(httpRequest.responseText);
                    obj = obj['data'];
                    var AccessKeySecret = obj.AccessKeySecret;
                    var AccessKeyId = obj.AccessKeyId;
                    var SecurityToken = obj.SecurityToken;

                } else {
                    alert("There was a problem with the request.");
                };
            };
        } catch (e) {
            alert("Caught Exception:" + e.description);
        };
    };
})();
