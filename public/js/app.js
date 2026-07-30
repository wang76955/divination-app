// ===== 应用初始化入口 =====
// 本文件负责初始化工作，主要逻辑在 divination.js 中

document.addEventListener("DOMContentLoaded", () => {
  // 初始化爻计数器显示
  updateYaoCounter();
  
  // 简化初始化：已有 initHexagramSlots() 在 startDivination 中调用
  
  console.log("🔮 周易卜卦已加载");
  console.log("📜 取三枚铜钱，抛六次，自下而上成卦");
});
