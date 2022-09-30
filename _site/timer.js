let e;const s={start:()=>{e=setInterval((function(){postMessage("")}),1e3)},pause:()=>{clearInterval(e)},stop:()=>{clearInterval(e)}};onmessage=function({data:e}){s[e]||console.log("issue!"),s[e]()};
