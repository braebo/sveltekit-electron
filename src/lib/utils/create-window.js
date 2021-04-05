const windowStateManager = require('electron-window-state');
const { app, BrowserWindow } = require('electron');

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
			// devTools: !isProd,
			devTools: true, // FIXME: Just for debugging build.
			spellcheck: false,
			nodeIntegration: true,
			...(options.webPreferences || {}),
		},
	};

	let windowState = windowStateManager({
		defaultWidth: 800,
		defaultHeight: 600,
	});

	const mainWindow = new BrowserWindow({
		...winOptions,
		x: windowState.x,
		y: windowState.y,
		width: windowState.width,
		height: windowState.height,
	});

	windowState.manage(mainWindow);

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		mainWindow.focus();
	});

	mainWindow.on('close', () => {
		windowState.saveState(mainWindow);
	})

	return mainWindow;
};
