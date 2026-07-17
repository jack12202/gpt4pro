(function () {
  if (window.__gptcClickTrackingLoaded) return;
  window.__gptcClickTrackingLoaded = true;

  const HIGH_INTENT_EVENTS = {
    purchase: "purchase_click",
    activate: "activate_click",
    consult: "consult_click",
    pro: "pro_click",
  };

  function cleanText(value, maxLength) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength || 100);
  }

  function getElementLabel(element) {
    return cleanText(
      element.getAttribute("aria-label") ||
        element.getAttribute("title") ||
        element.dataset.track ||
        element.dataset.trackEvent ||
        element.textContent ||
        element.id ||
        element.className,
      100
    );
  }

  function getSafeUrl(href) {
    if (!href) return { outbound: false };
    try {
      const url = new URL(href, window.location.href);
      const isHttp = url.protocol === "http:" || url.protocol === "https:";
      const isSameOrigin = url.origin === window.location.origin;
      return {
        link_url: isSameOrigin ? url.pathname : `${url.origin}${url.pathname}`,
        link_domain: url.hostname,
        link_path: url.pathname,
        outbound: isHttp && !isSameOrigin,
      };
    } catch (error) {
      return { link_url: cleanText(href, 100), outbound: false };
    }
  }

  function getArea(element) {
    const area = element.closest("[data-track-area], section, header, footer, nav, aside, main");
    if (!area) return "";
    return cleanText(
      area.dataset.trackArea ||
        area.getAttribute("aria-label") ||
        area.id ||
        area.className ||
        area.tagName.toLowerCase(),
      80
    );
  }

  function inferIntent(element, urlMeta) {
    const href = element.getAttribute("href") || "";
    const signal = [
      element.dataset.track,
      element.dataset.trackEvent,
      href,
      getElementLabel(element),
    ]
      .join(" ")
      .toLowerCase();

    if (signal.includes("fe.dtyuedan.cn/shop") || signal.includes("购买") || signal.includes("buy")) {
      return "purchase";
    }
    if (signal.includes("987ai.vip/recharge") || signal.includes("aipass.me/api/recharge-go") || signal.includes("激活") || signal.includes("activate")) {
      return "activate";
    }
    if (signal.includes("/pro") || signal.includes("pro") || signal.includes("5x") || signal.includes("20x")) {
      return "pro";
    }
    if (element.hasAttribute("data-copy-wx") || signal.includes("微信") || signal.includes("咨询") || signal.includes("consult")) {
      return "consult";
    }
    if (urlMeta.outbound) return "outbound";
    if (href.startsWith("#")) return "anchor";
    if (element.tagName.toLowerCase() === "button") return "button";
    return "internal";
  }

  function track(eventName, detail) {
    if (!eventName) return;
    const payload = Object.assign({ event: eventName }, detail || {});
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    if (typeof window.gtag === "function") window.gtag("event", eventName, detail || {});
    window._hmt = window._hmt || [];
    window._hmt.push([
      "_trackEvent",
      "conversion",
      eventName,
      cleanText(`${window.location.pathname}|${payload.click_area || ""}|${payload.click_text || ""}`, 160),
    ]);
    window.dispatchEvent(new CustomEvent("gptc:track", { detail: payload }));
  }

  document.addEventListener(
    "click",
    (event) => {
      const element = event.target.closest("a, button, [role='button'], [data-track], [data-track-event], [data-copy-wx]");
      if (!element || element.hasAttribute("data-track-ignore")) return;

      const trackedEvent = element.dataset.track || element.dataset.trackEvent || "";
      const urlMeta = getSafeUrl(element.getAttribute("href") || "");
      const intent = inferIntent(element, urlMeta);
      const detail = Object.assign(
        {
          click_text: getElementLabel(element),
          click_intent: intent,
          click_area: getArea(element),
          click_tag: element.tagName.toLowerCase(),
          tracked_event: cleanText(trackedEvent, 80),
          page_path: window.location.pathname,
          page_title: cleanText(document.title, 100),
        },
        urlMeta
      );

      track("site_click", detail);
      if (HIGH_INTENT_EVENTS[intent]) track(HIGH_INTENT_EVENTS[intent], detail);
    },
    true
  );
})();
