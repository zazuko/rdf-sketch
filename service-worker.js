if(!self.define){let s,e={};const i=(i,n)=>(i=new URL(i+".js",n).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(n,r)=>{const l=s||("document"in self?document.currentScript.src:"")||location.href;if(e[l])return;let o={};const u=s=>i(s,l),a={module:{uri:l},exports:o,require:u};e[l]=Promise.all(n.map((s=>a[s]||u(s)))).then((s=>(r(...s),o)))}}define(["./workbox-5ffe50d4"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"apple-touch-icon.png",revision:"45a9d073e13dc6da956715f9e81ed6fc"},{url:"assets/CustomJsonLdSerializer-CS9srNYw.js",revision:null},{url:"assets/CustomRdfXmlParser-wGruhsJN.js",revision:null},{url:"assets/index-DgvLsL1f.js",revision:null},{url:"assets/index-wLopkFQ0.js",revision:null},{url:"assets/main-BAPcXNJe.js",revision:null},{url:"assets/main-BvN7k4Xu.js",revision:null},{url:"assets/main-C5CtGnmC.js",revision:null},{url:"assets/main-CjI9Z_LN.css",revision:null},{url:"assets/main-CwzUuslq.js",revision:null},{url:"assets/main-CZ8lfwpC.js",revision:null},{url:"assets/main-Dpr_x4rC.js",revision:null},{url:"assets/main-DsNxryhl.js",revision:null},{url:"assets/main-DTNzEP7z.js",revision:null},{url:"assets/main-wJzz5sCD.js",revision:null},{url:"assets/primeicons-C6QP2o4f.woff2",revision:null},{url:"assets/primeicons-Dr5RGzOO.svg",revision:null},{url:"assets/primeicons-WjwUDZjB.woff",revision:null},{url:"assets/stream-D88LWzFB.js",revision:null},{url:"favicon-96x96.png",revision:"275ecb711d5bfd9651ebfd68fac51322"},{url:"favicon.ico",revision:"873abf72f4f693cf67266d7caf42f2a6"},{url:"favicon.svg",revision:"f06571cc81d76ad5f8e281def81a4549"},{url:"img/icons/zazuko_icon.svg",revision:"049394536d76b8e49af24ecc352f1996"},{url:"index.html",revision:"47c9b36c4ed96182261f70ebce9e1d4b"},{url:"manifest.webmanifest",revision:"8a9fe5d65c729a2210be1dfc77392944"},{url:"registerSW.js",revision:"38013143dc2183340ede8bc1c5124507"},{url:"site.webmanifest",revision:"881827f24d54a9791bca578c6dbaba49"},{url:"web-app-manifest-192x192.png",revision:"5e22dba4727f0d17032d5dbbc20623db"},{url:"web-app-manifest-512x512.png",revision:"cfdf277a5514f2744218fb81ca27266c"},{url:"manifest.webmanifest",revision:"8a9fe5d65c729a2210be1dfc77392944"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
