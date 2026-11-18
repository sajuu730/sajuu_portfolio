(() => {
  const feed = document.querySelector("[data-demo-feed]");
  const state = document.querySelector("[data-demo-state]");
  const button = document.querySelector("[data-demo-action]");
  if (!feed || !state || !button) return;
  const type = document.body.dataset.demo;
  const write = (lines) => { feed.innerHTML = lines.map(line => "<p>" + line + "</p>").join(""); };
  if (type === "pipeline") {
    let running = false;
    button.addEventListener("click", () => {
      if (running) return;
      running = true; button.disabled = true; button.textContent = "Processing sample…";
      const steps = [
        ["<span class='dim'>[1/5]</span> Request page from sample REST endpoint", "SOURCE CONNECTOR · FETCH"],
        ["<span class='dim'>[2/5]</span> Validate stable record ID and checkpoint offset", "SOURCE CONNECTOR · CHECKPOINT"],
        ["<span class='dim'>[3/5]</span> Publish sample event to Kafka topic", "KAFKA · EVENT PUBLISHED"],
        ["<span class='dim'>[4/5]</span> Sink batches record for relational write", "JDBC SINK · BATCH"],
        ["<span class='ok'>[5/5] Commit sample transaction</span>", "PIPELINE · EXAMPLE COMPLETE"]
      ];
      let i=0; const next=()=>{write([steps[i][0],"This is a browser-side illustration; no connector or database is contacted."]);state.textContent=steps[i][1];i++;if(i<steps.length)setTimeout(next,650);else{running=false;button.disabled=false;button.textContent="Run sample event again";}};
      next();
    });
  } else if (type === "guardian") {
    let failed=false;
    button.addEventListener("click",()=>{
      failed=!failed;
      if(failed){state.textContent="FAILED · INCIDENT DETECTED";state.classList.add("is-alert");button.textContent="Reset simulation";write(["<span class='dim'>[poll]</span> Connector status response received","<span class='dim'>[status]</span> inventory-sync = FAILED","<span class='dim'>[analysis]</span> APPLICATION category (heuristic)","<span class='ok'>[incident]</span> Alert event generated","[recovery] Automatic recovery remains DISABLED by default"]);}else{state.textContent="HEALTHY · WAITING FOR POLL";state.classList.remove("is-alert");button.textContent="Simulate connector failure";write(["<span class='ok'>[poll]</span> inventory-sync = RUNNING","[monitor] No failed tasks detected","[recovery] Disabled by configuration"]);}});
  } else if (type === "incident") {
    const stages=["OPEN","ACKNOWLEDGED","IN_PROGRESS","RESOLVED"];
    const messages=["Incident created · SEV2 · Checkout API returning 503","Assigned to support engineer · acknowledged","Investigation started · sample log hint: NETWORK (rule-based)","Resolution recorded · synthetic scenario complete"];
    let index=0;
    const render=()=>{state.textContent="STATUS · "+stages[index];write(messages.slice(0,index+1).map((m,i)=>"<span class='dim'>[event "+(i+1)+"]</span> "+m));};
    render();
    button.addEventListener("click",()=>{if(index<stages.length-1){index++;render();}else{index=0;render();}});
  }
})();