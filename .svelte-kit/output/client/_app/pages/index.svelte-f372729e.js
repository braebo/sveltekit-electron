import{C as s,S as t,i as a,s as e,e as n,t as r,c as l,a as c,g as i,d as o,b as h,f as u,F as d,H as f,h as m,G as g,I as $,J as v,l as p,v as k,z as E,K as x,L as b,M as H,N as I,j as N,k as w,m as y,n as C,o as M,r as j,w as G}from"../chunks/vendor-28a355f9.js";let L={};function S(s){let t,a,e,$,v;return{c(){t=n("button"),a=r("Clicks: "),e=r(s[1]),this.h()},l(n){t=l(n,"BUTTON",{id:!0,class:!0});var r=c(t);a=i(r,"Clicks: "),e=i(r,s[1]),r.forEach(o),this.h()},h(){h(t,"id",s[0]),h(t,"class","svelte-1mhlyxc")},m(n,r){u(n,t,r),d(t,a),d(t,e),$||(v=f(t,"click",s[3]),$=!0)},p(s,[a]){2&a&&m(e,s[1]),1&a&&h(t,"id",s[0])},i:g,o:g,d(s){s&&o(t),$=!1,v()}}}function T(t,a,e){let n,{id:r}=a;const l=function(t,a){return L[t]||(L[t]=s(a))}(r,0);$(t,l,(s=>e(1,n=s)));return t.$$set=s=>{"id"in s&&e(0,r=s.id)},[r,n,l,()=>{v(l,n+=1,n)}]}class z extends t{constructor(s){super(),a(this,s,T,S,e,{id:0})}}function A(s){let t;return{c(){t=n("div"),this.h()},l(s){t=l(s,"DIV",{style:!0}),c(t).forEach(o),this.h()},h(){x(t,"height","16rem")},m(s,a){u(s,t,a)},i:g,o:g,d(s){s&&o(t)}}}function B(s){let t,a,e;return{c(){t=n("img"),this.h()},l(s){t=l(s,"IMG",{src:!0,alt:!0,draggable:!0,class:!0}),this.h()},h(){t.src!==(a="/sveltekit-electron.svg")&&h(t,"src","/sveltekit-electron.svg"),h(t,"alt","Svelte Logo"),h(t,"draggable","false"),h(t,"class","svelte-gppvtg")},m(s,a){u(s,t,a)},i(s){e||b((()=>{e=H(t,I,{y:100,duration:1500}),e.start()}))},o:g,d(s){s&&o(t)}}}function D(s){let t;function a(s,t){return s[0]?B:A}let e=a(s),n=e(s);return{c(){n.c(),t=p()},l(s){n.l(s),t=p()},m(s,a){n.m(s,a),u(s,t,a)},p(s,[r]){e!==(e=a(s))&&(n.d(1),n=e(s),n&&(n.c(),k(n,1),n.m(t.parentNode,t)))},i(s){k(n)},o:g,d(s){n.d(s),s&&o(t)}}}function F(s,t,a){let e=!1;return E((()=>a(0,e=!0))),[e]}class J extends t{constructor(s){super(),a(this,s,F,D,e,{})}}function K(s){let t,a,e,f,m,$,v,p;return a=new J({}),v=new z({props:{id:"0"}}),{c(){t=n("main"),N(a.$$.fragment),e=w(),f=n("h1"),m=r("Hello Electron!"),$=w(),N(v.$$.fragment),this.h()},l(s){t=l(s,"MAIN",{class:!0});var n=c(t);y(a.$$.fragment,n),e=C(n),f=l(n,"H1",{class:!0});var r=c(f);m=i(r,"Hello Electron!"),r.forEach(o),$=C(n),y(v.$$.fragment,n),n.forEach(o),this.h()},h(){h(f,"class","svelte-1n2tm7i"),h(t,"class","svelte-1n2tm7i")},m(s,n){u(s,t,n),M(a,t,null),d(t,e),d(t,f),d(f,m),d(t,$),M(v,t,null),p=!0},p:g,i(s){p||(k(a.$$.fragment,s),k(v.$$.fragment,s),p=!0)},o(s){j(a.$$.fragment,s),j(v.$$.fragment,s),p=!1},d(s){s&&o(t),G(a),G(v)}}}export default class extends t{constructor(s){super(),a(this,s,null,K,e,{})}}