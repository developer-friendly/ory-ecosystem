import { createFlowForm, getFlowInfo, initFlow } from "./utils.js";

async function createForm(flowId) {
  console.log("Registration Flow ID", flowId);
  var flowInfo;

  if (!flowId) {
    flowInfo = await initFlow("registration");

    flowId = new URL(flowInfo.url).searchParams.get("flow");
  }

  flowInfo = await getFlowInfo("registration", flowId);

  if (flowInfo.status != 200) {
    return await createForm();
  }

  var registrationJson = await flowInfo.json();

  console.log(registrationJson);

  var form = createFlowForm(registrationJson, "Sign Up");

  return form;
}

export default createForm;
