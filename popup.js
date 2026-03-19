document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("notesContainer");
  const clearBtn = document.getElementById("clearBtn");
  const openLiveBtn = document.getElementById("openLiveBtn");

  function loadNotes() {
    chrome.storage.local.get(["notes"], (result) => {
      const notes = result.notes || [];
      container.innerHTML = "";

      if (notes.length === 0) {
        container.innerHTML = "<p>No notes yet...</p>";
        return;
      }

      notes.forEach((note, index) => {
        const div = document.createElement("div");
        div.style.border = "1px solid #ccc";
        div.style.padding = "5px";
        div.style.marginBottom = "5px";

        const title = note.title ? `<p><strong>${note.title}</strong></p>` : '';
        div.innerHTML = `
          ${title}
          <p>${note.text || ''}</p>
          <small>${new Date(note.date).toLocaleString()}</small>
          <br>
          <a href="${note.url || '#'}" target="_blank">Source</a>
        `;

        // add delete button for this note
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.style.marginLeft = '8px';
        delBtn.dataset.date = note.date; // use date as identifier
        delBtn.addEventListener('click', () => {
          // remove this note from storage
          chrome.storage.local.get(['notes'], (res) => {
            const current = res.notes || [];
            const filtered = current.filter(n => n.date !== note.date);
            chrome.storage.local.set({ notes: filtered }, () => {
              loadNotes();
            });
          });
        });

        div.appendChild(delBtn);
        container.appendChild(div);
      });
    });
  }

  // Clear all notes
  clearBtn.addEventListener("click", () => {
    chrome.storage.local.set({ notes: [] });
  });

  // Open live window
  if (openLiveBtn) {
    openLiveBtn.addEventListener('click', () => {
      chrome.windows.create({
        url: chrome.runtime.getURL('live.html'),
        type: 'popup',
        width: 420,
        height: 640
      });
    });
  }

  // Ascultăm schimbările din storage în timp real
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.notes) {
      loadNotes();
    }
  });

  loadNotes();
});