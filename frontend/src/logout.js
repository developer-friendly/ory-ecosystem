import { createFlowForm, getFlowInfo, initFlow, whoami } from "./utils.js";

async function createForm() {
  var flowInfo;

  var extraHeaders = {
    Accept: "application/json",
  };

  flowInfo = await initFlow("logout", extraHeaders);

  var flowJson = await flowInfo.json();

  await fetch(flowJson.logout_url, { credentials: "include" });

  window.location.href = "/login";
}

export default createForm;
