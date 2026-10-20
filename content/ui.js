async function selectAndClickAnswers(indices, isMultiSelect) {
  const optionCards = document.querySelectorAll(CONFIG.SELECTORS.OPTION_CARD);

  let mode = 'click';
  try {
    const storage = await chrome.storage.local.get(['action_mode']);
    mode = storage.action_mode || 'click';
  } catch (e) {}

  // تمييز الخيارات بصرياً
  indices.forEach(idx => {
    if (optionCards[idx]) {
      optionCards[idx].style.border = "5px solid #22c55e";
      optionCards[idx].style.boxShadow = "0 0 20px #22c55e";
      optionCards[idx].style.borderRadius = "8px";
    }
  });

  if (mode === 'highlight') return;

  // إرسال أمر النقر للمصفوفة
  document.dispatchEvent(new CustomEvent('KAHOOT_TRIGGER_MULTI_CLICK', {
    detail: { indices: indices, isMultiSelect: isMultiSelect }
  }));
}