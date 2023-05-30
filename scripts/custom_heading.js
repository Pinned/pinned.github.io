hexo.extend.filter.register('marked:renderer', function(renderer) {
    // 使用方式参考文档： https://github.com/hexojs/hexo-renderer-marked/blob/master/README.md
    const { config } = this; // Skip this line if you don't need user config from _config.yml
    renderer.heading = function(text, level) {
      return `<h${level}><span class="prefix"></span><span class="content">${text}</span><span class="suffix"></span></h${level}>`
    }
  })