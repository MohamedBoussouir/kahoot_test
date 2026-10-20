document.addEventListener('KAHOOT_TRIGGER_MULTI_CLICK', (e) => {
  const data = e.detail;
  if (!data || !Array.isArray(data.indices) || data.indices.length === 0) return;

  const cards = document.querySelectorAll('[data-functional-selector^="answer-"]');

  const triggerClick = (element) => {
    if (!element) return;

    // محاولة استدعاء معالج React
    const reactKey = Object.keys(element).find(k => k.startsWith('__reactProps'));
    if (reactKey && typeof element[reactKey]?.onClick === 'function') {
      try {
        element[reactKey].onClick({
          type: "click",
          bubbles: true,
          cancelable: true,
          defaultPrevented: false,
          isTrusted: true,
          nativeEvent: { isTrusted: true },
          target: element,
          currentTarget: element,
          persist: () => {},
          preventDefault: () => {},
          stopPropagation: () => {}
        });
      } catch (err) {}
    }

    // إطلاق أحداث الماوس
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(type => {
      element.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
    });
  };

  // النقر على الخيارات عبر توقيت تسلسلي
  data.indices.forEach((idx, i) => {
    setTimeout(() => {
      if (cards[idx]) {
        const target = cards[idx].querySelector('button') || cards[idx];
        triggerClick(target);
        console.log(`✅ [Clicker] تم النقر على الخيار رقم: ${idx}`);
      }
    }, i * 150);
  });

  // إذا كان السؤال يتطلب زر Submit
  if (data.isMultiSelect) {
    const submitDelay = (data.indices.length * 150) + 300;
    setTimeout(() => {
      const submitBtn = document.querySelector('[data-functional-selector="multi-select-submit-button"]') ||
                        Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim().toLowerCase() === 'submit');

      if (submitBtn) {
        console.log("🚀 [Clicker] الضغط على زر Submit لتأكيد الإجابات...");
        triggerClick(submitBtn);
      }
    }, submitDelay);
  }
});