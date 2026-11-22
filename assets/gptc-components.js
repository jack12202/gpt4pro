(function(){
  const WX = "jiage01888";
  function showToast(msg){
    let t = document.getElementById("jgWxToast");
    if(!t){
      t = document.createElement("div");
      t.id = "jgWxToast";
      t.style.cssText = "position:fixed;left:50%;bottom:88px;z-index:10002;transform:translateX(-50%);padding:10px 18px;border-radius:10px;background:#0f172a;color:#fff;font-size:14px;font-weight:700;opacity:0;pointer-events:none;transition:opacity .18s;box-shadow:0 10px 26px rgba(15,23,42,.28);";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = "1";
    clearTimeout(showToast.tm);
    showToast.tm = setTimeout(()=>{ t.style.opacity = "0"; }, 2200);
  }
  function copyWx(){
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(WX).then(()=>showToast("已复制微信号：" + WX)).catch(()=>fb());
    } else { fb(); }
  }
  function fb(){
    const ta = document.createElement("textarea");
    ta.value = WX; document.body.appendChild(ta); ta.select();
    try{ document.execCommand("copy"); showToast("已复制微信号：" + WX); }
    catch{ showToast("微信号：" + WX); }
    ta.remove();
  }
  function ensureModal(){
    let m = document.getElementById("jgWxQrModal");
    if(m) return m;
    m = document.createElement("div");
    m.id = "jgWxQrModal";
    m.setAttribute("role","dialog");
    m.setAttribute("aria-modal","true");
    m.style.cssText = "position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(15,23,42,.58);backdrop-filter:blur(4px);";
    m.innerHTML = `<div style="width:min(380px,100%);background:#fff;border-radius:18px;padding:24px;box-shadow:0 24px 60px rgba(15,23,42,.28);text-align:center;font-family:system-ui,-apple-system,sans-serif;">
      <div style="display:inline-flex;padding:4px 12px;border-radius:999px;background:#eef2ff;color:#4338ca;font-size:12px;font-weight:800;margin-bottom:8px;">嘉哥AI 人工对接</div>
      <h3 style="margin:0 0 6px;font-size:20px;font-weight:900;color:#0f172a;">扫码添加嘉哥微信</h3>
      <p style="margin:0 0 14px;font-size:13.5px;color:#475569;line-height:1.6;">Pro 100/200/500、Gemini/Grok、企业开票（+5%）与对公转账一对一办理（9:00–23:00）。</p>
      <img src="/assets/wechat-qr.jpg" alt="嘉哥AI 微信二维码 jiage01888" style="width:210px;max-width:100%;height:auto;border-radius:12px;border:1px solid #e2e8f0;display:block;margin:0 auto 12px;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;margin-bottom:12px;">
        <div style="text-align:left;"><div style="font-size:11.5px;color:#64748b;">微信号</div><strong style="font-size:16px;color:#0f172a;">jiage01888</strong></div>
        <button type="button" id="jgWxCopyBtn" style="padding:8px 14px;border-radius:9px;border:0;background:linear-gradient(135deg,#4f46e5 0%,#6366f1 100%);color:#fff;font-size:13px;font-weight:800;cursor:pointer;">复制微信号</button>
      </div>
      <button type="button" id="jgWxCloseBtn" style="width:100%;padding:10px;border-radius:10px;border:1px solid #e2e8f0;background:#fff;color:#475569;font-size:14px;font-weight:700;cursor:pointer;">关闭</button>
    </div>`;
    document.body.appendChild(m);
    m.addEventListener("click", e=>{ if(e.target===m) m.style.display="none"; });
    m.querySelector("#jgWxCloseBtn").addEventListener("click", ()=>{ m.style.display="none"; });
    m.querySelector("#jgWxCopyBtn").addEventListener("click", copyWx);
    document.addEventListener("keydown", e=>{ if(e.key==="Escape" && m.style.display==="flex") m.style.display="none"; });
    return m;
  }
  function openModal(){
    ensureModal().style.display = "flex";
    copyWx();
  }
  window.openJiageWechat = openModal;
  function init(){
    if(!document.getElementById("jgFloatWxBtn")){
      const st = document.createElement("style");
      st.textContent = "#jgFloatWxBtn{position:fixed;right:18px;bottom:22px;z-index:9999;display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:999px;border:1px solid rgba(255,255,255,.18);background:#0f172a;color:#fff;font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 12px 30px rgba(15,23,42,.32);transition:transform .15s,background .15s}#jgFloatWxBtn:hover{transform:translateY(-2px);background:#1e293b}@media(max-width:680px){#jgFloatWxBtn{bottom:78px;right:14px;padding:10px 15px;font-size:13.5px}}";
      document.head.appendChild(st);
      const b = document.createElement("button");
      b.id = "jgFloatWxBtn";
      b.type = "button";
      b.innerHTML = '<span style="width:8px;height:8px;border-radius:999px;background:#22c55e;display:inline-block;"></span><span>微信咨询</span>';
      b.addEventListener("click", openModal);
      document.body.appendChild(b);
    }
    document.querySelectorAll("[data-copy-wx],[data-wx-trigger],.js-copy-wx").forEach(el=>{
      if(el.dataset.jgBound) return;
      el.dataset.jgBound = "1";
      el.addEventListener("click", e=>{ e.preventDefault(); openModal(); });
    });
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
