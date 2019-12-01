"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const path_1 = require("path");
const url_1 = require("url");
let win;
const createWindow = () => {
    win = new electron_1.BrowserWindow({
        title: 'CRG Upgrade Utility',
        // icon: join(__dirname, '../build/flamingo-white.png'),
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    win.loadURL(url_1.format({
        pathname: path_1.join(__dirname, '../src/index.html'),
        protocol: 'file',
        slashes: true,
    }));
    if (electron_is_dev_1.default) {
        win.webContents.openDevTools();
        require('devtron').install();
    }
    // Prevent files dropped outside of the drop zone from doing anything.
    win.webContents.on('will-navigate', (event) => event.preventDefault());
    win.on('closed', () => {
        win = null;
    });
    win.webContents.on('crashed', () => {
        electron_1.dialog.showMessageBox(win, {
            type: 'error',
            title: 'CRG Upgrade Utility',
            message: 'CRG Upgrade Utility has crashed.  This should probably not surprise you.',
        });
    });
    win.on('unresponsive', () => {
        electron_1.dialog.showMessageBox(win, {
            type: 'error',
            title: 'CRG Upgrade Utility',
            // tslint:disable-next-line: max-line-length
            message: 'CRG Upgrade Utility has become unresponsive.  You should probably have been more emotionally supportive.',
        });
    });
    const menu = electron_1.Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Exit',
                    accelerator: 'CmdOrCtrl+Q',
                    click() {
                        electron_1.app.quit();
                    },
                },
            ],
        },
    ]);
    electron_1.Menu.setApplicationMenu(menu);
    // Do version check
    win.webContents.on('did-finish-load', () => {
        win.webContents.send('do-version-check', electron_1.app.getVersion());
    });
    win.webContents.on('new-window', (e, url) => {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    });
};
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (win == null) {
        createWindow();
    }
});
electron_1.ipcMain.on('error-thrown', (event, msg, url, lineNo, columnNo) => {
    electron_1.dialog.showMessageBox(win, {
        type: 'error',
        title: 'CRG Upgrade Utility',
        message: `CRG Upgrade Utility has encountered an error.
        Here's some details:
        Message: ${msg}
        URL: ${url}
        Line Number: ${lineNo}
        Column Number: ${columnNo}
        Does this help?  It probably doesn't help.`,
    });
});
process.on('uncaughtException', (err) => {
    electron_1.dialog.showMessageBox(win, {
        type: 'error',
        title: 'CRG Upgrade Utility',
        // tslint:disable-next-line: max-line-length
        message: `CRG Upgrade Utility has had an uncaught exception in main.js.  Does this help? (Note: will probably not help.) ${err}`,
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHVDQUEwRTtBQUMxRSxzRUFBbUM7QUFDbkMsK0JBQTJCO0FBQzNCLDZCQUF5QztBQUV6QyxJQUFJLEdBQWtCLENBQUE7QUFFdEIsTUFBTSxZQUFZLEdBQUcsR0FBRyxFQUFFO0lBQ3RCLEdBQUcsR0FBRyxJQUFJLHdCQUFhLENBQUM7UUFDcEIsS0FBSyxFQUFFLHFCQUFxQjtRQUM3Qix3REFBd0Q7UUFDdkQsS0FBSyxFQUFFLEdBQUc7UUFDVixNQUFNLEVBQUUsR0FBRztRQUNYLGNBQWMsRUFBRTtZQUNaLGVBQWUsRUFBRSxJQUFJO1NBQ3hCO0tBQ0osQ0FBQyxDQUFBO0lBRUYsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFTLENBQUM7UUFDbEIsUUFBUSxFQUFFLFdBQUksQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLENBQUM7UUFDOUMsUUFBUSxFQUFFLE1BQU07UUFDaEIsT0FBTyxFQUFFLElBQUk7S0FDaEIsQ0FBQyxDQUFDLENBQUE7SUFFSCxJQUFJLHlCQUFLLEVBQUU7UUFDUCxHQUFHLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFBO1FBQzlCLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUMvQjtJQUVELHNFQUFzRTtJQUN0RSxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFBO0lBRXRFLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtRQUNsQixHQUFHLEdBQUcsSUFBSSxDQUFBO0lBQ2QsQ0FBQyxDQUFDLENBQUE7SUFFRixHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1FBQy9CLGlCQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRTtZQUN2QixJQUFJLEVBQUUsT0FBTztZQUNiLEtBQUssRUFBRSxxQkFBcUI7WUFDNUIsT0FBTyxFQUFFLDBFQUEwRTtTQUN0RixDQUFDLENBQUE7SUFDTixDQUFDLENBQUMsQ0FBQTtJQUVGLEdBQUcsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtRQUN4QixpQkFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUU7WUFDdkIsSUFBSSxFQUFFLE9BQU87WUFDYixLQUFLLEVBQUUscUJBQXFCO1lBQzVCLDRDQUE0QztZQUM1QyxPQUFPLEVBQUUsMEdBQTBHO1NBQ3RILENBQUMsQ0FBQTtJQUNOLENBQUMsQ0FBQyxDQUFBO0lBRUYsTUFBTSxJQUFJLEdBQUcsZUFBSSxDQUFDLGlCQUFpQixDQUFDO1FBQ2hDO1lBQ0ksS0FBSyxFQUFFLE1BQU07WUFDYixPQUFPLEVBQUU7Z0JBQ0w7b0JBQ0ksS0FBSyxFQUFFLE1BQU07b0JBQ2IsV0FBVyxFQUFHLGFBQWE7b0JBQzNCLEtBQUs7d0JBQ0QsY0FBRyxDQUFDLElBQUksRUFBRSxDQUFBO29CQUNkLENBQUM7aUJBQ0o7YUFDSjtTQUNKO0tBQ0osQ0FBQyxDQUFBO0lBQ0YsZUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFBO0lBRTdCLG1CQUFtQjtJQUNuQixHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7UUFDdkMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsY0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7SUFDOUQsQ0FBQyxDQUFDLENBQUE7SUFFRixHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDeEMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFBO1FBQ2xCLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQy9DLENBQUMsQ0FBQyxDQUFBO0FBQ04sQ0FBQyxDQUFBO0FBRUQsY0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUE7QUFFN0IsY0FBRyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7SUFDN0IsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtRQUMvQixjQUFHLENBQUMsSUFBSSxFQUFFLENBQUE7S0FDYjtBQUNMLENBQUMsQ0FBQyxDQUFBO0FBRUYsY0FBRyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO0lBQ3BCLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtRQUNiLFlBQVksRUFBRSxDQUFBO0tBQ2pCO0FBQ0wsQ0FBQyxDQUFDLENBQUE7QUFFRixrQkFBRyxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxLQUFVLEVBQUUsR0FBUSxFQUFFLEdBQVEsRUFBRSxNQUFXLEVBQUUsUUFBYSxFQUFFLEVBQUU7SUFDbEYsaUJBQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFO1FBQ3ZCLElBQUksRUFBRSxPQUFPO1FBQ2IsS0FBSyxFQUFFLHFCQUFxQjtRQUM1QixPQUFPLEVBQUU7O21CQUVFLEdBQUc7ZUFDUCxHQUFHO3VCQUNLLE1BQU07eUJBQ0osUUFBUTttREFDa0I7S0FDOUMsQ0FBQyxDQUFBO0FBQ04sQ0FBQyxDQUFDLENBQUE7QUFFRixPQUFPLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDcEMsaUJBQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFO1FBQ3ZCLElBQUksRUFBRSxPQUFPO1FBQ2IsS0FBSyxFQUFFLHFCQUFxQjtRQUM1Qiw0Q0FBNEM7UUFDNUMsT0FBTyxFQUFFLGtIQUFrSCxHQUFHLEVBQUU7S0FDbkksQ0FBQyxDQUFBO0FBQ04sQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2FwcCwgQnJvd3NlcldpbmRvdywgZGlhbG9nLCBpcGNNYWluIGFzIGlwYywgTWVudSB9IGZyb20gJ2VsZWN0cm9uJ1xyXG5pbXBvcnQgaXNEZXYgZnJvbSAnZWxlY3Ryb24taXMtZGV2J1xyXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCdcclxuaW1wb3J0IHsgZm9ybWF0IGFzIGZvcm1hdHVybCB9IGZyb20gJ3VybCdcclxuXHJcbmxldCB3aW46IEJyb3dzZXJXaW5kb3dcclxuXHJcbmNvbnN0IGNyZWF0ZVdpbmRvdyA9ICgpID0+IHtcclxuICAgIHdpbiA9IG5ldyBCcm93c2VyV2luZG93KHtcclxuICAgICAgICB0aXRsZTogJ0NSRyBVcGdyYWRlIFV0aWxpdHknLFxyXG4gICAgICAgLy8gaWNvbjogam9pbihfX2Rpcm5hbWUsICcuLi9idWlsZC9mbGFtaW5nby13aGl0ZS5wbmcnKSxcclxuICAgICAgICB3aWR0aDogODAwLFxyXG4gICAgICAgIGhlaWdodDogNjAwLFxyXG4gICAgICAgIHdlYlByZWZlcmVuY2VzOiB7XHJcbiAgICAgICAgICAgIG5vZGVJbnRlZ3JhdGlvbjogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgfSlcclxuXHJcbiAgICB3aW4ubG9hZFVSTChmb3JtYXR1cmwoe1xyXG4gICAgICAgIHBhdGhuYW1lOiBqb2luKF9fZGlybmFtZSwgJy4uL3NyYy9pbmRleC5odG1sJyksXHJcbiAgICAgICAgcHJvdG9jb2w6ICdmaWxlJyxcclxuICAgICAgICBzbGFzaGVzOiB0cnVlLFxyXG4gICAgfSkpXHJcblxyXG4gICAgaWYgKGlzRGV2KSB7XHJcbiAgICAgICAgd2luLndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpXHJcbiAgICAgICAgcmVxdWlyZSgnZGV2dHJvbicpLmluc3RhbGwoKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFByZXZlbnQgZmlsZXMgZHJvcHBlZCBvdXRzaWRlIG9mIHRoZSBkcm9wIHpvbmUgZnJvbSBkb2luZyBhbnl0aGluZy5cclxuICAgIHdpbi53ZWJDb250ZW50cy5vbignd2lsbC1uYXZpZ2F0ZScsIChldmVudCkgPT4gZXZlbnQucHJldmVudERlZmF1bHQoKSlcclxuXHJcbiAgICB3aW4ub24oJ2Nsb3NlZCcsICgpID0+IHtcclxuICAgICAgICB3aW4gPSBudWxsXHJcbiAgICB9KVxyXG5cclxuICAgIHdpbi53ZWJDb250ZW50cy5vbignY3Jhc2hlZCcsICgpID0+IHtcclxuICAgICAgICBkaWFsb2cuc2hvd01lc3NhZ2VCb3god2luLCB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXHJcbiAgICAgICAgICAgIHRpdGxlOiAnQ1JHIFVwZ3JhZGUgVXRpbGl0eScsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdDUkcgVXBncmFkZSBVdGlsaXR5IGhhcyBjcmFzaGVkLiAgVGhpcyBzaG91bGQgcHJvYmFibHkgbm90IHN1cnByaXNlIHlvdS4nLFxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG5cclxuICAgIHdpbi5vbigndW5yZXNwb25zaXZlJywgKCkgPT4ge1xyXG4gICAgICAgIGRpYWxvZy5zaG93TWVzc2FnZUJveCh3aW4sIHtcclxuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcclxuICAgICAgICAgICAgdGl0bGU6ICdDUkcgVXBncmFkZSBVdGlsaXR5JyxcclxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBtYXgtbGluZS1sZW5ndGhcclxuICAgICAgICAgICAgbWVzc2FnZTogJ0NSRyBVcGdyYWRlIFV0aWxpdHkgaGFzIGJlY29tZSB1bnJlc3BvbnNpdmUuICBZb3Ugc2hvdWxkIHByb2JhYmx5IGhhdmUgYmVlbiBtb3JlIGVtb3Rpb25hbGx5IHN1cHBvcnRpdmUuJyxcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxuXHJcbiAgICBjb25zdCBtZW51ID0gTWVudS5idWlsZEZyb21UZW1wbGF0ZShbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsYWJlbDogJ0ZpbGUnLFxyXG4gICAgICAgICAgICBzdWJtZW51OiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdFeGl0JyxcclxuICAgICAgICAgICAgICAgICAgICBhY2NlbGVyYXRvcjogICdDbWRPckN0cmwrUScsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xpY2soKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5xdWl0KClcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9LFxyXG4gICAgXSlcclxuICAgIE1lbnUuc2V0QXBwbGljYXRpb25NZW51KG1lbnUpXHJcblxyXG4gICAgLy8gRG8gdmVyc2lvbiBjaGVja1xyXG4gICAgd2luLndlYkNvbnRlbnRzLm9uKCdkaWQtZmluaXNoLWxvYWQnLCAoKSA9PiB7XHJcbiAgICAgICAgd2luLndlYkNvbnRlbnRzLnNlbmQoJ2RvLXZlcnNpb24tY2hlY2snLCBhcHAuZ2V0VmVyc2lvbigpKVxyXG4gICAgfSlcclxuXHJcbiAgICB3aW4ud2ViQ29udGVudHMub24oJ25ldy13aW5kb3cnLCAoZSwgdXJsKSA9PiB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgcmVxdWlyZSgnZWxlY3Ryb24nKS5zaGVsbC5vcGVuRXh0ZXJuYWwodXJsKVxyXG4gICAgfSlcclxufVxyXG5cclxuYXBwLm9uKCdyZWFkeScsIGNyZWF0ZVdpbmRvdylcclxuXHJcbmFwcC5vbignd2luZG93LWFsbC1jbG9zZWQnLCAoKSA9PiB7XHJcbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ2RhcndpbicpIHtcclxuICAgICAgICBhcHAucXVpdCgpXHJcbiAgICB9XHJcbn0pXHJcblxyXG5hcHAub24oJ2FjdGl2YXRlJywgKCkgPT4ge1xyXG4gICAgaWYgKHdpbiA9PSBudWxsKSB7XHJcbiAgICAgICAgY3JlYXRlV2luZG93KClcclxuICAgIH1cclxufSlcclxuXHJcbmlwYy5vbignZXJyb3ItdGhyb3duJywgKGV2ZW50OiBhbnksIG1zZzogYW55LCB1cmw6IGFueSwgbGluZU5vOiBhbnksIGNvbHVtbk5vOiBhbnkpID0+IHtcclxuICAgIGRpYWxvZy5zaG93TWVzc2FnZUJveCh3aW4sIHtcclxuICAgICAgICB0eXBlOiAnZXJyb3InLFxyXG4gICAgICAgIHRpdGxlOiAnQ1JHIFVwZ3JhZGUgVXRpbGl0eScsXHJcbiAgICAgICAgbWVzc2FnZTogYENSRyBVcGdyYWRlIFV0aWxpdHkgaGFzIGVuY291bnRlcmVkIGFuIGVycm9yLlxyXG4gICAgICAgIEhlcmUncyBzb21lIGRldGFpbHM6XHJcbiAgICAgICAgTWVzc2FnZTogJHttc2d9XHJcbiAgICAgICAgVVJMOiAke3VybH1cclxuICAgICAgICBMaW5lIE51bWJlcjogJHtsaW5lTm99XHJcbiAgICAgICAgQ29sdW1uIE51bWJlcjogJHtjb2x1bW5Ob31cclxuICAgICAgICBEb2VzIHRoaXMgaGVscD8gIEl0IHByb2JhYmx5IGRvZXNuJ3QgaGVscC5gLFxyXG4gICAgfSlcclxufSlcclxuXHJcbnByb2Nlc3Mub24oJ3VuY2F1Z2h0RXhjZXB0aW9uJywgKGVycikgPT4ge1xyXG4gICAgZGlhbG9nLnNob3dNZXNzYWdlQm94KHdpbiwge1xyXG4gICAgICAgIHR5cGU6ICdlcnJvcicsXHJcbiAgICAgICAgdGl0bGU6ICdDUkcgVXBncmFkZSBVdGlsaXR5JyxcclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG1heC1saW5lLWxlbmd0aFxyXG4gICAgICAgIG1lc3NhZ2U6IGBDUkcgVXBncmFkZSBVdGlsaXR5IGhhcyBoYWQgYW4gdW5jYXVnaHQgZXhjZXB0aW9uIGluIG1haW4uanMuICBEb2VzIHRoaXMgaGVscD8gKE5vdGU6IHdpbGwgcHJvYmFibHkgbm90IGhlbHAuKSAke2Vycn1gLFxyXG4gICAgfSlcclxufSlcclxuIl19