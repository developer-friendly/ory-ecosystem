import { kratosHost } from "./config.js";

var headers = {
  Accept: "application/json",
};
var fetchOptions = {
  headers: headers,
  credentials: "include",
};

export async function whoami() {
  return await fetch(`${kratosHost}/sessions/whoami`, fetchOptions);
}

async function _getFlowInfo(flow, flowId) {
  switch (flow) {
    case "login":
    case "registration":
      return await fetch(
        `${kratosHost}/self-service/${flow}/flows?id=${flowId}`,
        fetchOptions
      );
    default:
      console.error("Unknown flow type", flow);
  }
}

export async function getFlowInfo(flow) {
  var flowId = new URLSearchParams(window.location.search).get("flow");

  if (!flowId) {
    window.location = `${kratosHost}/self-service/${flow}/browser`;
  }

  var flowInfo = await _getFlowInfo(flow, flowId);

  if (flowInfo.status != 200) {
    window.location = `${kratosHost}/self-service/${flow}/browser`;
  }

  return flowInfo;
}

export function createFlowForm(flowInfo) {
  var form = document.createElement("form");
  form.action = flowInfo.ui.action;
  form.method = flowInfo.ui.method;

  flowInfo.ui.nodes.forEach(function parseNode(node) {
    if (node.type === "input") {
      var input = document.createElement("input");
      var attr = node.attributes;
      var label = document.createElement("label");
      if (node.meta && node.meta.label && node.meta.label.text) {
        label.innerText = node.meta.label.text;
      }
      input.type = attr.type;
      input.name = attr.name;
      input.value = attr.value || "";
      if (attr.required) {
        input.required = true;
      }
      if (attr.disabled) {
        input.disabled = true;
      }
      form.appendChild(label);
      form.appendChild(input);
    }
  });

  return form;
}

export async function isLoggedIn() {
  if ((await whoami()).status == 200) {
    window.location = "/";
  }
}