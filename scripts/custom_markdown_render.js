const { encodeURL, url_for } = require('hexo-util');
hexo.extend.filter.register('marked:renderer', function (renderer) {
  // 使用方式参考文档： https://github.com/hexojs/hexo-renderer-marked/blob/master/README.md
  const { config } = this; // Skip this line if you don't need user config from _config.yml
  renderer.heading = function (text, level) {
    return `<h${level}><span class="prefix"></span><span class="content">${text}</span><span class="suffix"></span></h${level}>`
  }

  renderer.image = function (href, title, text) {
    console.log(href)
    let out = '<figure>'
    out = `<img src="${encodeURL(href)}"`;
    if (text) out += ` alt="${text}"`;
    if (title) out += ` title="${title}"`;
    out +=  ` referrerpolicy="no-referrer"`;
    out += '>';
    var className = hexo.config.image_caption.class_name || 'image-caption';
    out += `<figcaption class="${className}">${text}</figcaption>`
    out += '</figure>';
    return out;
  }
})