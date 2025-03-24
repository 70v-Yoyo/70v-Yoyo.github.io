async function sha256(message) {
    // 将字符串转换为 Uint8Array
    const msgBuffer = new TextEncoder().encode(message);

    // 使用 Web Crypto API 计算 SHA-256 哈希
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // 将 ArrayBuffer 转换为十六进制字符串
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

async function checkpasswd(userInput){
    const hash = await sha256(userInput);  // 使用 await 等待异步结果
    if(hash=="42d2236531705047f7c50e357e0aad7c01d2b7bf25b04927cc2763df1b1aabbf"){
            start();
            localStorage.setItem("hexo_home_password", userInput);
            return true;//return promise 还得异步接受
    }else  return false;
}

function start(){
    var siteInit = new SiteInit({
        "contentArea" : ".article-body",
        "searchButton" : ".toggle-search",
        "searchArea" : ".site-search"
    });
    let move=document.querySelector('#mask-layer');
    if(move)move.remove();
}
function checkflag2(flag1){
    if(flag1==false){
        var userInput = prompt("请输入密码访问本站：");
        checkpasswd(userInput).then(res=>{
            console.log(res)
            flag2=res.result||res;
            console.log(flag2)
            if(flag2==false)document.body.innerHTML = "<h1>密码错误，请刷新重试！</h1>";
        })
    }
}
$(function(){
        var flag1=false,flag2=false;
        var storedPassword = localStorage.getItem("hexo_home_password");
        if(storedPassword!=null){
            checkpasswd(storedPassword).then(res=>{
                flag1=res.result||res;
                checkflag2(flag1);
            })
        }else{
            checkflag2(flag1);
        }
        
            
            // sha256(userInput).then(hash=>{
            //     if(hash=="42d2236531705047f7c50e357e0aad7c01d2b7bf25b04927cc2763df1b1aabbf")start();
            //     else {
            //         document.body.innerHTML = "<h1>密码错误，请刷新重试！</h1>";
            //     }
            // })
        
});

var SiteInit = function(){

    this.init.apply(this, arguments)

};

SiteInit.prototype = {

    init : function(args){
        var _self = this;
        var _animationRate = 300;
        this.setObject(args);
        this.imageWrapper();
        this.imageFancybox();
        this.initSearchArea();
        this.clickSearchBtn(_self, _animationRate);
    },
    setObject : function(args){
        this.$contentArea = $(args.contentArea);
        this.$searchButton = $(args.searchButton);
        this.$searchArea = $(args.searchArea);
    },
    imageWrapper : function(){
        this.$contentArea.each(function(){
            $(this).find('img').each(function(){
                var $img = $(this),
                    imgAlt = this.alt,
                    imgSrc = this.src,
                    $imgWrap,
                    $imgCaption;
                if( imgAlt ){
                    $imgCaption = $('<span>', {
                        "class" : "caption",
                        "text" : imgAlt
                    });
                    $img.after($imgCaption);
                }
                $imgWrap = $('<a>', {
                    "class" : "img-wrap",
                    "href" : imgSrc
                });
                $img.wrap($imgWrap);
            });
        });
    },
    imageFancybox : function(){
        if( ! $.fancybox ){
            return false;
        }else{
            this.$contentArea.each(function(i){
                $(this).find('.img-wrap').each(function(){
                    $(this).attr('rel', 'image' + i);
                });
            });
            $('.img-wrap').fancybox();
        }
    },
    initSearchArea : function(){
        this.$searchArea.find('input[type="search"]').attr('type', 'text');
    },
    clickSearchBtn : function(_self, _animationRate){
        this.$searchButton.click(function(e){
            e.preventDefault();
            _self.$searchArea.toggleClass('active');
        });
    }

};