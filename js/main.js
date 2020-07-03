const $ = s=>document.querySelector(s)
const $$ = s =>document.querySelectorAll(s)
const isMain = str => (/^#{1,2}(?!#)/).test(str)
const isSub = str => (/^#{3}(?!#)/).test(str)
const convert=str=> {
    let arr = str.split(/\n(?=\s*#{1,3}[^#])/).filter(s => s != "").map(s => s.trim())
    let html = ''
    for (let i=0 ;i<arr.length;i++) {
        if (i === (arr.length - 1)) {
            if (isMain(arr[i])) {
                html += `
                <section data-markdown>
                    <textarea data-template>
                    ${arr[i]}
                    </textarea>
                </section>`
            } else if (isSub(arr[i])) {
                html += `
                    <section data-markdown>
                        <textarea data-template>
                        ${arr[i]}
                        </textarea>
                    </section>
                </section>
                `
            }
        } else {
            if(isMain(arr[i]) && isMain(arr[i+1])){
                html += `
                <section data-markdown>
                    <textarea data-template>
                    ${arr[i]}
                    </textarea>
                </section>`
            }else if(isMain(arr[i]) && isSub(arr[i+1])){
                html += `
                <section>
                <section data-markdown>
                    <textarea data-template>
                    ${arr[i]}
                    </textarea>
                </section>`
            }else if(isSub(arr[i]) && isSub(arr[i+1])){
                html += `
                <section data-markdown>
                    <textarea data-template>
                    ${arr[i]}
                    </textarea>
                </section>`
            }else if(isSub(arr[i]) && isMain(arr[i+1])){
                html += `
                    <section data-markdown>
                        <textarea data-template>
                        ${arr[i]}
                        </textarea>
                    </section>
                </section>
                `
            }
        }
    }
    return html
}
const Menu = {
    init(){
        console.log('menu init ...')
        this.$open = $('.control .icon-setting')
        this.$close = $('.menu .icon-close')
        this.$menu = $('.menu')
        this.$$tab = $$('.menu .detail .tab')
        this.$$content = $$('.menu .content')
        this.bind()
    },
    bind(){
        this.$open.onclick = () => this.$menu.classList.add('open')
        this.$close.onclick = ()=> this.$menu.classList.remove('open')
        this.$$tab.forEach($tab=>{
            $tab.onclick = ()=> {
                this.$$tab.forEach($tt=>$tt.classList.remove('active'))
                $tab.classList.add('active')
                let index = [...this.$$tab].indexOf($tab)
                this.$$content.forEach($con=>$con.classList.remove('active'))
                this.$$content[index].classList.add('active')
            }
            
        })
        
    }

}
const Editor = {
    init(){
        console.log('editor init ...')
        this.$btnsave = $('.content .button-save')
        this.$textarea = $('.content textarea')
        this.$slides = $('.slides')
        this.bind()
    },
    bind(){
        this.$btnsave.onclick = () =>{
            if(this.$textarea.value){
                localStorage.markdownStr=this.$textarea.value
                location.reload()
            }
        }
        this.start()
    },
    start(){
        let template =`
        # 首页
        首页内容
        ## 目录页
        ## 内容页2
        内容2
        ### 内容页3
        内容3
        ### 内容页4
        内容4
        ### 内容页5
        内容5
        ## 结束页
        谢谢观看
        `
        let markStr = localStorage.markdownStr
        this.$slides.innerHTML= convert(markStr || template)
        this.$textarea.innerHTML = (markStr || template)
        
        //转场
        let transtion = localStorage.trans || 'slide'
            // More info https://github.com/hakimel/reveal.js#configuration
        Reveal.initialize({
            controls: true,
            progress: true,
            center: localStorage.align==='left-top'?false:true,
            hash: true,
    
            transition: `${transtion}`, // none/fade/slide/convex/concave/zoom
    
            // More info https://github.com/hakimel/reveal.js#dependencies
            dependencies: [
                { src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
                { src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
                { src: 'plugin/highlight/highlight.js' },
                { src: 'plugin/search/search.js', async: true },
                { src: 'plugin/zoom-js/zoom.js', async: true },
                { src: 'plugin/notes/notes.js', async: true }
            ]
        });
    }
}
const Theme = {
    init(){
        this.$$figure = $$('.menu .themes figure')
        this.$transiton = $('.menu .theme .transiton')
        this.$align = $('.menu .theme .align')
        this.$reveal = $('.reveal')
        this.bind()
    },
    bind(){
        this.$$figure.forEach($fig=>{
            $fig.onclick = ()=>{
                localStorage.theme = $fig.dataset.name
                location.reload()
            }
        })
        this.themeLoad()
        //转场
        this.transition()
        //对齐方式
        this.align()
    },
    themeLoad(){
        let theme = localStorage.theme || "black"
        let $link = document.createElement('link')
        $link.rel = "stylesheet"
        $link.href = `css/theme/${theme}.css`
        $link.id = "theme"
        document.head.appendChild($link)
        
        Array.from(this.$$figure).find($ff=>$ff.dataset.name===theme).classList.add('select')
        this.$transiton.value = localStorage.trans || 'slide'
        this.$align.value = localStorage.align || 'center'
        this.$reveal.classList.add(this.$align.value)
    },
    transition(){
        this.$transiton.onchange = function(){
            localStorage.trans = this.value
            location.reload()
        }
    },
    align(){
        this.$align.onchange = function(){
            localStorage.align = this.value
            location.reload()
        }
    }
}
const Print = {
    init(){
        this.$dowload = $('.menu .content .download')
        this.bind()
        this.start()
    },
    bind(){
        this.$dowload.addEventListener('click',function(){
            let $a = document.createElement('a')
            $a.href = '?print-pdf'
            $a.target = '_blank'
            $a.click()
        })
    },
    start(){
        let link = document.createElement( 'link' );
        link.rel = 'stylesheet';
        link.type = 'text/css';
        //link.href = window.location.search.match( /print-pdf/gi ) ? 'css/print/pdf.css' : 'css/print/paper.css';
        if(window.location.search.match( /print-pdf/gi )){
            link.href = 'css/print/pdf.css';
            window.print()
        }else{
            link.href = 'css/print/paper.css';
        }
        document.head.appendChild( link );
    }
}

const imgUpload= {
    init(){
        this.$upfile = $('#img-upload')
        this.$textarea = $('.menu .content textarea')
        this.start()
        this.bind()
    },
    bind(){
        const self = this
        this.$upfile.onchange = function(){
            //大小不超过2M
            const $localFile = this.files[0]
            if($localFile.size/1048576>2){
                alert('文件大小不能超过2M')
                return
            }
            //在markdown中插入img标签
            self.insertText('![上传中，进度为0%]()')
            //上传图片
            const file = new AV.File(encodeURI($localFile.name), $localFile);
            file.save({ 
                keepFileName: true,
                onprogress: (progress) => {
                    self.insertText(`![上传中，进度为${progress.percent}%]()`)
                  }
            }).then((file) => {
                let url = file.attributes.url+'?imageView2/0/w/800/h/600'
                let imgName = file.attributes.name
                self.insertText(`![${imgName}](${url})`)
            }, (error) => {
                  alert(error)
                // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
              });

        }
    },
    insertText(text){
        let start = this.$textarea.selectionStart
        let end = this.$textarea.selectionEnd
        let oldText = this.$textarea.value
        this.$textarea.value = oldText.substring(0,start)+text+oldText.substring(end)
        this.$textarea.focus()
        this.$textarea.setSelectionRange(start,start+text.length)
    },
    start(){
        AV.init({
            appId: "ImKLz6IvL03EvCf2WLwarbrn-gzGzoHsz",
            appKey: "jsKlwvq1fWorgsPbUCnkQpq1",
            serverURL: "https://imklz6iv.lc-cn-n1-shared.com"
          });
    }

}

const APP = {
    init(){
        [...arguments].forEach(modules=>modules.init())
    }
}
APP.init(Menu,Editor,Theme,Print,imgUpload)