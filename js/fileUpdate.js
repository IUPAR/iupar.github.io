
function fileUpdate() {
    let f = document.getElementById('upload');
    let filename = f.value; // 'C:\fakepath\test.png'
    if (!filename || !(
        filename.endsWith('.jpg') || filename.endsWith('.png') || filename.endsWith('.jpeg') ||
        filename.endsWith('.JPG') || filename.endsWith('.PNG') || filename.endsWith('.JPEG')
    )) {
        $('.alert-danger').addClass('show').text('请上传后缀名为jpg或png的图片！');
        window.setTimeout(function () {
            $('.alert-danger').removeClass('show');
        }, 2000);
    }

    // console.log(f);
    let reader = new FileReader();
    reader.readAsDataURL(f.files[0]);
    reader.addEventListener('load', (e) => {
        // Get a reference to the file
        reader.onloadend = () => {
            let dataurl = reader.result;
            let image = new Image();
            image.setAttribute("crossOrigin", 'anonymous');
            image.src = dataurl;
            image.onload = function () {
                let canvas = document.createElement("canvas");
                canvas.width = 1200;
                canvas.height = 1200 * (image.height / image.width);
                let ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                let imgData = canvas.toDataURL("image/jpg");
                imgData = imgData.replace(/^data:image\/(png|jpg);base64,/, "");
                //console.log(imgData);
                //上传到后台。
                let uploadAjax = $.ajax({
                    type: "post",
                    //后端需要调用的地址
                    url: "http://127.0.0.1/:19023/receiveImage/",
                    data: JSON.stringify({"imgData": imgData}),
                    contentType: "json/application",
                    //设置超时
                    timeout: 10000,
                    async: true,
                    success: function (htmlVal) {
                        //成功后回调
                        //console.log(htmlVal)
                        $('.alert-success').addClass('show').text('上传成功！');
                        window.setTimeout(function () {
                            $('.alert-success').removeClass('show');
                        }, 2000);
                    },
                    error: function (data) {
                    },
                    //调用执行后调用的函数
                    complete: function (XMLHttpRequest, textStatus) {
                        if (textStatus === 'timeout') {
                            uploadAjax.abort(); //取消请求
                            //超时提示：请求超时，请重试
                            $('.alert-danger').addClass('show').text('上传失败');
                            window.setTimeout(function () {
                                $('.alert-danger').removeClass('show');
                            }, 2000);
                            //请求超时返回首页
                            // closeCard();
                        }
                    }
                });
            };
        };
    });
}

