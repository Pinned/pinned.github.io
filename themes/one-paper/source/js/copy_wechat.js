var clipboard_item = document.getElementById("clipboardbtn")
if (clipboard_item) {
    const copySafari = (text) => {
        // 获取 input
        let input = document.getElementById("copy-input");
        if (!input) {
            // input 不能用 CSS 隐藏，必须在页面内存在。
            input = document.createElement("input");
            input.id = "copy-input";
            input.style.position = "absolute";
            input.style.left = "-1000px";
            input.style.zIndex = "-1000";
            document.body.appendChild(input);
        }
        // 让 input 选中一个字符，无所谓那个字符
        input.value = "NOTHING";
        input.setSelectionRange(0, 1);
        input.focus();
    
        // 复制触发
        document.addEventListener("copy", function copyCall(e) {
            e.preventDefault();
            e.clipboardData.setData("text/html", text);
            e.clipboardData.setData("text/plain", text);
            document.removeEventListener("copy", copyCall);
        });
        document.execCommand("copy");
    };
    
    const copyWechat = () => {
        const layout = document.getElementById("beautiful"); // 保护现场
        const html = layout.innerHTML;
        // solveWeChatMath();
        const solvedHtml = solveHtml();
        copySafari(solvedHtml);
        console.log("已复制，请到微信公众平台粘贴");
        layout.innerHTML = html; // 恢复现场
    };
    const solveHtml = () => {
        const BOX_ID = "copy-post-content";
        const atom_one_dark = "atom-one-dark";
        const reset = "reset";
        const markdown = "markdown";
        const style = "style";
        const element = document.getElementById(BOX_ID);
    
        const inner = element.children[0].children;
        let html = element.innerHTML;
        console.log(html)
        html = html.replace(/<mjx-container (class="inline.+?)<\/mjx-container>/g, "<span $1</span>");
        html = html.replace(/\s<span class="inline/g, '&nbsp;<span class="inline');
        html = html.replace(/svg><\/span>\s/g, "svg></span>&nbsp;");
        html = html.replace(/mjx-container/g, "section");
        html = html.replace(/class="mjx-solid"/g, 'fill="none" stroke-width="70"');
        html = html.replace(/<mjx-assistive-mml.+?<\/mjx-assistive-mml>/g, "");
    
        const resetStyle = document.getElementById(reset).innerText;
        const sytleStyle = document.getElementById(style).innerText;
        const markdownStyle = document.getElementById(markdown).innerText;
        const atom_one_darkStyle = document.getElementById(atom_one_dark).innerText;
        const codeThemeStyle = document.getElementById("code-theme").innerText;
        let res = "";
        try {
            res = juice.inlineContent(html, resetStyle + sytleStyle + markdownStyle + atom_one_darkStyle + codeThemeStyle, {
                inlinePseudoElements: true,
                preserveImportant: true,
            });
            console.log(res)
        } catch (e) {
            message.error("请检查 CSS 文件是否编写正确！");
        }
        var lines = res.split("\n");
        var trimmedText = lines.map(function(line) {
            return line.trim();
        }).join("\n");
        
        // console.log(trimmedText)
        // console.log(res)
        return res;
    };
    clipboard_item.addEventListener("click", function () {
        copyWechat();
    })
}


var go_top = document.getElementById("go-top")
if (go_top) {  
    // 将整个页面滚动到顶部
    go_top.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });
}

window.onload = function () {
    var imgs = document.getElementsByTagName("img")
    for (var i = 0; i < imgs.length; i++) {
        var alt = imgs[i].alt
        if (imgs[i].id == "bing-bg") {
            continue;
        }
        // <figcaption class="post-image-caption">解析 Keep 后的描述符</figcaption>
        var figcaption = document.createElement("figcaption")
        figcaption.className = "post-image-caption"
        figcaption.innerHTML = alt
        imgs[i].parentNode.insertBefore(figcaption, imgs[i].nextSibling)


        var figure = document.createElement("figure")

        var parentNode = imgs[i].parentNode
        
        imgs[i].parentNode.parentNode.insertBefore(figure, imgs[i].parentNode.nextSibling)
        figure.appendChild(imgs[i])
        figure.appendChild(figcaption)
        parentNode.remove()
        // imgs[i].setAttribute("data-action", "zoom")
    }
}