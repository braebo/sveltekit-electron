const createWindow = require('./lib/utils/create-window');
const contextMenu = require('electron-context-menu');
const serve = require('electron-serve');
const { app } = require('electron');

const port = process.env.PORT || 3333;
const isDev = !app.isPackaged;

let mainWindow;

try {
	require('electron-reloader')(module);
} catch (e) {
	console.error(e);
}

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

function loadViteDev(port) {
	mainWindow.loadURL(`http://localhost:${port}`).catch((err) => {
		console.log('Vite unable to load URL, retrying in 200ms');
		setTimeout(() => {
			loadViteDev(port); // retry
		}, 200);
	});
}
function loadViteProd() {
	mainWindow.loadURL({directory: '.'}).catch((err) => {
		console.log('Vite unable to load URL, retrying in 200ms');
		setTimeout(() => {
			loadViteProd(); // retry
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
		loadViteDev(port);
	} else {
		loadViteProd()
		// mainWindow.loadFile('dist/index.html');
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
