/*******************************************************************************
牛牛截图的JS部分的核心流程封装在此文件中，绝大部分情况下，您不需要修改此文件中的JS内容，它已经包含了在所有浏览器上应用
牛牛截图所需要的所有代码，您只需要去修改capturewrapper.js，将相应的函数修改成与您的UI匹配的即可 
*******************************************************************************/

/*******************************************************************************/
//设置截图的参数 
import $ from 'jquery';

// module.exports = function () {
(function ($) {
    var escapeable = /["\\\x00-\x1f\x7f-\x9f]/g,
        meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        };
    $.toJSON = typeof JSON === 'object' && JSON.stringify ? JSON.stringify : function (o) {
        if (o === null) {
            return 'null';
        }
        var type = typeof o;
        if (type === 'undefined') {
            return undefined;
        }
        if (type === 'number' || type === 'boolean') {
            return '' + o;
        }
        if (type === 'string') {
            return $.quoteString(o);
        }
        if (type === 'object') {
            if (typeof o.toJSON === 'function') {
                return $.toJSON(o.toJSON());
            }
            if (o.constructor === Date) {
                var month = o.getUTCMonth() + 1,
                    day = o.getUTCDate(),
                    year = o.getUTCFullYear(),
                    hours = o.getUTCHours(),
                    minutes = o.getUTCMinutes(),
                    seconds = o.getUTCSeconds(),
                    milli = o.getUTCMilliseconds();
                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }
                if (hours < 10) {
                    hours = '0' + hours;
                }
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                if (seconds < 10) {
                    seconds = '0' + seconds;
                }
                if (milli < 100) {
                    milli = '0' + milli;
                }
                if (milli < 10) {
                    milli = '0' + milli;
                }
                return '"' + year + '-' + month + '-' + day + 'T' +
                    hours + ':' + minutes + ':' + seconds + '.' + milli + 'Z"';
            }
            if (o.constructor === Array) {
                var ret = [];
                for (var i = 0; i < o.length; i++) {
                    ret.push($.toJSON(o[i]) || 'null');
                }
                return '[' + ret.join(',') + ']';
            }
            var name, val, pairs = [];
            for (var k in o) {
                type = typeof k;
                if (type === 'number') {
                    name = '"' + k + '"';
                } else if (type === 'string') {
                    name = $.quoteString(k);
                } else {
                    continue;
                }
                type = typeof o[k];
                if (type === 'function' || type === 'undefined') {
                    continue;
                }
                val = $.toJSON(o[k]);
                pairs.push(name + ':' + val);
            }
            return '{' + pairs.join(',') + '}';
        }
    };
    $.evalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function (src) {
        return eval('(' + src + ')');
    };
    $.secureEvalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function (src) {
        var filtered = src.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        if (/^[\],:{}\s]*$/.test(filtered)) {
            return eval('(' + src + ')');
        } else {
            throw new SyntaxError('Error parsing JSON, source is not valid.');
        }
    };
    $.quoteString = function (string) {
        if (string.match(escapeable)) {
            return '"' + string.replace(escapeable, function (a) {
                var c = meta[a];
                if (typeof c === 'string') {
                    return c;
                }
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + string + '"';
    };
})($);
var emPensize = 1;		//设置画笔大小
var emDrawType = 2;		//设置是腾讯风格还是360风格 0： 腾讯风格   1： 360风格
var emTrackColor = 3;		//自动识别的边框的颜色
var emEditBorderColor = 4;	//文本输入的边框颜色
var emTransparent = 5;		//工具栏的透明度
var emWindowAware = 6;		//设置是否禁用随着DPI放大
var emSetSaveName = 8;		//设置保存时的开始文字     免费版本无效
var emSetMagnifierBkColor = 9; //设置放大镜的背景色，不设置则透明
var emSetMagnifierLogoText = 10; //设置放大镜上的LOGO字符，可提示快捷键，如： 牛牛截图(CTRL + SHIFT + A)     免费版本无效
var emSetWatermarkPictureType = 20;						//设置水印的类型 
var emSetWatermarkPicturePath = 21;						//设置水印的路径 
var emSetWatermarkTextType = 22;						//设置水印文字的类型 
var emSetWatermarkTextValue = 23;                       //设置水印文字的字符串
var emSetMosaicType = 24;               //指定马赛克的类型，1为矩形，2为画线 
var emSetTooltipText = 25;               //用于设置工具栏图标的TOOLTIP文字 
var emSetMoreInfo = 26;							//设置额外的信息，用于特殊需求 
/*******************************************************************************/


var emClosed = 1;
var emConnected = 2;
var emConnecting = 3;

var emCaptureSuccess = 0;
var emCaptureFailed = 1;
var emCaptureUnknown = 2;

var emCmdReady = -1;
var emCmdCapture = 0;
var emCmdSaveFile = 1;


export function isMacintosh() {
    return navigator.platform.indexOf('Mac') > -1;
}

export function rgb2value(r, g, b) {
    return r | g << 8 | b << 16;
}

var captureObjSelf = null;
export function onpluginLoaded() {
    captureObjSelf.pluginLoaded();
}
export function NiuniuCaptureObject() {
    var self = this;
    captureObjSelf = this;
    this.PenSize = 2;
    this.DrawType = 0;
    this.TrackColor = rgb2value(255, 0, 0);
    this.EditBorderColor = rgb2value(255, 0, 0);
    this.Transparent = 240;
    this.WindowAware = 1;
    this.MosaicType = 1;
    this.SaveName = "测试保存";
    this.MagnifierLogoText = "测试截图";
    this.WatermarkPictureType = "2|100|100|400|400|20";
    this.WatermarkPicturePath = "";
    this.WatermarkTextType = "2|100|100|100|40|20|0|150|30|80,55,55,55";
    this.WatermarkTextValue = "";
    this.NiuniuAuthKey = "";
    this.ToolTipText = "";  //tipRectangle|tipCircle|tipArrow|tipBrush|tipGlitter|tipMosaic|tipText|tipUndo|tipSave|tipCancel|tipFinish|txtFinish
    this.MoreInfo = "1,100|300|600";

    this.useCustomizedProtoco = true;   //是否使用浏览器自定义协议加websocket 

    this.IsWaitCustomizedCallBack = false;
    this.autoConnectAfterPageLoad = true;
    this.IsFirstConnect = true;
    this.IsEverConnected = false;
    this.reconnectTryTime = 0;
    this.TimeIntervalID = -1;
    this.ReceivedEchoBack = false;

    this.Version = "1.0.0.0";
    this.hostPort = "30101,30102";
    this.hostPortIndex = 0;
    this.CaptureName = "NiuniuCapture";
    this.NiuniuSocket = null;
    this.connectState = emClosed;

    this.SocketTimeStamp = new Date().getTime();
    this.TimeOutID = -1;

    this.FinishedCallback = null;
    this.PluginLoadedCallback = null;
    this.VersionCallback = null;
    this.OnConnectFailed = function (isReconnect) {
        self.WriteLog(isReconnect ? "reconnect failed, the capture control process is exit." : "connect failed at the first time.");
    }

    this.LoadPlugin = function () {
        var obj = $('#capturecontainer');
        if (obj.length < 1) {
            $("body").append('<div id="capturecontainer" style="height:0px;width:0px;"></div>');
            obj = $('#capturecontainer');
        }
        obj.html('');
        obj.html('<object id="niuniuCapture" type="application/x-niuniuwebcapture" width="0" height="0"><param name="onload" value="onpluginLoaded" /></object>');

        var iframeObj = $('startCaptureFrame');
        if (iframeObj.length < 1) {
            $("body").append('<iframe id="startCaptureFrame" style="display:none;"></iframe>');
        }
    }

    this.niuniuCapture = function () {
        return document.getElementById('niuniuCapture');
    }

    this.addEvent = function (obj, name, func) {
        if (obj.attachEvent) {
            obj.attachEvent("on" + name, func);
        } else {
            obj.addEventListener(name, func, false);
        }
    }

    this.pluginValid = function () {
        try {
            if (self.niuniuCapture().valid) {
                return true;
            }
        }
        catch (e) {
        }
        return false;
    }

    this.OnCaptureFinished = function (x, y, width, height, content, localpath) {
        self.OnCaptureFinishedEx(1, x, y, width, height, "", content, localpath);
    }

    this.OnCaptureFinishedEx = function (type, x, y, width, height, info, content, localpath) {
        //交给上层去处理截图完成后的事项 
        if (self.FinishedCallback != null) {
            self.FinishedCallback(type, x, y, width, height, info, content, localpath);
        }
        else {
            alert("截图完成的事件未绑定，将不能对图片进行处理，请指定FinishedCallback回调函数");
        }
    }

    this.pluginLoaded = function () {
        self.GetVersion();
        if (!self.pluginValid()) {
            if (self.PluginLoadedCallback != null) {
                self.PluginLoadedCallback(false);
            }
            return false;
        }

        //此函数必需调用，传递正确的参数，且必需先于其他函数调用  
        self.niuniuCapture().InitCapture(self.NiuniuAuthKey);

        self.niuniuCapture().InitParam(emPensize, self.PenSize);
        self.niuniuCapture().InitParam(emDrawType, self.DrawType);
        self.niuniuCapture().InitParam(emTrackColor, self.TrackColor);
        self.niuniuCapture().InitParam(emEditBorderColor, self.EditBorderColor);
        self.niuniuCapture().InitParam(emTransparent, self.Transparent);

        self.niuniuCapture().InitParam(emSetSaveName, self.SaveName);
        self.niuniuCapture().InitParam(emSetMagnifierLogoText, self.MagnifierLogoText);
        self.niuniuCapture().InitParam(emSetMosaicType, self.MosaicType);

        //设置工具栏上的按钮TOOLTIP  
        self.niuniuCapture().InitParam(emSetTooltipText, self.ToolTipText);

        self.niuniuCapture().InitParam(emSetMoreInfo, self.MoreInfo);
        //niuniuCapture().InitParam(23, "测试文字.");
        //此BASE64字符串表示牛牛默认的水印图片，可以替换
        // niuniuCapture().InitParam(21, "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");
        //注：以上设置LOGO及保存名的接口，免费版本无效

        //添加控件的事件监听 
        self.addEvent(self.niuniuCapture(), 'CaptureFinishedEx', self.OnCaptureFinishedEx);
        //以下这个事件主要是用于兼容旧的浏览器控件的事件通知
        self.addEvent(self.niuniuCapture(), 'CaptureFinished', self.OnCaptureFinished);


        if (self.PluginLoadedCallback != null) {
            self.PluginLoadedCallback(true);
        }
    }

    this.SetWatermarkPicture = function (watermarPicData) {
        self.WatermarkPicturePath = watermarPicData;
        //设置测试的水印图片的Base64字符串，此操作应该是在页面加载中处理比较合适 
        if (!self.pluginValid())
            return;
        self.niuniuCapture().InitParam(emSetWatermarkPicturePath, self.WatermarkPicturePath);
        self.niuniuCapture().InitParam(emSetWatermarkPictureType, self.WatermarkPictureType);
    }

    this.SetWatermarkText = function (watermarkText) {
        self.WatermarkTextValue = watermarkText;
        //设置测试的水印文字，此操作应该是在页面加载中处理比较合适 
        if (!self.pluginValid())
            return;
        //nShowType|nMinWidth|nMinHeight|nVerticalInterval|nOffset|nFontSize|nIsBold|nTextWidth|nTextHeight|colorText
        self.niuniuCapture().InitParam(emSetWatermarkTextValue, self.WatermarkTextValue);
        self.niuniuCapture().InitParam(emSetWatermarkTextType, self.WatermarkTextType);
    }


    this.SavePicture = function (savename) {
        if (self.pluginValid()) {
            self.niuniuCapture().SavePicture(savename);
        }
    }

    this.GetCursorPosition = function () {
        if (self.pluginValid()) {
            var val = self.niuniuCapture().GetCursorPosition();
            return val;
        }
        return "";
    }

    this.NewCaptureParamObject = function (defaultpath, hideCurrWindow, autoCaptureFlag, x, y, width, height) {
        var obj = new Object();
        obj.CmdType = 1;
        obj.IsGBK = 0;				//是否是GBK编码，这样会涉及到编码转换  
        obj.AuthKey = self.NiuniuAuthKey;  //						
        obj.Pensize = self.PenSize;		//设置画笔大小
        obj.DrawType = self.DrawType;			//设置是腾讯风格还是360风格
        obj.TrackColor = self.TrackColor;		//自动识别的边框的颜色
        obj.EditBorderColor = self.EditBorderColor;	//文本输入的边框颜色
        obj.Transparent = self.Transparent;		//工具栏的透明度
        obj.SetSaveName = self.SaveName;									//设置保存时的开始文字
        obj.SetMagnifierLogoText = self.MagnifierLogoText;						//设置放大镜上的LOGO字符   
        obj.SetWatermarkPictureTypeEx = self.WatermarkPictureType;						//设置水印的类型 
        obj.SetWatermarkPicturePath = self.WatermarkPicturePath;						//设置水印的路径 
        obj.SetWatermarkTextTypeEx = self.WatermarkTextType;							//设置水印文字的类型 
        obj.SetWatermarkTextValue = self.WatermarkTextValue;						//设置水印文字
        obj.MosaicType = self.MosaicType;          //设置马赛克的类型 
        obj.SetToolbarText = self.ToolTipText;
        obj.MoreInfo = this.MoreInfo;
        //以下是截图时传递的参数 
        obj.DefaultPath = defaultpath;
        obj.HideCurrentWindow = hideCurrWindow;
        obj.AutoCaptureFlag = autoCaptureFlag;
        obj.x = x;
        obj.y = y;
        obj.Width = width;
        obj.Height = height;
        return obj;
    }

    this.DoCapture = function (name, hide, AutoCapture, x, y, width, height) {
        if (self.IsNeedCustomizedProtocol()) {
            return self.DoCaptureForCustomize(name, hide, AutoCapture, parseInt(x), parseInt(y), parseInt(width), parseInt(height));
        }

        if (!self.pluginValid()) {
            return emCaptureFailed;
        }
        self.niuniuCapture().Capture(name, hide, AutoCapture, x, y, width, height);
        return emCaptureSuccess;
    }

    this.InitNiuniuCapture = function () {
        self.LoadPlugin();
        setTimeout(captureObjSelf.InitWebSocketAndBindCallback, 200);
    }

    this.InitWebSocketAndBindCallback = function () {
        if (!self.autoConnectAfterPageLoad || !self.IsNeedCustomizedProtocol()) {
            return;
        }
        // self.connectHost();
    }

    this.getNextPort = function () {
        //init port params flag
        //进行拆分处理 self.hostPort;
        var portArray = self.hostPort.split(",");
        if (portArray.length < 1) {
            alert("服务端口为空");
            return 30101;
        }
        if (self.hostPortIndex < 0) {
            self.hostPortIndex = 0;
        }
        if (self.hostPortIndex > portArray.length - 1) {
            self.hostPortIndex = portArray.length - 1;
        }
        var nPort = parseInt(portArray[self.hostPortIndex]);
        self.hostPortIndex++;
        if (self.hostPortIndex > portArray.length - 1) {
            self.hostPortIndex = 0;
        }
        return nPort;
    }

    this.connectHost = function () {
        if (self.NiuniuSocket != null) {
            self.WriteLog("connectHost NiuniuSocket is not null, return.");
            return;
        }
        clearTimeout(self.TimeOutID);
        self.connectState = emConnecting;


        try {
            var wshosts = ['127.0.0.1', 'localhost'];
            for (var i in wshosts) {
                try {
                    var host = "ws://127.0.0.1:" + self.getNextPort() + "/" + self.CaptureName;
                    self.NiuniuSocket = new WebSocket(host);
                    break;
                }
                catch (ee) {
                    var ggg = 0;
                }
            }

            //OutputLog('Socket Status: '+socket.readyState);
            self.NiuniuSocket.onopen = function (evt) {
                self.NiuniuSocket.send('0' + self.SocketTimeStamp);
                self.WriteLog("NiuniuSocket.onopen.");
                clearTimeout(self.TimeOutID);
            }

            self.NiuniuSocket.onmessage = function (msg) {
                var str = "";
                str = msg.data;
                var id = str.substr(0, 1);
                var arg1 = str.substr(1);
                clearTimeout(self.TimeOutID);
                if (id == "0") {
                    self.hostPortIndex--;
                    //表示连接成功，此时应该提示可以截图了 
                    self.connectState = emConnected;
                    self.pluginLoaded();
                    self.IsEverConnected = true;
                    self.IsFirstConnect = false;
                    if (self.IsWaitCustomizedCallBack) {
                        setTimeout(captureObjSelf.SendReadyRecvData, 3);
                    }
                    self.WriteLog("connect sucess.");
                    self.ReceivedEchoBack = true;
                    clearInterval(self.TimeIntervalID);
                    self.TimeIntervalID = setInterval(captureObjSelf.LoopEchoMessage, 3000);
                }
                if (id == "1") {
                    //解析消息 
                    var _aoResult = eval("(" + arg1 + ")");
                    self.ReceivedEchoBack = true;
                    if (_aoResult.command == "echo") {
                        self.WriteLog("received echo");
                        return;
                    }
                    self.WriteLog("received capturedata.");
                    if (_aoResult.command == "version") {
                        self.WriteLog(_aoResult.Ver);
                        self.VersionCallback(_aoResult.Ver);
                    }
                    else {
                        self.OnCaptureFinishedEx(_aoResult.Type, _aoResult.x, _aoResult.y, _aoResult.Width, _aoResult.Height, _aoResult.Info, _aoResult.Content, _aoResult.LocalPath);
                    }
                }
            }

            self.NiuniuSocket.onclose = function (evt) {
                self.OnWebSocketError("self.NiuniuSocket.onclose." + evt.data);
            }
            self.NiuniuSocket.onerror = function (evt) {
                //self.OnWebSocketError("self.NiuniuSocket.onerror." + evt.data);
            };

        } catch (e) {
            self.OnWebSocketError("connect exception." + e.message);
        }
    }

    this.WriteLog = function (txt) {
        //写日志 
        try {
            console.log(txt);
        }
        catch (e) {

        }
    }

    this.OnWebSocketError = function (type) {
        //如果不处于连接成功状态，说明不是断开连接，而是连接失败 
        var isConnectedFailed = false;
        if (self.connectState != emConnected) {
            isConnectedFailed = true;
        }
        self.WriteLog(type);
        self.ReceivedEchoBack = false;
        self.connectState = emClosed;

        if (self.NiuniuSocket != null) {
            self.NiuniuSocket.close();
        }

        self.NiuniuSocket = null;
        clearTimeout(self.TimeOutID);
        clearInterval(self.TimeIntervalID);

        if (isConnectedFailed) {
            if (self.IsFirstConnect) {
                self.IsFirstConnect = false;
                if (self.OnConnectFailed != null) {
                    self.OnConnectFailed(false);
                }
                return;
            }

            if (self.IsEverConnected) {
                self.reconnectTryTime++;
                //通知连接连接断开
                if (self.reconnectTryTime > 3) {
                    self.IsEverConnected = false;
                    self.reconnectTryTime = 0;
                    if (self.OnConnectFailed != null) {
                        self.OnConnectFailed(true);
                    }
                    return;
                }
            }
        }

        // self.TimeOutID = setTimeout(captureObjSelf.connectHost(), 800);
    }

    this.LoopEchoMessage = function () {
        if (!self.ReceivedEchoBack) {
            self.OnWebSocketError("this.LoopEchoMessage, !self.ReceivedEchoBack");
            self.ReceivedEchoBack = false;
            clearInterval(self.TimeIntervalID);
            self.TimeIntervalID = setInterval(captureObjSelf.LoopEchoMessage, 3000);
            return;
        }
        self.ReceivedEchoBack = false;
        clearTimeout(self.TimeOutID);
        if (self.connectState != emConnected) {
            clearInterval(self.TimeIntervalID);
            return;
        }
        var obj = new Object();
        obj.command = "echo";
        self.NiuniuSocket.send("1" + encodeURIComponent($.toJSON(obj)));
    }

    this.SendReadyRecvData = function () {
        self.WriteLog("SendReadyRecvData.");
        var obj = self.NewCaptureParamObject("", 0, 0, 0, 0, 0, 0);
        obj.CmdType = -1;
        self.NiuniuSocket.send("1" + encodeURIComponent($.toJSON(obj)));
    }

    this.DoCaptureForCustomize = function (name, hide, AutoCapture, x, y, width, height) {
        var obj = self.NewCaptureParamObject(name, hide, AutoCapture, x, y, width, height);
        try {
            //启动客户端，或者通过websocket去发送数据   
            if (self.connectState == emConnected) {
                var json = $.toJSON(obj);
                self.NiuniuSocket.send('1' + encodeURIComponent(json));
            }
            else {
                //首次启动时，不支持水印，否则会过长 
                obj.SetWatermarkPicturePath = "";
                //obj.SetWatermarkTextValue = "";	
                var json = $.toJSON(obj);
                self.WriteLog(json.length);
                var newUrl = self.CaptureName + "://" + encodeURIComponent(json);
                self.WriteLog(newUrl.length);

                //启动客户端  
                $('#startCaptureFrame').attr('src', newUrl);

                self.IsWaitCustomizedCallBack = true;
                // self.connectHost();
                return emCaptureUnknown;
            }

            return emCaptureSuccess;
        }
        catch (e) {
            alert(e.message);
        }
        return emCaptureUnknown;
    }


    this.IsNeedCustomizedProtocol = function () {
        if (isMacintosh()) {
            return true;
        }
        if (!self.useCustomizedProtoco) {
            return false;
        }

        if (self.pluginValid()) {
            return false;
        }

        try {
            var agent = window.navigator.userAgent.toLowerCase();
            var isQQBrowser = agent.indexOf("qqbrowser") != -1;
            //if(isQQBrowser)
            //{
            //    return false;
            //}
            var isUBrowser = agent.indexOf("ubrowser") != -1;
            if (isUBrowser) {
                return false;
            }
            var isChrome = agent.indexOf("chrome") != -1;
            if (isChrome) {
                if (chrome && chrome.runtime) {
                    return true;
                }
            }
            //如果是firefox 且在50版本以上，则需要  
            var brow = $.browser;
            if (brow.mozilla) {
                return true;
            }
            var isEdge = agent.indexOf("edge") != -1;
            if (isEdge) {
                return true;
            }
            return false;
        }
        catch (e) {
        }
        return false;
    }

    this.GetVersion = function () {
        if (self.IsNeedCustomizedProtocol()) {
            if (self.connectState != emConnected) {
                return;
            }
            var obj = new Object();
            obj.command = "version";
            self.NiuniuSocket.send("1" + encodeURIComponent($.toJSON(obj)));
            return;
        }

        if (!self.pluginValid()) {
            return;
        }
        var verSion = self.niuniuCapture().GetVersion();
        self.VersionCallback(verSion);
        self.WriteLog(verSion);
    }
}
//}

var savedPictureContent = '';
var extendName = '';
var captureObj = null;
var downloadUrl = 'http://www.ggniu.cn/download/CaptureInstall.exe?';

/*
用于初始化牛牛截图控件，此函数需要在页面加载完成后立即调用 
在此函数中，您可以设置相关的截图的UI控制，如，画笔大小、边框颜色等等 【这部分信息在niuniucapture.js中也有默认值，直接修改默认值也可 】
*/
export function Init() {
    if (isMacintosh()) {
        downloadUrl = 'http://www.ggniu.cn/download/CaptureInstall.dmg?';
    }
    captureObj = new NiuniuCaptureObject();
    captureObj.NiuniuAuthKey = "niuniu";
    //此处可以设置相关参数 
    captureObj.TrackColor = rgb2value(255, 0, 0);
    captureObj.EditBorderColor = rgb2value(0, 0, 255);

    //设置工具栏的TOOLTIP  
    //captureObj.ToolTipText = "tipRectangle|tipCircle|tipArrow|tipBrush|tipGlitter|tipMosaic|tipText|tipUndo|tipSave|tipCancel|tipFinish|Finish";

    //设置控件加载完成以及截图完成的回调函数
    captureObj.FinishedCallback = OnCaptureFinishedCallback;
    captureObj.PluginLoadedCallback = PluginLoadedCallback;
    captureObj.VersionCallback = VersionCallback;

    //初始化控件 
    captureObj.InitNiuniuCapture();
}

//用于返回控件的版本号
export function VersionCallback(ver) {
    //captureObj.Version;
    //可以在此根据最新的版本号与控件返回的版本号对比，决定是否要提示升级  
    //alert(ver);
}
/*
当控件成功加载后回调的的函数，您可以在此控制相应的UI显示  
*/
export function PluginLoadedCallback(success) {
    if (success) {
        $('#info').html('');
        $('#imgshow').hide();
        $('#imgshow').attr('src', "./image/loading.gif?v=1");
        $('#btnReload').hide();
        $('#btnCapture').show();
    }
}

//根据是否是Chrome新版本来控制下载不同的控件安装包
export function ShowDownLoad() {
    $('#info').html('如果超过5秒无响应，请点此<a target="_blank" href="' + downloadUrl + '" + date.getMinutes() + date.getSeconds()">安装</a>');
}

/*
当提示安装控件后，需要重新加载控件来使用截图；
也有部分是需要刷新浏览器的
*/
export function ReloadPlugin() {
    captureObj.LoadPlugin();
    $('#btnReload').hide();
    $('#btnCapture').show();
    if (captureObj.pluginValid()) {
        $('#downloadNotice').hide();
        $('#info').html("截图控件已经安装完毕，您可以进行截图了。");
    }
    else {
        var browserInfo = "查看控件是否被浏览器阻止，或通过浏览器设置中的加载项查看NiuniuCapture是否加载并正常运行";
        $('#info').html('截图控件未能识别到，请按如下步骤检查:<br/>1. 确定您已经下载控件安装包并正常安装 <br/>2. ' + browserInfo
            + '<br/>3. 刷新页面或重新启动浏览器试下<br/>4. 如果仍旧不能截图，出大招吧：'
            + '<a target="_blank" style="color:#ff0000;" class="btn" href="http://shang.qq.com/wpa/qunwpa?idkey=a9dab7a14df03d19a2833e6b5f17a33639027d06213cf61bdb7554b04492b6e5">一键加群求助</a>');
    }
}

/*
截图入口函数，用于控制UI标签的显示 
*/
export function StartCapture() {

    $('#imgshow').hide();
    $('#imgshow').attr('src', "./image/loading.gif?v=1");
    var captureRet = Capture();
    //从返回值来解析显示  	
    if (captureRet == emCaptureFailed) {
        ShowDownLoad();
    }
    else if (captureRet == emCaptureUnknown) {
        $('#info').html('正在截图中, 如果超过5秒无响应，请点此<a target="_blank" href="' + downloadUrl + '" + date.getMinutes() + date.getSeconds()">安装</a>');
    }
}

/*
此函数是根据在测试页面上的不同选项来进行截图，在实际应用中，您只需要根据您实际需要的截图模式，传入相应的参数即可 
*/
export function Capture() {
    var defaultName = "1.jpg"; //此处为了防止上传的数据过大，建议使用JPG格式 
    var hideFlag = $("#hideCurrent").attr("checked") == "checked" ? 1 : 0;
    var autoFlag = $("#captureselectSize").attr("checked") == "checked" ? 1 : 0;
    var captureRet = true;
    if (autoFlag == 0) {
        return captureObj.DoCapture("1.jpg", hideFlag, 0, 0, 0, 0, 0);
    }
    else {
        autoFlag = $('#getimagefromclipboard').is(':checked') ? 4 : 1;
        if (autoFlag == 4) {
            return captureObj.DoCapture("", 0, 4, 0, 0, 0, 0);
        }
        autoFlag = $('#showprewindow').is(':checked') ? 3 : 1;
        if (autoFlag == 3) {
            //此时如果x, y, width, height全为0，则表示预截图窗口点击“开始截图”时，手工先把区域
            //x, y, width, height全为1，则表示预截图窗口点击“开始截图”时，自动截取整个桌面
            //其他情况，则自动截取 x, y, width, height 指定的区域  
            return captureObj.DoCapture("1.jpg", hideFlag, 3, 0, 0, 0, 0);
        }
        autoFlag = $('#fullscreen').is(':checked') ? 2 : 1;
        if (autoFlag == 2) {
            return captureObj.DoCapture("1.jpg", hideFlag, 2, 0, 0, 0, 0);
        }
        else {
            return captureObj.DoCapture("1.jpg", hideFlag, 1, $('#xpos').val(), $('#ypos').val(), $('#width').val(), $('#height').val());
        }
    }
}

/*
此处是截图后的回调函数，用于将截图的详细信息反馈回来，你需要调整此函数，完成图像数据的传输与显示  
*/
export function OnCaptureFinishedCallback(type, x, y, width, height, info, content, localpath) {
    if (type < 0) {
        //需要重新安装控件
        ShowDownLoad();
        return;
    }
    $('#show').hide();
    switch (type) {
        case 1:
            {
                $('#info').html('截图完成： x:' + x + ',y:' + y + ',widht:' + width + ',height:' + height);
                break;
            }
        case 2:
            {
                $('#info').html('您取消了截图');
                break;
            }
        case 3:
            {
                $('#info').html('您保存了截图到本地： x:' + x + ',y:' + y + ',widht:' + width + ',height:' + height);
                break;
            }
        case 4:
            {
                if (info == '0') {
                    $('#info').html('从剪贴板获取到了截图： ' + localpath);
                }
                else {
                    $('#info').html('从剪贴板获取图片失败。');
                }
                break;
            }
    }
}



/*
实际上传图像数据的函数，此处主要是将BASE64的图像数据，通过AJAX的方式POST到服务器保存成文件，并且显示在页面上
*/

export function TestSetWatermarkPicture() {
    captureObj.SetWatermarkPicture("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");
}
Init()