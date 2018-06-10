<h3>Tutorial</h3>
<p>1. Download the 
    <a target="_blank" href="https://github.com/xiwangzishi/nebulas-cat">Nebulas Cat</a> source code
    <code>git clone https://github.com/xiwangzishi/nebulas-cat.git</code>
</p>

<p>2. Enter the folder "nebulas-cat"，install the dependent files
    <code>npm install</code>
</p>

<p>3. How to run（You need to restart the tool or debug program after updating contract files）：</p>
<ul>
    <li>Method 1(Recommended)：Use the debug function in Visual Studio Code（can use break point）
        <code>Debug -> Start Debugging</code>
        <img style="width:500px;margin:10px;" src="static/images/vsc-step-en.png" alt="">
    </li>
    <li>Method 2: Run the tool
        Execute command <code>node index.js</code>, then use console.log in contract file to print info（will output to terminal console）
        <img style="width:500px;margin:10px;" src="static/images/cli-step-en.png" alt="">
    </li>
</ul>

<p>4. Set network as localhost in Chrome extension wallent</p>
<img style="width:500px;margin:10px;" src="static/images/chrome-plugin-en.png" alt="">
<div>5. Set request as localhost in Neb.js （in the js source code of your DAPP）
    <p>
        <code>neb.setRequest(new HttpRequest("http://localhost:8685"));</code>
    </p>
</div>
<p>6. Set the queryPayInfo API callback in NebPay as localhost url（Skip this step if you haven't used this API. You can set this in the js source code of your DAPP.）
<pre>
<code style="display:block;">
NebPay.queryPayInfo(serialNumber,{
callback:'http://localhost:8685/api/pay',
listener:undefined
})
</code>
</pre>
</p>

<p>7. Open inden.html under nebulas-cat via browser and input
    <code>the path of your contract file</code>，click
    <code>Deploy</code> to start.</p>
<img style="width:500px;margin:10px;" src="static/images/config.png" alt="">

<h3>How it works</h3>
<p>This tool is basically a mock web server based on Koa.js, pretending to be a mining node.
</p>
<p>Available APIs：</p>
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
<p>When clicking "Deploy", the tool requires your contract file as a module of Node.js. And requests of Neb.js actually call methods of contract instance directly, so you can also Visual Studio Code to debug the contract (theoretically IDE can do, figure it out yourself). All source codes are in index.js</p>
<p>This project contains source codes of the official <a href="https://github.com/nebulasio/neb.js/tree/feature/nvm">NVM</a> debug tool.</p>