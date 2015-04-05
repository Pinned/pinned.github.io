/* 控制导航按钮动作 */
function nav_click(is_show) {
  if (is_show) {
    /* 显示左侧aside */
    $('.aside')
      .addClass('visible-md visible-lg')
      .removeClass('hidden-md hidden-lg')
    /* 调整右侧内容 */
    $('.aside3')
      .removeClass('col-md-12 col-lg-12')
      .addClass('col-md-8 col-lg-8');
    /* 调整文字内容格式 */
    $('.aside3-content')
      .removeClass('col-md-10 col-lg-8 col-md-offset-1 col-lg-offset-2')
      .addClass('col-md-12');
  } else {
    /* 隐藏左侧aside */
    $('.aside')
      .removeClass('visible-md visible-lg')
      .addClass('hidden-md hidden-lg');
    /* 右侧内容最大化 */
    $('.aside3')
      .removeClass('col-md-8 col-lg-8')
      .addClass('col-md-12 col-lg-12');
    /* 修改文字排版 */
    $('.aside3-content')
      .removeClass('col-md-12')
      .addClass('col-md-10 col-lg-8 col-md-offset-1 col-lg-offset-2');
  }
}
/* 控制文章章节列表按钮 */
function content_click(is_show) {
  if (is_show) {
    $('#content_table').show();
  } else {
    $('#content_table').hide();
  }
}

function content_effects() {
  //remove the asidebar
  $('.row-offcanvas').removeClass('active');
  if ($("#nav").length > 0) {
    $("#content > h1,#content > h2,#content > h3,#content > h4,#content > h5,#content > h6").each(function(i) {
      var current = $(this);
      current.attr("id", "title" + i);
      tag = current.prop('tagName').substr(-1);
      $("#nav").append("<div style='margin-left:" + 15 * (tag) + "px'><a id='link" + i + "' href='#title" + i + "'>" + "◆ " + current.html() + "</a></div>");
    });
    $("pre").addClass("prettyprint");
    prettyPrint();
    $('#content img').addClass('img-thumbnail').parent('p').addClass('center');
    $('#content_btn').show();
  } else {
    $('#content_btn').hide();
  }
  add_linenumber();
}

function add_linenumber (){
  $('pre code').each(function(){
    //var lines = $(this).text().split('\n').length - 1;
    var $numbering = $('<ul/>').addClass('pre-numbering');
    $(this)
        .addClass('has-numbering')
        .parent()
        .prepend($numbering);
    //if(lines==0 && $.trim($(this).text())!=""){
    //  lines=1;
    //}
    var lines=Math.round(($(this).height()+3)/18);
    for(i=1;i<=lines;i++){
        $numbering.append($('<li/>').text(i));
    }
  });
};

$(document).ready(function() {
  /* 控制左侧 aside 的动作 */
  $("#nav_btn").on('click', function() {
    isClicked = $(this).data('clicked');
    nav_click(isClicked);
    $(this).data('clicked', !isClicked);
  });

  $('body').on('click', '#content_btn' , function() {
    isClicked = $(this).data('clicked');
    content_click(!isClicked);
    $(this).data('clicked', !isClicked);
  });

  $(document).pjax('.pjaxlink', '#pjax', {
    fragment: "#pjax",
    timeout: 10000
  });

  $(document).on("pjax:end", function() {
    if ($("body").find('.container').width() < 992)
      $('#nav_btn').click();
    $('.aside3').scrollTop(0);
    content_effects();
  });

  $('body').on('click', '.show-commend', function() {
    var ds_loaded = false;
    window.disqus_shortname = $('.show-commend').attr('name');
    $.ajax({
      type: "GET",
      url: "http://" + disqus_shortname + ".disqus.com/embed.js",
      dataType: "script",
      cache: true
    });
  });
  content_effects();


  $(".js-mynav").on("click",function(e){
    var parent = $(this).parent();
    parent.parent().find("li").removeClass("active");
    parent.addClass("active");
  });


  /*snippet fenye*/
  (function(){
    var snippetObj = $("#js-snippet");
    var snipperItem = $(".js-snippet-item",snippetObj);
    var sinpperPagger = $(".js-sinippet-pager", snippetObj);

    var pageSize = 15;
    var currIndex = 1;
    var pIndex = 1;
    var total = snipperItem.size();
    var totalSize = Math.ceil(total/pageSize);


    function showItme() {
      snipperItem.slice((pIndex-1)*pageSize,(pIndex)*pageSize).hide();
      snipperItem.slice((currIndex-1)*pageSize,(currIndex)*pageSize).show();
    }


    function createPagger() {
      var ulLeft = "<ul>",ulRight="</ul>";
      var liMore = "<li class='more'>---</li>";
      var htmls = [];
      htmls.push(ulLeft);
      for(var i = 0; i<totalSize;i++){
        if(currIndex == (i+1)) {
          htmls.push("<li data-index='"+(i+1)+"' class='curr'>"+(i+1)+"</li>");
        } else {
          htmls.push("<li data-index='"+(i+1)+"'>"+(i+1)+"</li>");
        }

      }
      htmls.push(ulRight);

      return htmls.join("");
    }

    snipperItem.hide();
    showItme();

    if(totalSize > 1) {
      sinpperPagger.html(createPagger());
    }

    sinpperPagger.on("click","li",function(e) {
      var thisIndex = $(this).data("index");
      //console.log(thisIndex , currIndex);
      if(thisIndex == currIndex) {
        return;
      }
      pIndex = currIndex;
      currIndex = $(this).data("index");
      sinpperPagger.html(createPagger());
      showItme();
    });


  })();

});
