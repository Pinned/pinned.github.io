'use strict';

var fs = require('hexo-fs');

hexo.extend.helper.register('css_inline', function(path) {
    let result = '';
    var local_path = 'source/' + path
    var file_exists = fs.existsSync(local_path);
    if (!file_exists) {
        local_path = "themes/" + hexo.config.theme + '/source/' + path
    }
    var reg = /([^\\/]+)\.([^\\/]+)/i;
    reg.test(local_path);
    result += `<style type="text/css" id="${RegExp.$1}">`
    var cached = fs.readFileSync(local_path);
    result += cached
    result += '</style>'
    // console.log(result)
    return result;
});