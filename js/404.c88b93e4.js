(self["webpackChunk_zazuko_rdf_sketch"]=self["webpackChunk_zazuko_rdf_sketch"]||[]).push([[404],{33084:function(e,t,r){if("function"!==typeof queueMicrotask){let e=Promise.resolve();try{queueMicrotask=t=>e.then(t).catch((e=>setTimeout((()=>{throw e}),0)))}catch(a){}}const s=r(42084),i=r(38802),n=32768;class o extends i.Transform{static _flush_buffer(e){e._s_push&&(e.push(e._s_push),e._s_push="")}constructor(e={}){super({writableObjectMode:!0,readableObjectMode:!1});let{prefixes:t={}}=e;this._s_push="",this._n_max_buffer=e.max_buffer||e.maxBuffer||n,this._h_prefixes=s.cache_prefixes(t||{}),this.on("pipe",(e=>{e.on("prefix",((e,t)=>{this.write({type:"prefixes",value:{[e]:t}})})),e.on("comment",(e=>{this.write({type:"comment",value:e})}))})),e.close&&this.once("close",e.close),e.drain&&this.on("drain",e.drain),e.error&&this.on("error",e.error),e.finish&&this.once("finish",e.finish),e.data&&this.on("data",e.data),e.end&&this.once("end",e.end),e.warning&&this.on("warning",e.warning)}_serialize_hash_comment(e){return"# "+e.replace(/\n/g,"\n# ")+"\n"}_serialize_newlines(e=1){return"\n".repeat(e)}_serialize_c4r(e){let t=this._h_prefixes,r=[],i="";for(let s in e)"*"!==s&&r.push(s),i+=this._serialize_c3r(e[s]);if(r.length){let e=`Destination format does not support quads; an implicit union into the default graph was performed on the quads contained in graphs: ${r.map((e=>s.c1(e,t).verbose())).join(", ")}`;this.emit("warning",e)||console.warn(e)}return i}_serialize_c3(){throw new Error(`Write event type 'c3' not supported by ${this.constructor.name}`)}_serialize_c4(){throw new Error(`Write event type 'c4' not supported by ${this.constructor.name}`)}_serialize_c3r(){throw new Error(`Write event type 'c3r' should have been implemented by subclass ${this.constructor.name}`)}_serialize_quad(){throw new Error(`Write event type 'quad' should have been implemented by subclass ${this.constructor.name}`)}_serialize_comment(){}_update_prefixes(e,t=!1){let r={...this._h_prefixes,...e};this._h_prefixes=s.cachePrefixes(r||{},t)}_transform(e,t,r){let s;try{s=this.serialize(e)}catch(i){return r(i),i}if(s)o._flush_buffer(this),this.push(s);else{let e=this._s_push.length;e>this._n_max_buffer?o._flush_buffer(this):e&&queueMicrotask((()=>o._flush_buffer(this)))}r()}_queue(e){this._s_push+=e,this._s_push.length>this._n_max_buffer?o._flush_buffer(this):queueMicrotask((()=>o._flush_buffer(this)))}serialize(e){switch(e.type){case void 0:return this._serialize_quad(e);case"c3r":return this._serialize_c3r(e.value);case"c4r":return this._serialize_c4r(e.value);case"array":{let t="";for(let r of e.value){let e=this.serialize(r);e?t+=e:this._s_push&&(t+=this._s_push,this._s_push="")}return t}case"quad":return this._serialize_quad(e.value);case"c3":return this._serialize_c3(e.value);case"c4":return this._serialize_c4(e.value);case"prefixes":return this._serialize_prefixes(e.value);case"comment":return this._serialize_comment(e.value);case"newline":case"newlines":return this._serialize_newlines(e.value);default:throw new Error(`no such writable data event type for RDF stream: '${e.type}'`)}}rinse(){this._reset(),o._flush_buffer(this)}_flush(){o._flush_buffer(this),this.push(null)}}Object.assign(o.prototype,{isGraphyWritable:!0,_serialize_prefixes:o.prototype._update_prefixes}),e.exports=o},7404:function(e,t,r){const s=r(42084),i=r(33084),n=/^`\[[^\]]+\](.*)$/,o=new Map([[Date,e=>s.dateTime(e)],[Number,e=>s.number(e)]]);class a extends i{constructor(e={}){super(e);let{lists:t=null}=e,r=o;if(e.coercions){r=new Map(r);for(let[t,s]of e.coercions)r.set(t,s)}let s={first:">http://www.w3.org/1999/02/22-rdf-syntax-ns#first",rest:">http://www.w3.org/1999/02/22-rdf-syntax-ns#rest",nil:">http://www.w3.org/1999/02/22-rdf-syntax-ns#nil"};if(t){let{first:e=null,rest:r=null,nil:i=null}=t;e&&(s.first=e),r&&(s.rest=r),i&&(s.nil=i)}Object.assign(this,{_xc_state:0,_hm_coercions:r,_g_lists:s})}_serialize_comment(e,t){let r="";if(2!==this._xc_state&&(r+="\n",this._xc_state=2),t&&t.width){let r=t.width,s=[];while(e.length>r){let t=e.slice(0,r+1),i=/^(.*[^\s])\s+/.exec(t);if(i){let t=i[1];s.push(t),e=e.slice(t.length).replace(/^\s+/,"")}else s.push(e.slice(0,r)),e=e.slice(r)}e=s.join("\n")}return r+(super._serialize_comment(e)||"")}_transcode_list(e,t=this._g_lists){if(e.length){let r=e[0],s=r;return Array.isArray(r)&&(s=this._transcode_list(r,t)),{[t.first]:s,[t.rest]:1===e.length?t.nil:this._transcode_list(e.slice(1),t)}}return t.nil}_apply_directive(e,t){let r,s=n.exec(e);if(!s)throw new Error(`Invalid writable data event directive string: "${e}"`);try{r=JSON.parse(s[1])}catch(o){throw new Error(`Unable to parse JSON in writable data event directive: "${s[1]}"`)}let i=r.type;switch(i){case"comment":if(this._serialize_comment)return{write:this._serialize_comment(t+"",r)};break;case"newlines":if(this._serialize_newlines)return{write:this._serialize_newlines(t)};break;case"config":switch(r.value){case"lists":{let e=this._a_list_serializers;e.push(this._serialize_list_object);let r=this._g_lists,s={first:t.first||r.first,rest:t.rest||r.rest,nil:t.nil||r.nil};return this._serialize_list_object=function(e,t){let r=this._transcode_list(e,s);return this._encode_objects(r,t)},{exit:()=>{this._serialize_list_object=e.pop()}}}default:throw new Error(`No such config key '${r.value}'`)}default:throw new Error(`Invalid writable data event directive type: '${i}'`)}return{}}_serialize_c4(e){let t=this._h_prefixes,r=[],i="";for(let s in e)"*"!==s&&r.push(s),i+=this._serialize_c3(e[s]);if(r.length){let e=`Destination format does not support quads; an implicit union into the default graph was performed on the quads contained in graphs: ${r.map((e=>s.c1(e,t).verbose())).join(", ")}`;this.emit("warning",e)||console.warn(e)}return i}}e.exports=a},38802:function(e,t,r){var s=r(48764)["Buffer"],i=r(34155);const n=r(88473);class o extends n.Readable{constructor(e={}){if(super(e),e.iterator)throw new Error("readable stream iterator shortcut not yet implemented")}until(e,t){return new Promise(((r,s)=>{this.on("error",(e=>{s(e)})),t?this.once(e,((...e)=>{r(this,...e)})):this.once(e,r)}))}bucket(e="utf8"){let t=this._readableState;return t.objectMode?new Promise(((e,t)=>{let r=[];this.pipe(new n.Writable({write(e,t,s){r.push(e),s()},writev(e,t){r.push(...e),t()}})).on("error",(e=>{t(e)})).on("finish",(()=>{e(r)}))})):"utf8"===e||"utf-8"===e?new Promise(((t,r)=>{let s="";this.setEncoding(e),this.pipe(new n.Writable({decodeStrings:!1,write(e,t,r){s+=e,r()},writev(e,t){s+=e.join(""),t()}})).on("error",(e=>{r(e)})).on("finish",(()=>{t(s)}))})):"buffer"===e?new Promise(((e,t)=>{let r=s.from([]);this.pipe(new n.Writable({decodeStrings:!0,write(e,t,i){r=s.concat([r,e],r.length+e.length),i()}})).on("error",(e=>{t(e)})).on("finish",(()=>{e(r)}))})):void 0}}class a extends n.Writable{until(e,t){return new Promise(((r,s)=>{this.on("error",(e=>{s(e)})),t?this.once(e,((...e)=>{r(this,...e)})):this.once(e,r)}))}import(e){return e.on("data",(e=>this.write(e))).on("end",(()=>this.end())).on("error",(e=>this.emit("error",e))),this}}class h extends n.Duplex{until(e,t){return new Promise(((r,s)=>{this.on("error",(e=>{s(e)})),t?this.once(e,((...e)=>{r(this,...e)})):this.once(e,r)}))}bucket(e="utf8"){let t=this._readableState;return t.objectMode?new Promise(((e,t)=>{let r=[];this.pipe(new n.Writable({write(e,t,s){r.push(e),s()},writev(e,t){r.push(...e),t()}})).on("error",(e=>{t(e)})).on("finish",(()=>{e(r)}))})):"utf8"===e||"utf-8"===e?new Promise(((t,r)=>{let s="";this.setEncoding(e),this.pipe(new n.Writable({decodeStrings:!1,write(e,t,r){s+=e,r()},writev(e,t){s+=e.join(""),t()}})).on("error",(e=>{r(e)})).on("finish",(()=>{t(s)}))})):"buffer"===e?new Promise(((e,t)=>{let r=s.from([]);this.pipe(new n.Writable({decodeStrings:!0,write(e,t,i){r=s.concat([r,e],r.length+e.length),i()}})).on("error",(e=>{t(e)})).on("finish",(()=>{e(r)}))})):void 0}}class l extends n.Transform{until(e,t){return new Promise(((r,s)=>{this.on("error",(e=>{s(e)})),t?this.once(e,((...e)=>{r(this,...e)})):this.once(e,r)}))}bucket(e="utf8"){let t=this._readableState;return t.objectMode?new Promise(((e,t)=>{let r=[];this.pipe(new n.Writable({write(e,t,s){r.push(e),s()},writev(e,t){r.push(...e),t()}})).on("error",(e=>{t(e)})).on("finish",(()=>{e(r)}))})):"utf8"===e||"utf-8"===e?new Promise(((t,r)=>{let s="";this.setEncoding(e),this.pipe(new n.Writable({decodeStrings:!1,write(e,t,r){s+=e,r()},writev(e,t){s+=e.join(""),t()}})).on("error",(e=>{r(e)})).on("finish",(()=>{t(s)}))})):"buffer"===e?new Promise(((e,t)=>{let r=s.from([]);this.pipe(new n.Writable({decodeStrings:!0,write(e,t,i){r=s.concat([r,e],r.length+e.length),i()}})).on("error",(e=>{t(e)})).on("finish",(()=>{e(r)}))})):void 0}import(e){return e.on("data",(e=>this.write(e))).on("end",(()=>this.end())).on("error",(e=>this.emit("error",e))),this}demolish(e){if(this.push=e=>{if(null!==e)throw new Error("[ERR_STREAM_DESTROYED]: Cannot push after stream was destroyed")},this.emit=function(e,...t){"end"!==e&&Object.getPrototypeOf(this).emit.apply(this,[e,...t])},e)return n.Transform.prototype.destroy.call(this,e)}}const u=new Function("try {return this===global;}catch(e){return false;}")(),[c,_]=(()=>"undefined"===typeof i?[!0,!1]:i.browser?[!0,!0]:"undefined"===i.versions||"undefined"===i.versions.node?[!0,!1]:[!1,!1])();(_||u&&+/^v(\d+)/.exec(i.version)[1]<10)&&(l.prototype.destroy=h.prototype.destroy=function(e,t){this._readableState.destroyed=!0,this._writableState.destroyed=!0;let r=()=>{this._writableState.emitClose&&this._readableState.emitClose&&this.emit("close")};return this._destroy(e||null,(e=>{!t&&e?(i.nextTick((()=>{this.emit("error",e),r()})),this._writableState.errorEmitted=!0):(i.nextTick(r),t&&t(e))})),this},l.prototype._destroy=h.prototype._destroy=(e,t)=>t(e));class f extends l{constructor(e={}){super({...e,writableObjectMode:!0,readableObjectMode:!0}),this._as_inputs=new Set,this.on("pipe",(e=>{this._as_inputs.add(e),e.on("prefix",((...e)=>{this.emit("prefix",...e)})).on("comment",((...e)=>{this.emit("comment",...e)}))})),this.on("unpipe",(e=>{this._as_inputs.delete(e)}))}_destroy(){for(let e of this._as_inputs)e.destroy()}}class p extends f{_transform(e,t,r){r(null,JSON.stringify(e.isolate())+"\n")}}class d extends f{_transform(e,t,r){r(null,{type:"quad",value:e})}}l.QuadsToOther=f,e.exports={...n,Readable:o,Writable:a,Duplex:h,Transform:l,QuadsToOther:f,quads_to_json(){return new p},quads_to_writable(){return new d},source(e,t=null){return t||"string"!==typeof e||(t="utf8"),new o({objectMode:!t&&"string"!==typeof e&&!s.isBuffer(e),read(){this.push(e,t),this.push(null)}})}}}}]);
//# sourceMappingURL=404.c88b93e4.js.map