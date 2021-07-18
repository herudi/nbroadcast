function findBase(s){const e=s.indexOf("/",1);return e!==-1?s.substring(0,e):s}class Router{route={};c_routes=[];midds=[];pmidds={};get;post;put;patch;delete;any;head;options;trace;connect;constructor(){this.get=this.on.bind(this,"GET"),this.post=this.on.bind(this,"POST"),this.put=this.on.bind(this,"PUT"),this.patch=this.on.bind(this,"PATCH"),this.delete=this.on.bind(this,"DELETE"),this.any=this.on.bind(this,"ANY"),this.head=this.on.bind(this,"HEAD"),this.options=this.on.bind(this,"OPTIONS"),this.trace=this.on.bind(this,"TRACE"),this.connect=this.on.bind(this,"CONNECT")}#e=(e,t,r,n,o)=>{if(o!==void 0){const i=findBase(n||"/");o[i]&&(r=o[i].concat(r))}return e.length&&(r=e.concat(r)),r=r.concat([t])};on(e,t,...r){return this.c_routes.push({method:e,path:t,handlers:r}),this}findRoute(e,t,r){let n=[];const o={};if(this.route[e+t]){const d=this.route[e+t];return d.m?n=d.handlers:(n=this.#e(this.midds,r,d.handlers),this.route[e+t]={m:!0,handlers:n}),{params:o,handlers:n}}if(t!=="/"&&t[t.length-1]==="/"){const d=t.slice(0,-1);if(this.route[e+d]){const f=this.route[e+d];return f.m?n=f.handlers:(n=this.#e(this.midds,r,f.handlers),this.route[e+d]={m:!0,handlers:n}),{params:o,handlers:n}}}let i=0,a=0,c={},l=this.route[e]||[],u=[],h=!0;this.route.ANY&&(l=l.concat(this.route.ANY));const p=l.length;for(;i<p;){if(c=l[i],c.pathx&&c.pathx.test(t)){if(h=!1,c.params){for(u=c.pathx.exec(t);a<c.params.length;)o[c.params[a]]=u[++a]||null;o.wild&&(o.wild=o.wild.split("/"))}break}i++}return n=this.#e(this.midds,r,h?[]:c.handlers||[],t,this.pmidds),{params:o,handlers:n}}}const SERIALIZE_COOKIE_REGEXP=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/,encoder=new TextEncoder,decoder=new TextDecoder;function findFns(s){let e=[],t=0;const r=s.length;for(;t<r;t++)Array.isArray(s[t])?e=e.concat(findFns(s[t])):typeof s[t]=="function"&&e.push(s[t]);return e}function toBytes(s){const e={b:1,kb:1<<10,mb:1<<20,gb:1<<30,tb:Math.pow(1024,4),pb:Math.pow(1024,5)};if(typeof s=="number")return s;const t=/^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i.exec(s);let r,n="b";return t?(r=parseFloat(t[1]),n=t[4].toLowerCase()):(r=parseInt(r,10),n="b"),Math.floor(e[n]*r)}function toPathx(s,e){if(s instanceof RegExp)return{params:null,pathx:s};const t=/\?|\*|\./;if(!t.test(s)&&e===!1&&(s.match(/\/:/gi)||[]).length===0)return;let r=[],n="";const o="/([^/]+?)",i="(?:/([^/]+?))?";if(t.test(s)){const l=s.split("/");let u,h,p=0;for(l[0]||l.shift();p<l.length;p++)if(u=l[p],h=u[0],h==="*")r.push("wild"),n+="/(.*)";else if(h===":"){const d=u.indexOf("?")!==-1,f=u.indexOf(".")!==-1;if(d&&!f?n+=i:n+=o,f){const y=u.substring(u.indexOf("."));let m=n+(d?"?":"")+"\\"+y;m=m.replaceAll(o+"\\"+y,"/([\\w-]+"+y+")"),n=m}}else n+="/"+u}else n=s.replace(/\/:[a-z_-]+/gi,o);const a=new RegExp(`^${n}/?$`,"i"),c=s.match(/\:([a-z_-]+)/gi);return r.length?r=(c?c.map(u=>u.substring(1)):[]).concat(r):r=c&&c.map(l=>l.substring(1)),{params:r,pathx:a}}function needPatch(s,e,t){if(e.length===0)return t;let r=e.shift();r||(s=s||[],Array.isArray(s)&&(r=s.length));const n=+r;isNaN(n)||(s=s||[],r=n),s=s||{};const o=needPatch(s[r],e,t);return s[r]=o,s}function myParse(s){return s.reduce((t,[r,n])=>{if(t.hasOwnProperty(r))Array.isArray(t[r])?t[r]=[...t[r],n]:t[r]=[t[r],n];else{let[o,i,a]=r.match(/^([^\[]+)((?:\[[^\]]*\])*)/);a&&(a=Array.from(a.matchAll(/\[([^\]]*)\]/g),c=>c[1]),n=needPatch(t[i],a,n)),t[i]=n}return t},{})}function parseQuery(s){if(s===null)return{};if(typeof s=="string"){const e=new URLSearchParams("?"+s);return myParse(Array.from(e.entries()))}return myParse(Array.from(s.entries()))}function serializeCookie(s,e,t={}){if(!SERIALIZE_COOKIE_REGEXP.test(s))throw new TypeError("name is invalid");if(e!==""&&!SERIALIZE_COOKIE_REGEXP.test(e))throw new TypeError("value is invalid");t.encode=!!t.encode,t.encode&&(e="E:"+btoa(encoder.encode(e).toString()));let r=`${s}=${e}`;if(s.startsWith("__Secure")&&(t.secure=!0),s.startsWith("__Host")&&(t.path="/",t.secure=!0,delete t.domain),t.secure&&(r+="; Secure"),t.httpOnly&&(r+="; HttpOnly"),typeof t.maxAge=="number"&&Number.isInteger(t.maxAge)&&(r+=`; Max-Age=${t.maxAge}`),t.domain){if(!SERIALIZE_COOKIE_REGEXP.test(t.domain))throw new TypeError("domain is invalid");r+=`; Domain=${t.domain}`}if(t.sameSite&&(r+=`; SameSite=${t.sameSite}`),t.path){if(!SERIALIZE_COOKIE_REGEXP.test(t.path))throw new TypeError("path is invalid");r+=`; Path=${t.path}`}if(t.expires){if(typeof t.expires.toUTCString!="function")throw new TypeError("expires is invalid");r+=`; Expires=${t.expires.toUTCString()}`}return t.other&&(r+=`; ${t.other.join("; ")}`),r}function tryDecode(s){try{s=s.substring(2);const e=atob(s),t=Uint8Array.from(e.split(",")),r=decoder.decode(t)||s;if(r!==s&&(r.startsWith("j:{")||r.startsWith("j:["))){const n=r.substring(2);return JSON.parse(n)}return r}catch(e){return s}}function getReqCookies(s,e,t=0){const r=s.headers.get("Cookie");if(r===null)return{};const n={},o=r.split(";"),i=o.length;for(;t<i;){const[a,...c]=o[t].split("="),l=c.join("=");n[a.trim()]=e&&l.startsWith("E:")?tryDecode(l):l,t++}return n}class NHttpError extends Error{status;constructor(e,t=500,r){super(e);this.message=e,this.status=t,this.name=r||"HttpError"}}class BadRequestError extends NHttpError{constructor(e){super(e,400,"BadRequestError")}}class UnauthorizedError extends NHttpError{constructor(e){super(e,401,"UnauthorizedError")}}class PaymentRequiredError extends NHttpError{constructor(e){super(e,402,"PaymentRequiredError")}}class ForbiddenError extends NHttpError{constructor(e){super(e,403,"ForbiddenError")}}class NotFoundError extends NHttpError{constructor(e){super(e,404,"NotFoundError")}}class MethodNotAllowedError extends NHttpError{constructor(e){super(e,405,"MethodNotAllowedError")}}class NotAcceptableError extends NHttpError{constructor(e){super(e,406,"NotAcceptableError")}}class ProxyAuthRequiredError extends NHttpError{constructor(e){super(e,407,"ProxyAuthRequiredError")}}class RequestTimeoutError extends NHttpError{constructor(e){super(e,408,"RequestTimeoutError")}}class ConflictError extends NHttpError{constructor(e){super(e,409,"ConflictError")}}class GoneError extends NHttpError{constructor(e){super(e,410,"GoneError")}}class LengthRequiredError extends NHttpError{constructor(e){super(e,411,"LengthRequiredError")}}class PreconditionFailedError extends NHttpError{constructor(e){super(e,412,"PreconditionFailedError")}}class RequestEntityTooLargeError extends NHttpError{constructor(e){super(e,413,"RequestEntityTooLargeError")}}class RequestURITooLongError extends NHttpError{constructor(e){super(e,414,"RequestURITooLongError")}}class UnsupportedMediaTypeError extends NHttpError{constructor(e){super(e,415,"UnsupportedMediaTypeError")}}class RequestedRangeNotSatisfiableError extends NHttpError{constructor(e){super(e,416,"RequestedRangeNotSatisfiableError")}}class ExpectationFailedError extends NHttpError{constructor(e){super(e,417,"ExpectationFailedError")}}class TeapotError extends NHttpError{constructor(e){super(e,418,"TeapotError")}}class MisdirectedRequestError extends NHttpError{constructor(e){super(e,421,"MisdirectedRequestError")}}class UnprocessableEntityError extends NHttpError{constructor(e){super(e,422,"UnprocessableEntityError")}}class LockedError extends NHttpError{constructor(e){super(e,423,"LockedError")}}class FailedDependencyError extends NHttpError{constructor(e){super(e,424,"FailedDependencyError")}}class TooEarlyError extends NHttpError{constructor(e){super(e,425,"TooEarlyError")}}class UpgradeRequiredError extends NHttpError{constructor(e){super(e,426,"UpgradeRequiredError")}}class PreconditionRequiredError extends NHttpError{constructor(e){super(e,428,"PreconditionRequiredError")}}class TooManyRequestsError extends NHttpError{constructor(e){super(e,429,"TooManyRequestsError")}}class RequestHeaderFieldsTooLargeError extends NHttpError{constructor(e){super(e,431,"RequestHeaderFieldsTooLargeError")}}class UnavailableForLegalReasonsError extends NHttpError{constructor(e){super(e,451,"UnavailableForLegalReasonsError")}}class InternalServerError extends NHttpError{constructor(e){super(e,500,"InternalServerError")}}class NotImplementedError extends NHttpError{constructor(e){super(e,501,"NotImplementedError")}}class BadGatewayError extends NHttpError{constructor(e){super(e,502,"BadGatewayError")}}class ServiceUnavailableError extends NHttpError{constructor(e){super(e,503,"ServiceUnavailableError")}}class GatewayTimeoutError extends NHttpError{constructor(e){super(e,504,"GatewayTimeoutError")}}class HTTPVersionNotSupportedError extends NHttpError{constructor(e){super(e,505,"HTTPVersionNotSupportedError")}}class VariantAlsoNegotiatesError extends NHttpError{constructor(e){super(e,506,"VariantAlsoNegotiatesError")}}class InsufficientStorageError extends NHttpError{constructor(e){super(e,507,"InsufficientStorageError")}}class LoopDetectedError extends NHttpError{constructor(e){super(e,508,"LoopDetectedError")}}class NotExtendedError extends NHttpError{constructor(e){super(e,510,"NotExtendedError")}}class NetworkAuthenticationRequiredError extends NHttpError{constructor(e){super(e,511,"NetworkAuthenticationRequiredError")}}function getError(s,e){let t=s.status||s.statusCode||s.code||500;typeof t!="number"&&(t=500);let r;if(e){const n=s.stack?s.stack.split(`
`):[""];n.shift(),r=n.filter(o=>o.indexOf("file://")!==-1).map(o=>o.trim())}return{status:t,message:s.message||"Something went wrong",name:s.name||"HttpError",stack:r}}const decoder1=new TextDecoder;class Multipart{createBody=(e,{parse:t}={})=>t?t(Object.fromEntries(Array.from(e.keys()).map(r=>[r,e.getAll(r).length>1?e.getAll(r):e.get(r)]))):parseQuery(e);#e=e=>{for(const t in e)if(Array.isArray(e[t])){const r=e[t];for(let n=0;n<r.length;n++)if(r[n]instanceof File){delete e[t];break}}else e[t]instanceof File&&delete e[t]};#t=(e,t)=>{let r=0;const n=e.length;if(t?.maxCount&&n>t.maxCount)throw new BadRequestError(`${t.name} no more than ${t.maxCount} file`);for(;r<n;){const o=e[r],i=o.name.substring(o.name.lastIndexOf(".")+1);if(t?.accept&&!t.accept.includes(i))throw new BadRequestError(`${t.name} only accept ${t.accept}`);if(t?.maxSize&&o.size>toBytes(t.maxSize))throw new BadRequestError(`${t.name} to large, maxSize = ${t.maxSize}`);r++}};#r=async(e,t)=>{const r=Deno.cwd();let n=0;const o=e.length;for(;n<o;){const i=e[n],a=i.name.substring(i.name.lastIndexOf(".")+1);t?.callback&&t.callback(i);let c=t.dest||"";c.lastIndexOf("/")===-1&&(c+="/"),i.filename=i.filename||Date.now()+i.lastModified.toString()+"_"+i.name.substring(0,16).replace(/\./g,"")+"."+a,i.path=i.path||(c!=="/"?c:"")+i.filename;const l=await i.arrayBuffer();await Deno.writeFile(r+"/"+c+i.filename,new Uint8Array(l)),n++}};upload(e){return async(t,r)=>{if(t.body===void 0&&(t.body={}),t.file===void 0&&(t.file={}),t.request.body&&t.request.headers.get("content-type")?.includes("multipart/form-data")){if(t.request.bodyUsed===!1){const n=await t.request.formData();t.body=await this.createBody(n,{parse:t.__parseQuery})}if(Array.isArray(e)){let n=0,o=0;const i=e.length;for(;n<i;){const a=e[n];if(a.required&&t.body[a.name]===void 0)throw new BadRequestError(`Field ${a.name} is required`);if(t.body[a.name]){t.file[a.name]=t.body[a.name];const c=t.file[a.name],l=Array.isArray(c)?c:[c];this.#t(l,a)}n++}for(;o<i;){const a=e[o];if(t.body[a.name]){t.file[a.name]=t.body[a.name];const c=t.file[a.name],l=Array.isArray(c)?c:[c];await this.#r(l,a),delete t.body[a.name]}o++}this.#e(t.body)}else if(typeof e=="object"){const n=e;if(n.required&&t.body[n.name]===void 0)throw new BadRequestError(`Field ${n.name} is required`);if(t.body[n.name]){t.file[n.name]=t.body[n.name];const o=t.file[n.name],i=Array.isArray(o)?o:[o];this.#t(i,n),await this.#r(i,n),delete t.body[n.name]}this.#e(t.body)}}r()}}}async function verifyBody(s,e){const t=await s.arrayBuffer();if(e&&t.byteLength>toBytes(e))throw new BadRequestError(`Body is too large. max limit ${e}`);return decoder1.decode(t)}const multipart=new Multipart;function acceptContentType(s,e){const t=s.get("content-type");return t===e||t?.startsWith(e)}const withBody=async(s,e,t,r,n)=>{if(s.body={},s.request.body&&s.request.bodyUsed===!1){const o=s.request.headers;if(acceptContentType(o,"application/json")){if(n?.json!==0)try{const i=await verifyBody(s.request,n?.json||"3mb");s.body=JSON.parse(i)}catch(i){return e(i)}}else if(acceptContentType(o,"application/x-www-form-urlencoded")){if(n?.urlencoded!==0)try{const i=await verifyBody(s.request,n?.urlencoded||"3mb");s.body=t(i)}catch(i){return e(i)}}else if(acceptContentType(o,"text/plain")){if(n?.raw!==0)try{const i=await verifyBody(s.request,n?.raw||"3mb");try{s.body=JSON.parse(i)}catch(a){s.body={_raw:i}}}catch(i){return e(i)}}else if(acceptContentType(o,"multipart/form-data")&&n?.multipart!==0){const i=await s.request.formData();s.body=await multipart.createBody(i,{parse:r})}}e()},JSON_TYPE_CHARSET="application/json; charset=utf-8";class JsonResponse extends Response{constructor(e,t={}){t.headers=t.headers||new Headers,t.headers.set("content-type",JSON_TYPE_CHARSET),super(JSON.stringify(e),t)}}function response(s,e,t){s.header=function(r,n){if(t.headers=t.headers||new Headers,typeof r=="string"&&typeof n=="string")return t.headers.set(r,n),this;if(typeof r=="object"){if(r instanceof Headers)t.headers=r;else for(const o in r)t.headers.set(o,r[o]);return this}return typeof r=="string"?t.headers.get(r):t.headers},s.status=function(r){return r?(t.status=r,this):t.status||200},s.type=function(r){return this.header("Content-Type",r),this},s.send=function(r){if(typeof r=="object"){if(r instanceof Uint8Array||r instanceof ReadableStream||r instanceof FormData||r instanceof Blob||typeof r.read=="function")return e(new Response(r,t));r=JSON.stringify(r),t.headers=t.headers||new Headers,t.headers.set("Content-Type",JSON_TYPE_CHARSET)}return e(new Response(r,t))},s.json=function(r){return e(new JsonResponse(r,t))},s.redirect=function(r,n){return this.header("Location",r).status(n||302).send()},s.cookie=function(r,n,o={}){return o.httpOnly=o.httpOnly!==!1,o.path=o.path||"/",o.maxAge&&(o.expires=new Date(Date.now()+o.maxAge),o.maxAge/=1e3),n=typeof n=="object"?"j:"+JSON.stringify(n):String(n),this.header().append("Set-Cookie",serializeCookie(r,n,o)),this},s.clearCookie=function(r,n={}){n.httpOnly=n.httpOnly!==!1,this.header().append("Set-Cookie",serializeCookie(r,"",{...n,expires:new Date(0)}))}}class NHttp extends Router{#e;#t;#r;#s;server;constructor({parseQuery:e,bodyLimit:t,env:r}={}){super();this.#e=e||parseQuery,this.#t=e,this.#r=t,this.#s=r||"development",this.fetchEventHandler=this.fetchEventHandler.bind(this),e&&this.use((n,o)=>{n.__parseQuery=e,o()})}onError(e){this.#n=e}on404(e){this.#o=e}use(...e){const t=e[0],r=e[e.length-1];if(e.length===1&&typeof t=="function")this.midds.push(t);else if(typeof t=="string"&&typeof r=="function")t==="/"||t===""?this.midds=this.midds.concat(findFns(e)):this.pmidds[t]=[(o,i)=>{o.url=o.url.substring(t.length)||"/",o.path=o.path&&o.path.substring(t.length)||"/",i()}].concat(findFns(e));else if(typeof r=="object"&&r.c_routes)this.#i(t,e,r.c_routes);else if(Array.isArray(r)){let o=0;const i=r.length;for(;o<i;){const a=r[o];typeof a=="object"&&a.c_routes?this.#i(t,e,a.c_routes):typeof a=="function"&&this.midds.push(a),o++}}else this.midds=this.midds.concat(findFns(e));return this}on(e,t,...r){const n=findFns(r),o=toPathx(t,e==="ANY");return o!==void 0?(this.route[e]=this.route[e]||[],this.route[e].push({...o,handlers:n})):this.route[e+t]={handlers:n},this}handle(e,t=0){this.#l(e);const r=this.findRoute(e.request.method,e._parsedUrl.pathname,this.#o),n=o=>{if(o)return this.#n(o,e,n);let i;try{i=r.handlers[t++](e,n)}catch(a){return n(a)}i&&typeof i.then=="function"&&i.then(void 0).catch(n)};e.params=r.params,e.path=e._parsedUrl.pathname,e.query=this.#e(e._parsedUrl.query),e.search=e._parsedUrl.search,e.getCookies=o=>getReqCookies(e.request,o),response(e.response={},e.respondWith,e.responseInit={}),withBody(e,n,this.#e,this.#t,this.#r)}fetchEventHandler(){return async e=>{let t;const r=new Promise(i=>t=i),n=e.respondWith(r),o=e;o.respondWith=t,this.handle(o),await n}}async listen(e,t){let r=!1;typeof e=="number"?e={port:e}:typeof e=="object"&&(r=e.certFile!==void 0),this.server=r?Deno.listenTls(e):Deno.listen(e);try{for(t&&t(void 0,{...e,hostname:e.hostname||"localhost",server:this.server});;)try{const n=await this.server.accept();if(n)this.#a(n);else break}catch(n){}}catch(n){t&&t(n,{...e,hostname:e.hostname||"localhost",server:this.server})}}#n=(e,t,r)=>{const n=getError(e,this.#s==="development");return t.response.status(n.status).json(n)};#o=(e,t)=>{const r=getError(new NotFoundError(`Route ${e.request.method}${e.url} not found`));return e.response.status(r.status).json(r)};#i=(e,t,r)=>{let n="",o=0;const i=findFns(t),a=r.length;for(typeof e=="string"&&e.length>1&&e.charAt(0)==="/"&&(n=e);o<a;){const c=r[o];c.handlers=i.concat(c.handlers),this.on(c.method,n+c.path,...c.handlers),o++}};#a=async e=>{try{const t=Deno.serveHttp(e);for await(const r of t){let n;const o=new Promise(c=>n=c),i=r.respondWith(o),a=r;a.respondWith=n,this.handle(a),await i}}catch(t){}};#c=e=>{const t=[];let r=-1;for(;(r=e.indexOf("/",r+1))!=-1&&(t.push(r),t.length!==3););return e.substring(t[2])};#l=e=>{const t=e.url=this.#c(e.request.url),r=e._parsedUrl||{};if(r._raw===t)return;let n=t,o=null,i=null,a=0;const c=t.length;for(;a<c;){if(t.charCodeAt(a)===63){n=t.substring(0,a),o=t.substring(a+1),i=t.substring(a);break}a++}r.path=r._raw=r.href=t,r.pathname=n,r.query=o,r.search=i,e._parsedUrl=r}}const fetch_url="https://raw.githubusercontent.com/herudi/nbroadcast/master/client",generateId=s=>{const e=new Uint8Array((s||40)/2);return window.crypto.getRandomValues(e),Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")},initApp=({response:s},e)=>{s.header({"Access-Control-Allow-Origin":"*","X-Powered-By":"NHttp Deno"}),e()},validateKey=({params:s},e)=>{if(s.key.length!==40)throw new Error("Key not valid. please generate key first.");e()},fetchFile=async({response:s,request:e},t,r)=>{const n=await fetch(fetch_url+"/"+t);if(!n.ok)return s.status(404).send({status:404,message:"Not Found"});const o=s.header();if(n.headers.get("ETag")&&(o.set("ETag",n.headers.get("ETag")||""),e.headers.get("if-none-match")===o.get("ETag")))return s.status(304).send();o.set("content-type",r);const i=await n.text();return s.header(o).send(i)},app=new NHttp;app.use(initApp).get("/",s=>{fetchFile(s,"index.html","text/html")}).get("/generate-key",({response:s})=>{const e=generateId();s.json({key:e})}).get("/sample/live-news",s=>{fetchFile(s,"live-news.html","text/html")}).get("/:key/:channel",validateKey,({response:s,params:e})=>{const t=new BroadcastChannel(e.key+e.channel),r=new ReadableStream({start:n=>{t.onmessage=o=>{n.enqueue(`data: ${JSON.stringify(o.data)}

`)}},cancel(){t.close()}});s.header({Connection:"Keep-Alive","Content-Type":"text/event-stream","Cache-Control":"no-cache","Keep-Alive":`timeout=${Number.MAX_SAFE_INTEGER}`}).send(r.pipeThrough(new TextEncoderStream))}).post("/:key/:channel",validateKey,({response:s,body:e,params:t})=>{new BroadcastChannel(t.key+t.channel).postMessage(e),s.status(201).json({status:201,message:"success send broadcast to "+t.channel,data:e})}),addEventListener("fetch",app.fetchEventHandler());