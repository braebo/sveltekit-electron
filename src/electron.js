const createWindow = require('./lib/utils/create-window');
const contextMenu = require('electron-context-menu');
const { app } = require('electron');

try {
	require('electron-reloader')(module);
} catch {}

contextMenu({
	showLookUpSelection: false,
	showSearchWithGoogle: false,
	showCopyImage: false,
	prepend: (defaultActions, params, browserWindow) => [
		{
			label: 'its like magic 💥',
		},
	],
});

const port = process.env.PORT || 3333;
const isDev = !app.isPackaged;

let mainWindow;

function loadVitePage(port) {
	mainWindow.loadURL(`http://localhost:${port}`).catch((err) => {
		console.log('VITE NOT READY, WILL TRY AGAIN IN 200ms');
		setTimeout(() => {
			// do it again as the vite build can take a bit longer the first time
			loadVitePage(port);
		}, 200);
	});
}

function createMainWindow() {
	mainWindow = createWindow('main', {
		backgroundColor: 'whitesmoke',
	});
	mainWindow.once('close', () => {
		mainWindow = null;
	});

	if (isDev) {
		loadVitePage(port);
	} else {
		mainWindow.loadFile('dist/index.html');
	}
}

app.once('ready', createMainWindow);
app.on('activate', () => {
	if (!mainWindow) {
		createMainWindow();
	}
});
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
