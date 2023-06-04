hexo.extend.helper.register('code_snippet', function() {
    // const sidebar = this.site.data.sidebar[type];
    // const path = basename(this.path);
    const posts = this.site.posts.data
    let result = '';
    result += '<div class="post-md">'
    for (const item of Object.entries(posts)) {
        if (item[1].type === 'snippet') {
            // console.log(item[1].title)
            // console.log(item[1].type)
            result += `<h1><span class="prefix"></span><span class="content">${item[1].title}</span><span class="suffix"></span></h1>`
            result += item[1].content
        }
    }
    result += '</div>'
    return result;
  });