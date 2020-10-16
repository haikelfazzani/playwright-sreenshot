let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
chrome = isChrome ? chrome : browser;

let loadingEl = document.querySelector('.lds-dual-ring');

async function sendAction (message) {
	return new Promise(async (resolve) => {
		chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, message, null, response => {
				resolve(response);
			});
		});
	});
}

document.querySelector('.btns-container').addEventListener('click', async (e) => {

	let audio = new Audio('../camera.mp3');
	audio.volume = 0.1;

	if (e.target.id === 'btn-fullpage') {
		await sendAction({ action: 'start' });
		audio.play();
	}

	if (e.target.id === 'btn-partial') {
		await sendAction({ action: 'capture-visible-page' });
		audio.play();
	}

	if (chrome.runtime.lastError) {
		// console.log(chrome.runtime.lastError);
		// document.querySelector('.container').classList.remove('disp-none');
	}
});

chrome.runtime.onMessage.addListener((request) => {

	if (request.action === "capture-finished" && request.url) {
		loadingEl.classList.add('disp-none');
	}

	if (request.action === "capture") {
		loadingEl.classList.remove('disp-none');
	}
});