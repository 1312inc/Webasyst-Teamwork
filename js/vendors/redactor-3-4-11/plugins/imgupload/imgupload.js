(function ($R) {
    $R.add("plugin", "imgupload", {
        init: function (app) {
            this.app = app;
            this.opts = app.opts;
            this.opts.imageUploadParam = 'image';
            this.opts.imageUpload = function (formData) {

                var res = [];

                $.ajax({
                    type: "POST",
                    url: '?module=attachments&action=imageUpload',
                    data: formData,
                    processData: false,
                    contentType: false,
                    async: false,
                })
                    .done(function (response) {
                        Object.keys(response.data).forEach(function (key, i) {
                            res.push({
                                [key]: {
                                    "url": response.data[key],
                                    "id": i
                                }
                            });
                        });
                    })
                    .fail(function () {

                    });

                return res;

            };
        },
    });
})(Redactor);
