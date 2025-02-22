const fs=require("fs"),axios=require("axios"),readline=require("readline"),token=fs.readFileSync("token.txt","utf8").trim(),api=axios.create({baseURL:"https://api.infinityg.ai/api/v1",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json","User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",Accept:"*/*",Origin:"https://www.infinityg.ai",Referer:"https://www.infinityg.ai/"}}),sleep=t=>new Promise(e=>setTimeout(e,t)),banner=`
██╗  ██╗ █████╗ ███████╗██╗   ██╗██╗  ██╗ █████╗ 
██║ ██╔╝██╔══██╗╚══███╔╝██║   ██║██║  ██║██╔══██╗
█████╔╝ ███████║  ███╔╝ ██║   ██║███████║███████║
██╔═██╗ ██╔══██║ ███╔╝  ██║   ██║██╔══██║██╔══██║
██║  ██╗██║  ██║███████╗╚██████╔╝██║  ██║██║  ██║
╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
🔥 InfinityG Task Bot by Kazuha 🔥
`;function formatResponse(t){return"90000"===t.code&&"成功"===t.message?{...t,message:"✅ Success",status:"Operation completed successfully"}:t}async function animatedMessage(t,e=100){let a=[".  ",".. ","..."];for(let n=0;n<3;n++)process.stdout.write(`\r${t}${a[n]}`),await sleep(e);process.stdout.write(`\r${t} ✅
`)}async function dailyCheckIn(){try{await animatedMessage("\uD83D\uDD04 Checking in");let t=await api.post("/task/checkIn/");console.log("\uD83C\uDF89 Daily check-in:",formatResponse(t.data))}catch(e){console.error("❌ Check-in error:",e.response?.data||e.message)}}async function getTaskList(){try{await animatedMessage("\uD83D\uDCCB Retrieving task list");let t=await api.post("/task/list");return console.log("✅ Task list:",formatResponse(t.data)),t.data}catch(e){console.error("❌ Task list error:",e.response?.data||e.message)}}async function completeTask(t){try{await animatedMessage(`✅ Completing task ${t}`);let e=await api.post("/task/complete",{taskId:t});console.log(`🎯 Task ${t} completed:`,formatResponse(e.data))}catch(a){console.error(`❌ Error completing task ${t}:`,a.response?.data||a.message)}}async function claimTask(t){try{await animatedMessage(`💰 Claiming reward for task ${t}`);let e=await api.post("/task/claim",{taskId:t});console.log(`🏆 Task ${t} reward claimed:`,formatResponse(e.data))}catch(a){console.error(`❌ Error claiming task ${t}:`,a.response?.data||a.message)}}async function runBot(){try{for(let t of(console.log("\n\uD83D\uDE80 Starting InfinityG bot..."),await dailyCheckIn(),await sleep(2e3),await getTaskList(),await sleep(2e3),[8,15,7]))await completeTask(t),await sleep(2e3),await claimTask(t),await sleep(2e3);console.log("\uD83C\uDF89 Bot tasks completed successfully!")}catch(e){console.error("❌ Bot error:",e)}}function getTimeUntilNextRun(){let t=new Date,e=new Date(t);return e.setDate(e.getDate()+1),e.setHours(0,1,0,0),e-t}function formatTimeRemaining(t){return`${Math.floor(t/1e3/60/60%24)}h ${Math.floor(t/1e3/60%60)}m ${Math.floor(t/1e3%60)}s`}function startCountdown(t){let e=setInterval(()=>{t-=1e3,readline.clearLine(process.stdout,0),readline.cursorTo(process.stdout,0),process.stdout.write(`⏳ Next run in: ${formatTimeRemaining(t)} `),t<=0&&(clearInterval(e),console.log("\n\uD83D\uDE80 Restarting bot now...\n"))},1e3)}async function runBotWithCountdown(){for(;;){await runBot();let t=getTimeUntilNextRun();console.log(`
⏳ Next run in: ${formatTimeRemaining(t)}
`),startCountdown(t),await sleep(t)}}console.log(banner),console.log("\uD83C\uDFAF Starting bot with countdown timer...\n"),runBotWithCountdown();
