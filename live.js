document.addEventListener('DOMContentLoaded', () => {
  const status = document.getElementById('status');
  const liveList = document.getElementById('liveList');

  function render(notes) {
    liveList.innerHTML = '';
    if (!notes || notes.length === 0) {
      status.textContent = 'Nu există notițe.';
      return;
    }
    status.textContent = `Notițe: ${notes.length}`;
    for (const n of notes) {
      const li = document.createElement('li');
      const left = document.createElement('div');
      left.style.flex = '1';
      const meta = document.createElement('div');
      meta.className = 'note-meta';
      meta.textContent = new Date(n.date || n.created || n.timestamp || 0).toLocaleString();
      const text = document.createElement('div');
      text.className = 'note-text';
      text.textContent = n.text || '';
      left.appendChild(meta);
      left.appendChild(text);

      const del = document.createElement('button');
      del.textContent = 'Șterge';
      del.addEventListener('click', () => {
        chrome.storage.local.get(['notes'], (res) => {
          const current = res.notes || [];
          const filtered = current.filter(item => (item.date || item.created) !== (n.date || n.created));
          chrome.storage.local.set({ notes: filtered });
        });
      });

      li.appendChild(left);
      li.appendChild(del);
      liveList.appendChild(li);
    }
  }

  // initial load
  chrome.storage.local.get(['notes'], (res) => {
    render(res.notes || []);
  });

  // live update
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.notes) {
      render(changes.notes.newValue || []);
    }
  });
});
