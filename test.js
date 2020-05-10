const isMain = str => (/^#{1,2}(?!#)/).test(str)
const isSub = str => (/^#{3}(?!#)/).test(str)
function convert(str) {
    let arr = str.split(/\n(?=\s*#)/).filter(s => s != "").map(s => s.trim())
    let html = ""
    for (let i in arr) {
        if (i === (arr.length - 1)) {
            if (isMain(arr[i])) {
                html += `
                <section data-markdown>
                    <script type="text/template">
                    ${arr[i]}
                    </script>
                </section>`
            } else if (isSub(arr[i])) {
                html += `
                    <section data-markdown>
                        <script type="text/template">
                        ${arr[i]}
                        </script>
                    </section>
                </section>
                `
            }
        } else {
            if(isMain(arr[i]) && isMain(arr[i+1])){
                html += `
                <section data-markdown>
                    <script type="text/template">
                    ${arr[i]}
                    </script>
                </section>`
            }else if(isMain(arr[i]) && isSub(arr[i+1])){
                html += `
                <section>
                <section data-markdown>
                    <script type="text/template">
                    ${arr[i]}
                    </script>
                </section>`
            }else if(isSub(arr[i]) && isSub(arr[i+1])){
                html += `
                <section data-markdown>
                    <script type="text/template">
                    ${arr[i]}
                    </script>
                </section>`
            }else if(isSub(arr[i]) && isMain(arr[i+1])){
                html += `
                    <section data-markdown>
                        <script type="text/template">
                        ${arr[i]}
                        </script>
                    </section>
                </section>
                `
            }
        }
    }
    console.log(html)
}

let markStr = `
# 首页
首页内容
## 目录页
1、标题1
2、标题2
## 内容页1
内容1
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
console.log(convert(markStr))