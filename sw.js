if(!self.define){let e,t={};const i=(i,n)=>(i=new URL(i+".js",n).href,t[i]||new Promise((t=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=t,document.head.appendChild(e)}else e=i,importScripts(i),t()})).then((()=>{let e=t[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,o)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(t[r])return;let s={};const d=e=>i(e,r),c={module:{uri:r},exports:s,require:d};t[r]=Promise.all(n.map((e=>c[e]||d(e)))).then((e=>(o(...e),s)))}}define(["./workbox-e8f5ea68"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"df9ed014.js",revision:"8cbc5eefaf233fe613e77eba7b7431a1"},{url:"index.html",revision:"d819acdfc5a3dbebb0822bdcfcdd9e7d"}],{}),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/index.html"))),e.registerRoute("polyfills/*.js",new e.CacheFirst,"GET")}));
//# sourceMappingURL=sw.js.map
