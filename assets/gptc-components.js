(function () {
  const WX_ID = "jiage01888";

  function track(eventName, detail) {
    if (!eventName) return;
    const payload = Object.assign({ event: eventName }, detail || {});
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    if (typeof window.gtag === "function") window.gtag("event", eventName, detail || {});
    window.dispatchEvent(new CustomEvent("gptc:track", { detail: payload }));
  }

  function showToast(text) {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function appendFromParam(link) {
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("/buy/plus") && !href.startsWith("/activate/")) return;
    const source = link.dataset.track || link.dataset.from || "";
    if (!source || href.includes("from=")) return;
    const glue = href.includes("?") ? "&" : "?";
    link.setAttribute("href", `${href}${glue}from=${encodeURIComponent(source)}`);
  }

  function normalizeButtonText() {
    document.querySelectorAll("a, button").forEach((node) => {
      const text = (node.textContent || "").trim();
      const oldBuyText = "购买" + "激活码";
      const oldActivateText = "已购买？去" + "自助" + "激活";
      const oldActivateShort = "已购买" + "去激活";
      const oldConsultText = "Pro / " + "异常订单咨询";
      if (text === oldBuyText || text === "购买 Plus 激活码") {
        node.textContent = "立即充值 Plus";
      }
      if (text === oldActivateText || text === oldActivateShort) {
        node.textContent = "已购买？去站内激活";
      }
      if (text === oldConsultText || text === oldConsultText + "微信") {
        node.textContent = "不确定？复制微信咨询";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    normalizeButtonText();

    document.querySelectorAll("[data-track]").forEach((element) => {
      appendFromParam(element);
      element.addEventListener("click", () => track(element.dataset.track));
    });

    document.querySelectorAll("[data-copy-wx]").forEach((trigger) => {
      trigger.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(WX_ID);
          track(trigger.dataset.track || "blog_wechat_copy");
          showToast(`已复制微信：${WX_ID}`);
        } catch (error) {
          track(trigger.dataset.track || "blog_wechat_copy", { fallback: true });
          showToast(`微信号：${WX_ID}`);
        }
      });
    });
  });
})();
