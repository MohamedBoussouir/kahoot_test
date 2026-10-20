const CONFIG = {
  GROQ: {
    API_KEY: "" // يمكن تركه فارغاً وتحديده مباشرة عبر واجهة الإضافة
  },
  SELECTORS: {
    QUESTION_TEXT: '[data-functional-selector="block-title"], [data-functional-selector="question-title"]',
    OPTION_CARD: '[data-functional-selector^="answer-"]'
  }
};