var rs=()=>{};var ss=function(n){let e=[],t=0;for(let r=0;r<n.length;r++){let i=n.charCodeAt(r);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},Ja=function(n){let e=[],t=0,r=0;for(;t<n.length;){let i=n[t++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){let s=n[t++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){let s=n[t++],o=n[t++],a=n[t++],c=((i&7)<<18|(s&63)<<12|(o&63)<<6|a&63)-65536;e[r++]=String.fromCharCode(55296+(c>>10)),e[r++]=String.fromCharCode(56320+(c&1023))}else{let s=n[t++],o=n[t++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},os={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();let t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<n.length;i+=3){let s=n[i],o=i+1<n.length,a=o?n[i+1]:0,c=i+2<n.length,m=c?n[i+2]:0,_=s>>2,E=(s&3)<<4|a>>4,T=(a&15)<<2|m>>6,W=m&63;c||(W=64,o||(T=64)),r.push(t[_],t[E],t[T],t[W])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(ss(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Ja(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();let t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<n.length;){let s=t[n.charAt(i++)],a=i<n.length?t[n.charAt(i)]:0;++i;let m=i<n.length?t[n.charAt(i)]:64;++i;let E=i<n.length?t[n.charAt(i)]:64;if(++i,s==null||a==null||m==null||E==null)throw new _r;let T=s<<2|a>>4;if(r.push(T),m!==64){let W=a<<4&240|m>>2;if(r.push(W),E!==64){let O=m<<6&192|E;r.push(O)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}},_r=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},Qa=function(n){let e=ss(n);return os.encodeByteArray(e,!0)},ft=function(n){return Qa(n).replace(/\./g,"")},Kt=function(n){try{return os.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};function Xa(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}var Za=()=>Xa().__FIREBASE_DEFAULTS__,ec=()=>{if(typeof process>"u"||typeof process.env>"u")return;let n=process.env.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},tc=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let e=n&&Kt(n[1]);return e&&JSON.parse(e)},Ir=()=>{try{return rs()||Za()||ec()||tc()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Er=n=>Ir()?.emulatorHosts?.[n],as=n=>{let e=Er(n);if(!e)return;let t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);let r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},wr=()=>Ir()?.config,Tr=n=>Ir()?.[`_${n}`];var qe=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}};function cs(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');let t={alg:"none",type:"JWT"},r=e||"demo-project",i=n.iat||0,s=n.sub||n.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");let o={iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}},...n};return[ft(JSON.stringify(t)),ft(JSON.stringify(o)),""].join(".")}function M(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function us(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(M())}function ls(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function hs(){let n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function ds(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function fs(){let n=M();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function ps(){try{return typeof indexedDB=="object"}catch{return!1}}function ms(){return new Promise((n,e)=>{try{let t=!0,r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{e(i.error?.message||"")}}catch(t){e(t)}})}var nc="FirebaseError",H=class n extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=nc,Object.setPrototypeOf(this,n.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,fe.prototype.create)}},fe=class{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){let r=t[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?rc(s,r):"Error",a=`${this.serviceName}: ${o} (${i}).`;return new H(i,a,r)}};function rc(n,e){try{let t=0,r="";for(;t<n.length;){let i=n.indexOf("{$",t);if(i===-1){r+=n.substring(t);break}let s=n.indexOf("}",i+2);if(s===-1){r+=n.substring(t);break}let o=n.substring(i+2,s),a=e[o];r+=n.substring(t,i)+(a!=null?String(a):`<${o}?>`),t=s+1}return r}catch{return n}}function gs(n){for(let e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Z(n,e){if(n===e)return!0;let t=Object.keys(n),r=Object.keys(e);for(let i of t){if(!r.includes(i))return!1;let s=n[i],o=e[i];if(is(s)&&is(o)){if(!Z(s,o))return!1}else if(s!==o)return!1}for(let i of r)if(!t.includes(i))return!1;return!0}function is(n){return n!==null&&typeof n=="object"}function $e(n){let e=[];for(let[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function We(n){let e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){let[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function He(n){let e=n.indexOf("?");if(!e)return"";let t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function _s(n,e){let t=new yr(n,e);return t.subscribe.bind(t)}var yr=class{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let i;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");ic(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:r},i.next===void 0&&(i.next=gr),i.error===void 0&&(i.error=gr),i.complete===void 0&&(i.complete=gr);let s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}};function ic(n,e){if(typeof n!="object"||n===null)return!1;for(let t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function gr(){}var kh=4*60*60*1e3;function V(n){return n&&n._delegate?n._delegate:n}function Ne(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Yt(n){return(await fetch(n,{credentials:"include"})).ok}var J=class{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};var Pe="[DEFAULT]";var br=class{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){let r=new qe;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{let i=this.getOrInitializeService({instanceIdentifier:t});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){let t=this.normalizeInstanceIdentifier(e?.identifier),r=e?.optional??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(oc(e))try{this.getOrInitializeService({instanceIdentifier:Pe})}catch{}for(let[t,r]of this.instancesDeferred.entries()){let i=this.normalizeInstanceIdentifier(t);try{let s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Pe){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Pe){return this.instances.has(e)}getOptions(e=Pe){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let i=this.getOrInitializeService({instanceIdentifier:r,options:t});for(let[s,o]of this.instancesDeferred.entries()){let a=this.normalizeInstanceIdentifier(s);r===a&&o.resolve(i)}return i}onInit(e,t){let r=this.normalizeInstanceIdentifier(t),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);let s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){let r=this.onInitCallbacks.get(t);if(r)for(let i of r)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:sc(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Pe){return this.component?this.component.multipleInstances?e:Pe:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function sc(n){return n===Pe?void 0:n}function oc(n){return n.instantiationMode==="EAGER"}var Jt=class{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let t=new br(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}};var ac=[],v;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(v||(v={}));var cc={debug:v.DEBUG,verbose:v.VERBOSE,info:v.INFO,warn:v.WARN,error:v.ERROR,silent:v.SILENT},uc=v.INFO,lc={[v.DEBUG]:"log",[v.VERBOSE]:"log",[v.INFO]:"info",[v.WARN]:"warn",[v.ERROR]:"error"},hc=(n,e,...t)=>{if(e<n.logLevel)return;let r=new Date().toISOString(),i=lc[e];if(i)console[i](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)},Ee=class{constructor(e){this.name=e,this._logLevel=uc,this._logHandler=hc,this._userLogHandler=null,ac.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in v))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?cc[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,v.DEBUG,...e),this._logHandler(this,v.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,v.VERBOSE,...e),this._logHandler(this,v.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,v.INFO,...e),this._logHandler(this,v.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,v.WARN,...e),this._logHandler(this,v.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,v.ERROR,...e),this._logHandler(this,v.ERROR,...e)}};var dc=(n,e)=>e.some(t=>n instanceof t),ys,Is;function fc(){return ys||(ys=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function pc(){return Is||(Is=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var Es=new WeakMap,Ar=new WeakMap,ws=new WeakMap,vr=new WeakMap,Rr=new WeakMap;function mc(n){let e=new Promise((t,r)=>{let i=()=>{n.removeEventListener("success",s),n.removeEventListener("error",o)},s=()=>{t(re(n.result)),i()},o=()=>{r(n.error),i()};n.addEventListener("success",s),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&Es.set(t,n)}).catch(()=>{}),Rr.set(e,n),e}function gc(n){if(Ar.has(n))return;let e=new Promise((t,r)=>{let i=()=>{n.removeEventListener("complete",s),n.removeEventListener("error",o),n.removeEventListener("abort",o)},s=()=>{t(),i()},o=()=>{r(n.error||new DOMException("AbortError","AbortError")),i()};n.addEventListener("complete",s),n.addEventListener("error",o),n.addEventListener("abort",o)});Ar.set(n,e)}var Sr={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Ar.get(n);if(e==="objectStoreNames")return n.objectStoreNames||ws.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return re(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Ts(n){Sr=n(Sr)}function _c(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){let r=n.call(Qt(this),e,...t);return ws.set(r,e.sort?e.sort():[e]),re(r)}:pc().includes(n)?function(...e){return n.apply(Qt(this),e),re(Es.get(this))}:function(...e){return re(n.apply(Qt(this),e))}}function yc(n){return typeof n=="function"?_c(n):(n instanceof IDBTransaction&&gc(n),dc(n,fc())?new Proxy(n,Sr):n)}function re(n){if(n instanceof IDBRequest)return mc(n);if(vr.has(n))return vr.get(n);let e=yc(n);return e!==n&&(vr.set(n,e),Rr.set(e,n)),e}var Qt=n=>Rr.get(n);function vs(n,e,{blocked:t,upgrade:r,blocking:i,terminated:s}={}){let o=indexedDB.open(n,e),a=re(o);return r&&o.addEventListener("upgradeneeded",c=>{r(re(o.result),c.oldVersion,c.newVersion,re(o.transaction),c)}),t&&o.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),a.then(c=>{s&&c.addEventListener("close",()=>s()),i&&c.addEventListener("versionchange",m=>i(m.oldVersion,m.newVersion,m))}).catch(()=>{}),a}var Ic=["get","getKey","getAll","getAllKeys","count"],Ec=["put","add","delete","clear"],Nr=new Map;function bs(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Nr.get(e))return Nr.get(e);let t=e.replace(/FromIndex$/,""),r=e!==t,i=Ec.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(i||Ic.includes(t)))return;let s=async function(o,...a){let c=this.transaction(o,i?"readwrite":"readonly"),m=c.store;return r&&(m=m.index(a.shift())),(await Promise.all([m[t](...a),i&&c.done]))[0]};return Nr.set(e,s),s}Ts(n=>({...n,get:(e,t,r)=>bs(e,t)||n.get(e,t,r),has:(e,t)=>!!bs(e,t)||n.has(e,t)}));var kr=class{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(wc(t)){let r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}};function wc(n){return n.getComponent()?.type==="VERSION"}var Cr="@firebase/app",As="0.16.4";var me=new Ee("@firebase/app"),Tc="@firebase/app-compat",bc="@firebase/analytics-compat",vc="@firebase/analytics",Ac="@firebase/app-check-compat",Sc="@firebase/app-check",Rc="@firebase/auth",Nc="@firebase/auth-compat",Pc="@firebase/database",kc="@firebase/data-connect",Cc="@firebase/database-compat",Dc="@firebase/functions",Oc="@firebase/functions-compat",Vc="@firebase/installations",Lc="@firebase/installations-compat",xc="@firebase/messaging",Mc="@firebase/messaging-compat",Uc="@firebase/performance",Fc="@firebase/performance-compat",jc="@firebase/remote-config",Bc="@firebase/remote-config-compat",qc="@firebase/storage",$c="@firebase/storage-compat",Wc="@firebase/firestore",Hc="@firebase/ai",zc="@firebase/firestore-compat",Gc="firebase",Kc="13.1.0";var Dr="[DEFAULT]",Yc={[Cr]:"fire-core",[Tc]:"fire-core-compat",[vc]:"fire-analytics",[bc]:"fire-analytics-compat",[Sc]:"fire-app-check",[Ac]:"fire-app-check-compat",[Rc]:"fire-auth",[Nc]:"fire-auth-compat",[Pc]:"fire-rtdb",[kc]:"fire-data-connect",[Cc]:"fire-rtdb-compat",[Dc]:"fire-fn",[Oc]:"fire-fn-compat",[Vc]:"fire-iid",[Lc]:"fire-iid-compat",[xc]:"fire-fcm",[Mc]:"fire-fcm-compat",[Uc]:"fire-perf",[Fc]:"fire-perf-compat",[jc]:"fire-rc",[Bc]:"fire-rc-compat",[qc]:"fire-gcs",[$c]:"fire-gcs-compat",[Wc]:"fire-fst",[zc]:"fire-fst-compat",[Hc]:"fire-vertex","fire-js":"fire-js",[Gc]:"fire-js-all"};var Xt=new Map,Jc=new Map,Or=new Map;function Ss(n,e){try{n.container.addComponent(e)}catch(t){me.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function we(n){let e=n.name;if(Or.has(e))return me.debug(`There were multiple attempts to register component ${e}.`),!1;Or.set(e,n);for(let t of Xt.values())Ss(t,n);for(let t of Jc.values())Ss(t,n);return!0}function mt(n,e){let t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function U(n){return n==null?!1:n.settings!==void 0}var Qc={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},pe=new fe("app","Firebase",Qc);var Vr=class{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new J("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw pe.create("app-deleted",{appName:this._name})}};var Te=Kc;function ks(n,e={}){let t=n;typeof e!="object"&&(e={name:e});let r={name:Dr,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw pe.create("bad-app-name",{appName:String(i)});if(t||(t=wr()),!t)throw pe.create("no-options");let s=Xt.get(i);if(s)if(Z(t,s.options)){if(Z(r,s.config))return s;throw pe.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw pe.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(t)});let o=new Jt(i);for(let c of Or.values())o.addComponent(c);let a=new Vr(t,r,o);return Xt.set(i,a),a}function Zt(n=Dr){let e=Xt.get(n);if(!e&&n===Dr&&wr())return ks();if(!e)throw pe.create("no-app",{appName:n});return e}function ee(n,e,t){let r=Yc[n]??n;t&&(r+=`-${t}`);let i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){let o=[`Unable to register library "${r}" with version "${e}":`];i&&o.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&o.push("and"),s&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),me.warn(o.join(" "));return}we(new J(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}var Xc="firebase-heartbeat-database",Zc=1,pt="firebase-heartbeat-store",Pr=null;function Cs(){return Pr||(Pr=vs(Xc,Zc,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(pt)}catch(t){console.warn(t)}}}}).catch(n=>{throw pe.create("idb-open",{originalErrorMessage:n.message})})),Pr}async function eu(n){try{let t=(await Cs()).transaction(pt),r=await t.objectStore(pt).get(Ds(n));return await t.done,r}catch(e){if(e instanceof H)me.warn(e.message);else{let t=pe.create("idb-get",{originalErrorMessage:e?.message});me.warn(t.message)}}}async function Rs(n,e){try{let r=(await Cs()).transaction(pt,"readwrite");await r.objectStore(pt).put(e,Ds(n)),await r.done}catch(t){if(t instanceof H)me.warn(t.message);else{let r=pe.create("idb-set",{originalErrorMessage:t?.message});me.warn(r.message)}}}function Ds(n){return`${n.name}!${n.options.appId}`}var tu=1024,nu=30,Lr=class{constructor(e){this.container=e,this._heartbeatsCache=null;let t=this.container.getProvider("app").getImmediate();this._storage=new xr(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){try{let t=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Ns();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(i=>i.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:t}),this._heartbeatsCache.heartbeats.length>nu){let i=iu(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(i,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){me.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";let e=Ns(),{heartbeatsToSend:t,unsentEntries:r}=ru(this._heartbeatsCache.heartbeats),i=ft(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(e){return me.warn(e),""}}};function Ns(){return new Date().toISOString().substring(0,10)}function ru(n,e=tu){let t=[],r=n.slice();for(let i of n){let s=t.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),Ps(t)>e){s.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),Ps(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}var xr=class{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return ps()?ms().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let t=await eu(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){let r=await this.read();return Rs(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){let r=await this.read();return Rs(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}};function Ps(n){return ft(JSON.stringify({version:2,heartbeats:n})).length}function iu(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}function su(n){we(new J("platform-logger",e=>new kr(e),"PRIVATE")),we(new J("heartbeat",e=>new Lr(e),"PRIVATE")),ee(Cr,As,n),ee(Cr,As,"esm2020"),ee("fire-js","")}su("");var ou="firebase",au="13.1.0";ee(ou,au,"app");function Xs(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}var Zs=Xs,eo=new fe("auth","Firebase",Xs());var cn=new Ee("@firebase/auth");function tn(n,...e){cn.logLevel<=v.WARN&&cn.warn(`Auth (${Te}): ${n}`,...e)}function nn(n,...e){cn.logLevel<=v.ERROR&&cn.error(`Auth (${Te}): ${n}`,...e)}function Q(n,...e){throw si(n,...e)}function te(n,...e){return si(n,...e)}function Cn(n,e,t){let r={...Zs(),[e]:t};return new fe("auth","Firebase",r).create(e,{appName:n.name})}function se(n){return Cn(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function to(n,e,t){let r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&Q(n,"argument-error"),Cn(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function si(n,...e){if(typeof n!="string"){let t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return eo.create(n,...e)}function y(n,e,...t){if(!n)throw si(e,...t)}function ie(n){let e="INTERNAL ASSERTION FAILED: "+n;throw nn(e),new Error(e)}function _e(n,e){n||ie(e)}function qr(){return typeof self<"u"&&self.location?.href||""}function cu(){return Os()==="http:"||Os()==="https:"}function Os(){return typeof self<"u"&&self.location?.protocol||null}function uu(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(cu()||hs()||"connection"in navigator)?navigator.onLine:!0}function lu(){if(typeof navigator>"u")return null;let n=navigator;return n.languages&&n.languages[0]||n.language||null}var Ce=class{constructor(e,t){this.shortDelay=e,this.longDelay=t,_e(t>e,"Short delay should be less than long delay!"),this.isMobile=us()||ds()}get(){return uu()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}};function oi(n,e){_e(n.emulator,"Emulator should always be set here");let{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}var un=class{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;ie("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;ie("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;ie("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}};var hu={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};var du=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],fu=new Ce(3e4,6e4);function N(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function L(n,e,t,r,i={}){return no(n,i,async()=>{let s={},o={};r&&(e==="GET"?o=r:s={body:JSON.stringify(r)});let a=$e({...o,key:n.config.apiKey}).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);let m={method:e,headers:c,...s};return ls()||(m.referrerPolicy="strict-origin-when-cross-origin"),n.emulatorConfig&&Ne(n.emulatorConfig.host)&&(m.credentials="include"),un.fetch()(await ro(n,n.config.apiHost,t,a),m)})}async function no(n,e,t){n._canInitEmulator=!1;let r={...hu,...e};try{let i=new $r(n),s=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();let o=await s.json();if("needConfirmation"in o)throw _t(n,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{let a=s.ok?o.errorMessage:o.error.message,[c,m]=a.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw _t(n,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw _t(n,"email-already-in-use",o);if(c==="USER_DISABLED")throw _t(n,"user-disabled",o);let _=r[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(m)throw Cn(n,_,m);Q(n,_)}}catch(i){if(i instanceof H)throw i;Q(n,"network-request-failed",{message:String(i)})}}async function Ae(n,e,t,r,i={}){let s=await L(n,e,t,r,i);return"mfaPendingCredential"in s&&Q(n,"multi-factor-auth-required",{_serverResponse:s}),s}async function ro(n,e,t,r){let i=`${e}${t}?${r}`,s=n,o=s.config.emulator?oi(n.config,i):`${n.config.apiScheme}://${i}`;return du.includes(t)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(o).toString():o}function pu(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}var $r=class{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(te(this.auth,"network-request-failed")),fu.get())})}};function _t(n,e,t){let r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);let i=te(n,e,r);return i.customData._tokenResponse=t,i}function Vs(n){return n!==void 0&&n.enterprise!==void 0}var ln=class{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(let t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return pu(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}};async function io(n,e){return L(n,"GET","/v2/recaptchaConfig",N(n,e))}async function mu(n,e){return L(n,"POST","/v1/accounts:delete",e)}async function hn(n,e){return L(n,"POST","/v1/accounts:lookup",e)}function yt(n){if(n)try{let e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function so(n,e=!1){let t=V(n),r=await t.getIdToken(e),i=ai(r);y(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");let s=typeof i.firebase=="object"?i.firebase:void 0,o=s?.sign_in_provider;return{claims:i,token:r,authTime:yt(Mr(i.auth_time)),issuedAtTime:yt(Mr(i.iat)),expirationTime:yt(Mr(i.exp)),signInProvider:o||null,signInSecondFactor:s?.sign_in_second_factor||null}}function Mr(n){return Number(n)*1e3}function ai(n){let[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return nn("JWT malformed, contained fewer than 3 sections"),null;try{let i=Kt(t);return i?JSON.parse(i):(nn("Failed to decode base64 JWT payload"),null)}catch(i){return nn("Caught error parsing JWT payload as JSON",i?.toString()),null}}function Ls(n){let e=ai(n);return y(e,"internal-error"),y(typeof e.exp<"u","internal-error"),y(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}async function Tt(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw oo(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function oo(n){return n instanceof H?n.code==="auth/user-disabled"||n.code==="auth/user-token-expired":!1}var Wr=class{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){let t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;let r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;let t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}};var bt=class{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=yt(this.lastLoginAt),this.creationTime=yt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}};async function dn(n){let e=n.auth,t=await n.getIdToken(),r=await Tt(n,hn(e,{idToken:t}));y(r?.users.length,e,"internal-error");let i=r.users[0];n._notifyReloadListener(i);let s=i.providerUserInfo?.length?co(i.providerUserInfo):[],o=gu(n.providerData,s),a=n.isAnonymous,c=!(n.email&&i.passwordHash)&&!o?.length,m=a?c:!1,_={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:o,metadata:new bt(i.createdAt,i.lastLoginAt),isAnonymous:m};Object.assign(n,_)}async function ao(n){let e=V(n);await dn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function gu(n,e){return[...n.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function co(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}async function _u(n,e){let t=await no(n,{},async()=>{let r=$e({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=n.config,o=await ro(n,i,"/v1/token",`key=${s}`),a=await n._getAdditionalHeaders();a["Content-Type"]="application/x-www-form-urlencoded";let c={method:"POST",headers:a,body:r};return n.emulatorConfig&&Ne(n.emulatorConfig.host)&&(c.credentials="include"),un.fetch()(o,c)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function yu(n,e){return L(n,"POST","/v2/accounts:revokeToken",N(n,e))}var It=class n{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){y(e.idToken,"internal-error"),y(typeof e.idToken<"u","internal-error"),y(typeof e.refreshToken<"u","internal-error");let t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Ls(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){y(e.length!==0,"internal-error");let t=Ls(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(y(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){let{accessToken:r,refreshToken:i,expiresIn:s}=await _u(e,t);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){let{refreshToken:r,accessToken:i,expirationTime:s}=t,o=new n;return r&&(y(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),i&&(y(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(y(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new n,this.toJSON())}_performRefresh(){return ie("not implemented")}};function be(n,e){y(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}var ve=class n{constructor({uid:e,auth:t,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new Wr(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new bt(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){let t=await Tt(this,this.stsTokenManager.getToken(this.auth,e));return y(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return so(this,e)}reload(){return ao(this)}_assign(e){this!==e&&(y(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){let t=new n({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){y(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await dn(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(U(this.auth.app))return Promise.reject(se(this.auth));let e=await this.getIdToken();return await Tt(this,mu(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){let r=t.displayName??void 0,i=t.email??void 0,s=t.phoneNumber??void 0,o=t.photoURL??void 0,a=t.tenantId??void 0,c=t._redirectEventId??void 0,m=t.createdAt??void 0,_=t.lastLoginAt??void 0,{uid:E,emailVerified:T,isAnonymous:W,providerData:O,stsTokenManager:q}=t;y(E&&q,e,"internal-error");let k=It.fromJSON(this.name,q);y(typeof E=="string",e,"internal-error"),be(r,e.name),be(i,e.name),y(typeof T=="boolean",e,"internal-error"),y(typeof W=="boolean",e,"internal-error"),be(s,e.name),be(o,e.name),be(a,e.name),be(c,e.name),be(m,e.name),be(_,e.name);let Ie=new n({uid:E,auth:e,email:i,emailVerified:T,displayName:r,isAnonymous:W,photoURL:o,phoneNumber:s,tenantId:a,stsTokenManager:k,createdAt:m,lastLoginAt:_});return O&&Array.isArray(O)&&(Ie.providerData=O.map(je=>({...je}))),c&&(Ie._redirectEventId=c),Ie}static async _fromIdTokenResponse(e,t,r=!1){let i=new It;i.updateFromServerResponse(t);let s=new n({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await dn(s),s}static async _fromGetAccountInfoResponse(e,t,r){let i=t.users[0];y(i.localId!==void 0,"internal-error");let s=i.providerUserInfo!==void 0?co(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!s?.length,a=new It;a.updateFromIdToken(r);let c=new n({uid:i.localId,auth:e,stsTokenManager:a,isAnonymous:o}),m={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new bt(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!s?.length};return Object.assign(c,m),c}};var xs=new Map;function ge(n){_e(n instanceof Function,"Expected a class definition");let e=xs.get(n);return e?(_e(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,xs.set(n,e),e)}var fn=class{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){let t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}};fn.type="NONE";var Hr=fn;function rn(n,e,t){return`firebase:${n}:${e}:${t}`}var Et=class n{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;let{config:i,name:s}=this.auth;this.fullUserKey=rn(this.userKey,i.apiKey,s),this.fullPersistenceKey=rn("persistence",i.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t);try{this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}catch{}}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){let e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){let t=await hn(this.auth,{idToken:e}).catch(()=>{});return t?ve._fromGetAccountInfoResponse(this.auth,t,e):null}return ve._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;let t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){try{this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}catch{}}static async create(e,t,r="authUser"){if(!t.length)return new n(ge(Hr),e,r);let i=(await Promise.all(t.map(async m=>{try{if(await m._isAvailable())return m}catch{return}}))).filter(m=>m),s=i[0]||ge(Hr),o=rn(r,e.config.apiKey,e.name),a=null;for(let m of t)try{let _=await m._get(o);if(_){let E;if(typeof _=="string"){let T=await hn(e,{idToken:_}).catch(()=>{});if(!T)break;E=await ve._fromGetAccountInfoResponse(e,T,_)}else E=ve._fromJSON(e,_);m!==s&&(a=E),s=m;break}}catch{}let c=i.filter(m=>m._shouldAllowMigration);return!s._shouldAllowMigration||!c.length?new n(s,e,r):(s=c[0],a&&await s._set(o,a.toJSON()),await Promise.all(t.map(async m=>{if(m!==s)try{await m._remove(o)}catch{}})),new n(s,e,r))}};function Ms(n){let e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(fo(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(uo(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(mo(e))return"Blackberry";if(go(e))return"Webos";if(lo(e))return"Safari";if((e.includes("chrome/")||ho(e))&&!e.includes("edge/"))return"Chrome";if(po(e))return"Android";{let t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if(r?.length===2)return r[1]}return"Other"}function uo(n=M()){return/firefox\//i.test(n)}function lo(n=M()){let e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function ho(n=M()){return/crios\//i.test(n)}function fo(n=M()){return/iemobile/i.test(n)}function po(n=M()){return/android/i.test(n)}function mo(n=M()){return/blackberry/i.test(n)}function go(n=M()){return/webos/i.test(n)}function ci(n=M()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Iu(n=M()){return ci(n)&&!!window.navigator?.standalone}function Eu(){return fs()&&document.documentMode===10}function _o(n=M()){return ci(n)||po(n)||go(n)||mo(n)||/windows phone/i.test(n)||fo(n)}function yo(n,e=[]){let t;switch(n){case"Browser":t=Ms(M());break;case"Worker":t=`${Ms(M())}-${n}`;break;default:t=n}let r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Te}/${r}`}var zr=class{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){let r=s=>new Promise((o,a)=>{try{let c=e(s);o(c)}catch(c){a(c)}});r.onAbort=t,this.queue.push(r);let i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;let t=[];try{for(let r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(let i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r?.message})}}};async function wu(n,e={}){return L(n,"GET","/v2/passwordPolicy",N(n,e))}var Tu=6,Gr=class{constructor(e){let t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??Tu,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=e.allowedNonAlphanumericCharacters?.join("")??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){let t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){let r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}};var Kr=class{constructor(e,t,r,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new pn(this),this.idTokenSubscription=new pn(this),this.beforeStateQueue=new zr(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=eo,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=ge(t)),this._initializationPromise=this.queue(async()=>{if(!this._deleted){try{this.persistenceManager=await Et.create(this,e)}catch(r){tn(`Failed to initialize persistence: ${r}`),this.persistenceManager=await Et.create(this,[])}finally{this._resolvePersistenceManagerAvailable?.()}if(!this._deleted){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}try{await this.initializeCurrentUser(t)}catch(r){tn(`Failed to initialize current user: ${r}`),await this.directlySetCurrentUser(null).catch(()=>{})}this.lastNotifiedUid=this.currentUser?.uid||null,!this._deleted&&(this._isInitialized=!0)}}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;let e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{let t=await hn(this,{idToken:e}),r=await ve._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){if(U(this.app)){let s=this.app.settings.authIdToken;return s?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(s).then(o,o))}):this.directlySetCurrentUser(null)}let t=await this.assertedPersistence.getCurrentUser(),r=t,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();let s=this.redirectUser?._redirectEventId,o=r?._redirectEventId,a=await this.tryRedirectSignIn(e);(!s||s===o)&&a?.user&&(r=a.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(s){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(s))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return y(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await dn(e)}catch(t){if(oo(t))return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=lu()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(U(this.app))return Promise.reject(se(this));let t=e?V(e):null;return t&&y(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&y(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return U(this.app)?Promise.reject(se(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return U(this.app)?Promise.reject(se(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(ge(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();let t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){let e=await wu(this),t=new Gr(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new fe("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{let r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){let t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await yu(this,r)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(e,t){let r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){let t=e&&ge(e)||this._popupRedirectResolver;y(t,this,"argument-error"),this.redirectPersistenceManager=await Et.create(this,[ge(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){return this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===e?this._currentUser:this.redirectUser?._redirectEventId===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);let e=this.currentUser?.uid??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,i){if(this._deleted)return()=>{};let s=typeof t=="function"?t:t.next.bind(t),o=!1,a=this._isInitialized?Promise.resolve():this._initializationPromise;if(y(a,this,"internal-error"),a.then(()=>{o||s(this.currentUser)}).catch(c=>{if(!o)if(typeof t!="function"&&t.error)t.error(c);else if(r)r(c);else throw c}),typeof t=="function"){let c=e.addObserver(t,r,i);return()=>{o=!0,c()}}else{let c=e.addObserver(t);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){if(this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,this.persistenceManager)try{e?await this.persistenceManager.setCurrentUser(e):await this.persistenceManager.removeCurrentUser()}catch(t){let r=t?.message||String(t),i=Cn(this,"internal-error",`An internal AuthError has occurred: ${r}`);throw i.customData={originalError:t},i}}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return y(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=yo(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){let e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);let t=await this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader();t&&(e["X-Firebase-Client"]=t);let r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){if(U(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;let e=await this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken();return e?.error&&tn(`Error while retrieving App Check token: ${e.error}`),e?.token}};function z(n){return V(n)}var pn=class{constructor(e){this.auth=e,this.observer=null,this.addObserver=_s(t=>this.observer=t)}get next(){return y(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}};var Dn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function bu(n){Dn=n}function Io(n){return Dn.loadJS(n)}function vu(){return Dn.recaptchaEnterpriseScript}function Au(){return Dn.gapiScript}function Eo(n){return`__${n}${Math.floor(Math.random()*1e6)}`}var Yr=class{constructor(){this.enterprise=new Jr}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}},Jr=class{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}};var Su="recaptcha-enterprise",wt="NO_RECAPTCHA",Us="onFirebaseAuthREInstanceReady",vt=class n{constructor(e){this.type=Su,this.auth=z(e)}async verify(e="verify",t=!1){async function r(s){if(!t){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(o,a)=>{io(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)a(new Error("recaptcha Enterprise site key undefined"));else{let m=new ln(c);return s.tenantId==null?s._agentRecaptchaConfig=m:s._tenantRecaptchaConfigs[s.tenantId]=m,o(m.siteKey)}}).catch(c=>{a(c)})})}function i(s,o,a){let c=window.grecaptcha;Vs(c)?c.enterprise.ready(()=>{c.enterprise.execute(s,{action:e}).then(m=>{o(m)}).catch(()=>{o(wt)})}):a(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new Yr().execute("siteKey",{action:"verify"}):new Promise((s,o)=>{r(this.auth).then(async a=>{if(!t&&Vs(window.grecaptcha)&&n.scriptInjectionDeferred)await n.scriptInjectionDeferred.promise,i(a,s,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let c=vu();c.length!==0&&(c+=a+`&onload=${Us}`),n.scriptInjectionDeferred=new qe,window[Us]=()=>{n.scriptInjectionDeferred?.resolve()},Io(c).then(()=>n.scriptInjectionDeferred?.promise).then(()=>{i(a,s,o)}).catch(m=>{o(m)})}}).catch(a=>{o(a)})})}};vt.scriptInjectionDeferred=null;async function gt(n,e,t,r=!1,i=!1){let s=new vt(n),o;if(i)o=wt;else try{o=await s.verify(t)}catch{o=await s.verify(t,!0)}let a={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in a){let c=a.phoneEnrollmentInfo.phoneNumber,m=a.phoneEnrollmentInfo.recaptchaToken;Object.assign(a,{phoneEnrollmentInfo:{phoneNumber:c,recaptchaToken:m,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in a){let c=a.phoneSignInInfo.recaptchaToken;Object.assign(a,{phoneSignInInfo:{recaptchaToken:c,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return a}return r?Object.assign(a,{captchaResp:o}):Object.assign(a,{captchaResponse:o}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function ke(n,e,t,r,i){if(i==="EMAIL_PASSWORD_PROVIDER")if(n._getRecaptchaConfig()?.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){let s=await gt(n,e,t,t==="getOobCode");return r(n,s)}else return r(n,e).catch(async s=>{if(s.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);let o=await gt(n,e,t,t==="getOobCode");return r(n,o)}else return Promise.reject(s)});else if(i==="PHONE_PROVIDER")if(n._getRecaptchaConfig()?.isProviderEnabled("PHONE_PROVIDER")){let s=await gt(n,e,t);return r(n,s).catch(async o=>{if(n._getRecaptchaConfig()?.getProviderEnforcementState("PHONE_PROVIDER")==="AUDIT"&&(o.code==="auth/missing-recaptcha-token"||o.code==="auth/invalid-app-credential")){console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${t} flow.`);let a=await gt(n,e,t,!1,!0);return r(n,a)}return Promise.reject(o)})}else{let s=await gt(n,e,t,!1,!0);return r(n,s)}else return Promise.reject(i+" provider is not supported.")}async function Ru(n){let e=z(n),t=await io(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),r=new ln(t);e.tenantId==null?e._agentRecaptchaConfig=r:e._tenantRecaptchaConfigs[e.tenantId]=r,r.isAnyProviderEnabled()&&new vt(e).verify()}function wo(n,e){let t=mt(n,"auth");if(t.isInitialized()){let i=t.getImmediate(),s=t.getOptions();if(Z(s,e??{}))return i;Q(i,"already-initialized")}return t.initialize({options:e})}function Nu(n,e){let t=e?.persistence||[],r=(Array.isArray(t)?t:[t]).map(ge);e?.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e?.popupRedirectResolver)}function To(n,e,t){let r=z(n);y(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");let i=!!t?.disableWarnings,s=bo(e),{host:o,port:a}=Pu(e),c=a===null?"":`:${a}`,m={url:`${s}//${o}${c}/`},_=Object.freeze({host:o,port:a,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){y(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),y(Z(m,r.config.emulator)&&Z(_,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=m,r.emulatorConfig=_,r.settings.appVerificationDisabledForTesting=!0,Ne(o)?Yt(`${s}//${o}${c}`):i||ku()}function bo(n){let e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Pu(n){let e=bo(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};let r=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){let s=i[1];return{host:s,port:Fs(r.substr(s.length+1))}}else{let[s,o]=r.split(":");return{host:s,port:Fs(o)}}}function Fs(n){if(!n)return null;let e=Number(n);return isNaN(e)?null:e}function ku(){function n(){let e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}var De=class{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return ie("not implemented")}_getIdTokenResponse(e){return ie("not implemented")}_linkToIdToken(e,t){return ie("not implemented")}_getReauthenticationResolver(e){return ie("not implemented")}};async function Cu(n,e){return L(n,"POST","/v1/accounts:signUp",e)}async function Du(n,e){return Ae(n,"POST","/v1/accounts:signInWithPassword",N(n,e))}async function Ou(n,e){return L(n,"POST","/v1/accounts:sendOobCode",N(n,e))}async function Vu(n,e){return Ou(n,e)}async function Lu(n,e){return Ae(n,"POST","/v1/accounts:signInWithEmailLink",N(n,e))}async function xu(n,e){return Ae(n,"POST","/v1/accounts:signInWithEmailLink",N(n,e))}var At=class n extends De{constructor(e,t,r,i=null){super("password",r),this._email=e,this._password=t,this._tenantId=i}static _fromEmailAndPassword(e,t){return new n(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new n(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){let t=typeof e=="string"?JSON.parse(e):e;if(t?.email&&t?.password){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":let t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ke(e,t,"signInWithPassword",Du,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return Lu(e,{email:this._email,oobCode:this._password});default:Q(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":let r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ke(e,r,"signUpPassword",Cu,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return xu(e,{idToken:t,email:this._email,oobCode:this._password});default:Q(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}};async function ze(n,e){return Ae(n,"POST","/v1/accounts:signInWithIdp",N(n,e))}var Mu="http://localhost",Oe=class n extends De{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){let t=new n(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Q("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){let t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=t;if(!r||!i)return null;let o=new n(r,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){let t=this.buildRequest();return ze(e,t)}_linkToIdToken(e,t){let r=this.buildRequest();return r.idToken=t,ze(e,r)}_getReauthenticationResolver(e){let t=this.buildRequest();return t.autoCreate=!1,ze(e,t)}buildRequest(){let e={requestUri:Mu,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{let t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=$e(t)}return e}};async function js(n,e){return L(n,"POST","/v1/accounts:sendVerificationCode",N(n,e))}async function Uu(n,e){return Ae(n,"POST","/v1/accounts:signInWithPhoneNumber",N(n,e))}async function Fu(n,e){let t=await Ae(n,"POST","/v1/accounts:signInWithPhoneNumber",N(n,e));if(t.temporaryProof)throw _t(n,"account-exists-with-different-credential",t);return t}var ju={USER_NOT_FOUND:"user-not-found"};async function Bu(n,e){let t={...e,operation:"REAUTH"};return Ae(n,"POST","/v1/accounts:signInWithPhoneNumber",N(n,t),ju)}var St=class n extends De{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new n({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new n({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return Uu(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return Fu(e,{idToken:t,...this._makeVerificationRequest()})}_getReauthenticationResolver(e){return Bu(e,this._makeVerificationRequest())}_makeVerificationRequest(){let{temporaryProof:e,phoneNumber:t,verificationId:r,verificationCode:i}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:r,code:i}}toJSON(){let e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));let{verificationId:t,verificationCode:r,phoneNumber:i,temporaryProof:s}=e;return!r&&!t&&!i&&!s?null:new n({verificationId:t,verificationCode:r,phoneNumber:i,temporaryProof:s})}};function qu(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function $u(n){let e=We(He(n)).link,t=e?We(He(e)).deep_link_id:null,r=We(He(n)).deep_link_id;return(r?We(He(r)).link:null)||r||t||e||n}var mn=class n{constructor(e){let t=We(He(e)),r=t.apiKey??null,i=t.oobCode??null,s=qu(t.mode??null);y(r&&i&&s,"argument-error"),this.apiKey=r,this.operation=s,this.code=i,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){let t=$u(e);try{return new n(t)}catch{return null}}};var Ve=class n{constructor(){this.providerId=n.PROVIDER_ID}static credential(e,t){return At._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){let r=mn.parseLink(t);return y(r,"argument-error"),At._fromEmailAndCode(e,r.code,r.tenantId)}};Ve.PROVIDER_ID="password";Ve.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Ve.EMAIL_LINK_SIGN_IN_METHOD="emailLink";var Ge=class{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}};var Le=class extends Ge{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}};var Rt=class n extends Le{constructor(){super("facebook.com")}static credential(e){return Oe._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return n.credential(e.oauthAccessToken)}catch{return null}}};Rt.FACEBOOK_SIGN_IN_METHOD="facebook.com";Rt.PROVIDER_ID="facebook.com";var Ke=class n extends Le{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Oe._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return n.credential(t,r)}catch{return null}}};Ke.GOOGLE_SIGN_IN_METHOD="google.com";Ke.PROVIDER_ID="google.com";var Nt=class n extends Le{constructor(){super("github.com")}static credential(e){return Oe._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return n.credential(e.oauthAccessToken)}catch{return null}}};Nt.GITHUB_SIGN_IN_METHOD="github.com";Nt.PROVIDER_ID="github.com";var Pt=class n extends Le{constructor(){super("twitter.com")}static credential(e,t){return Oe._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return n.credential(t,r)}catch{return null}}};Pt.TWITTER_SIGN_IN_METHOD="twitter.com";Pt.PROVIDER_ID="twitter.com";async function Wu(n,e){return Ae(n,"POST","/v1/accounts:signUp",N(n,e))}var Ye=class n{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,i=!1){let s=await ve._fromIdTokenResponse(e,r,i),o=Bs(r);return new n({user:s,providerId:o,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);let i=Bs(r);return new n({user:e,providerId:i,_tokenResponse:r,operationType:t})}};function Bs(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}var Qr=class n extends H{constructor(e,t,r,i){super(t.code,t.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,n.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,i){return new n(e,t,r,i)}};function vo(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Qr._fromErrorAndOperation(n,s,e,r):s})}async function Hu(n,e,t=!1){let r=await Tt(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Ye._forOperation(n,"link",r)}async function zu(n,e,t=!1){let{auth:r}=n;if(U(r.app))return Promise.reject(se(r));let i="reauthenticate";try{let s=await Tt(n,vo(r,i,e,n),t);y(s.idToken,r,"internal-error");let o=ai(s.idToken);y(o,r,"internal-error");let{sub:a}=o;return y(n.uid===a,r,"user-mismatch"),Ye._forOperation(n,i,s)}catch(s){throw s?.code==="auth/user-not-found"&&Q(r,"user-mismatch"),s}}async function Ao(n,e,t=!1){if(U(n.app))return Promise.reject(se(n));let r="signIn",i=await vo(n,r,e),s=await Ye._fromIdTokenResponse(n,r,i);return t||await n._updateCurrentUser(s.user),s}async function So(n,e){return Ao(z(n),e)}function Gu(n,e,t){y(t.url?.length>0,n,"invalid-continue-uri"),y(typeof t.dynamicLinkDomain>"u"||t.dynamicLinkDomain.length>0,n,"invalid-dynamic-link-domain"),y(typeof t.linkDomain>"u"||t.linkDomain.length>0,n,"invalid-hosting-link-domain"),e.continueUrl=t.url,e.dynamicLinkDomain=t.dynamicLinkDomain,e.linkDomain=t.linkDomain,e.canHandleCodeInApp=t.handleCodeInApp,t.iOS&&(y(t.iOS.bundleId.length>0,n,"missing-ios-bundle-id"),e.iOSBundleId=t.iOS.bundleId),t.android&&(y(t.android.packageName.length>0,n,"missing-android-pkg-name"),e.androidInstallApp=t.android.installApp,e.androidMinimumVersionCode=t.android.minimumVersion,e.androidPackageName=t.android.packageName)}async function Ro(n){let e=z(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function No(n,e,t){let r=z(n),i={requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"};t&&Gu(r,i,t),await ke(r,i,"getOobCode",Vu,"EMAIL_PASSWORD_PROVIDER")}async function Po(n,e,t){if(U(n.app))return Promise.reject(se(n));let r=z(n),o=await ke(r,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Wu,"EMAIL_PASSWORD_PROVIDER").catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&Ro(n),c}),a=await Ye._fromIdTokenResponse(r,"signIn",o);return await r._updateCurrentUser(a.user),a}function ko(n,e,t){return U(n.app)?Promise.reject(se(n)):So(V(n),Ve.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Ro(n),r})}function Co(n,e,t,r){return V(n).onIdTokenChanged(e,t,r)}function Do(n,e,t){return V(n).beforeAuthStateChanged(e,t)}function Oo(n,e,t,r){return V(n).onAuthStateChanged(e,t,r)}function Vo(n){return V(n).signOut()}function qs(n,e){return L(n,"POST","/v2/accounts/mfaEnrollment:start",N(n,e))}function Ku(n,e){return L(n,"POST","/v2/accounts/mfaEnrollment:finalize",N(n,e))}function Yu(n,e){return L(n,"POST","/v2/accounts/mfaEnrollment:start",N(n,e))}function Ju(n,e){return L(n,"POST","/v2/accounts/mfaEnrollment:finalize",N(n,e))}var gn="__sak";var _n=class{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(gn,"1"),this.storage.removeItem(gn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){let t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}};var Qu=1e3,Xu=10,yn=class extends _n{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=_o(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(let t of Object.keys(this.listeners)){let r=this.storage.getItem(t),i=this.localCache[t];r!==i&&e(t,i,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,a,c)=>{this.notifyListeners(o,c)});return}let r=e.key;t?this.detachListener():this.stopPolling();let i=()=>{let o=this.storage.getItem(r);!t&&this.localCache[r]===o||this.notifyListeners(r,o)},s=this.storage.getItem(r);Eu()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,Xu):i()}notifyListeners(e,t){this.localCache[e]=t;let r=this.listeners[e];if(r)for(let i of Array.from(r))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},Qu)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){let t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}};yn.type="LOCAL";var Lo=yn;var Zu=1e3;function Ur(n){let e=n.replace(/[\\^$.*+?()[\]{}|]/g,"\\$&"),t=RegExp(`${e}=([^;]+)`);return document.cookie.match(t)?.[1]??null}function Fr(n){return`${window.location.protocol==="http:"?"__dev_":"__HOST-"}FIREBASE_${n.split(":")[3]}`}var Xr=class{constructor(){this.type="COOKIE",this.listenerUnsubscribes=new Map}_getFinalTarget(e){if(typeof window===void 0)return e;let t=new URL(`${window.location.origin}/__cookies__`);return t.searchParams.set("finalTarget",e),t}async _isAvailable(){return typeof isSecureContext=="boolean"&&!isSecureContext||typeof navigator>"u"||typeof document>"u"?!1:navigator.cookieEnabled??!0}async _set(e,t){}async _get(e){if(!this._isAvailable())return null;let t=Fr(e);return window.cookieStore?(await window.cookieStore.get(t))?.value:Ur(t)}async _remove(e){if(!this._isAvailable()||!await this._get(e))return;let r=Fr(e);document.cookie=`${r}=;Max-Age=34560000;Partitioned;Secure;SameSite=Strict;Path=/;Priority=High`,await fetch("/__cookies__",{method:"DELETE"}).catch(()=>{})}_addListener(e,t){if(!this._isAvailable())return;let r=Fr(e);if(window.cookieStore){let a=m=>{let _=m.changed.find(T=>T.name===r);_&&t(_.value),m.deleted.find(T=>T.name===r)&&t(null)},c=()=>window.cookieStore.removeEventListener("change",a);return this.listenerUnsubscribes.set(t,c),window.cookieStore.addEventListener("change",a)}let i=Ur(r),s=setInterval(()=>{let a=Ur(r);a!==i&&(t(a),i=a)},Zu),o=()=>clearInterval(s);this.listenerUnsubscribes.set(t,o)}_removeListener(e,t){let r=this.listenerUnsubscribes.get(t);r&&(r(),this.listenerUnsubscribes.delete(t))}};Xr.type="COOKIE";var In=class extends _n{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}};In.type="SESSION";var ui=In;function el(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}var En=class n{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){let t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;let r=new n(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){let t=e,{eventId:r,eventType:i,data:s}=t.data,o=this.handlersMap[i];if(!o?.size)return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:i});let a=Array.from(o).map(async m=>m(t.origin,s)),c=await el(a);t.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}};En.receivers=[];function li(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}var Zr=class{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){let i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((a,c)=>{let m=li("",20);i.port1.start();let _=setTimeout(()=>{c(new Error("unsupported_event"))},r);o={messageChannel:i,onMessage(E){let T=E;if(T.data.eventId===m)switch(T.data.status){case"ack":clearTimeout(_),s=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),a(T.data.response);break;default:clearTimeout(_),clearTimeout(s),c(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:m,data:t},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}};function oe(){return window}function tl(n){oe().location.href=n}function xo(){return typeof oe().WorkerGlobalScope<"u"&&typeof oe().importScripts=="function"}async function nl(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function rl(){return navigator?.serviceWorker?.controller||null}function il(){return xo()?self:null}var Mo="firebaseLocalStorageDb",sl=1,wn="firebaseLocalStorage",Uo="fbase_key",xe=class{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}};function On(n,e){return n.transaction([wn],e?"readwrite":"readonly").objectStore(wn)}function ol(){let n=indexedDB.deleteDatabase(Mo);return new xe(n).toPromise()}function Fo(){let n=indexedDB.open(Mo,sl);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{let r=n.result;try{r.createObjectStore(wn,{keyPath:Uo})}catch(i){t(i)}}),n.addEventListener("success",async()=>{let r=n.result;r.objectStoreNames.contains(wn)?e(r):(r.close(),await ol(),e(await Fo()))})})}async function $s(n,e,t){let r=On(n,!0).put({[Uo]:e,value:t});return new xe(r).toPromise()}async function al(n,e){let t=On(n,!1).get(e),r=await new xe(t).toPromise();return r===void 0?null:r.value}function Ws(n,e){let t=On(n,!0).delete(e);return new xe(t).toPromise()}var cl=800,ul=3,Tn=class{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.dbPromise?this.dbPromise:(this.dbPromise=Fo(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{let r=await this._openDb();return await e(r)}catch(r){if(t++>ul)throw r;if(this.dbPromise){let i=this.dbPromise;this.dbPromise=null;try{(await i).close()}catch{}}}}async initializeServiceWorkerMessaging(){return xo()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=En._getInstance(il()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){if(this.activeServiceWorker=await nl(),!this.activeServiceWorker)return;this.sender=new Zr(this.activeServiceWorker);let e=await this.sender._send("ping",{},800);e&&e[0]?.fulfilled&&e[0]?.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||rl()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await $s(e,gn,"1"),await Ws(e,gn)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>$s(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){let t=await this._withRetries(r=>al(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Ws(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{let e=await this._withRetries(i=>{let s=On(i,!1).getAll();return new xe(s).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];let t=[],r=new Set;if(e.length!==0)for(let{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),t.push(i));for(let i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}catch(e){return this.isClosing||tn(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,t){this.localCache[e]=t;let r=this.listeners[e];if(r)for(let i of Array.from(r))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),cl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}};Tn.type="LOCAL";var jo=Tn;function Hs(n,e){return L(n,"POST","/v2/accounts/mfaSignIn:start",N(n,e))}function ll(n,e){return L(n,"POST","/v2/accounts/mfaSignIn:finalize",N(n,e))}function hl(n,e){return L(n,"POST","/v2/accounts/mfaSignIn:finalize",N(n,e))}var nd=Eo("rcb"),rd=new Ce(3e4,6e4);var sn="recaptcha";async function dl(n,e,t){if(!n._getRecaptchaConfig())try{await Ru(n)}catch{console.log("Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.")}try{let r;if(typeof e=="string"?r={phoneNumber:e}:r=e,"session"in r){let i=r.session;if("phoneNumber"in r){y(i.type==="enroll",n,"internal-error");let s={idToken:i.credential,phoneEnrollmentInfo:{phoneNumber:r.phoneNumber,clientType:"CLIENT_TYPE_WEB"}};return(await ke(n,s,"mfaSmsEnrollment",async(m,_)=>{if(_.phoneEnrollmentInfo.captchaResponse===wt){y(t?.type===sn,m,"argument-error");let E=await jr(m,_,t);return qs(m,E)}return qs(m,_)},"PHONE_PROVIDER").catch(m=>Promise.reject(m))).phoneSessionInfo.sessionInfo}else{y(i.type==="signin",n,"internal-error");let s=r.multiFactorHint?.uid||r.multiFactorUid;y(s,n,"missing-multi-factor-info");let o={mfaPendingCredential:i.credential,mfaEnrollmentId:s,phoneSignInInfo:{clientType:"CLIENT_TYPE_WEB"}};return(await ke(n,o,"mfaSmsSignIn",async(_,E)=>{if(E.phoneSignInInfo.captchaResponse===wt){y(t?.type===sn,_,"argument-error");let T=await jr(_,E,t);return Hs(_,T)}return Hs(_,E)},"PHONE_PROVIDER").catch(_=>Promise.reject(_))).phoneResponseInfo.sessionInfo}}else{let i={phoneNumber:r.phoneNumber,clientType:"CLIENT_TYPE_WEB"};return(await ke(n,i,"sendVerificationCode",async(c,m)=>{if(m.captchaResponse===wt){y(t?.type===sn,c,"argument-error");let _=await jr(c,m,t);return js(c,_)}return js(c,m)},"PHONE_PROVIDER").catch(c=>Promise.reject(c))).sessionInfo}}finally{t?._reset()}}async function jr(n,e,t){y(t.type===sn,n,"argument-error");let r=await t.verify();y(typeof r=="string",n,"argument-error");let i={...e};if("phoneEnrollmentInfo"in i){let s=i.phoneEnrollmentInfo.phoneNumber,o=i.phoneEnrollmentInfo.captchaResponse,a=i.phoneEnrollmentInfo.clientType,c=i.phoneEnrollmentInfo.recaptchaVersion;return Object.assign(i,{phoneEnrollmentInfo:{phoneNumber:s,recaptchaToken:r,captchaResponse:o,clientType:a,recaptchaVersion:c}}),i}else if("phoneSignInInfo"in i){let s=i.phoneSignInInfo.captchaResponse,o=i.phoneSignInInfo.clientType,a=i.phoneSignInInfo.recaptchaVersion;return Object.assign(i,{phoneSignInInfo:{recaptchaToken:r,captchaResponse:s,clientType:o,recaptchaVersion:a}}),i}else return Object.assign(i,{recaptchaToken:r}),i}var kt=class n{constructor(e){this.providerId=n.PROVIDER_ID,this.auth=z(e)}verifyPhoneNumber(e,t){return dl(this.auth,e,V(t))}static credential(e,t){return St._fromVerification(e,t)}static credentialFromResult(e){let t=e;return n.credentialFromTaggedObject(t)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{phoneNumber:t,temporaryProof:r}=e;return t&&r?St._fromTokenResponse(t,r):null}};kt.PROVIDER_ID="phone";kt.PHONE_SIGN_IN_METHOD="phone";function hi(n,e){return e?ge(e):(y(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}var Ct=class extends De{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return ze(e,this._buildIdpRequest())}_linkToIdToken(e,t){return ze(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return ze(e,this._buildIdpRequest())}_buildIdpRequest(e){let t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}};function fl(n){return Ao(n.auth,new Ct(n),n.bypassAuthState)}function pl(n){let{auth:e,user:t}=n;return y(t,e,"internal-error"),zu(t,new Ct(n),n.bypassAuthState)}async function ml(n){let{auth:e,user:t}=n;return y(t,e,"internal-error"),Hu(t,new Ct(n),n.bypassAuthState)}var bn=class{constructor(e,t,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){let{urlResponse:t,sessionId:r,postBody:i,tenantId:s,error:o,type:a}=e;if(o){this.reject(o);return}let c={auth:this.auth,requestUri:t,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(c))}catch(m){this.reject(m)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return fl;case"linkViaPopup":case"linkViaRedirect":return ml;case"reauthViaPopup":case"reauthViaRedirect":return pl;default:Q(this.auth,"internal-error")}}resolve(e){_e(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){_e(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}};var gl=new Ce(2e3,1e4);async function Bo(n,e,t){if(U(n.app))return Promise.reject(te(n,"operation-not-supported-in-this-environment"));let r=z(n);to(n,e,Ge);let i=hi(r,t);return new vn(r,"signInViaPopup",e,i).executeNotNull()}var vn=class n extends bn{constructor(e,t,r,i,s){super(e,t,i,s),this.provider=r,this.authWindow=null,this.pollId=null,n.currentPopupAction&&n.currentPopupAction.cancel(),n.currentPopupAction=this}async executeNotNull(){let e=await this.execute();return y(e,this.auth,"internal-error"),e}async onExecution(){_e(this.filter.length===1,"Popup operations only handle one event");let e=li();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(te(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(te(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,n.currentPopupAction=null}pollUserCancellation(){let e=()=>{if(this.authWindow?.window?.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(te(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,gl.get())};e()}};vn.currentPopupAction=null;var _l="pendingRedirect",on=new Map,ei=class extends bn{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=on.get(this.auth._key());if(!e){try{let r=await yl(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}on.set(this.auth._key(),e)}return this.bypassAuthState||on.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){let t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}};async function yl(n,e){let t=$o(e),r=qo(n);if(!await r._isAvailable())return!1;let i=await r._get(t)==="true";return await r._remove(t),i}async function Il(n,e){return qo(n)._set($o(e),"true")}function El(n,e){on.set(n._key(),e)}function qo(n){return ge(n._redirectPersistence)}function $o(n){return rn(_l,n.config.apiKey,n.name)}function Wo(n,e,t){return wl(n,e,t)}async function wl(n,e,t){if(U(n.app))return Promise.reject(se(n));let r=z(n);to(n,e,Ge),await r._initializationPromise;let i=hi(r,t);return await Il(i,r),i._openRedirect(r,e,"signInViaRedirect")}async function Ho(n,e){return await z(n)._initializationPromise,zo(n,e,!1)}async function zo(n,e,t=!1){if(U(n.app))return Promise.reject(se(n));let r=z(n),i=hi(r,e),o=await new ei(r,i,t).execute();return o&&!t&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}var Tl=10*60*1e3,ti=class{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!bl(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){if(e.error&&!Go(e)){let r=e.error.code?.split("auth/")[1]||"internal-error";t.onError(te(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){let r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Tl&&this.cachedEventUids.clear(),this.cachedEventUids.has(zs(e))}saveEventToCache(e){this.cachedEventUids.add(zs(e)),this.lastProcessedEventTime=Date.now()}};function zs(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Go({type:n,error:e}){return n==="unknown"&&e?.code==="auth/no-auth-event"}function bl(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Go(n);default:return!1}}async function vl(n,e={}){return L(n,"GET","/v1/projects",e)}var Al=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Sl=/^https?/;async function Rl(n){if(n.config.emulator)return;let{authorizedDomains:e}=await vl(n);for(let t of e)try{if(Nl(t))return}catch{}Q(n,"unauthorized-domain")}function Nl(n){let e=qr(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){let o=new URL(n);return o.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===r}if(!Sl.test(t))return!1;if(Al.test(n))return r===n;let i=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}var Pl=new Ce(3e4,6e4);function Gs(){let n=oe().___jsl;if(n?.H){for(let e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function kl(n){return new Promise((e,t)=>{function r(){Gs(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Gs(),t(te(n,"network-request-failed"))},timeout:Pl.get()})}if(oe().gapi?.iframes?.Iframe)e(gapi.iframes.getContext());else if(oe().gapi?.load)r();else{let i=Eo("iframefcb");return oe()[i]=()=>{gapi.load?r():t(te(n,"network-request-failed"))},Io(`${Au()}?onload=${i}`).catch(s=>t(s))}}).catch(e=>{throw an=null,e})}var an=null;function Cl(n){return an=an||kl(n),an}var Dl=new Ce(5e3,15e3),Ol="__/auth/iframe",Vl="emulator/auth/iframe",Ll={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},xl=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Ml(n){let e=n.config;y(e.authDomain,n,"auth-domain-config-required");let t=e.emulator?oi(e,Vl):`https://${n.config.authDomain}/${Ol}`,r={apiKey:e.apiKey,appName:n.name,v:Te},i=xl.get(n.config.apiHost);i&&(r.eid=i);let s=n._getFrameworks();return s.length&&(r.fw=s.join(",")),`${t}?${$e(r).slice(1)}`}async function Ul(n){let e=await Cl(n),t=oe().gapi;return y(t,n,"internal-error"),e.open({where:document.body,url:Ml(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Ll,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});let o=te(n,"network-request-failed"),a=oe().setTimeout(()=>{s(o)},Dl.get());function c(){oe().clearTimeout(a),i(r)}r.ping(c).then(c,()=>{s(o)})}))}var Fl={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},jl=500,Bl=600,ql="_blank",$l="http://localhost",An=class{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}};function Wl(n,e,t,r=jl,i=Bl){let s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString(),a="",c={...Fl,width:r.toString(),height:i.toString(),top:s,left:o},m=M().toLowerCase();t&&(a=ho(m)?ql:t),uo(m)&&(e=e||$l,c.scrollbars="yes");let _=Object.entries(c).reduce((T,[W,O])=>`${T}${W}=${O},`,"");if(Iu(m)&&a!=="_self")return Hl(e||"",a),new An(null);let E=window.open(e||"",a,_);y(E,n,"popup-blocked");try{E.focus()}catch{}return new An(E)}function Hl(n,e){let t=document.createElement("a");t.href=n,t.target=e;let r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}var zl="__/auth/handler",Gl="emulator/auth/handler",Kl=encodeURIComponent("fac");async function Ks(n,e,t,r,i,s){y(n.config.authDomain,n,"auth-domain-config-required"),y(n.config.apiKey,n,"invalid-api-key");let o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:Te,eventId:i};if(e instanceof Ge){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",gs(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(let[_,E]of Object.entries(s||{}))o[_]=E}if(e instanceof Le){let _=e.getScopes().filter(E=>E!=="");_.length>0&&(o.scopes=_.join(","))}n.tenantId&&(o.tid=n.tenantId);let a=o;for(let _ of Object.keys(a))a[_]===void 0&&delete a[_];let c=await n._getAppCheckToken(),m=c?`#${Kl}=${encodeURIComponent(c)}`:"";return`${Yl(n)}?${$e(a).slice(1)}${m}`}function Yl({config:n}){return n.emulator?oi(n,Gl):`https://${n.authDomain}/${zl}`}var Br="webStorageSupport",ni=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=ui,this._completeRedirectFn=zo,this._overrideRedirectResult=El}async _openPopup(e,t,r,i){_e(this.eventManagers[e._key()]?.manager,"_initialize() not called before _openPopup()");let s=await Ks(e,t,r,qr(),i);return Wl(e,s,li())}async _openRedirect(e,t,r,i){await this._originValidation(e);let s=await Ks(e,t,r,qr(),i);return tl(s),new Promise(()=>{})}_initialize(e){let t=e._key();if(this.eventManagers[t]){let{manager:i,promise:s}=this.eventManagers[t];return i?Promise.resolve(i):(_e(s,"If manager is not set, promise should be"),s)}let r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){let t=await Ul(e),r=new ti(e);return t.register("authEvent",i=>(y(i?.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Br,{type:Br},i=>{let s=i?.[0]?.[Br];s!==void 0&&t(!!s),Q(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){let t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Rl(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return _o()||lo()||ci()}},Ko=ni,Sn=class{constructor(e){this.factorId=e}_process(e,t,r){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,r);case"signin":return this._finalizeSignIn(e,t.credential);default:return ie("unexpected MultiFactorSessionType")}}},ri=class n extends Sn{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new n(e)}_finalizeEnroll(e,t,r){return Ku(e,{idToken:t,displayName:r,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,t){return ll(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()})}},Rn=class{constructor(){}static assertion(e){return ri._fromCredential(e)}};Rn.FACTOR_ID="phone";var Nn=class{static assertionForEnrollment(e,t){return Pn._fromSecret(e,t)}static assertionForSignIn(e,t){return Pn._fromEnrollmentId(e,t)}static async generateSecret(e){let t=e;y(typeof t.user?.auth<"u","internal-error");let r=await Yu(t.user.auth,{idToken:t.credential,totpEnrollmentInfo:{}});return kn._fromStartTotpMfaEnrollmentResponse(r,t.user.auth)}};Nn.FACTOR_ID="totp";var Pn=class n extends Sn{constructor(e,t,r){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=r}static _fromSecret(e,t){return new n(t,void 0,e)}static _fromEnrollmentId(e,t){return new n(t,e)}async _finalizeEnroll(e,t,r){return y(typeof this.secret<"u",e,"argument-error"),Ju(e,{idToken:t,displayName:r,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)})}async _finalizeSignIn(e,t){y(this.enrollmentId!==void 0&&this.otp!==void 0,e,"argument-error");let r={verificationCode:this.otp};return hl(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:r})}},kn=class n{constructor(e,t,r,i,s,o,a){this.sessionInfo=o,this.auth=a,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=r,this.codeIntervalSeconds=i,this.enrollmentCompletionDeadline=s}static _fromStartTotpMfaEnrollmentResponse(e,t){return new n(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){let r=!1;return(en(e)||en(t))&&(r=!0),r&&(en(e)&&(e=this.auth.currentUser?.email||"unknownuser"),en(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}};function en(n){return typeof n>"u"||n?.length===0}var Ys="@firebase/auth",Js="1.13.8";var ii=class{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;let t=this.auth.onIdTokenChanged(r=>{e(r?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();let t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){y(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}};function Jl(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Ql(n){we(new J("auth",(e,{options:t})=>{let r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=r.options;y(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});let c={apiKey:o,authDomain:a,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:yo(n)},m=new Kr(r,i,s,c);return Nu(m,t),m},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),we(new J("auth-internal",e=>{let t=z(e.getProvider("auth").getImmediate());return(r=>new ii(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),ee(Ys,Js,Jl(n)),ee(Ys,Js,"esm2020")}var Xl=5*60,Zl=Tr("authIdTokenMaxAge")||Xl,Qs=null,eh=n=>async e=>{let t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>Zl)return;let i=t?.token;Qs!==i&&(Qs=i,await fetch(n,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Yo(n=Zt()){let e=mt(n,"auth");if(e.isInitialized())return e.getImmediate();let t=wo(n,{popupRedirectResolver:Ko,persistence:[jo,Lo,ui]}),r=Tr("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){let s=new URL(r,location.origin);if(location.origin===s.origin){let o=eh(s.toString());Do(t,o,()=>o(t.currentUser)),Co(t,a=>o(a))}}let i=Er("auth");return i&&To(t,`http://${i}`),t}function th(){return document.getElementsByTagName("head")?.[0]??document}bu({loadJS(n){return new Promise((e,t)=>{let r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=i=>{let s=te("internal-error");s.customData=i,t(s)},r.type="text/javascript",r.charset="UTF-8",th().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Ql("Browser");var Jo=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Qo={};var di,nh;(function(){var n;function e(d,u){function h(){}h.prototype=u.prototype,d.F=u.prototype,d.prototype=new h,d.prototype.constructor=d,d.D=function(p,f,g){for(var l=Array(arguments.length-2),Re=2;Re<arguments.length;Re++)l[Re-2]=arguments[Re];return u.prototype[f].apply(p,l)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,t),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(d,u,h){h||(h=0);let p=Array(16);if(typeof u=="string")for(var f=0;f<16;++f)p[f]=u.charCodeAt(h++)|u.charCodeAt(h++)<<8|u.charCodeAt(h++)<<16|u.charCodeAt(h++)<<24;else for(f=0;f<16;++f)p[f]=u[h++]|u[h++]<<8|u[h++]<<16|u[h++]<<24;u=d.g[0],h=d.g[1],f=d.g[2];let g=d.g[3],l;l=u+(g^h&(f^g))+p[0]+3614090360&4294967295,u=h+(l<<7&4294967295|l>>>25),l=g+(f^u&(h^f))+p[1]+3905402710&4294967295,g=u+(l<<12&4294967295|l>>>20),l=f+(h^g&(u^h))+p[2]+606105819&4294967295,f=g+(l<<17&4294967295|l>>>15),l=h+(u^f&(g^u))+p[3]+3250441966&4294967295,h=f+(l<<22&4294967295|l>>>10),l=u+(g^h&(f^g))+p[4]+4118548399&4294967295,u=h+(l<<7&4294967295|l>>>25),l=g+(f^u&(h^f))+p[5]+1200080426&4294967295,g=u+(l<<12&4294967295|l>>>20),l=f+(h^g&(u^h))+p[6]+2821735955&4294967295,f=g+(l<<17&4294967295|l>>>15),l=h+(u^f&(g^u))+p[7]+4249261313&4294967295,h=f+(l<<22&4294967295|l>>>10),l=u+(g^h&(f^g))+p[8]+1770035416&4294967295,u=h+(l<<7&4294967295|l>>>25),l=g+(f^u&(h^f))+p[9]+2336552879&4294967295,g=u+(l<<12&4294967295|l>>>20),l=f+(h^g&(u^h))+p[10]+4294925233&4294967295,f=g+(l<<17&4294967295|l>>>15),l=h+(u^f&(g^u))+p[11]+2304563134&4294967295,h=f+(l<<22&4294967295|l>>>10),l=u+(g^h&(f^g))+p[12]+1804603682&4294967295,u=h+(l<<7&4294967295|l>>>25),l=g+(f^u&(h^f))+p[13]+4254626195&4294967295,g=u+(l<<12&4294967295|l>>>20),l=f+(h^g&(u^h))+p[14]+2792965006&4294967295,f=g+(l<<17&4294967295|l>>>15),l=h+(u^f&(g^u))+p[15]+1236535329&4294967295,h=f+(l<<22&4294967295|l>>>10),l=u+(f^g&(h^f))+p[1]+4129170786&4294967295,u=h+(l<<5&4294967295|l>>>27),l=g+(h^f&(u^h))+p[6]+3225465664&4294967295,g=u+(l<<9&4294967295|l>>>23),l=f+(u^h&(g^u))+p[11]+643717713&4294967295,f=g+(l<<14&4294967295|l>>>18),l=h+(g^u&(f^g))+p[0]+3921069994&4294967295,h=f+(l<<20&4294967295|l>>>12),l=u+(f^g&(h^f))+p[5]+3593408605&4294967295,u=h+(l<<5&4294967295|l>>>27),l=g+(h^f&(u^h))+p[10]+38016083&4294967295,g=u+(l<<9&4294967295|l>>>23),l=f+(u^h&(g^u))+p[15]+3634488961&4294967295,f=g+(l<<14&4294967295|l>>>18),l=h+(g^u&(f^g))+p[4]+3889429448&4294967295,h=f+(l<<20&4294967295|l>>>12),l=u+(f^g&(h^f))+p[9]+568446438&4294967295,u=h+(l<<5&4294967295|l>>>27),l=g+(h^f&(u^h))+p[14]+3275163606&4294967295,g=u+(l<<9&4294967295|l>>>23),l=f+(u^h&(g^u))+p[3]+4107603335&4294967295,f=g+(l<<14&4294967295|l>>>18),l=h+(g^u&(f^g))+p[8]+1163531501&4294967295,h=f+(l<<20&4294967295|l>>>12),l=u+(f^g&(h^f))+p[13]+2850285829&4294967295,u=h+(l<<5&4294967295|l>>>27),l=g+(h^f&(u^h))+p[2]+4243563512&4294967295,g=u+(l<<9&4294967295|l>>>23),l=f+(u^h&(g^u))+p[7]+1735328473&4294967295,f=g+(l<<14&4294967295|l>>>18),l=h+(g^u&(f^g))+p[12]+2368359562&4294967295,h=f+(l<<20&4294967295|l>>>12),l=u+(h^f^g)+p[5]+4294588738&4294967295,u=h+(l<<4&4294967295|l>>>28),l=g+(u^h^f)+p[8]+2272392833&4294967295,g=u+(l<<11&4294967295|l>>>21),l=f+(g^u^h)+p[11]+1839030562&4294967295,f=g+(l<<16&4294967295|l>>>16),l=h+(f^g^u)+p[14]+4259657740&4294967295,h=f+(l<<23&4294967295|l>>>9),l=u+(h^f^g)+p[1]+2763975236&4294967295,u=h+(l<<4&4294967295|l>>>28),l=g+(u^h^f)+p[4]+1272893353&4294967295,g=u+(l<<11&4294967295|l>>>21),l=f+(g^u^h)+p[7]+4139469664&4294967295,f=g+(l<<16&4294967295|l>>>16),l=h+(f^g^u)+p[10]+3200236656&4294967295,h=f+(l<<23&4294967295|l>>>9),l=u+(h^f^g)+p[13]+681279174&4294967295,u=h+(l<<4&4294967295|l>>>28),l=g+(u^h^f)+p[0]+3936430074&4294967295,g=u+(l<<11&4294967295|l>>>21),l=f+(g^u^h)+p[3]+3572445317&4294967295,f=g+(l<<16&4294967295|l>>>16),l=h+(f^g^u)+p[6]+76029189&4294967295,h=f+(l<<23&4294967295|l>>>9),l=u+(h^f^g)+p[9]+3654602809&4294967295,u=h+(l<<4&4294967295|l>>>28),l=g+(u^h^f)+p[12]+3873151461&4294967295,g=u+(l<<11&4294967295|l>>>21),l=f+(g^u^h)+p[15]+530742520&4294967295,f=g+(l<<16&4294967295|l>>>16),l=h+(f^g^u)+p[2]+3299628645&4294967295,h=f+(l<<23&4294967295|l>>>9),l=u+(f^(h|~g))+p[0]+4096336452&4294967295,u=h+(l<<6&4294967295|l>>>26),l=g+(h^(u|~f))+p[7]+1126891415&4294967295,g=u+(l<<10&4294967295|l>>>22),l=f+(u^(g|~h))+p[14]+2878612391&4294967295,f=g+(l<<15&4294967295|l>>>17),l=h+(g^(f|~u))+p[5]+4237533241&4294967295,h=f+(l<<21&4294967295|l>>>11),l=u+(f^(h|~g))+p[12]+1700485571&4294967295,u=h+(l<<6&4294967295|l>>>26),l=g+(h^(u|~f))+p[3]+2399980690&4294967295,g=u+(l<<10&4294967295|l>>>22),l=f+(u^(g|~h))+p[10]+4293915773&4294967295,f=g+(l<<15&4294967295|l>>>17),l=h+(g^(f|~u))+p[1]+2240044497&4294967295,h=f+(l<<21&4294967295|l>>>11),l=u+(f^(h|~g))+p[8]+1873313359&4294967295,u=h+(l<<6&4294967295|l>>>26),l=g+(h^(u|~f))+p[15]+4264355552&4294967295,g=u+(l<<10&4294967295|l>>>22),l=f+(u^(g|~h))+p[6]+2734768916&4294967295,f=g+(l<<15&4294967295|l>>>17),l=h+(g^(f|~u))+p[13]+1309151649&4294967295,h=f+(l<<21&4294967295|l>>>11),l=u+(f^(h|~g))+p[4]+4149444226&4294967295,u=h+(l<<6&4294967295|l>>>26),l=g+(h^(u|~f))+p[11]+3174756917&4294967295,g=u+(l<<10&4294967295|l>>>22),l=f+(u^(g|~h))+p[2]+718787259&4294967295,f=g+(l<<15&4294967295|l>>>17),l=h+(g^(f|~u))+p[9]+3951481745&4294967295,d.g[0]=d.g[0]+u&4294967295,d.g[1]=d.g[1]+(f+(l<<21&4294967295|l>>>11))&4294967295,d.g[2]=d.g[2]+f&4294967295,d.g[3]=d.g[3]+g&4294967295}r.prototype.v=function(d,u){u===void 0&&(u=d.length);let h=u-this.blockSize,p=this.C,f=this.h,g=0;for(;g<u;){if(f==0)for(;g<=h;)i(this,d,g),g+=this.blockSize;if(typeof d=="string"){for(;g<u;)if(p[f++]=d.charCodeAt(g++),f==this.blockSize){i(this,p),f=0;break}}else for(;g<u;)if(p[f++]=d[g++],f==this.blockSize){i(this,p),f=0;break}}this.h=f,this.o+=u},r.prototype.A=function(){var d=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);d[0]=128;for(var u=1;u<d.length-8;++u)d[u]=0;u=this.o*8;for(var h=d.length-8;h<d.length;++h)d[h]=u&255,u/=256;for(this.v(d),d=Array(16),u=0,h=0;h<4;++h)for(let p=0;p<32;p+=8)d[u++]=this.g[h]>>>p&255;return d};function s(d,u){var h=a;return Object.prototype.hasOwnProperty.call(h,d)?h[d]:h[d]=u(d)}function o(d,u){this.h=u;let h=[],p=!0;for(let f=d.length-1;f>=0;f--){let g=d[f]|0;p&&g==u||(h[f]=g,p=!1)}this.g=h}var a={};function c(d){return-128<=d&&d<128?s(d,function(u){return new o([u|0],u<0?-1:0)}):new o([d|0],d<0?-1:0)}function m(d){if(isNaN(d)||!isFinite(d))return E;if(d<0)return k(m(-d));let u=[],h=1;for(let p=0;d>=h;p++)u[p]=d/h|0,h*=4294967296;return new o(u,0)}function _(d,u){if(d.length==0)throw Error("number format error: empty string");if(u=u||10,u<2||36<u)throw Error("radix out of range: "+u);if(d.charAt(0)=="-")return k(_(d.substring(1),u));if(d.indexOf("-")>=0)throw Error('number format error: interior "-" character');let h=m(Math.pow(u,8)),p=E;for(let g=0;g<d.length;g+=8){var f=Math.min(8,d.length-g);let l=parseInt(d.substring(g,g+f),u);f<8?(f=m(Math.pow(u,f)),p=p.j(f).add(m(l))):(p=p.j(h),p=p.add(m(l)))}return p}var E=c(0),T=c(1),W=c(16777216);n=o.prototype,n.m=function(){if(q(this))return-k(this).m();let d=0,u=1;for(let h=0;h<this.g.length;h++){let p=this.i(h);d+=(p>=0?p:4294967296+p)*u,u*=4294967296}return d},n.toString=function(d){if(d=d||10,d<2||36<d)throw Error("radix out of range: "+d);if(O(this))return"0";if(q(this))return"-"+k(this).toString(d);let u=m(Math.pow(d,6));var h=this;let p="";for(;;){let f=Gt(h,u).g;h=Ie(h,f.j(u));let g=((h.g.length>0?h.g[0]:h.h)>>>0).toString(d);if(h=f,O(h))return g+p;for(;g.length<6;)g="0"+g;p=g+p}},n.i=function(d){return d<0?0:d<this.g.length?this.g[d]:this.h};function O(d){if(d.h!=0)return!1;for(let u=0;u<d.g.length;u++)if(d.g[u]!=0)return!1;return!0}function q(d){return d.h==-1}n.l=function(d){return d=Ie(this,d),q(d)?-1:O(d)?0:1};function k(d){let u=d.g.length,h=[];for(let p=0;p<u;p++)h[p]=~d.g[p];return new o(h,~d.h).add(T)}n.abs=function(){return q(this)?k(this):this},n.add=function(d){let u=Math.max(this.g.length,d.g.length),h=[],p=0;for(let f=0;f<=u;f++){let g=p+(this.i(f)&65535)+(d.i(f)&65535),l=(g>>>16)+(this.i(f)>>>16)+(d.i(f)>>>16);p=l>>>16,g&=65535,l&=65535,h[f]=l<<16|g}return new o(h,h[h.length-1]&-2147483648?-1:0)};function Ie(d,u){return d.add(k(u))}n.j=function(d){if(O(this)||O(d))return E;if(q(this))return q(d)?k(this).j(k(d)):k(k(this).j(d));if(q(d))return k(this.j(k(d)));if(this.l(W)<0&&d.l(W)<0)return m(this.m()*d.m());let u=this.g.length+d.g.length,h=[];for(var p=0;p<2*u;p++)h[p]=0;for(p=0;p<this.g.length;p++)for(let f=0;f<d.g.length;f++){let g=this.i(p)>>>16,l=this.i(p)&65535,Re=d.i(f)>>>16,ns=d.i(f)&65535;h[2*p+2*f]+=l*ns,je(h,2*p+2*f),h[2*p+2*f+1]+=g*ns,je(h,2*p+2*f+1),h[2*p+2*f+1]+=l*Re,je(h,2*p+2*f+1),h[2*p+2*f+2]+=g*Re,je(h,2*p+2*f+2)}for(d=0;d<u;d++)h[d]=h[2*d+1]<<16|h[2*d];for(d=u;d<2*u;d++)h[d]=0;return new o(h,0)};function je(d,u){for(;(d[u]&65535)!=d[u];)d[u+1]+=d[u]>>>16,d[u]&=65535,u++}function dt(d,u){this.g=d,this.h=u}function Gt(d,u){if(O(u))throw Error("division by zero");if(O(d))return new dt(E,E);if(q(d))return u=Gt(k(d),u),new dt(k(u.g),k(u.h));if(q(u))return u=Gt(d,k(u)),new dt(k(u.g),u.h);if(d.g.length>30){if(q(d)||q(u))throw Error("slowDivide_ only works with positive integers.");for(var h=T,p=u;p.l(d)<=0;)h=ts(h),p=ts(p);var f=Be(h,1),g=Be(p,1);for(p=Be(p,2),h=Be(h,2);!O(p);){var l=g.add(p);l.l(d)<=0&&(f=f.add(h),g=l),p=Be(p,1),h=Be(h,1)}return u=Ie(d,f.j(u)),new dt(f,u)}for(f=E;d.l(u)>=0;){for(h=Math.max(1,Math.floor(d.m()/u.m())),p=Math.ceil(Math.log(h)/Math.LN2),p=p<=48?1:Math.pow(2,p-48),g=m(h),l=g.j(u);q(l)||l.l(d)>0;)h-=p,g=m(h),l=g.j(u);O(g)&&(g=T),f=f.add(g),d=Ie(d,l)}return new dt(f,d)}n.B=function(d){return Gt(this,d).h},n.and=function(d){let u=Math.max(this.g.length,d.g.length),h=[];for(let p=0;p<u;p++)h[p]=this.i(p)&d.i(p);return new o(h,this.h&d.h)},n.or=function(d){let u=Math.max(this.g.length,d.g.length),h=[];for(let p=0;p<u;p++)h[p]=this.i(p)|d.i(p);return new o(h,this.h|d.h)},n.xor=function(d){let u=Math.max(this.g.length,d.g.length),h=[];for(let p=0;p<u;p++)h[p]=this.i(p)^d.i(p);return new o(h,this.h^d.h)};function ts(d){let u=d.g.length+1,h=[];for(let p=0;p<u;p++)h[p]=d.i(p)<<1|d.i(p-1)>>>31;return new o(h,d.h)}function Be(d,u){let h=u>>5;u%=32;let p=d.g.length-h,f=[];for(let g=0;g<p;g++)f[g]=u>0?d.i(g+h)>>>u|d.i(g+h+1)<<32-u:d.i(g+h);return new o(f,d.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,nh=Qo.Md5=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=m,o.fromString=_,di=Qo.Integer=o}).apply(typeof Jo<"u"?Jo:typeof self<"u"?self:typeof window<"u"?window:{});function C(n,e,t,r){if(t==="a"&&!r)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?n!==e||!r:!e.has(n))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?r:t==="a"?r.call(n):r?r.value:e.get(n)}var F=class{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}};F.UNAUTHENTICATED=new F(null),F.GOOGLE_CREDENTIALS=new F("google-credentials-uid"),F.FIRST_PARTY=new F("first-party-uid"),F.MOCK_USER=new F("mock-user");var ht="13.1.0";function da(n){ht=n}var Ze=new Ee("@firebase/firestore");function Lt(n,...e){if(Ze.logLevel<=v.DEBUG){let t=e.map(Ki);Ze.debug(`Firestore (${ht}): ${n}`,...t)}}function dr(n,...e){if(Ze.logLevel<=v.ERROR){let t=e.map(Ki);Ze.error(`Firestore (${ht}): ${n}`,...t)}}function fa(n,...e){if(Ze.logLevel<=v.WARN){let t=e.map(Ki);Ze.warn(`Firestore (${ht}): ${n}`,...t)}}function Ki(n){if(typeof n=="string")return n;try{return function(t){return JSON.stringify(t)}(n)}catch{return n}}function P(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,pa(n,r,t)}function pa(n,e,t){let r=`FIRESTORE (${ht}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw dr(r),new Error(r)}function K(n,e,t,r){let i="Unexpected state";typeof t=="string"?i=t:r=t,n||pa(e,i,r)}function ma(n,e){return n}var I={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"},w=class extends H{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}};var Fn=class{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}},_i=class{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(F.UNAUTHENTICATED))}shutdown(){}},yi=class{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}},jn=class{constructor(e){this.auth=null,e.onInit(t=>{this.auth=t})}getToken(){return this.auth?this.auth.getToken().then(e=>e?(K(typeof e.accessToken=="string",42297,{Z:e}),new Fn(e.accessToken,new F(this.auth.getUid()))):null):Promise.resolve(null)}invalidateToken(){}start(e,t){}shutdown(){}},Ii=class{constructor(e,t,r){this.ee=e,this.te=t,this.re=r,this.type="FirstParty",this.user=F.FIRST_PARTY,this.ne=new Map}ie(){return this.re?this.re():null}get headers(){this.ne.set("X-Goog-AuthUser",this.ee);let e=this.ie();return e&&this.ne.set("Authorization",e),this.te&&this.ne.set("X-Goog-Iam-Authorization-Token",this.te),this.ne}},Ei=class{constructor(e,t,r){this.ee=e,this.te=t,this.re=r}getToken(){return Promise.resolve(new Ii(this.ee,this.te,this.re))}start(e,t){e.enqueueRetryable(()=>t(F.FIRST_PARTY))}shutdown(){}invalidateToken(){}},Bn=class{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}},qn=class{constructor(e,t){this.se=t,this.appCheck=null,this.oe=null,U(e)&&e.settings.appCheckToken&&(this.oe=e.settings.appCheckToken),t.onInit(r=>{this.appCheck=r})}getToken(){return this.oe?Promise.resolve(new Bn(this.oe)):this.appCheck?this.appCheck.getToken().then(e=>e?(K(typeof e.token=="string",3470,{tokenResult:e}),new Bn(e.token)):null):Promise.resolve(null)}invalidateToken(){}start(e,t){}shutdown(){}};var wi=class{constructor(e,t,r,i,s,o,a,c,m,_,E,T,W){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=c,this.useFetchStreams=m,this.isUsingEmulator=_,this.apiKey=E,this._customHeaders=T,this.grpcFlowControlWindow=W}},Ti="(default)",$n=class n{constructor(e,t){this.projectId=e,this.database=t||Ti}static empty(){return new n("","")}get isDefaultDatabase(){return this.database===Ti}isEqual(e){return e instanceof n&&e.projectId===this.projectId&&e.database===this.database}};function ga(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new w(I.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new $n(n.options.projectId,e)}function rh(n){let e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}var bi=class{static newId(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516),r="";for(;r.length<20;){let i=rh(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<t&&(r+=e.charAt(i[s]%62))}return r}};function he(n,e){return n<e?-1:n>e?1:0}function Yi(n,e){let t=Math.min(n.length,e.length);for(let r=0;r<t;r++){let i=n.charAt(r),s=e.charAt(r);if(i!==s)return fi(i)===fi(s)?he(i,s):fi(i)?1:-1}return he(n.length,e.length)}var ih=55296,sh=57343;function fi(n){let e=n.charCodeAt(0);return e>=ih&&e<=sh}function _a(n,e,t){return n.length===e.length&&n.every((r,i)=>t(r,e[i]))}var Xo="__name__",Wn=class n{constructor(e,t,r){t===void 0?t=0:t>e.length&&P(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&P(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return n.comparator(this,e)===0}child(e){let t=this.segments.slice(this.offset,this.limit());return e instanceof n?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){let r=Math.min(e.length,t.length);for(let i=0;i<r;i++){let s=n.compareSegments(e.get(i),t.get(i));if(s!==0)return s}return he(e.length,t.length)}static compareSegments(e,t){let r=n.isNumericId(e),i=n.isNumericId(t);return r&&!i?-1:!r&&i?1:r&&i?n.extractNumericId(e).compare(n.extractNumericId(t)):Yi(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return di.fromString(e.substring(4,e.length-2))}},j=class n extends Wn{construct(e,t,r){return new n(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toStringWithLeadingSlash(){return`/${this.canonicalString()}`}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){let t=[];for(let r of e){if(r.indexOf("//")>=0)throw new w(I.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(i=>i.length>0))}return new n(t)}static emptyPath(){return new n([])}},oh=/^[_a-zA-Z][_a-zA-Z0-9]*$/,xt=class Je extends Wn{construct(e,t,r){return new Je(e,t,r)}static isValidIdentifier(e){return oh.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Je.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Xo}static keyField(){return new Je([Xo])}static fromServerFormat(e){let t=[],r="",i=0,s=()=>{if(r.length===0)throw new w(I.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""},o=!1;for(;i<e.length;){let a=e[i];if(a==="\\"){if(i+1===e.length)throw new w(I.INVALID_ARGUMENT,"Path has trailing escape character: "+e);let c=e[i+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new w(I.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=c,i+=2}else a==="`"?(o=!o,i++):a!=="."||o?(r+=a,i++):(s(),i++)}if(s(),o)throw new w(I.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Je(t)}static emptyPath(){return new Je([])}};var de=class n{constructor(e){this.path=e}static fromPath(e){return new n(j.fromString(e))}static fromName(e){return new n(j.fromString(e).popFirst(5))}static empty(){return new n(j.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&j.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return j.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new n(new j(e.slice()))}};function ah(n,e,t){if(!t)throw new w(I.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function Zo(n){if(!de.isDocumentKey(n))throw new w(I.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function ya(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Ji(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{let e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":P(12329,{type:typeof n})}function fr(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new w(I.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let t=Ji(n);throw new w(I.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}function Ia(n){let e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}var Vn=null;function ch(){return Vn===null?Vn=function(){return 268435456+Math.round(2147483648*Math.random())}():Vn++,"0x"+Vn.toString(16)}function Hn(n){return n===0&&1/n==-1/0}var pi="RestConnection",uh={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"},vi=class{get ae(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;let t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.ue=t+"://"+e.host,this._e=`projects/${r}/databases/${i}`,this.ce=this.databaseId.database===Ti?`project_id=${r}`:`project_id=${r}&database_id=${i}`}le(e,t,r,i,s){let o=ch(),a=this.fe(e,t.toUriEncodedString());Lt(pi,`Sending RPC '${e}' ${o}:`,a,r);let c={"google-cloud-resource-prefix":this._e,"x-goog-request-params":this.ce};this.he(c,i,s);let{host:m}=new URL(a),_=Ne(m);return this.de(e,a,c,r,_).then(E=>(Lt(pi,`Received RPC '${e}' ${o}: `,E),E),E=>{throw fa(pi,`RPC '${e}' ${o} failed with error: `,E,"url: ",a,"request:",r),E})}me(e,t,r,i,s,o){return this.le(e,t,r,i,s)}he(e,t,r){if(e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+ht}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((i,s)=>e[s]=i),r&&r.headers.forEach((i,s)=>e[s]=i),this.databaseInfo._customHeaders)for(let i of Object.keys(this.databaseInfo._customHeaders))e[i]=this.databaseInfo._customHeaders[i]}fe(e,t){let r=uh[e],i=`${this.ue}/v1/${t}:${r}`;return this.databaseInfo.apiKey&&(i=`${i}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),i}terminate(){}};var ea,b,D,Qe,Ai,Ln,xn,Dt;function ta(n){if(n===void 0)return dr("RPC_ERROR","HTTP error has no status"),I.UNKNOWN;switch(n){case 200:return I.OK;case 400:return I.FAILED_PRECONDITION;case 401:return I.UNAUTHENTICATED;case 403:return I.PERMISSION_DENIED;case 404:return I.NOT_FOUND;case 409:return I.ABORTED;case 416:return I.OUT_OF_RANGE;case 429:return I.RESOURCE_EXHAUSTED;case 499:return I.CANCELLED;case 500:return I.UNKNOWN;case 501:return I.UNIMPLEMENTED;case 503:return I.UNAVAILABLE;case 504:return I.DEADLINE_EXCEEDED;default:return n>=200&&n<300?I.OK:n>=400&&n<500?I.FAILED_PRECONDITION:n>=500&&n<600?I.INTERNAL:I.UNKNOWN}}(b=ea||(ea={}))[b.OK=0]="OK",b[b.CANCELLED=1]="CANCELLED",b[b.UNKNOWN=2]="UNKNOWN",b[b.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",b[b.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",b[b.NOT_FOUND=5]="NOT_FOUND",b[b.ALREADY_EXISTS=6]="ALREADY_EXISTS",b[b.PERMISSION_DENIED=7]="PERMISSION_DENIED",b[b.UNAUTHENTICATED=16]="UNAUTHENTICATED",b[b.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",b[b.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",b[b.ABORTED=10]="ABORTED",b[b.OUT_OF_RANGE=11]="OUT_OF_RANGE",b[b.UNIMPLEMENTED=12]="UNIMPLEMENTED",b[b.INTERNAL=13]="INTERNAL",b[b.UNAVAILABLE=14]="UNAVAILABLE",b[b.DATA_LOSS=15]="DATA_LOSS";var Si=class extends vi{Ee(e,t){throw new Error("Not supported by FetchConnection")}async de(e,t,r,i,s){let o=JSON.stringify(i),a;try{let c={method:"POST",headers:r,body:o};s&&(c.credentials="include"),a=await fetch(t,c)}catch(c){let m=c,_=m?.message,E=m?.cause?String(m.cause):void 0,T=(_&&E?`${_} (${E})`:_??E)??m?.statusText??String(c);throw new w(ta(m?.status),`Request failed with error: ${T}`)}if(!a.ok){let c=await a.json();Array.isArray(c)&&(c=c[0]);let m=c?.error?.message;throw new w(ta(a.status),`Request failed with error: ${m??a.statusText}`)}return a.json()}};var Ri=class extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}};var ne=class n{constructor(e){this.binaryString=e}static fromBase64String(e){let t=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new Ri("Invalid base64 string: "+s):s}}(e);return new n(t)}static fromUint8Array(e){let t=function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s}(e);return new n(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){let r=new Uint8Array(t.length);for(let i=0;i<t.length;i++)r[i]=t.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return he(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}};function Mt(n){let e=0;for(let t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function pr(n,e){for(let t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}ne.EMPTY_BYTE_STRING=new ne("");var R=class n{constructor(){this.exponent=0,this.Ve=0n,this.Te=0n,this.Ie=new Array(4).fill(0n),this.Ae=new Array(6).fill(0n),this.Re=new Array(6).fill(0n),this.Pe=new Array(6).fill(0n),this.pe=new Array(12).fill(0n)}static ye(e,t){let r=new n;return r.parse(e,t),r}parse(e,t){t+=e.length-1,this.exponent=0,this.Ve=0n,this.Te=0n;let r=this.Pe,i=this.be(e,r);if(i==0&&this.isEmpty(r)||(t+=i)<n.we)return;if(t>n.ge)return void(this.exponent=Number(n.Fe));let s=this.ve(t,r);this.xe(t,s,r)}be(e,t){for(let s=0;s<6;s++)t[s]=0n;let r=0;for(;r<e.length&&e[r]==0;)r+=1;if(r==e.length)return 0;let i=-r;if(e.length-r>n.De){let s=e[n.De]>=5,o=new Array(n.De).fill(0);for(let a=0;a<n.De;a++)o[a]=e[a+r];s&&(i+=this.Ne(o)),e=o,r=0}for(let s=e.length-1;s>=r;s--)t[0]|=BigInt(e[s])<<32n,this.Se(t);return i}Se(e){let t=e.length;for(let r=0;r<t;r++){let i=e[r]%10n;e[r]=e[r]/10n,r+1<t&&(e[r+1]+=i<<32n)}}isEmpty(e){for(let t=0;t<e.length;t++)if(e[t]!=0n)return!1;return!0}Ne(e){for(let t=e.length-1;t>=0;t--){if(e[t]!=9)return e[t]=e[t]+1,0;e[t]=0}return e[0]=1,1}ve(e,t){let r=t[0]<<31n|t[1]>>1n,i=Number(r)/n.Ce;return Math.floor(Number(e)*n.Be+this.log2(i))}log2(e){return n.Qe*Math.log(e)}xe(e,t,r){let i=this.Ie;this.Oe(-t,i);let s=this.pe;this.Me(r,i,s),this.qe(s),BigInt(i[0])!=BigInt(-e)&&this.qe(s),t+=this.Le(s),(t+=n.Ue)<=0||(t+=this.$e(s),BigInt(t)>=n.Fe?this.exponent=Number(n.Fe):(this.exponent=Number(t),this.Ve=(s[0]<<32n)+s[1]&0xffffffffffffffffn,this.Te=(s[2]<<32n)+s[3]&0xffffffffffffffffn))}Oe(e,t){if(e==0)return void this.ke(n.je[0],t);let r=n.je;e<0&&(e=-e,r=n.Ke);let i=n.ze,s=32,o=!0;for(;e>0;)e>=i&&(o?(this.ke(r[s],t),o=!1):this.We(t,r[s],t),e-=i),s-=1,i*=.5}ke(e,t){for(let r=0;r<t.length;r++)t[r]=e[r]}We(e,t,r){this.Ge(e,t,this.pe);let i=this.Je(this.pe);this.He(this.pe,r),r[0]=e[0]+t[0]+BigInt(i)}Ge(e,t,r){for(let i=0;i<r.length;i++)r[i]=0n;this.Ye(e,this.Ae),this.Ye(t,this.Re);for(let i=5;i>=0;i--)for(let s=5;s>=0;s--){let o=this.Ae[i]*this.Re[s];r[s+i+1]=r[s+i+1]+(o&n.Xe)&0xffffffffffffffffn,r[s+i]=r[s+i]+(o>>32n)&0xffffffffffffffffn}for(let i=11;i>=1;i--)r[i-1]=r[i-1]+(r[i]>>32n)&0xffffffffffffffffn,r[i]&=n.Xe}Je(e){let t=0;for(;this.Ze(e);)this.qe(e),t-=1;return t}Ze(e){if(e[0]<0x19999999n)return!0;if(e[0]>0x19999999n)return!1;for(let t=1;t<e.length;t++){if(e[t]<0x99999999n)return!0;if(e[t]>0x99999999n)return!1}return!1}Me(e,t,r){for(let o=0;o<r.length;o++)r[o]=0n;let i=this.Re;this.Ye(t,i);let s=e.length;for(let o=s-1;o>=0;o--)for(let a=s-1;a>=0;a--){let c=e[o]*i[a];r[a+o+1]=r[a+o+1]+(c&n.Xe)&0xffffffffffffffffn,r[a+o]=r[a+o]+(c>>32n)&0xffffffffffffffffn}for(let o=11;o>=1;o--)r[o-1]=r[o-1]+(r[o]>>32n)&0xffffffffffffffffn,r[o]&=n.Xe}qe(e){let t=e.length-1;e[0]&=n.Xe,e[t]*=10n;for(let r=t-1;r>=0;r--)e[r]=10n*e[r]+(e[r+1]>>32n)&0xffffffffffffffffn,e[r+1]&=n.Xe}Le(e){let t=31-n.et(e[0]);return t!=0&&this.tt(e,t),t}$e(e){return this.rt(e,5,100n),this.rt(e,4,0x80000000n),(e[0]&n.nt<<1n)!=0n?(this.tt(e,1),1):0}He(e,t){t[1]=(e[0]<<32n)+e[1],t[2]=(e[2]<<32n)+e[3],t[3]=(e[4]<<32n)+e[5]}Ye(e,t){t[0]=e[1]>>32n,t[1]=e[1]&n.Xe,t[2]=e[2]>>32n,t[3]=e[2]&n.Xe,t[4]=e[3]>>32n,t[5]=e[3]&n.Xe}tt(e,t){let r=e.length-1,i=BigInt(32-Math.abs(t));if(t>0){let s=BigInt(t);for(let o=r+1-1;o>=1;o--)e[o]=e[o]>>s|e[o-1]<<i&n.Xe;e[0]=e[0]>>s}else if(t<0){let s=BigInt(-t);e[0]=0xffffffffffffffffn&(e[0]<<s|e[1]>>i);for(let o=1;o<r;o++)e[o]=0xffffffffffffffffn&(e[o]<<s&n.Xe|e[o+1]>>i);e[r]=e[r]<<s&n.Xe}}rt(e,t,r){let i=t;e[i]=e[i]+r&0xffffffffffffffffn;for(let s=i+1-1;s>=1&&(e[s]&n.nt)!=0n;s--)e[s]&=n.Xe,e[s-1]+=1n}static et(e){let t=Number(e>>32n);return t==0?32+Math.clz32(Number(BigInt.asUintN(32,e))):Math.clz32(t)}};R.De=59,R.ge=646456993,R.we=-646457032,R.Ce=0xccccccccccccd00,R.it=0x8000000000000000n,R.ze=2147483648,R.Xe=0x00000000ffffffffn,R.nt=0xffffffff00000000n,R.Be=Math.log(10)/Math.log(2),R.Qe=1/Math.log(2),R.Ue=2147483647,R.Fe=0xffffffffn,R.je=[[1n,0x1999999999999999n,0x9999999999999999n,0x999999999999999an],[1n,0x3333333333333333n,0x3333333333333333n,0x3333333333333334n],[1n,0x6666666666666666n,0x6666666666666666n,0x6666666666666667n],[2n,0x28f5c28f5c28f5c2n,0x8f5c28f5c28f5c28n,0xf5c28f5c28f5c290n],[3n,0x4189374bc6a7ef9dn,0xb22d0e5604189374n,0xbc6a7ef9db22d0e6n],[5n,0xa7c5ac471b478423n,0x0fcf80dc33721d53n,0xcddd6e04c0592104n],[10n,0x6df37f675ef6eadfn,0x5ab9a2072d44268dn,0x97df837e6748956en],[20n,0x2f394219248446ban,0xa23d2ec729af3d61n,0x0607aa0167dd94cbn],[39n,0x571cbec554b60dbbn,0xd5f64baf0506840dn,0x451db70d5904029bn],[78n,0x1da48ce468e7c702n,0x6520247d3556476dn,0x1469caf6db224cfan],[155n,0x2252f0e5b39769dcn,0x9ae2eea30ca3ade0n,0xeeaa3c08dfe84e30n],[309n,0x2e055c9a3f6ba793n,0x16583a816eb60a59n,0x22c4b0826cf1ebf7n],[617n,0x52bb45e9cf23f17fn,0x7688c07606e50364n,0xb34479aa9d449a57n],[1234n,0x1abc81c8ff5f846cn,0x8f5e3c9853e38c97n,0x45060097f3bf9296n],[2467n,0x1bec53b510daa7b4n,0x48369ed77dbb0eb1n,0x3b05587b2187b41en],[4933n,0x1e75063a5ba91326n,0x8abfb8e460016ae3n,0x28008702d29e8a3cn],[9865n,0x243c5d8bb5c5fa55n,0x40c6d248c5881915n,0x4c0fd99fd5befc22n],[19729n,0x334a5570c3f4ef3cn,0xa13c36c43f979c90n,0xda7ac473555fb7a8n],[39457n,0x66c304445dd98f3bn,0xa8c293a20e47a41bn,0x4c5b03dc12604964n],[78914n,0x293ffbf5fb028cc4n,0x89d3e5ff44238406n,0x369a339e1bfe8c9bn],[157827n,0x427792fbb68e5d20n,0x7b297cd9fc154b62n,0xf09142114aa9a20cn],[315653n,0xac92bc65ad5c08fcn,0x00beeb115a566c19n,0x4ba882d8a4622437n],[631306n,0x745581440f92e80en,0x4da822cf7f896f41n,0x509d598678164ecdn],[1262612n,0x34dd99b4c69523a5n,0x64bc2e8f0d8b1044n,0xb03b1c96da5dd349n],[2525223n,0x6d2bbea9d6d25a08n,0xa0a4606a88e96b70n,0x182063bbc2fe8520n],[5050446n,0x2e8e47d63bfdd6e3n,0x2b55fa8976eaa3e9n,0x1a6b9d3086412a73n],[10100891n,0x54aa68efa1d719dfn,0xd8505806612c5c8fn,0xad068837fee8b43an],[20201782n,0x1c00464ccb7bae77n,0x9e3877784c77982cn,0xd94af3b61717404fn],[40403563n,0x1ea099c8be2b6cd0n,0x8bfb6d539fa50466n,0x6d3bc37e69a84218n],[80807125n,0x24a457f466ce8d18n,0xf2c8f3b81bc6bb59n,0xa78c757692e02d49n],[161614249n,0x347256677aba6b53n,0x3fbf90d30611a67cn,0x1e039d87e0bdb32bn],[323228497n,0x6b727daf0fd3432an,0x71f71121f9e4200fn,0x8fcd9942d486c10cn],[646456994n,0x2d18e84484d91f78n,0x4079bfe7829dec6fn,0x21551643e365abc6n]],R.Ke=[[1n,0x1999999999999999n,0x9999999999999999n,0x999999999999999an],[0n,0x8000000000000000n,0x0000000000000000n,0x0000000000000000n],[0n,0x4000000000000000n,0x0000000000000000n,0x0000000000000001n],[-1n,0xa000000000000000n,0x0000000000000000n,0x0000000000000000n],[-2n,0x6400000000000000n,0x0000000000000000n,0x0000000000000000n],[-4n,0x2710000000000000n,0x0000000000000000n,0x0000000000000001n],[-9n,0x3b9aca0000000000n,0x0000000000000000n,0x0000000000000001n],[-19n,0x8ac7230489e80000n,0x0000000000000000n,0x0000000000000000n],[-38n,0x4b3b4ca85a86c47an,0x098a224000000000n,0x0000000000000001n],[-77n,0xdd15fe86affad912n,0x49ef0eb713f39eben,0xaa987b6e6fd2a002n],[-154n,0xbeeefb584aff8603n,0xaafb550ffacfd8fan,0x5ca47e4f88d45371n],[-308n,0x8e679c2f5e44ff8fn,0x570f09eaa7ea7648n,0x5961db50c6d2b888n],[-616n,0x4f371b3399fc2ab0n,0x8170041c9feb05aan,0xc7c343447c75bcf6n],[-1233n,0xf51e928179013fd3n,0xde4bd12cde4d985cn,0x4a573ca6f94bff14n],[-2466n,0xeab388127bccaff7n,0x1667639142b9fbaen,0x775ec9995e1039fbn],[-4932n,0xd72cb2a95c7ef6ccn,0xe81bf1e825ba7515n,0xc2feb521d6cb5dcdn],[-9864n,0xb4dc1be6604502dcn,0xd491079b8eef6535n,0x578d3965d24de84dn],[-19728n,0x7fc6447bee60ea43n,0x2548da5c8b125b27n,0x5f42d1142f41d349n],[-39456n,0x3fc65180f88af8fbn,0x6a6915f383349413n,0x063c3708b6ceb291n],[-78913n,0x9ee0197c8dcd55bfn,0x2b2b9b942c38f4a2n,0x0f8ba634e9c706aen],[-157826n,0x629963a25b8b2d79n,0xd00b9d2286f70876n,0xe97004700c3644fcn],[-315652n,0x25f9cc308ceef4f3n,0x40f19543911a4546n,0xa2cd389452cfc366n],[-631305n,0x385597b0d47e76b8n,0x1b9f67e103bf2329n,0xc3119848595985f7n],[-1262611n,0x7bf795d276c12f66n,0x66a61d62a446659an,0xa1a4d73bebf093d5n],[-2525222n,0x3c07d96ab1ed7799n,0xcb7355c22cc05ac0n,0x4ffc0ab73b1f6a49n],[-5050445n,0x8cc4cd8c3edefb9an,0x6c8ff86a90a97e0cn,0x166cfddbf98b71bfn],[-10100890n,0x4d67d81cc88e1228n,0x1d7cfb06666b79b3n,0x7b916728aaa4e70dn],[-20201781n,0xea0c55494e7a552dn,0xb88cb9484bb86c61n,0x8d44893c610bb7dfn],[-40403562n,0xd5fa8c821ec0c24an,0xa80e46e764e0f8b0n,0xa7276bfa432fac7en],[-80807124n,0xb2dae307426f6791n,0xc970b82f58b12918n,0x0472592f7f39190en],[-161614248n,0x7cf51edd8a15f1c9n,0x656dab3498f8e697n,0x12daa2a80e53c807n],[-323228496n,0x3cfe609ab5883c50n,0xbec8b5d22b198871n,0xe18477703b4622b4n],[-646456993n,0x9152447b9d7cda9an,0x3b4d3f6110d77aadn,0xfa81bad1c394adb4n]];var A=class n{constructor(e,t,r,i){this.negative=e,this.st=t,this.Ve=r,this.Te=i}exponent(){return this.st-R.Ue}ot(){return this.st===0&&this.Ve===0n&&this.Te===0n}ut(){return this.st===C(n,D,"f",Qe)&&this.Ve===0n&&this.Te===0n}isNaN(){return this.st===C(n,D,"f",Qe)&&!(this.Ve===0n&&this.Te===0n)}compareTo(e){if(this.isNaN())return e.isNaN()?0:1;if(e.isNaN())return-1;let t,r;if(this.negative){if(!e.negative)return-1;t=1,r=-1}else{if(e.negative)return 1;t=-1,r=1}return this.st<e.st?t:this.st>e.st?r:this.Ve<e.Ve?t:this.Ve>e.Ve?r:this.Te<e.Te?t:this.Te>e.Te?r:0}debug(){return(this.negative?"+":"-")+C(n,D,"m",Ai).call(n,this.Ve)+C(n,D,"m",Ai).call(n,this.Te)+"*2^"+this.exponent()}static fromNumber(e){if(isNaN(e))return n.NaN;if(!isFinite(e))return e<0?n._t:n.ct;if(e===0)return Math.sign(1/e)>0?n.lt:n.ft;let t=new DataView(new ArrayBuffer(8));t.setFloat64(0,e);let r=t.getBigUint64(0),i=BigInt.asUintN(64,r<<12n),s=2047&Number(r>>52n);if(s===0){let o=R.et(i);i=o<63?i<<BigInt(o+1):0n,s=-o}return new n(e<0,C(n,D,"m",Dt).call(n,s-1023),i,0n)}static fromString(e){if(e==="NaN")return n.NaN;if(e==="-Infinity")return n._t;if(e==="Infinity"||e==="+Infinity")return n.ct;let t=new Array(e.length).fill(0),r=0,i=0,s=0,o=!1;for(e[r]==="-"?(o=!0,r++):e[r]==="+"&&r++;C(n,D,"m",Ln).call(n,e,r);)t[i++]=C(n,D,"m",xn).call(n,e,r++);if(e[r]==="."){let c=++r;for(;C(n,D,"m",Ln).call(n,e,r);)t[i++]=C(n,D,"m",xn).call(n,e,r++);s=c-r}if(e[r]==="e"||e[r]==="E"){let c=0;r++;let m=1;e[r]==="-"?(m=-1,r++):e[r]==="+"&&r++;let _=r;for(;C(n,D,"m",Ln).call(n,e,r);)if(c=10*c+C(n,D,"m",xn).call(n,e,r++),r-_>9)throw new Error("Exponent too large "+e);if(r===_)throw new Error("Invalid number "+e);s+=c*m}if(i===0||r!==e.length)throw new Error("Invalid number "+e);let a=R.ye(t.slice(0,i),s);return new n(o,a.exponent,a.Ve,a.Te)}};D=A,Ai=function(e){return e.toString(16).padStart(16,"0")},Ln=function(e,t){let r=e.codePointAt(t);return r!==void 0&&r>=48&&r<=57},xn=function(e,t){return e.codePointAt(t)-48},Dt=function(e){return e+R.Ue},Qe={value:Number(R.Fe)},A.lt=new A(!1,0,0n,0n),A.ft=new A(!0,0,0n,0n),A.NaN=new A(!1,C(A,D,"f",Qe),1n<<63n,0n),A._t=new A(!0,C(A,D,"f",Qe),0n,0n),A.ct=new A(!1,C(A,D,"f",Qe),0n,0n),new A(!0,C(A,D,"m",Dt).call(A,63),0n,0n),new A(!1,C(A,D,"m",Dt).call(A,0),0n,0n),new A(!0,C(A,D,"m",Dt).call(A,0),0n,0n);var lh=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Ut(n){if(K(!!n,39018),typeof n=="string"){let e=0,t=lh.exec(n);if(K(!!t,46558,{timestamp:n}),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}let r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:G(n.seconds),nanos:G(n.nanos)}}function G(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function zn(n){return typeof n=="string"?ne.fromBase64String(n):ne.fromUint8Array(n)}function Y(n,e){let t={typeString:n};return e&&(t.value=e),t}function Ht(n,e){if(!ya(n))throw new w(I.INVALID_ARGUMENT,"JSON must be an object");let t;for(let r in e)if(e[r]){let i=e[r].typeString,s="value"in e[r]?{value:e[r].value}:void 0,o=e[r].optional;if(!(r in n)){if(o)continue;t=`JSON missing required field: '${r}'`;break}let a=n[r];if(i&&typeof a!==i){t=`JSON field '${r}' must be a ${i}.`;break}if(s!==void 0&&a!==s.value){t=`Expected '${r}' field to equal '${s.value}'`;break}}if(t)throw new w(I.INVALID_ARGUMENT,t);return!0}var na=-62135596800,ra=1e6,x=class n{static now(){return n.fromMillis(Date.now())}static fromDate(e){return n.fromMillis(e.getTime())}static fromMillis(e){let t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*ra);return new n(t,r)}static fromInstant(e){if(!e||typeof e.ht!="bigint")throw new w(I.INVALID_ARGUMENT,"Invalid Temporal.Instant object provided.");return n._fromEpochNanoseconds(e.ht)}static _fromEpochNanoseconds(e){let t,r;if(e>=0n)t=Number(e/1000000000n),r=Number(e%1000000000n);else{let i=e%1000000000n;i===0n?(t=Number(e/1000000000n),r=0):(t=Number(e/1000000000n-1n),r=Number(i+1000000000n))}return new n(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new w(I.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new w(I.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<na)throw new w(I.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new w(I.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/ra}toInstant(){if(typeof Temporal>"u"||!Temporal.Instant)throw new w(I.FAILED_PRECONDITION,"The Temporal object is not available in the current environment.");let e=1000000000n*BigInt(this.seconds)+BigInt(this.nanoseconds);return Temporal.Instant.__PRIVATE_fromEpochNanoseconds(e)}_compareTo(e){return this.seconds===e.seconds?he(this.nanoseconds,e.nanoseconds):he(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:n._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Ht(e,n._jsonSchema))return new n(e.seconds,e.nanoseconds)}valueOf(){let e=this.seconds-na;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}};x._jsonSchemaVersion="firestore/timestamp/1.0",x._jsonSchema={type:Y("string",x._jsonSchemaVersion),seconds:Y("number"),nanoseconds:Y("number")};function hh(n){return(n?.mapValue?.fields||{}).__type__?.stringValue==="server_timestamp"}function Ea(n){let e=n.mapValue.fields.__previous_value__;return hh(e)?Ea(e):e}function Ni(n){let e=Ut(n.mapValue.fields.__local_write_time__.timestampValue);return new x(e.seconds,e.nanos)}var wa="__type__",Ta="__vector__",ba="value",dh="server_timestamp",va="__min__",Qi="__max__",Se="__regex__",Gn="pattern",Kn="options",Ft="__oid__",zt="__int__",et="__decimal128__",Me="__request_timestamp__",Yn="seconds",Jn="increment",mr="__binary__";var S,X;(X=S||(S={})).dt="regexValue",X.Et="bsonObjectIdValue",X.Vt="int32Value",X.Tt="decimal128Value",X.It="bsonTimestampValue",X.At="bsonBinaryValue",X.Rt="minKeyValue",X.Pt="maxKeyValue",X.yt="maxValue",X.bt="vectorValue",X.wt="serverTimestampValue",X.gt="regularMapValue";var ia={[Ta]:S.bt,[Qi]:S.yt,[dh]:S.wt},Aa={[Se]:S.dt,[Ft]:S.Et,[zt]:S.Vt,[et]:S.Tt,[Me]:S.It,[mr]:S.At,[va]:S.Rt,[Qi]:S.Pt};function Pi(n){if("nullValue"in n)return 0;if("booleanValue"in n)return 2;if("integerValue"in n||"doubleValue"in n)return 3;if("timestampValue"in n)return 4;if("stringValue"in n)return 7;if("bytesValue"in n)return 8;if("referenceValue"in n)return 9;if("geoPointValue"in n)return 11;if("arrayValue"in n)return 13;if(!("mapValue"in n))return P(28295,{value:n});switch(function(r){if(!r.mapValue?.fields)return S.gt;let i=r.mapValue.fields,s=i[wa]?.stringValue;if(s&&ia[s])return ia[s];if(Mt(i)===1){let o=Object.keys(i);return Aa[o[0]]??S.gt}return S.gt}(n)){case S.wt:return 6;case S.yt:return 9007199254740991;case S.bt:return 14;case S.dt:return 12;case S.Et:return 10;case S.Vt:case S.Tt:return 3;case S.It:return 5;case S.At:return 8;case S.Rt:return 1;case S.Pt:return 16;default:return 15}}function ki(n,e,t){if(n===e)return!0;let r=Pi(n);if(r!==Pi(e))return!1;switch(r){case 0:case 9007199254740991:case 16:case 1:return!0;case 2:return n.booleanValue===e.booleanValue;case 6:return Ni(n).isEqual(Ni(e));case 4:return function(s,o){if(typeof s.timestampValue=="string"&&typeof o.timestampValue=="string"&&s.timestampValue.length===o.timestampValue.length)return s.timestampValue===o.timestampValue;let a=Ut(s.timestampValue),c=Ut(o.timestampValue);return a.seconds===c.seconds&&a.nanos===c.nanos}(n,e);case 7:return n.stringValue===e.stringValue;case 8:return function(s,o){return mh(s,o)===0}(n,e);case 9:return n.referenceValue===e.referenceValue;case 11:return function(s,o){return G(s.geoPointValue.latitude)===G(o.geoPointValue.latitude)&&G(s.geoPointValue.longitude)===G(o.geoPointValue.longitude)}(n,e);case 3:return function(s,o,a){if(tt(s)&&tt(o))return Sa(s,o)===0;if("integerValue"in s&&"integerValue"in o||Qn(s)&&Qn(o))return jt(s)===jt(o);let c,m;return!("doubleValue"in s)||!("doubleValue"in o)?!1:(c=G(s.doubleValue),m=G(o.doubleValue),c===m?Hn(c)===Hn(m):!!(a===void 0||a.vt)&&isNaN(c)&&isNaN(m))}(n,e,t);case 13:return _a(n.arrayValue.values||[],e.arrayValue.values||[],(i,s)=>ki(i,s,t));case 14:case 15:return function(s,o,a){let c=s.mapValue.fields||{},m=o.mapValue.fields||{};if(Mt(c)!==Mt(m))return!1;for(let _ in c)if(c.hasOwnProperty(_)&&(m[_]===void 0||!ki(c[_],m[_],a)))return!1;return!0}(n,e,t);case 5:return ph(n,e)===0;case 12:return gh(n,e)===0;case 10:return _h(n,e)===0;default:return P(52216,{left:n})}}function jt(n){let e;return e=Qn(n)?n.mapValue.fields[zt].integerValue:n.integerValue||n.doubleValue,G(e)}function fh(n){return n.mapValue.fields[et].stringValue}function sa(n,e){if(tt(n)||tt(e))return Sa(n,e);let t=jt(n),r=jt(e);return isNaN(t)?isNaN(r)?0:-1:isNaN(r)?1:he(t,r)}function Sa(n,e){let t=oa(n),r=oa(e);return t.ot()&&r.ot()?0:t.isNaN()?r.isNaN()?0:-1:r.isNaN()?1:t.compareTo(r)}function oa(n){return tt(n)?A.fromString(fh(n)):A.fromNumber(jt(n))}function ph(n,e){let t=n.mapValue.fields?.[Me].mapValue?.fields?.[Yn],r=e.mapValue.fields?.[Me].mapValue?.fields?.[Yn],i=n.mapValue.fields?.[Me].mapValue?.fields?.[Jn],s=e.mapValue.fields?.[Me].mapValue?.fields?.[Jn],o=sa(t,r);return o!==0?o:sa(i,s)}function aa(n){if("bytesValue"in n)return{subtype:0,bytes:zn(n.bytesValue)};let e=n.mapValue?.fields,t=e?.[mr],r=t?.bytesValue;if(!r)throw new Error("Received incorrect value for BsonBinaryData");let i=zn(r).toUint8Array();if(i.length===0)throw new Error("Received empty bytesValue for BsonBinaryData");let s=i[0],o=i.slice(1);return{subtype:s,bytes:ne.fromUint8Array(o)}}function mh(n,e){let t=aa(n),r=aa(e);return t.subtype!==r.subtype?t.subtype<r.subtype?-1:1:t.bytes.compareTo(r.bytes)}function gh(n,e){let t=n.mapValue.fields,r=t?.[Se]?.mapValue?.fields?.[Gn]?.stringValue??"",i=t?.[Se]?.mapValue?.fields?.[Kn]?.stringValue??"",s=e.mapValue.fields,o=s?.[Se]?.mapValue?.fields?.[Gn]?.stringValue??"",a=s?.[Se]?.mapValue?.fields?.[Kn]?.stringValue??"",c=Yi(r,o);return c!==0?c:he(i,a)}function _h(n,e){return Yi(n.mapValue.fields?.[Ft]?.stringValue??"",e.mapValue.fields?.[Ft]?.stringValue??"")}function tt(n){if(!n.mapValue?.fields)return!1;let e=n.mapValue.fields;return Mt(e)===1&&e[et]&&!!e[et].stringValue}function Qn(n){if(!n.mapValue?.fields)return!1;let e=n.mapValue.fields;return Mt(e)===1&&e[zt]?.integerValue!==void 0}function mi(n){return!!n&&"mapValue"in n}function Ot(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){let e={mapValue:{fields:{}}};return pr(n.mapValue.fields,(t,r)=>e.mapValue.fields[t]=Ot(r)),e}if(n.arrayValue){let e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Ot(n.arrayValue.values[t]);return e}return{...n}}new Set(Object.values(Aa));var $=class n{static fromTimestamp(e){return new n(e)}static min(){return new n(new x(0,0))}static max(){return new n(new x(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}};var Ci=class n{constructor(e,t){this.comparator=e,this.root=t||ce.EMPTY}insert(e,t){return new n(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,ce.BLACK,null,null))}remove(e){return new n(this.comparator,this.root.remove(e,this.comparator).copy(null,null,ce.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){let r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){let i=this.comparator(e,r.key);if(i===0)return t+r.left.size;i<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){let e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Xe(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Xe(this.root,e,this.comparator,!1)}getReverseIterator(){return new Xe(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Xe(this.root,e,this.comparator,!0)}},Xe=class{constructor(e,t,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?r(e.key,t):1,t&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop(),t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}},ce=class n{constructor(e,t,r,i,s){this.key=e,this.value=t,this.color=r??n.RED,this.left=i??n.EMPTY,this.right=s??n.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,i,s){return new n(e??this.key,t??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let i=this,s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,t,r),null):s===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return n.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return n.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){let e=this.copy(null,null,n.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,n.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){let e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw P(43730,{key:this.key,value:this.value});if(this.right.isRed())throw P(14113,{key:this.key,value:this.value});let e=this.left.check();if(e!==this.right.check())throw P(27949);return e+(this.isRed()?0:1)}};ce.EMPTY=null,ce.RED=!0,ce.BLACK=!1;ce.EMPTY=new class{constructor(){this.size=0}get key(){throw P(57766)}get value(){throw P(16141)}get color(){throw P(16727)}get left(){throw P(29726)}get right(){throw P(36894)}copy(e,t,r,i,s){return this}insert(e,t,r){return new ce(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};var Di=class n{constructor(e){this.comparator=e,this.data=new Ci(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){let r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){let i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){let t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Xn(this.data.getIterator())}getIteratorFrom(e){return new Xn(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(r=>{t=t.add(r)}),t}isEqual(e){if(!(e instanceof n)||this.size!==e.size)return!1;let t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){let i=t.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){let e=[];return this.forEach(t=>{e.push(t)}),e}toString(){let e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){let t=new n(this.comparator);return t.data=e,t}},Xn=class{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}};var Zn=class n{constructor(e){this.fields=e,e.sort(xt.comparator)}static empty(){return new n([])}unionWith(e){let t=new Di(xt.comparator);for(let r of this.fields)t=t.add(r);for(let r of e)t=t.add(r);return new n(t.toArray())}covers(e){for(let t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return _a(this.fields,e.fields,(t,r)=>t.isEqual(r))}};var ae=class n{constructor(e){this.value=e}static empty(){return new n({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!mi(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Ot(t)}setAll(e){let t=xt.emptyPath(),r={},i=[];e.forEach((o,a)=>{if(!t.isImmediateParentOf(a)){let c=this.getFieldsMap(t);this.applyChanges(c,r,i),r={},i=[],t=a.popLast()}o?r[a.lastSegment()]=Ot(o):i.push(a.lastSegment())});let s=this.getFieldsMap(t);this.applyChanges(s,r,i)}delete(e){let t=this.field(e.popLast());mi(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return ki(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=t.mapValue.fields[e.get(r)];mi(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,r){pr(t,(i,s)=>e[i]=s);for(let i of r)delete e[i]}clone(){return new n(Ot(this.value))}};var er=class n{constructor(e,t,r,i,s,o,a){this.key=e,this.documentType=t,this.version=r,this.readTime=i,this.createTime=s,this.data=o,this.documentState=a}static newInvalidDocument(e){return new n(e,0,$.min(),$.min(),$.min(),ae.empty(),0)}static newFoundDocument(e,t,r,i){return new n(e,1,t,$.min(),r,i,0)}static newNoDocument(e,t){return new n(e,2,t,$.min(),$.min(),ae.empty(),0)}static newUnknownDocument(e,t){return new n(e,3,t,$.min(),$.min(),ae.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual($.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=ae.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=ae.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=$.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof n&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new n(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}};var Oi=class{constructor(e,t=null,r=[],i=[],s=null,o="F",a=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=o,this.startAt=a,this.endAt=c,this.St=null,this.Ct=null,this.Bt=null,this.startAt,this.endAt}};function Ra(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Hn(e)?"-0":e}}function Mn(n){return{integerValue:""+n}}function yh(n,e,t){return function(i){return typeof i=="number"&&Number.isInteger(i)&&!Hn(i)&&i<=Number.MAX_SAFE_INTEGER&&i>=Number.MIN_SAFE_INTEGER}(e)?Mn(e):Ra(n,e)}var nt=class{constructor(){this._=void 0}},Vi=class extends nt{},Li=class extends nt{constructor(e){super(),this.elements=e}},xi=class extends nt{constructor(e){super(),this.elements=e}},Bt=class extends nt{constructor(e,t){super(),this.serializer=e,this.Qt=t}},Mi=class extends Bt{},Ui=class extends Bt{},Fi=class extends Bt{};var tr=class n{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new n}static exists(e){return new n(void 0,e)}static updateTime(e){return new n(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}},rt=class{},nr=class extends rt{constructor(e,t,r,i=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}},rr=class extends rt{constructor(e,t,r,i,s=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}},ir=class extends rt{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}},sr=class extends rt{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}};var ji=class{constructor(e,t){this.databaseId=e,this.useProto3Json=t}};function Un(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function ca(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function Ih(n,e){return Un(n,e.toTimestamp())}function gi(n){return K(!!n,49232),$.fromTimestamp(function(t){let r=Ut(t);return new x(r.seconds,r.nanos)}(n))}function Na(n,e){return Bi(n,e).canonicalString()}function Bi(n,e){let t=function(i){return new j(["projects",i.projectId,"databases",i.database])}(n).child("documents");return e===void 0?t:t.child(e)}function or(n,e){return Na(n.databaseId,e.path)}function ua(n,e){let t=function(i){let s=j.fromString(i);return K(Pa(s),10190,{key:s.toString()}),s}(e);if(t.get(1)!==n.databaseId.projectId)throw new w(I.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new w(I.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new de(function(i){return K(i.length>4&&i.get(4)==="documents",29091,{key:i.toString()}),i.popFirst(5)}(t))}function la(n,e,t){return{name:or(n,e),fields:t.value.mapValue.fields}}function Eh(n,e){return"found"in e?function(r,i){K(!!i.found,43571),i.found.name,i.found.updateTime;let s=ua(r,i.found.name),o=gi(i.found.updateTime),a=i.found.createTime?gi(i.found.createTime):$.min(),c=new ae({mapValue:{fields:i.found.fields}});return er.newFoundDocument(s,o,a,c)}(n,e):"missing"in e?function(r,i){K(!!i.missing,3894),K(!!i.readTime,22933);let s=ua(r,i.missing),o=gi(i.readTime);return er.newNoDocument(s,o)}(n,e):P(7234,{result:e})}function wh(n,e){let t;if(e instanceof nr)t={update:la(n,e.key,e.value)};else if(e instanceof ir)t={delete:or(n,e.key)};else if(e instanceof rr)t={update:la(n,e.key,e.data),updateMask:Th(e.fieldMask)};else{if(!(e instanceof sr))return P(16599,{Ot:e.type});t={verify:or(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(r=>function(s,o){let a=o.transform;if(a instanceof Vi)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof Li)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof xi)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof Mi)return{fieldPath:o.field.canonicalString(),increment:a.Qt};if(a instanceof Ui)return{fieldPath:o.field.canonicalString(),minimum:a.Qt};if(a instanceof Fi)return{fieldPath:o.field.canonicalString(),maximum:a.Qt};throw P(20930,{transform:o.transform})}(0,r))),e.precondition.isNone||(t.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:Ih(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:P(27497)}(n,e.precondition)),t}function Th(n){let e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function Pa(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}function ka(n){return!!n&&typeof n._toProto=="function"&&n._protoValueType==="ProtoValue"}function Xi(n){return new ji(n,!0)}var qi=class{},$i=class extends qi{constructor(e,t,r,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=i,this.qt=!1}Lt(){if(this.qt)throw new w(I.FAILED_PRECONDITION,"The client has already been terminated.")}le(e,t,r,i){return this.Lt(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.le(e,Bi(t,r),i,s,o)).catch(s=>{throw s.name==="FirebaseError"?(s.code===I.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new w(I.UNKNOWN,s.toString())})}me(e,t,r,i,s){return this.Lt(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.me(e,Bi(t,r),i,o,a,s)).catch(o=>{throw o.name==="FirebaseError"?(o.code===I.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new w(I.UNKNOWN,o.toString())})}terminate(){this.qt=!0,this.connection.terminate()}};async function Ca(n,e){let t=ma(n),r={writes:e.map(i=>wh(t.serializer,i))};await t.le("Commit",t.serializer.databaseId,j.emptyPath(),r)}async function Da(n,e){let t=ma(n),r={documents:e.map(a=>or(t.serializer,a))},i=await t.me("BatchGetDocuments",t.serializer.databaseId,j.emptyPath(),r,e.length),s=new Map;i.forEach(a=>{let c=Eh(t.serializer,a);s.set(c.key.toString(),c)});let o=[];return e.forEach(a=>{let c=s.get(a.toString());K(!!c,55234,{key:a}),o.push(c)}),o}var Oa="ComponentProvider",Vt=new Map;function Zi(n){if(n._terminated)throw new w(I.FAILED_PRECONDITION,"The client has already been terminated.");if(!Vt.has(n)){Lt(Oa,"Initializing Datastore");let e=function(s){return new Si(s)}(function(s,o,a,c,m){return new wi(s,o,a,m.host,m.ssl,m.experimentalForceLongPolling,m.experimentalAutoDetectLongPolling,Ia(m.experimentalLongPollingOptions),m.useFetchStreams,m.isUsingEmulator,c,m._customHeaders,m.grpcFlowControlWindow)}(n._databaseId,n.app.options.appId||"",n._persistenceKey,n.app.options.apiKey,n._freezeSettings())),t=Xi(n._databaseId),r=function(s,o,a,c){return new $i(s,o,a,c)}(n._authCredentials,n._appCheckCredentials,e,t);Vt.set(n,r)}return Vt.get(n)}var bh=1048576,Va="firestore.googleapis.com",ha=!0,ar=class{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new w(I.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Va,this.ssl=ha}else this.host=e.host,this.ssl=e.ssl??ha;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e._customHeaders&&(this._customHeaders={...e._customHeaders}),e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<bh)throw new w(I.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}if(function(r,i,s,o){if(i===!0&&o===!0)throw new w(I.INVALID_ARGUMENT,`${r} and ${s} cannot be used together.`)}("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Ia(e.experimentalLongPollingOptions??{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new w(I.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new w(I.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new w(I.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams,e.grpcFlowControlWindow!==void 0){if(typeof e.grpcFlowControlWindow!="number"||e.grpcFlowControlWindow<=0||e.grpcFlowControlWindow>2147483647||!Number.isInteger(e.grpcFlowControlWindow))throw new w(I.INVALID_ARGUMENT,"grpcFlowControlWindow must be a positive integer and cannot exceed 2147483647");this.grpcFlowControlWindow=e.grpcFlowControlWindow}}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams&&this.grpcFlowControlWindow===e.grpcFlowControlWindow&&function(r,i){if(r===i)return!0;if(!r||!i)return!1;let s=Object.keys(r),o=Object.keys(i);if(s.length!==o.length)return!1;for(let a of s)if(r[a]!==i[a])return!1;return!0}(this._customHeaders,e._customHeaders)}},it=class{constructor(e,t,r,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ar({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new w(I.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new w(I.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ar(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new _i;switch(r.type){case"firstParty":return new Ei(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new w(I.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){let r=Vt.get(t);r&&(Lt(Oa,"Removing Datastore"),Vt.delete(t),r.terminate())}(this),Promise.resolve()}};function La(n,e){let t=typeof n=="object"?n:Zt(),r=typeof n=="string"?n:e||"(default)",i=mt(t,"firestore/lite").getImmediate({identifier:r});if(!i._initialized){let s=as("firestore");s&&xa(i,...s)}return i}function xa(n,e,t,r={}){n=fr(n,it);let i=Ne(e),s=n._getSettings(),o={...s,emulatorOptions:n._getEmulatorOptions()},a=`${e}:${t}`;i&&Yt(`https://${a}`),s.host!==Va&&s.host!==a&&fa("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");let c={...s,host:a,ssl:i,emulatorOptions:r};if(!Z(c,o)&&(n._setSettings(c),r.mockUserToken)){let m,_;if(typeof r.mockUserToken=="string")m=r.mockUserToken,_=F.MOCK_USER;else{m=cs(r.mockUserToken,n._app?.options.projectId);let E=r.mockUserToken.sub||r.mockUserToken.user_id;if(!E)throw new w(I.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");_=new F(E)}n._authCredentials=new yi(new Fn(m,_))}}var cr=class n{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new n(this.firestore,e,this._query)}},B=class n{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new st(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new n(this.firestore,e,this._key)}toJSON(){return{type:n._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(Ht(t,n._jsonSchema))return new n(e,r||null,new de(j.fromString(t.referencePath)))}};B._jsonSchemaVersion="firestore/documentReference/1.0",B._jsonSchema={type:Y("string",B._jsonSchemaVersion),referencePath:Y("string")};var st=class n extends cr{constructor(e,t,r){super(e,t,function(s){return new Oi(s)}(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){let e=this._path.popLast();return e.isEmpty()?null:new B(this.firestore,null,new de(e))}withConverter(e){return new n(this.firestore,e,this._path)}};function Ma(n,e,...t){if(n=V(n),arguments.length===1&&(e=bi.newId()),ah("doc","path",e),n instanceof it){let r=j.fromString(e,...t);return Zo(r),new B(n,null,new de(r))}{if(!(n instanceof B||n instanceof st))throw new w(I.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=n._path.child(j.fromString(e,...t));return Zo(r),new B(n.firestore,n instanceof st?n.converter:null,new de(r))}}var ue=class n{constructor(e,t=0){if(this.subtype=t,!Number.isInteger(t)||t<0||t>255)throw new w(I.INVALID_ARGUMENT,"The subtype for Bytes must be a value in the inclusive [0, 255] range.");this._byteString=e}static fromBase64String(e,t=0){try{return new n(ne.fromBase64String(e),t)}catch(r){throw new w(I.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+r)}}static fromUint8Array(e,t=0){return new n(ne.fromUint8Array(e),t)}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}get data(){return this.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+", subtype: "+this.subtype+")"}isEqual(e){return this.subtype===e.subtype&&this._byteString.isEqual(e._byteString)}toJSON(){let e={type:n._jsonSchemaVersion,bytes:this.toBase64()};return this.subtype!==0&&(e.subtype=this.subtype),e}static fromJSON(e){if(Ht(e,n._jsonSchema)){let t=e.subtype??0;return n.fromBase64String(e.bytes,t)}}};ue._jsonSchemaVersion="firestore/bytes/1.0",ue._jsonSchema={type:Y("string",ue._jsonSchemaVersion),bytes:Y("string"),subtype:{...Y("number"),optional:!0}};var qt=class{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new w(I.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new xt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}};var ot=class{constructor(e){this.value=e}isEqual(e){return this.value===e.value}};var at=class{constructor(e,t){if(this.seconds=e,this.increment=t,!Number.isInteger(e)||e<0||e>4294967295)throw new Error("BsonTimestamp 'seconds' must be in the range of a 32-bit unsigned integer (0-4294967295).");if(!Number.isInteger(t)||t<0||t>4294967295)throw new Error("BsonTimestamp 'increment' must be in the range of a 32-bit unsigned integer (0-4294967295).")}isEqual(e){return this.seconds===e.seconds&&this.increment===e.increment}};var ct=class{constructor(e){this.stringValue=e,this.value=A.fromString(e)}isEqual(e){return!(!this.value.ot()||!e.value.ot())||this.value.compareTo(e.value)===0}toJSON(){return{$t:{stringValue:this.stringValue}}}};var $t=class{constructor(e){this._methodName=e}};var ye=class n{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new w(I.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new w(I.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return he(this._lat,e._lat)||he(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:n._jsonSchemaVersion}}static fromJSON(e){if(Ht(e,n._jsonSchema))return new n(e.latitude,e.longitude)}};ye._jsonSchemaVersion="firestore/geoPoint/1.0",ye._jsonSchema={type:Y("string",ye._jsonSchemaVersion),latitude:Y("number"),longitude:Y("number")};var ut=class{constructor(e){this.value=e}isEqual(e){return this.value===e.value}};var Ue=class n{constructor(){this.type="MaxKey"}static instance(){return n.MAX_KEY_VALUE_INSTANCE||(n.MAX_KEY_VALUE_INSTANCE=new n),n.MAX_KEY_VALUE_INSTANCE}};Ue.MAX_KEY_VALUE_INSTANCE=null;var Fe=class n{constructor(){this.type="MinKey"}static instance(){return n.MIN_KEY_VALUE_INSTANCE||(n.MIN_KEY_VALUE_INSTANCE=new n),n.MIN_KEY_VALUE_INSTANCE}};Fe.MIN_KEY_VALUE_INSTANCE=null;var lt=class{constructor(e,t){this.pattern=e,this.options=t}isEqual(e){return this.pattern===e.pattern&&this.options===e.options}};var le=class n{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0}(this._values,e._values)}toJSON(){return{type:n._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Ht(e,n._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(t=>typeof t=="number"))return new n(e.vectorValues);throw new w(I.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}};le._jsonSchemaVersion="firestore/vectorValue/1.0",le._jsonSchema={type:Y("string",le._jsonSchemaVersion),vectorValues:Y("object")};var vh=/^__.*__$/,Wi=class{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new rr(e,this.data,this.fieldMask,t,this.fieldTransforms):new nr(e,this.data,t,this.fieldTransforms)}};function Ua(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw P(40011,{dataSource:n})}}var Hi=class n{constructor(e,t,r,i,s,o){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.validatePath(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new n({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){let t=this.path?.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePathSegment(e),r}childContextForFieldPath(e){let t=this.path?.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePath(),r}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return ur(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(Ua(this.dataSource)&&vh.test(e))throw this.createError('Document fields cannot begin and end with "__"')}},zi=class{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||Xi(e)}createContext(e,t,r,i=!1){return new Hi({dataSource:e,methodName:t,targetDoc:r,path:xt.emptyPath(),arrayElement:!1,hasConverter:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}};function Fa(n){let e=n._freezeSettings(),t=Xi(n._databaseId);return new zi(n._databaseId,!!e.ignoreUndefinedProperties,t)}function ja(n,e,t,r,i,s={}){let o=n.createContext(s.merge||s.mergeFields?2:0,e,t,i);Ha("Data must be an object, but it was:",o,r);let a=qa(r,o),c,m;if(s.merge)c=new Zn(o.fieldMask),m=o.fieldTransforms;else if(s.mergeFields){let _=[];for(let E of s.mergeFields){let T=es(e,E,t);if(!o.contains(T))throw new w(I.INVALID_ARGUMENT,`Field '${T}' is specified in your field mask but missing from your input data.`);Rh(_,T)||_.push(T)}c=new Zn(_),m=o.fieldTransforms.filter(E=>c.covers(E.field))}else c=null,m=o.fieldTransforms;return new Wi(new ae(a),c,m)}function Ba(n,e,t){if(Wa(n=V(n)))return Ha("Unsupported field value:",e,n),qa(n,e);if(n instanceof $t)return function(i,s){if(!Ua(s.dataSource))throw s.createError(`${i._methodName}() can only be used with update() and set()`);if(!s.path)throw s.createError(`${i._methodName}() is not currently supported inside arrays`);let o=i._toFieldTransform(s);o&&s.fieldTransforms.push(o)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return function(i,s){let o=[],a=0;for(let c of i){let m=Ba(c,s.childContextForArray(a));m==null&&(m={nullValue:"NULL_VALUE"}),o.push(m),a++}return{arrayValue:{values:o}}}(n,e)}return function(i,s,o){if((i=V(i))===null)return{nullValue:"NULL_VALUE"};if(typeof i=="number")return yh(s.serializer,i);if(typeof i=="boolean")return{booleanValue:i};if(typeof i=="string")return{stringValue:i};if(i instanceof Date){let a=x.fromDate(i);return{timestampValue:Un(s.serializer,a)}}if(i instanceof x){let a=new x(i.seconds,1e3*Math.floor(i.nanoseconds/1e3));return{timestampValue:Un(s.serializer,a)}}if($a(i)){let a=x.fromInstant(i),c=new x(a.seconds,1e3*Math.floor(a.nanoseconds/1e3));return{timestampValue:Un(s.serializer,c)}}if(i instanceof ye)return{geoPointValue:{latitude:i.latitude,longitude:i.longitude}};if(i instanceof ue)return i.subtype===0?{bytesValue:ca(s.serializer,i._byteString)}:function(c,m){let _=m.toUint8Array(),E=new Uint8Array(_.length+1);return E[0]=m.subtype,E.set(_,1),{mapValue:{fields:{[mr]:{bytesValue:ca(c,ne.fromUint8Array(E))}}}}}(s.serializer,i);if(i instanceof B){let a=s.databaseId,c=i.firestore._databaseId;if(!c.isEqual(a))throw s.createError(`Document reference is for database ${c.projectId}/${c.database} but should be for database ${a.projectId}/${a.database}`);return{referenceValue:Na(i.firestore._databaseId||s.databaseId,i._key.path)}}if(i instanceof le)return function(c,m){let _=c instanceof le?c.toArray():c;return{mapValue:{fields:{[wa]:{stringValue:Ta},[ba]:{arrayValue:{values:_.map(T=>{if(typeof T!="number")throw m.createError("VectorValues must only contain numeric values.");return Ra(m.serializer,T)})}}}}}}(i,s);if(i instanceof lt)return function(c){return{mapValue:{fields:{[Se]:{mapValue:{fields:{[Gn]:{stringValue:c.pattern},[Kn]:{stringValue:c.options}}}}}}}}(i);if(i instanceof ot)return function(c){return{mapValue:{fields:{[Ft]:{stringValue:c.value}}}}}(i);if(i instanceof ut)return function(c){return{mapValue:{fields:{[zt]:Mn(c.value)}}}}(i);if(i instanceof ct)return function(c){return{mapValue:{fields:{[et]:{stringValue:c.stringValue}}}}}(i);if(i instanceof at)return function(c){return{mapValue:{fields:{[Me]:{mapValue:{fields:{[Yn]:Mn(c.seconds),[Jn]:Mn(c.increment)}}}}}}}(i);if(i instanceof Fe)return function(){return{mapValue:{fields:{[va]:{nullValue:"NULL_VALUE"}}}}}();if(i instanceof Ue)return function(){return{mapValue:{fields:{[Qi]:{nullValue:"NULL_VALUE"}}}}}();if(ka(i))return i._toProto(s.serializer);throw s.createError(`Unsupported field value: ${Ji(i)}`)}(n,e)}function qa(n,e){let t={};return function(i){for(let s in i)if(Object.prototype.hasOwnProperty.call(i,s))return!1;return!0}(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):pr(n,(r,i)=>{let s=Ba(i,e.childContextForField(r));s!=null&&(t[r]=s)}),{mapValue:{fields:t}}}function $a(n){if(typeof n!="object"||n===null)return!1;if(typeof Temporal<"u"&&typeof Temporal.Instant=="function"&&n instanceof Temporal.Instant)return!0;let e=n;return e[Symbol.toStringTag]==="Temporal.Instant"&&typeof e.ht=="bigint"}function Wa(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof x||n instanceof ye||n instanceof ue||n instanceof B||n instanceof $t||n instanceof le||n instanceof Fe||n instanceof Ue||n instanceof ut||n instanceof ct||n instanceof lt||n instanceof ot||n instanceof at||$a(n)||ka(n))}function Ha(n,e,t){if(!Wa(t)||!ya(t)){let r=Ji(t);throw r==="an object"?e.createError(n+" a custom object"):e.createError(n+" "+r)}}function es(n,e,t){if((e=V(e))instanceof qt)return e._internalPath;if(typeof e=="string")return Sh(n,e);throw ur("Field path arguments must be of type string or ",n,!1,void 0,t)}var Ah=new RegExp("[~\\*/\\[\\]]");function Sh(n,e,t){if(e.search(Ah)>=0)throw ur(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new qt(...e.split("."))._internalPath}catch{throw ur(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function ur(n,e,t,r,i){let s=r&&!r.isEmpty(),o=i!==void 0,a=`Function ${e}() called with invalid data`;t&&(a+=" (via `toFirestore()`)"),a+=". ";let c="";return(s||o)&&(c+=" (found",s&&(c+=` in field ${r}`),o&&(c+=` in document ${i}`),c+=")"),new w(I.INVALID_ARGUMENT,a+n+c)}function Rh(n,e){return n.some(t=>t.isEqual(e))}var Wt=class{constructor(e,t,r,i,s){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new B(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){let e=new lr(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){return this._document?.data.clone().value.mapValue.fields??void 0}get(e){if(this._document){let t=this._document.data.field(es("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}},lr=class extends Wt{data(){return super.data()}};var Gi=class{convertValue(e,t="none"){switch(Pi(e)){case 0:return null;case 2:return e.booleanValue;case 3:if("mapValue"in e){if(Qn(e))return this.convertToInt32Value(e.mapValue);if(tt(e))return this.convertToDecimal128Value(e.mapValue)}return G(e.integerValue||e.doubleValue);case 4:return this.convertTimestamp(e.timestampValue);case 6:return this.convertServerTimestamp(e,t);case 7:return e.stringValue;case 8:return"bytesValue"in e?this.convertBytes(zn(e.bytesValue)):this.convertToBytesWithSubtype(e.mapValue);case 9:return this.convertReference(e.referenceValue);case 11:return this.convertGeoPoint(e.geoPointValue);case 13:return this.convertArray(e.arrayValue,t);case 15:return this.convertObject(e.mapValue,t);case 14:return this.convertVectorValue(e.mapValue);case 12:return this.convertToRegexValue(e.mapValue);case 10:return this.convertToBsonObjectId(e.mapValue);case 5:return this.convertToBsonTimestamp(e.mapValue);case 16:return Ue.instance();case 1:return Fe.instance();default:throw P(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){let r={};return pr(e,(i,s)=>{r[i]=this.convertValue(s,t)}),r}convertVectorValue(e){let t=e.fields?.[ba].arrayValue?.values?.map(r=>G(r.doubleValue));return new le(t)}convertToBsonObjectId(e){let t=e.fields?.[Ft]?.stringValue??"";return new ot(t)}convertToBytesWithSubtype(e){let t=e.fields?.[mr],r=t?.bytesValue;if(!r)throw new Error("Received incorrect bytesValue for Bytes with subtype");let i=zn(r).toUint8Array();if(i.length===0)throw new Error("Received empty bytesValue for Bytes with subtype");let s=i[0],o=i.slice(1);return new ue(ne.fromUint8Array(o),s)}convertToBsonTimestamp(e){let t=e.fields?.[Me],r=Number(t?.mapValue?.fields?.[Yn]?.integerValue),i=Number(t?.mapValue?.fields?.[Jn]?.integerValue);return new at(r,i)}convertToRegexValue(e){let t=e.fields?.[Se]?.mapValue?.fields?.[Gn]?.stringValue??"",r=e.fields?.[Se]?.mapValue?.fields?.[Kn]?.stringValue??"";return new lt(t,r)}convertToInt32Value(e){let t=Number(e.fields?.[zt]?.integerValue);return new ut(t)}convertToDecimal128Value(e){let t=e.fields?.[et]?.stringValue??"";return new ct(t)}convertGeoPoint(e){return new ye(G(e.latitude),G(e.longitude))}convertArray(e,t){return(e.values||[]).map(r=>this.convertValue(r,t))}convertServerTimestamp(e,t){switch(t){case"previous":let r=Ea(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(Ni(e));default:return null}}convertTimestamp(e){let t=Ut(e);return new x(t.seconds,t.nanos)}convertDocumentKey(e,t){let r=j.fromString(e);K(Pa(r),9688,{name:e});let i=new $n(r.get(1),r.get(3)),s=new de(r.popFirst(5));return i.isEqual(t)||dr(`A document reference to ${s} refers to a different database (${i.projectId}/${i.database}), which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}};function za(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}var hr=class extends Gi{constructor(e){super(),this.firestore=e}convertBytes(e){return new ue(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new B(this.firestore,null,t)}};function Ga(n){let e=Zi((n=fr(n,B)).firestore),t=new hr(n.firestore);return Da(e,[n._key]).then(r=>{K(r.length===1,15618);let i=r[0];return new Wt(n.firestore,t,n._key,i.isFoundDocument()?i:null,n.converter)})}function Ka(n,e,t){let r=za((n=fr(n,B)).converter,e,t),i=ja(Fa(n.firestore),"setDoc",n._key,r,n.converter!==null,t);return Ca(Zi(n.firestore),[i.toMutation(n._key,tr.none())])}var Ya="4.19.0";(function(){da(`${Te}_lite`),we(new J("firestore/lite",(e,{instanceIdentifier:t,options:r})=>{let i=e.getProvider("app").getImmediate(),s=new it(new jn(e.getProvider("auth-internal")),new qn(i,e.getProvider("app-check-internal")),ga(i,t),i);return r&&s._setSettings(r),s},"PUBLIC").setMultipleInstances(!0)),ee("firestore-lite",Ya,""),ee("firestore-lite",Ya,"esm2020")})();export{Ke as GoogleAuthProvider,Po as createUserWithEmailAndPassword,Ma as doc,Yo as getAuth,Ga as getDoc,La as getFirestore,Ho as getRedirectResult,ks as initializeApp,Oo as onAuthStateChanged,No as sendPasswordResetEmail,Ka as setDoc,ko as signInWithEmailAndPassword,Bo as signInWithPopup,Wo as signInWithRedirect,Vo as signOut};
/*! Bundled license information:

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/component/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/logger/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm/index-DYWDbVEA.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js:
  (** @license
  Copyright The Closure Library Authors.
  SPDX-License-Identifier: Apache-2.0
  *)
  (** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * Copyright 2021 M.Vokhmentsev
   *
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
