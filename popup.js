document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('apiKeyInput');
  const radios = document.querySelectorAll('input[name="action_mode"]');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');

  const data = await chrome.storage.local.get(['grokApiKey', 'action_mode']);
  
  if (data.grokApiKey) {
    apiKeyInput.value = data.grokApiKey;
  }

  const currentMode = data.action_mode || 'click';
  radios.forEach(r => {
    if (r.value === currentMode) r.checked = true;
  });

  saveBtn.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim();
    const selectedMode = document.querySelector('input[name="action_mode"]:checked')?.value || 'click';

    await chrome.storage.local.set({
      grokApiKey: key,
      action_mode: selectedMode
    });

    status.style.color = '#16a34a';
    status.textContent = '✓ تم حفظ الإعدادات بنجاح!';
    setTimeout(() => {
      status.textContent = '';
    }, 2000);
  });
});