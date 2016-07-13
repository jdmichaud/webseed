/**
 * @license almond 0.3.2 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */

var requirejs,require,define;!function(e){function n(e,n){return b.call(e,n)}function r(e,n){var r,t,o,i,u,c,s,f,a,l,g,d,p=n&&n.split("/"),v=m.map,b=v&&v["*"]||{};if(e){for(e=e.split("/"),u=e.length-1,m.nodeIdCompat&&w.test(e[u])&&(e[u]=e[u].replace(w,"")),"."===e[0].charAt(0)&&p&&(d=p.slice(0,p.length-1),e=d.concat(e)),a=0;a<e.length;a++)if(g=e[a],"."===g)e.splice(a,1),a-=1;else if(".."===g){if(0===a||1===a&&".."===e[2]||".."===e[a-1])continue;a>0&&(e.splice(a-1,2),a-=2)}e=e.join("/")}if((p||b)&&v){for(r=e.split("/"),a=r.length;a>0;a-=1){if(t=r.slice(0,a).join("/"),p)for(l=p.length;l>0;l-=1)if(o=v[p.slice(0,l).join("/")],o&&(o=o[t])){i=o,c=a;break}if(i)break;!s&&b&&b[t]&&(s=b[t],f=a)}!i&&s&&(i=s,c=f),i&&(r.splice(0,c,i),e=r.join("/"))}return e}function t(n,r){return function(){var t=h.call(arguments,0);return"string"!=typeof t[0]&&1===t.length&&t.push(null),a.apply(e,t.concat([n,r]))}}function o(e){return function(n){return r(n,e)}}function i(e){return function(n){d[e]=n}}function u(r){if(n(p,r)){var t=p[r];delete p[r],v[r]=!0,f.apply(e,t)}if(!n(d,r)&&!n(v,r))throw new Error("No "+r);return d[r]}function c(e){var n,r=e?e.indexOf("!"):-1;return r>-1&&(n=e.substring(0,r),e=e.substring(r+1,e.length)),[n,e]}function s(e){return function(){return m&&m.config&&m.config[e]||{}}}var f,a,l,g,d={},p={},m={},v={},b=Object.prototype.hasOwnProperty,h=[].slice,w=/\.js$/;l=function(e,n){var t,i=c(e),s=i[0];return e=i[1],s&&(s=r(s,n),t=u(s)),s?e=t&&t.normalize?t.normalize(e,o(n)):r(e,n):(e=r(e,n),i=c(e),s=i[0],e=i[1],s&&(t=u(s))),{f:s?s+"!"+e:e,n:e,pr:s,p:t}},g={require:function(e){return t(e)},exports:function(e){var n=d[e];return"undefined"!=typeof n?n:d[e]={}},module:function(e){return{id:e,uri:"",exports:d[e],config:s(e)}}},f=function(r,o,c,s){var f,a,m,b,h,w,S=[],k=typeof c;if(s=s||r,"undefined"===k||"function"===k){for(o=!o.length&&c.length?["require","exports","module"]:o,h=0;h<o.length;h+=1)if(b=l(o[h],s),a=b.f,"require"===a)S[h]=g.require(r);else if("exports"===a)S[h]=g.exports(r),w=!0;else if("module"===a)f=S[h]=g.module(r);else if(n(d,a)||n(p,a)||n(v,a))S[h]=u(a);else{if(!b.p)throw new Error(r+" missing "+a);b.p.load(b.n,t(s,!0),i(a),{}),S[h]=d[a]}m=c?c.apply(d[r],S):void 0,r&&(f&&f.exports!==e&&f.exports!==d[r]?d[r]=f.exports:m===e&&w||(d[r]=m))}else r&&(d[r]=c)},requirejs=require=a=function(n,r,t,o,i){if("string"==typeof n)return g[n]?g[n](r):u(l(n,r).f);if(!n.splice){if(m=n,m.deps&&a(m.deps,m.callback),!r)return;r.splice?(n=r,r=t,t=null):n=e}return r=r||function(){},"function"==typeof t&&(t=o,o=i),o?f(e,n,r,t):setTimeout(function(){f(e,n,r,t)},4),a},a.config=function(e){return a(e)},requirejs._defined=d,define=function(e,r,t){if("string"!=typeof e)throw new Error("See almond README: incorrect module build, no module name");r.splice||(t=r,r=[]),n(d,e)||n(p,e)||(p[e]=[e,r,t])},define.amd={jQuery:!0}}(),define("../../../node_modules/almond/almond",function(){}),define("app.modules",[],function(){var e=angular.module("WebseedApp",["ui.router","ui.bootstrap","pascalprecht.translate"]);return e}),define("app.constants",["app.modules"],function(e){e.constant("someContant",1e3)}),define("app.routes",["app.modules"],function(e){return function(e,n){e.state("main",{url:"/",templateUrl:"templates/scenario.html"}),n.otherwise("/")}}),define("app.config",["app.modules","app.routes"],function(e,n){return function(e,r,t){e.useStaticFilesLoader({prefix:"resources/locales/locale-",suffix:".json"}).preferredLanguage("en").useSanitizeValueStrategy("escape"),n(r,t)}}),define("services/rest.service",[],function(){"use strict";var e={x:"/some/X/url",log:"/log",configuration:"/uxcast/conf-provider/configuration"};return function(n){var r={};return r.x=function(r,t){return new Promise(function(o,i){n.post(e.x,{username:r,password:t}).then(function(e){o(e)},function(e){i(e)})})},r.log=function(r){n.put(e.log,r).then(function(){},function(){console.error("Could not log message. Server error.")})},r.getConfiguration=function(){return new Promise(function(r,t){n.get(e.configuration).then(function(e){r(e.data)},function(e){t(e)})})},r.setConfiguration=function(r){return new Promise(function(t,o){n.put(e.configuration,r).then(function(e){t(e.data)},function(e){o(e)})})},r}}),define("services/log.service",[],function(){"use strict";var e=function(e){var n={};return n.error=function(e){return new Promise(function(r,t){StackTrace.get().then(function(t){n.log(e,1,Date.now(),t[t.length-1].fileName,t[t.length-1].lineNumber,t[t.length-1].columnNumber),r()})["catch"](function(e){t(e)})})},n.warning=function(e){StackTrace.get().then(function(r){n.log(e,2,Date.now(),r[r.length-1].fileName,r[r.length-1].lineNumber,r[r.length-1].columnNumber)})},n.info=function(e){StackTrace.get().then(function(r){n.log(e,3,Date.now(),r[r.length-1].fileName,r[r.length-1].lineNumber,r[r.length-1].columnNumber)})},n.debug=function(e){StackTrace.get().then(function(r){n.log(e,4,Date.now(),r[r.length-1].fileName,r[r.length-1].lineNumber,r[r.length-1].columnNumber)})},n.log=function(n,r,t,o,i,u){console.log(n+" ("+o+":"+i+")"),e.log({message:n,level:r,timestamp:t,file:o,line:i,column:u})},n};return e}),define("services/configuration.service",[],function(){"use strict";var e=function(e,n){var r={},t={};return r.initPromise=n.getConfiguration().then(function(n){return e.debug("Configuration retrieved"),t=n})["catch"](function(){e.error("Configuration retrieval failed")}),r.getWebSocketServerUrl=function(){return t.websocketSuffix},r.getWebSocketServerPort=function(){return t.websocketPort},r.getLanguage=function(){return t.userLanguage},r};return e}),define("services/websocket.service",[],function(){"use strict";var e=function(e,n,r,t,o){function i(e){r.info("Websocket connection opened with "+a)}function u(n){r.info("Websocket connection closed with "+a," with following event code: ",n.code," and reason: ",n.reason),e.$broadcast("WebSocketService.onclose")}function c(n){r.info("Websocket error with "+a," with following event: ",n),e.$broadcast("WebSocketService.onerror")}function s(n){r.debug("Websocket message received: "+n.data);var t=JSON.parse(n.data);o.update(t);for(var i in t)({}).hasOwnProperty.call(t,i)&&e.$broadcast("WebSocketService.message",i)}var f,a,l={};return t.initPromise.then(function(e){a="ws://"+location.hostname+":"+t.getWebSocketServerPort()+"/"+t.getWebSocketServerUrl(),r.info("Connecting to websocket server on "+a),f=new WebSocket(a),f.onopen=i,f.onclose=u,f.onerror=c,f.onmessage=s}),l};return e}),define("services/model.service",[],function(){"use strict";var e=function(e,n,r){var t={};return t={model:{profiles:[],status:[]},currentProfile:0,currentView:0,currentTab:0},t.setCurrentProfile=function(e){t.currentProfile=e},t.setCurrentView=function(n){t.currentView=n,e.$broadcast("ModelService.onChange","view")},t.setCurrentTab=function(n){t.currentTab=n,e.$broadcast("ModelService.onChange","tab")},t.getCurrentProfile=function(){return t.model.profiles[t.currentProfile]},t.getCurrentView=function(){return t.model.profiles[t.currentProfile].views[t.currentView]},t.getCurrentTab=function(){return t.model.profiles[t.currentProfile].views[t.currentView].tabs[t.currentTab]},t.getProfiles=function(){return t.model.profiles},t.getCurrentViews=function(){return t.model.profiles[t.currentProfile].views},t.getCurrentTabs=function(){return t.model.profiles[t.currentProfile].views[t.currentView].tabs},t.update=function(e){n.assign(t.model,e),console.log("model:",t.model)},t.getComponent=function(e){return t.model.actions.hasOwnProperty(e)||r.error("Component "+e+" is unknown"),t.model.actions[e]},t};return e}),require(["app.modules","app.constants","app.config","services/rest.service","services/log.service","services/configuration.service","services/websocket.service","services/model.service"],function(e,n,r,t,o,i,u,c){"use strict";e.factory("jQuery",["$window",function(e){return e.jQuery}]),e.factory("lodash",["$window",function(e){return e._}]),e.service("restService",t),e.service("logService",o),e.service("confService",i),e.service("webSocketService",u),e.service("modelService",c),e.config(["$translateProvider","$stateProvider","$urlRouterProvider",r]),angular.bootstrap(document,["WebseedApp"])}),define("main",function(){});