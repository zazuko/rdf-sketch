if(!self.define){let s,e={};const i=(i,n)=>(i=new URL(i+".js",n).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(n,r)=>{const l=s||("document"in self?document.currentScript.src:"")||location.href;if(e[l])return;let o={};const a=s=>i(s,l),u={module:{uri:l},exports:o,require:a};e[l]=Promise.all(n.map((s=>u[s]||a(s)))).then((s=>(r(...s),o)))}}define(["./workbox-5ffe50d4"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"apple-touch-icon.png",revision:"45a9d073e13dc6da956715f9e81ed6fc"},{url:"assets/CustomJsonLdSerializer-D8N1qWIh.js",revision:null},{url:"assets/CustomRdfXmlParser-D5friA1M.js",revision:null},{url:"assets/index-BMzMoN0b.js",revision:null},{url:"assets/index-DMn3ABzq.js",revision:null},{url:"assets/main-_2tfKWhP.css",revision:null},{url:"assets/main-Bbig3v3v.js",revision:null},{url:"assets/main-BFf8j2gg.js",revision:null},{url:"assets/main-C0Hzf2I6.js",revision:null},{url:"assets/main-CvyrvPY3.js",revision:null},{url:"assets/main-D8DixJoJ.js",revision:null},{url:"assets/main-DBX7HHCf.js",revision:null},{url:"assets/main-Dj80NaNp.js",revision:null},{url:"assets/main-GqMsSp0-.js",revision:null},{url:"assets/main-WH1QwD4R.js",revision:null},{url:"assets/primeicons-C6QP2o4f.woff2",revision:null},{url:"assets/primeicons-Dr5RGzOO.svg",revision:null},{url:"assets/primeicons-WjwUDZjB.woff",revision:null},{url:"assets/stream-DrVE15ld.js",revision:null},{url:"favicon-96x96.png",revision:"275ecb711d5bfd9651ebfd68fac51322"},{url:"favicon.ico",revision:"873abf72f4f693cf67266d7caf42f2a6"},{url:"favicon.svg",revision:"f06571cc81d76ad5f8e281def81a4549"},{url:"img/icons/zazuko_icon.svg",revision:"049394536d76b8e49af24ecc352f1996"},{url:"index.html",revision:"12325dc64917ce8ca60ec7446ea1aa4c"},{url:"manifest.webmanifest",revision:"8a9fe5d65c729a2210be1dfc77392944"},{url:"registerSW.js",revision:"38013143dc2183340ede8bc1c5124507"},{url:"site.webmanifest",revision:"881827f24d54a9791bca578c6dbaba49"},{url:"web-app-manifest-192x192.png",revision:"5e22dba4727f0d17032d5dbbc20623db"},{url:"web-app-manifest-512x512.png",revision:"cfdf277a5514f2744218fb81ca27266c"},{url:"manifest.webmanifest",revision:"8a9fe5d65c729a2210be1dfc77392944"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
