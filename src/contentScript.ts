import { translateText } from './translator';
import { apiKey } from './apiKey';

export {};

const bootstrapCSS = document.createElement('link');
bootstrapCSS.rel = 'stylesheet';
// bootstrapCSS.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';
bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
// 引入自定义的CSS会污染注入页面样式,避免方法是使用Shadow DOM,但Shadow DOM需要更换坐标计算方式
document.head.appendChild(bootstrapCSS);

const logoUrl = chrome.runtime.getURL("logo.png");

const logo = document.createElement("img");
logo.src = logoUrl;
logo.style.position = "absolute";
logo.style.width = "30px";
logo.style.height = "30px";
logo.style.cursor = "pointer";
logo.style.zIndex = "1000";
logo.style.display = "none";
document.body.appendChild(logo);

const popup = document.createElement("div");
popup.className = "card shadow-sm";
popup.style.position = "absolute";
popup.style.width = "400px";
popup.style.maxHeight = "510px";
popup.style.overflowY = "auto";
popup.style.zIndex = "1000";
popup.style.display = "none";
popup.innerHTML = `
    <div class="card-header">
        <h5 class="card-title mb-0">翻译窗口</h5>

    </div>
    <div class="card-body">
        <div class="form-group">
            <label for="original_text">原文:</label>
            <div id="original_text" class="form-control" style="height: auto; margin-bottom: 10px; overflow-wrap: break-word;"></div>
        </div>
        <div class="form-group">
            <label for="translated_text">翻译:</label>
            <div id="translated_text" class="form-control" style="height: auto; overflow-wrap: break-word;"></div>
        </div>
    </div>
`;
document.body.appendChild(popup);


console.log('[DEBUG] content script loaded');

document.addEventListener('mouseup', async () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) { // 如果有选中文本 && 选中文本的范围大于0
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            logo.style.top = `${window.scrollY + rect.top - 35}px`;
            logo.style.left = `${window.scrollX + rect.left}px`;
            logo.style.display = "block";
            (document.getElementById('original_text') as HTMLElement).innerText = selectedText;
            console.log("[DEBUG] 选中文本: ", selectedText);
            // console.log("logo.location: ", logo.style.top, logo.style.left);
        }
    } else {
        logo.style.display = "none";
        popup.style.display = "none";
        (document.getElementById('original_text') as HTMLElement).innerText = '';
        (document.getElementById('translated_text') as HTMLElement).innerText = '';
    }
});

logo.addEventListener('click', async () => {
    popup.style.top = `${parseInt(logo.style.top) + 35}px`;
    popup.style.left = logo.style.left;
    popup.style.display = "block";

    const originalText = (document.getElementById('original_text') as HTMLElement).innerText;
    if (apiKey) {
        console.log("API Key 已设置");
        const onStream = (translatedText: string) => {
            (document.getElementById('translated_text') as HTMLElement).innerText = translatedText;
            popup.style.height = 'auto';
            const newHeight = popup.scrollHeight;
            popup.style.height = newHeight > 510 ? '510px' : `${newHeight}px`;
        };
        const translatedText = await translateText(apiKey, originalText, onStream);
        (document.getElementById('translated_text') as HTMLElement).innerText = translatedText;
    } else {
        console.error("API Key 未设置");
        (document.getElementById('translated_text') as HTMLElement).innerText = "API Key 未设置";
    }
});
