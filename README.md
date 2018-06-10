<a href="https://github.com/xiwangzishi/nebulas-cat/blob/master/README-EN.md">English</a>
<p>欢迎使用 Nebulas Cat 星云链 DAPP 本地开发调试工具，使用过程中遇到任何问题可以到 <a target="_blank" href="https://bbs.forfunapp.com/">链社区</a> 发帖交流。</p>
<h3>使用教程</h3>
<p>1. 下载
    <a target="_blank" href="https://github.com/xiwangzishi/nebulas-cat">Nebulas Cat</a> 源码
    <code>git clone https://github.com/xiwangzishi/nebulas-cat.git</code>
</p>

<p>2. 进入 nebulas-cat 文件夹，安装依赖
    <code>npm install</code>
</p>

<p>3. 运行工具（合约文件更新后，需要重启调试程序）：</p>
<ul>
    <li>方法一(推荐)：使用 Visual Studio Code 的调试功能（可以在合约里面下断点）
        <code>调试 -> 启动调试</code>
        <img style="width:500px;margin:10px;" src="static/images/vsc-step.png" alt="">
    </li>
    <li>方法二：运行工具
        <code>node index.js</code>, 然后直接在合约里面使用 console.log 打印对应信息（会输出到控制台）
        <img style="width:500px;margin:10px;" src="static/images/cli-step.png" alt="">
    </li>
</ul>

<p>4. 设置chrome 插件钱包为 localhost 网络</p>
<img style="width:500px;margin:10px;" src="static/images/chrome-plugin.png" alt="">
<p>5. 设置 Neb.js 网络为 localhost 网络（在你 DAPP 的 JS 代码中设置）
    <code>neb.setRequest(new HttpRequest("http://localhost:8685"));</code>
</p>
<p>6. 设置 NebPay 的 queryPayInfo API callback为 localhost 网络（如果未使用该API则跳过，此处在你 DAPP 的 JS 代码中 NebPay.queryPayInfo 处设置）
    <pre>
<code style="display:block;">
NebPay.queryPayInfo(serialNumber,{
callback:'http://localhost:8685/api/pay',
listener:undefined
})
</code>
</pre>
</p>

<p>7. 用浏览器打开 nebulas-cat 目录下的 index.html 后输入
    <code>合约文件路径</code>，点击
    <code>部署</code>即可使用。</p>
<img style="width:500px;margin:10px;" src="static/images/config.png" alt="">

<h3>原理</h3>
<p>其实就是本地起了一个 Web 服务（基于 Koa）,然后实现了 Neb.js 请求节点的一些 API ，假装自己是个记账节点而已。</p>
<p>目前实现的 API 有：</p>
<ul>
    <li>
        <code>/v1/user/nebstate</code>
    </li>
    <li>
        <code>/v1/user/call</code>
    </li>
    <li>
        <code>/v1/user/accountstate</code>
    </li>
    <li>
        <code>/v1/user/rawtransaction</code>
    </li>
    <li>
        <code>/v1/user/getTransactionReceipt</code>
    </li>
    <li>
        <code>/v1/user/getEventsByHash</code>
    </li>
    <li>NebPay：
        <code>/api/pay</code>
    </li>
    <li>NebPay：
        <code>/api/pay/query</code>
    </li>
</ul>
<p>点击部署按钮，就是把输入的合约文件路径 require 进来作为 Node.js 的一个模块，然后 Neb.js 的请求都是直接调用合约实例的方法，所以可以直接利用 Visual Studio Code 来调试合约功能（理论上其他 IDE 也可以，自行摸索！）。具体的源码都在 index.js 中</p>
<p>本项目使用了一些官方
    <a href="https://github.com/nebulasio/neb.js/tree/feature/nvm">NVM</a> 调试工具的一些源码</p>
<p>联系我：d2VjaGF0Onphbmtibw==</p>
