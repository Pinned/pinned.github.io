const { encodeURL,  url_for} = require('hexo-util');
hexo.extend.filter.register('marked:renderer', function (renderer) {
  // 使用方式参考文档： https://github.com/hexojs/hexo-renderer-marked/blob/master/README.md
  const { config } = this; // Skip this line if you don't need user config from _config.yml
  renderer.heading = function (text, level) {
    return `<h${level}><span class="prefix"></span><span class="content">${text}</span><span class="suffix"></span></h${level}>`
  }

  // renderer.image = function (href, title, text) {
  //   const { relative_link } = hexo.config;
  //   const { lazyload, prependRoot, postPath } = options;
  //   if (!/^(#|\/\/|http(s)?:)/.test(href) && !relative_link && prependRoot) {
  //     if (!href.startsWith('/') && !href.startsWith('\\') && postPath) {
  //       const PostAsset = hexo.model('PostAsset');
  //       // findById requires forward slash
  //       const asset = PostAsset.findById(join(postPath, href.replace(/\\/g, '/')));
  //       // asset.path is backward slash in Windows
  //       if (asset) href = asset.path.replace(/\\/g, '/');
  //     }
  //     href = url_for.call(hexo, href);
  //   }
  //   let out = `<img src="${encodeURL(href)}"`;
  //     if (text) out += ` alt="${text}"`;
  //     if (title) out += ` title="${title}"`;
  //     if (lazyload) out += ' loading="lazy"';
  
  //     out += '>';
  //     return out;
  // }
})