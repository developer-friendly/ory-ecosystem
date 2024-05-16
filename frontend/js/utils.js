import { kratosHost } from "./config.js";

var fetchOptions = {
  credentials: "include",
};

export async function whoami() {
  return await fetch(`${kratosHost}/sessions/whoami`, fetchOptions);
}

export async function getFlowInfo(flow, flowId) {
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

export function createFlowForm(flowInfo, submitLabel = null) {
  var form = document.createElement("form");
  form.action = flowInfo.ui.action;
  form.method = flowInfo.ui.method;

  var autofocus = false;

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
      if (input.type != "submit") {
        input.value = attr.value || "";
      } else {
        input.value = submitLabel || "Submit";
        input.classList.add("button");
      }
      if (attr.required) {
        input.required = true;
        if (attr.type != "hidden") {
          var required = document.createElement("span");
          required.innerText = " *";
          required.className = "required";
          label.appendChild(required);
        }
      }
      if (attr.disabled) {
        input.disabled = true;
      }
      if (input.type != "submit") {
        form.appendChild(label);
      }

      if (!autofocus && input.type != "hidden") {
        input.autofocus = true;
        autofocus = true;
      }

      form.appendChild(input);
    }
  });

  return form;
}

export async function initFlow(flow) {
  return await fetch(`${kratosHost}/self-service/${flow}/browser`, fetchOptions);
}

export async function isLoggedIn() {
  try {
    var whoamiResponse = await whoami();
    return whoamiResponse.status == 200;
  } catch (e) {
    console.error(e);
    return false;
  }
}
