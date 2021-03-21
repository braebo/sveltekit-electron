const { app, screen, BrowserWindow } = require('electron');
const windowStateKeeper = require('electron-window-state');

const isProd = app.isPackaged;

module.exports = function createWindow(windowName = 'main', options = {}) {
	const winOptions = {
		minWidth: 500,
		minHeight: 450,
		titleBarStyle: 'hidden',
		autoHideMenuBar: true,
		trafficLightPosition: {
			x: 17,
			y: 32,
		},
		...options,
		webPreferences: {
			contextIsolation: true,
			devTools: !isProd,
			spellcheck: false,
			nodeIntegration: true,
			...(options.webPreferences || {}),
		},
	};

	let windowState = windowStateKeeper({
		defaultWidth: 800,
		defaultHeight: 600,
	});

	let win;

	win = new BrowserWindow({
		...winOptions,
		x: windowState.x,
		y: windowState.y,
		width: windowState.width,
		height: windowState.height,
	});
	windowState.manage(win);

	win.once('ready-to-show', () => {
		win.show();
		win.focus();
	});

	return win;
};
