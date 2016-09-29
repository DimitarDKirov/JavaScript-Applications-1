function loadTemplate(name) {
    return new Promise(function (resolve, reject) {
        $.get('/templates/' + name + '.handlebars')
            .done((file) => {
                let template = Handlebars.compile(file);
                resolve(template);
            })
            .fail(reject);
    });
}