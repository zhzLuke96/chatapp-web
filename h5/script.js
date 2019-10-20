const msgTpl = (content, ismedia) => `
<div class="chat-bubble mine">
    <div class="avatar">
        <img src="a1.jpeg">
    </div>
    <div class="body ${ ismedia?"media":"" }">
        <div class="msg">
            ${ content }
        </div>
        <div class="timer">
            <span>
                ${ Date().toLocaleString().match(/\d\d:\d\d/g)[0] }
            </span>
            <i class="material-icons">
                check
            </i>
            <i class="material-icons">
                check
            </i>
        </div>
    </div>
</div>`

const msgDom = (...args) => {
    let d = document.createElement("div");
    d.innerHTML = msgTpl(...args);
    return d.children[0];
}

const $msger = document.querySelector(".chat-input");
const $msgBox = document.querySelector(".content");


$msger.addEventListener("keyup", ev => {
    let enter;
    if (ev.keyCode == 13) {
        enter = true;
    }
    enter && sendMsg();
})

function typeTester(types) {
    return function (text) {
        types = types || [];
        for (const type of types) {
            const regex = new RegExp(`^http(s)?:\\/\\/.+?\\.${type}((\\?.+?)|(#.+?))?$`, "gi");
            if (regex.test(text)) return true
        }
        return false
    }
}

const isVideoSrc = typeTester(["mp4", "webm"]);
const isImgSrc = typeTester(['jpg', "png", "jpeg", "bmp", "gif", "webp"]);

function sendMsg() {
    let messageV = $msger.value;
    if (messageV.trim() == "") return;
    if (isVideoSrc(messageV.trim())) {
        $msgBox.appendChild(msgDom(`<div class="media-warp"><video src="${messageV}" controls></video></div>`, true));
    } else if (isImgSrc(messageV.trim())) {
        $msgBox.appendChild(msgDom(`<div class="media-warp"><img src="${messageV}"></div>`, true))
    } else {
        $msgBox.appendChild(msgDom(messageV));
    }
    $msger.value = "";
    $msgBox.scrollTop = $msgBox.scrollHeight;
}

const $previewImg = document.querySelector("#pImage");
const $previewClose = document.querySelector("#previewClose");

$previewClose.addEventListener("click", ev => {
    $previewImg.parentNode.style.cssText = "";
    app.style.cssText = "";
})
$previewImg.parentNode.addEventListener("mousewheel", ev => {
    if(ev.wheelDelta){
        let nowV = $previewImg.style.transform.match(/scale\((.+?)\)/) || [0,1];
        let nowVnum = Number(nowV[1]);
        if (ev.wheelDelta > 0) {
            let nxtV = nowVnum * 1.1;
            $previewImg.style.transform = `translate(-50%,-50%) scale(${nxtV})`
        }
        if (ev.wheelDelta < 0) {
            let nxtV = nowVnum * 0.909;
            if(nxtV < 1)nxtV = 1;
            $previewImg.style.transform = `translate(-50%,-50%) scale(${nxtV})`
        }
    }
})
// $previewImg.parentNode.addEventListener("click", ev => {
//     if(ev.target == $previewImg)return;
//     $previewImg.parentNode.style.cssText = "";
// })

document.body.addEventListener("click", ev => {
    if (ev.target.nodeName.toLowerCase() == "img") {
        app.style.cssText = "pointer-events: none;user-select: none;";
        $previewImg.style.cssText = "";
        $previewImg.parentNode.style.cssText = "display: unset;"
        if ($previewImg.src == ev.target.src) return;
        $previewImg.src = ev.target.src;
    }
})

document.onmousedown = function (e) {
    let disx = e.pageX - $previewImg.offsetLeft;
    let disy = e.pageY - $previewImg.offsetTop;
    document.onmousemove = function (e) {
        $previewImg.style.left = e.pageX - disx + 'px';
        $previewImg.style.top = e.pageY - disy + 'px';
    }
    document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null;
    }
}

document.body.addEventListener("mouseup", ev => {
    if (ev.target.nodeName == "BODY") {
        $msger.focus()
        menuClose();
    }
})

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        let context = this;

        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(() => {
            func.apply(context, args)
        }, delay);
    }
}

function throttle(func, delay) {
    let lastTime = null
    return function (...args) {
        let now = new Date()
        if (now - lastTime - delay > 0) {
            func(...args)
            lastTime = now
        }
    }
}

function resizeCall() {
    istyle.innerHTML = `
.content img {
    max-height: calc(${ $msgBox.clientHeight }px - 3rem);
}`
}

const reCall = debounce(resizeCall, 500);

window.addEventListener("resize", ev => {
    reCall();
});

resizeCall();

function menuPop() {
    uPanel.style.cssText = '';
    uPanelLeft.style.cssText = '';
}

function menuClose() {
    setTimeout(_ => uPanel.style.cssText = 'display: none;opacity: 0;', 300)
    uPanel.style.cssText = 'opacity: 0;';
    uPanelLeft.style.cssText = 'flex: 0 0 0;';
}