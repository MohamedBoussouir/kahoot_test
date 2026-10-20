function extractQuestionData() {
  const questionEl = document.querySelector(CONFIG.SELECTORS.QUESTION_TEXT);
  const optionEls = document.querySelectorAll(CONFIG.SELECTORS.OPTION_CARD);

  if (!questionEl || optionEls.length === 0) {
    return null;
  }

  const question = questionEl.innerText.trim();
  const options = [];

  optionEls.forEach((el, index) => {
    options.push({
      index: index,
      text: el.innerText.trim() || `Option ${index}`
    });
  });

  const hasSubmitBtn = Boolean(
    document.querySelector('[data-functional-selector="multi-select-submit-button"]') ||
    Array.from(document.querySelectorAll('button')).some(b => b.innerText.trim().toLowerCase() === 'submit')
  );

  return {
    question: question,
    options: options,
    isMultiSelect: hasSubmitBtn
  };
}