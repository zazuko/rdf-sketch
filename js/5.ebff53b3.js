(self["webpackChunk_zazuko_rdf_sketch"]=self["webpackChunk_zazuko_rdf_sketch"]||[]).push([[5],{69005:function(t,e,s){if("function"!==typeof queueMicrotask){let t=Promise.resolve();try{queueMicrotask=e=>t.then(e).catch((t=>setTimeout((()=>{throw t}),0)))}catch(O){}}const r=s(38802),i=s(42084),n=/^[a-z][a-z0-9+\-.]*:(?:[^\0-\x20<>"{}|^`\\]|\\u[A-Fa-f0-9]{4}|\\U[A-Fa-f0-9]{8})*$/,a=/^[a-z][a-z0-9+\-.]*:[^\0-\x20<>"{}|^`]*$/,o=/^([^\0-\x20<>"{}|^`\\]|\\u[A-Fa-f0-9]{4}|\\U[A-Fa-f0-9]{8})*$/,l=/^([^\0-\x20<>"{}|^`])*$/,h=/\\u([0-9A-Fa-f]{4})|\\U([0-9A-Fa-f]{8})/g,_=(t,e,s)=>String.fromCodePoint(parseInt(e||s,16)),c=/\s*(?:#[^\n]*\n\s*)*\s*/y,u=/\s*(#[^\n]*\n\s*)*\s*/y,f=/[\\]/,d=/[^\n]+\n/y,p=/^(?:[A-Za-z\xc0-\xd6\xd8-\xf6\xf8-\u{02ff}\u{0370}-\u{037d}\u{037f}-\u{1fff}\u{200c}-\u{200d}\u{2070}-\u{218f}\u{2c00}-\u{2fef}\u{3001}-\u{d7ff}\u{f900}-\u{fdcf}\u{fdf0}-\u{fffd}\u{10000}-\u{effff}_0-9])(?:(?:[A-Za-z\xc0-\xd6\xd8-\xf6\xf8-\u{02ff}\u{0370}-\u{037d}\u{037f}-\u{1fff}\u{200c}-\u{200d}\u{2070}-\u{218f}\u{2c00}-\u{2fef}\u{3001}-\u{d7ff}\u{f900}-\u{fdcf}\u{fdf0}-\u{fffd}\u{10000}-\u{effff}_\-0-9\xb7\u{0300}-\u{036f}\u{203f}-\u{2040}.])*[A-Za-z\xc0-\xd6\xd8-\xf6\xf8-\u{02ff}\u{0370}-\u{037d}\u{037f}-\u{1fff}\u{200c}-\u{200d}\u{2070}-\u{218f}\u{2c00}-\u{2fef}\u{3001}-\u{d7ff}\u{f900}-\u{fdcf}\u{fdf0}-\u{fffd}\u{10000}-\u{effff}_\-0-9\xb7\u{0300}-\u{036f}\u{203f}-\u{2040}])?$/u,m=/^[a-z]+(-[a-z0-9]+)*$/,g=/[ \t]*/y,x=/@([A-Za-z]+(?:-[A-Za-z0-9-]+)*)(?:\s+|(?=[.,;\])#]))/y,b=/<([^>]*)>\s*/y,w=(t,e,s,r,i,n)=>{if(e)switch(e){case"t":return"\t";case"n":return"\n";case"r":return"\r";case"f":return"\f";case"b":return"\b";default:console.assert(`bad regex escape char mapping: '${e}'`)}else{if(s)return s;if(r)return String.fromCodePoint(parseInt(r,16));if(i)return String.fromCodePoint(parseInt(i,16));if(n)throw"\\"===n[0]?new Error(`expected string_literal but invalid escape sequence within contents: '${n}'. failed to parse a valid token`):new Error(`expected string_literal but invalid whitespace character within contents: ${JSON.stringify(n)}. failed to parse a valid token`);console.assert("unexpected no match branch in escape sequence replace callback")}},y=/(?:\\(?:([tnrfb])|([\\"'])|u([0-9A-Fa-f]{4})|U([0-9A-Fa-f]{8}))|([\r\n]|\\.))/g,k=/(?:\\(?:([tnrfb])|([\\"'])|u([0-9A-Fa-f]{4})|U([0-9A-Fa-f]{8}))|([\r\n]|\\[^uU]|\\u[^]{4}|\\U[^]{8}))/g,j=t=>t.replace(y,w),I=t=>{let e=v.exec(t);if(e){let s=e.index;return[t.slice(0,s).replace(k,w),t.slice(s)]}return[t.replace(k,w),""]},[v,E]=(()=>{function t(t){let e=RegExp.prototype.exec.call(this,t);if(e){let t=e[0].length-e[1].length;e.index+=t,e[0]=e[0].slice(t)}return e}let e=(()=>{try{new RegExp("(?<!h)i")}catch(t){return(t,e,s)=>(e.exec=s,e)}return t=>t()})();return[e((()=>new RegExp("(?<!(?:[^\\\\]|^)(?:\\\\\\\\)*\\\\)\\\\(|u[0-9A-Fa-f]{0,3}|U[0-9A-Fa-f]{0,7})$")),/^(?:(?:[^\\]|\\.)*)(\\(?:|u[0-9A-Fa-f]{0,3}|U[0-9A-Fa-f]{0,7}))$/,(function(t){let e=RegExp.prototype.exec.call(this,t);return e&&(e.index+=e[0].length-e[1].length),e})),e((()=>new RegExp('(?<!(?:[^\\\\]|^)(?:\\\\\\\\)*\\\\)"\\s*',"g")),/(?:[^\\"]|\\.)*("\s*)/y,t)]})(),S=/(?:<([^\\>]*)>|_:([^\x20\t<]+))[\x20\t]*<([^\\>]*)>[\x20\t]*(?:(?:(<[^\\>]*)>|_:([^\x20\t<]+))[\x20\t]*(?:<([^\\>]*)>|_:([^\x20\t<]+)|)[\x20\t]*\.\s*(#[^\n]*\n\s*|\n\s*)+|"([^"\\]*)(?:(")(?:\^\^<([^\\>]*)>|@([^\x20\t.]+)|)[\x20\t]*(?:<([^\\>]*)>|_:([^\x20\t<]+)|)[\x20\t]*\.\s*(#[^\n]*\n\s*|\n\s*)+)?)/y,$=/(?:<([^>]*)>|_:([^\x20\t<]+))[\x20\t]*<([^>]*)>[\x20\t]*(?:(?:(<[^>]*)>|_:([^\x20\t<]+))[\x20\t]*(?:<([^>]*)>|_:([^\x20\t<]+)|)[\x20\t]*\.\s*(#[^\n]*\n\s*|\n\s*)+|"((?:[^"\\]|\\.)*)(?:(")(?:\^\^<([^>]*)>|@([^\x20\t.]+)|)[\x20\t]*(?:<([^>]*)>|_:([^\x20\t<]+)|)[\x20\t]*\.\s*(#[^\n]*\n\s*|\n\s*)+)?)/y,A=/_:([^\x20\t<]+)/y;class q extends r.Transform{constructor(t){super({decodeStrings:!1,writableObjectMode:!1,readableObjectMode:!0,flush:t.flush,transform:t.transform}),this.on("pipe",(t=>{this._ds_input=t,"function"===typeof t.setEncoding&&t.setEncoding("utf8")}))}pipe(t){let e=t;return e._writableState.objectMode?t.isGraphyWritable&&(t=r.quads_to_writable()):t=r.quads_to_json(),t!==e?(super.pipe(t),t.pipe(e)):super.pipe(e)}}class F{constructor(t){let{input:e=null,relax:s=!1,debug:r=!1}=t,h=t.allow_relative_iris||t.allowRelativeIRIs||t.allowRelativeIris||!1,_=this._dc_factory=i.adopt(t.dataFactory||t.data_factory||i.unfiltered),f=this._f_quad=_.quad;Object.assign(this,{s:t.prepend||"",n:0,_b_debug:r,_b_relax:s,_b_destroyed:!1,_b_trim_start:!0,_f_state:this.statement,_kt_subject:null,_kt_predicate:null,_kt_object:null,_s_literal:""}),this._kt_default_graph=_.defaultGraph(),this._kt_rdfs_lang_string=_.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#langString");let d=this._r_clean=c;t.relaxed&&console.warn(new Error("no such option 'relaxed'; did you mean 'relax' ?").stack.replace(/^Error:/,"Warning:")),"validate"in t&&console.warn(new Error("option 'validate' has been removed and validation is now on by default. Use 'relax' option if you wish to disable validation.").stack.replace(/^Error:/,"Warning:"));let g,x=_.namedNode,b=_.blankNode,w=_.languagedLiteral,y=h?o:n,k=h?l:a,j=this;Object.assign(this,s?{create_named_node:x,create_named_node_escapeless:x,create_blank_node:b,create_languaged_literal:w}:{create_named_node(t){return y.test(t)?x(t):j._error(`invalid IRI: "${t}"`)},create_named_node_escapeless(t){return k.test(t)?x(t):j._error(`invalid IRI: "${t}"`)},create_blank_node(t){return p.test(t)?b(t):j._error(`Invalid blank node label: "${t}"`)},create_languaged_literal(t,e){return m.test(e)?w(t,e):j._error(`Invalid literal language tag: ${e}`)}});let I=!1;if(g=this.transform=new q({transform:(t,e,s)=>{I||(g.emit("ready"),I=!1);let r=this.s+=t;if(this._b_trim_start){d.lastIndex=0;let t=d.exec(r);this.emit_comments&&this.emit_comments(t[1]),this.i=d.lastIndex}else this.i=0;this.n=r.length;try{this.parse(!0)}catch(i){return g.destroy(i)}g.emit("progress",t.length),s()},flush:t=>{if(this.s.length){if(this.s+="\n",this._b_trim_start){d.lastIndex=0;let t=d.exec(this.s);this.emit_comments&&this.emit_comments(t[1]),this.i=d.lastIndex}else this.i=0;try{this.parse()}catch(e){return g.demolish(e)}if(this.s.length)return g.demolish(new Error(`parsing error occurred in state: statement\n  ${this.s.substr(0,50)}\n  ^ starting here`))}if(this._f_state!==this.statement)return g.demolish(new Error(`parsing error occurred in state: ${this._f_state.name}\n  ${this.s.substr(0,50)}\n  ^ starting here`));this.s=null,g.emit("progress",0),g.emit("eof"),t()}}),g._destroy=(...t)=>{this.destroy(...t)},this._f_data_quad=(t,e,s,r)=>g.push(f(t,e,s,r)),g.on("newListener",(t=>{"comment"===t&&(d=u,this.emit_comments=t=>{if(!t)return;let e=t.slice(1).replace(/\n\s+$/,"").split(/\n+\s*#/g);for(let s of e)g.emit("comment",s)})})),this.bind(t),e)if(e.stream){let t=e.stream;queueMicrotask((()=>{t.pipe(g)}))}else{if("string"!==typeof e.string)throw new TypeError(`Invalid argument for input parameter: ${"object"===typeof e?JSON.stringify(e):e}`);{let t=e.string;queueMicrotask((()=>{g.end(t,"utf8")}))}}g._graphy_reader=this}_error(t){throw this._b_destroyed=!0,new Error(t)}bind(t){let e=this.transform;t.error&&e.on("error",t.error),t.comment&&e.on("comment",t.comment),t.read&&e.once("read",t.read),t.progress&&e.on("progress",t.progress),t.eof&&e.once("eof",t.eof),t.end&&e.once("end",t.end),t.finish&&e.once("finish",t.finish),t.data&&e.on("data",t.data)}parse(){let t=this._f_state();while("function"===typeof t)t=t.apply(this)}statement(){let t=this.s,e=(this.n,this.i),s=this._f_data_quad,r=this.create_named_node,i=this.create_named_node_escapeless,n=this.create_languaged_literal,a=this.create_blank_node,o=this._dc_factory.simpleLiteral,l=this._dc_factory.datatypedLiteral,c=this._kt_default_graph;for(;;){S.lastIndex=e;let u=S.exec(t);if(u){let r;e=S.lastIndex;let h=!1;if(u[4]){let t=u[4].slice(1);r=i(t)}else if(u[5])r=a(u[5]);else{h=!0;let s=u[9];if(!u[10]){this._s_literal=s,this.i=e;{let t=u[1];this._kt_subject=t||"string"===typeof t?i(t):a(u[2])}this._kt_predicate=i(u[3]);let r=this.strlit_contents();if(r&&this.statement!==r)return r;{let s=this._r_clean;s.lastIndex=this.i;let r=s.exec(t);this.emit_comments&&this.emit_comments(r[1]),e=s.lastIndex;continue}}if(u[11]){let t=this.create_named_node_escapeless(u[11]);r=l(s,t)}else if(u[12]){let t=u[12].toLowerCase();r=n(s,t)}else r=o(s)}let _,f=c;if(h){let t=u[13];t||"string"===typeof t?f=i(t):u[14]&&(f=a(u[14]))}else{let t=u[6];t||"string"===typeof t?f=i(t):u[7]&&(f=a(u[7]))}{let t=u[1];_=t||"string"===typeof t?i(t):a(u[2])}let d=u[3];s(_,i(d),r,f),this.emit_comments&&this.emit_comments(u[8]||u[15])}else{$.lastIndex=e;let i=$.exec(t);if(i){let u;e=$.lastIndex;let d=!1;if(i[4]){let t=i[4].slice(1);u=r(f.test(t)?t.replace(h,_):t)}else if(i[5])u=a(f.test(i[5])?i[5].replace(h,_):i[5]);else{d=!0;let s=i[9];if(!i[10]){this._s_literal=s,this.i=e;{let t=i[1];this._kt_subject=t||"string"===typeof t?r(f.test(t)?t.replace(h,_):t):a(i[2])}this._kt_predicate=r(f.test(i[3])?i[3].replace(h,_):i[3]);let n=this.strlit_contents();if(n&&this.statement!==n)return n;{let s=this._r_clean;s.lastIndex=this.i;let r=s.exec(t);this.emit_comments&&this.emit_comments(r[1]),e=s.lastIndex;continue}}if(s=j(s),i[11]){let t=this.create_named_node(i[11]);u=l(s,t)}else if(i[12]){let t=i[12].toLowerCase();u=n(s,t)}else u=o(s)}let p,m=c;if(d){let t=i[13];t||"string"===typeof t?m=r(f.test(t)?t.replace(h,_):t):i[14]&&(m=a(i[14]))}else{let t=i[6];t||"string"===typeof t?m=r(f.test(t)?t.replace(h,_):t):i[7]&&(m=a(i[7]))}{let t=i[1];p=t||"string"===typeof t?r(f.test(t)?t.replace(h,_):t):a(i[2])}let g=i[3];s(p,r(f.test(g)?g.replace(h,_):g),u,m),this.emit_comments&&this.emit_comments(i[8]||i[15])}else{if(d.lastIndex=e,!d.exec(t))break;e=d.lastIndex,this._error(`Failed to read statement:\n\`${t.substr(e,80).replace(/\n/g,"⏎")} [...]\`\n ^ starting here`)}}}return this.s=t.substr(e),this._f_state=this.statement,1}strlit_contents(){let{s:t,n:e,i:s}=this;E.lastIndex=s;let r=E.exec(t);if(r){let e=r.index,i=t.slice(s,e);return this._s_literal+=j(i),this.i=e+r[0].length,this._b_trim_start=!0,this.datatype_or_langtag()||this.statement}{let r=t.slice(s),[i,n]=I(r);this._s_literal+=i,this.i=s=e-n.length,this._b_trim_start=!1}return s<this.n&&0===s&&this.n>this.max_token_length?this.parse_error("strlit_contents"):(this._f_state=this.strlit_contents,this.s=t.slice(s),this.eos&&this.eos(),1)}datatype_or_langtag(){let{s:t,n:e,i:s}=this,r=t[s];while(s<e){if("^"!==r){if("@"===r){x.lastIndex=s;let e=x.exec(t);if(e)return this.i=x.lastIndex,this._kt_object=this._dc_factory.languagedLiteral(this._s_literal,e[1]),this._s_literal="",this.post_object();break}if("<"===r||"_"===r)return this._kt_object=this._dc_factory.simpleLiteral(this._s_literal),this._s_literal="",this.graph();if("."===r){let t=this._dc_factory.simpleLiteral(this._s_literal);return this._s_literal="",this.i=s+1,this._f_data_quad(this._kt_subject,this._kt_predicate,t,this._kt_default_graph),this.statement}break}if(!(s+2<e))break;if("^"===t[s+1]){b.lastIndex=s+2;let e=b.exec(t);if(e){this.i=b.lastIndex;let t=e[1].replace(h,_),s=this.create_named_node(t);return this._kt_object=this._dc_factory.datatypedLiteral(this._s_literal,s),this._s_literal="",this.post_object()}break}this._error(`Failed to read token after literal:\n\`${t.substr(s+1,80).replace(/\n/g,"⏎")} [...]\`\n ^ starting here`)}return this.i=s,s<this.n&&0===s&&this.n>this.max_token_length?this.parse_error("datatype_or_langtag"):(this._f_state=this.datatype_or_langtag,this.s=t.slice(s),this.eos&&this.eos(),1)}statement_term(){let{s:t,n:e,i:s}=this,r=t.indexOf(".",s);return r>-1?(this._b_trim_start=!0,this.i=r+1,this.statement):(/^\s*$/.test(t.slice(s))||this.parse_error("statement_term"),this._b_trim_start=!1,this._f_state=this.statement_term,this.s=t.slice(s),this.eos&&this.eos(),1)}post_object(){let{s:t,n:e,i:s}=this;if(g.lastIndex=s,g.exec(t),s=g.lastIndex,s>=e)return this._f_state=this.post_object,this.s=t.slice(s),this.eos&&this.eos(),1;switch(t[s]){case".":return this.i=s+1,this._f_data_quad(this._kt_subject,this._kt_predicate,this._kt_object,this._kt_default_graph),this.statement;case"<":case"_":return this.i=s,this.graph();default:this.i=s,this.parse_error("post_object")}}graph(){let{s:t,n:e,i:s}=this;b.lastIndex=s;let r=b.exec(t);if(r){this.i=b.lastIndex;let t=this.create_named_node(r[1]);return this._f_data_quad(this._kt_subject,this._kt_predicate,this._kt_object,t),this.statement_term()}{A.lastIndex=s;let e=A.exec(t);if(e){this.i=A.lastIndex;let t=this._dc_factory.blankNode(e[1]);return this._f_data_quad(this._kt_subject,this._kt_predicate,this._kt_object,t),this.statement_term()}}return this._f_state=this.graph,this.s=t.slice(s),this.eos&&this.eos(),1}parse_error(t){return this._error(`Failed to read ${t}:\n\`${this.s.substr(this.i,80).replace(/\n/g,"⏎")} [...]\`\n ^ starting here`)}destroy(t){this._f_data_quad=()=>{},!t&&this._ds_input&&this._ds_input.destroy(t),this.transform.demolish(t)}}t.exports=function(...t){let e={};if(t.length){let s=t[0];if(s&&s.input&&"undefined"===typeof s.input.string&&!s.input.stream&&(s=s.input),"string"===typeof s)e.input={string:s};else if(null===s)e.input=null;else if("function"===typeof s.setEncoding)e.input={stream:s};else{if("function"===typeof s.pipeTo)throw new TypeError("Sorry, WHATWG streams are currently not supported :(");if(!s||"object"!==typeof s||"[object Object]"!==Object.prototype.toString.call(s))throw new TypeError(`unexpected input type: ${s}`);if(e=s,t.length>1)throw new TypeError(`unexpected argument(s) after config struct: ${t.slice(1)}`)}if(t.length>1&&(Object.assign(e,t[1]),t.length>2))throw new TypeError(`unexpected argument(s) after input and config struct: ${t.slice(2)}`)}return new F(e).transform}},38802:function(t,e,s){var r=s(48764)["Buffer"],i=s(34155);const n=s(88473);class a extends n.Readable{constructor(t={}){if(super(t),t.iterator)throw new Error("readable stream iterator shortcut not yet implemented")}until(t,e){return new Promise(((s,r)=>{this.on("error",(t=>{r(t)})),e?this.once(t,((...t)=>{s(this,...t)})):this.once(t,s)}))}bucket(t="utf8"){let e=this._readableState;return e.objectMode?new Promise(((t,e)=>{let s=[];this.pipe(new n.Writable({write(t,e,r){s.push(t),r()},writev(t,e){s.push(...t),e()}})).on("error",(t=>{e(t)})).on("finish",(()=>{t(s)}))})):"utf8"===t||"utf-8"===t?new Promise(((e,s)=>{let r="";this.setEncoding(t),this.pipe(new n.Writable({decodeStrings:!1,write(t,e,s){r+=t,s()},writev(t,e){r+=t.join(""),e()}})).on("error",(t=>{s(t)})).on("finish",(()=>{e(r)}))})):"buffer"===t?new Promise(((t,e)=>{let s=r.from([]);this.pipe(new n.Writable({decodeStrings:!0,write(t,e,i){s=r.concat([s,t],s.length+t.length),i()}})).on("error",(t=>{e(t)})).on("finish",(()=>{t(s)}))})):void 0}}class o extends n.Writable{until(t,e){return new Promise(((s,r)=>{this.on("error",(t=>{r(t)})),e?this.once(t,((...t)=>{s(this,...t)})):this.once(t,s)}))}import(t){return t.on("data",(t=>this.write(t))).on("end",(()=>this.end())).on("error",(t=>this.emit("error",t))),this}}class l extends n.Duplex{until(t,e){return new Promise(((s,r)=>{this.on("error",(t=>{r(t)})),e?this.once(t,((...t)=>{s(this,...t)})):this.once(t,s)}))}bucket(t="utf8"){let e=this._readableState;return e.objectMode?new Promise(((t,e)=>{let s=[];this.pipe(new n.Writable({write(t,e,r){s.push(t),r()},writev(t,e){s.push(...t),e()}})).on("error",(t=>{e(t)})).on("finish",(()=>{t(s)}))})):"utf8"===t||"utf-8"===t?new Promise(((e,s)=>{let r="";this.setEncoding(t),this.pipe(new n.Writable({decodeStrings:!1,write(t,e,s){r+=t,s()},writev(t,e){r+=t.join(""),e()}})).on("error",(t=>{s(t)})).on("finish",(()=>{e(r)}))})):"buffer"===t?new Promise(((t,e)=>{let s=r.from([]);this.pipe(new n.Writable({decodeStrings:!0,write(t,e,i){s=r.concat([s,t],s.length+t.length),i()}})).on("error",(t=>{e(t)})).on("finish",(()=>{t(s)}))})):void 0}}class h extends n.Transform{until(t,e){return new Promise(((s,r)=>{this.on("error",(t=>{r(t)})),e?this.once(t,((...t)=>{s(this,...t)})):this.once(t,s)}))}bucket(t="utf8"){let e=this._readableState;return e.objectMode?new Promise(((t,e)=>{let s=[];this.pipe(new n.Writable({write(t,e,r){s.push(t),r()},writev(t,e){s.push(...t),e()}})).on("error",(t=>{e(t)})).on("finish",(()=>{t(s)}))})):"utf8"===t||"utf-8"===t?new Promise(((e,s)=>{let r="";this.setEncoding(t),this.pipe(new n.Writable({decodeStrings:!1,write(t,e,s){r+=t,s()},writev(t,e){r+=t.join(""),e()}})).on("error",(t=>{s(t)})).on("finish",(()=>{e(r)}))})):"buffer"===t?new Promise(((t,e)=>{let s=r.from([]);this.pipe(new n.Writable({decodeStrings:!0,write(t,e,i){s=r.concat([s,t],s.length+t.length),i()}})).on("error",(t=>{e(t)})).on("finish",(()=>{t(s)}))})):void 0}import(t){return t.on("data",(t=>this.write(t))).on("end",(()=>this.end())).on("error",(t=>this.emit("error",t))),this}demolish(t){if(this.push=t=>{if(null!==t)throw new Error("[ERR_STREAM_DESTROYED]: Cannot push after stream was destroyed")},this.emit=function(t,...e){"end"!==t&&Object.getPrototypeOf(this).emit.apply(this,[t,...e])},t)return n.Transform.prototype.destroy.call(this,t)}}const _=new Function("try {return this===global;}catch(e){return false;}")(),[c,u]=(()=>"undefined"===typeof i?[!0,!1]:i.browser?[!0,!0]:"undefined"===i.versions||"undefined"===i.versions.node?[!0,!1]:[!1,!1])();(u||_&&+/^v(\d+)/.exec(i.version)[1]<10)&&(h.prototype.destroy=l.prototype.destroy=function(t,e){this._readableState.destroyed=!0,this._writableState.destroyed=!0;let s=()=>{this._writableState.emitClose&&this._readableState.emitClose&&this.emit("close")};return this._destroy(t||null,(t=>{!e&&t?(i.nextTick((()=>{this.emit("error",t),s()})),this._writableState.errorEmitted=!0):(i.nextTick(s),e&&e(t))})),this},h.prototype._destroy=l.prototype._destroy=(t,e)=>e(t));class f extends h{constructor(t={}){super({...t,writableObjectMode:!0,readableObjectMode:!0}),this._as_inputs=new Set,this.on("pipe",(t=>{this._as_inputs.add(t),t.on("prefix",((...t)=>{this.emit("prefix",...t)})).on("comment",((...t)=>{this.emit("comment",...t)}))})),this.on("unpipe",(t=>{this._as_inputs.delete(t)}))}_destroy(){for(let t of this._as_inputs)t.destroy()}}class d extends f{_transform(t,e,s){s(null,JSON.stringify(t.isolate())+"\n")}}class p extends f{_transform(t,e,s){s(null,{type:"quad",value:t})}}h.QuadsToOther=f,t.exports={...n,Readable:a,Writable:o,Duplex:l,Transform:h,QuadsToOther:f,quads_to_json(){return new d},quads_to_writable(){return new p},source(t,e=null){return e||"string"!==typeof t||(e="utf8"),new a({objectMode:!e&&"string"!==typeof t&&!r.isBuffer(t),read(){this.push(t,e),this.push(null)}})}}}}]);
//# sourceMappingURL=5.ebff53b3.js.map