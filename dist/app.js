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
        pathname: path_1.join(__dirname, './index.html'),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHVDQUEwRTtBQUMxRSxzRUFBbUM7QUFDbkMsK0JBQTJCO0FBQzNCLDZCQUF5QztBQUV6QyxJQUFJLEdBQWtCLENBQUE7QUFFdEIsTUFBTSxZQUFZLEdBQUcsR0FBRyxFQUFFO0lBQ3RCLEdBQUcsR0FBRyxJQUFJLHdCQUFhLENBQUM7UUFDcEIsS0FBSyxFQUFFLHFCQUFxQjtRQUM3Qix3REFBd0Q7UUFDdkQsS0FBSyxFQUFFLEdBQUc7UUFDVixNQUFNLEVBQUUsR0FBRztRQUNYLGNBQWMsRUFBRTtZQUNaLGVBQWUsRUFBRSxJQUFJO1NBQ3hCO0tBQ0osQ0FBQyxDQUFBO0lBRUYsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFTLENBQUM7UUFDbEIsUUFBUSxFQUFFLFdBQUksQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDO1FBQ3pDLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLE9BQU8sRUFBRSxJQUFJO0tBQ2hCLENBQUMsQ0FBQyxDQUFBO0lBRUgsSUFBSSx5QkFBSyxFQUFFO1FBQ1AsR0FBRyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtRQUM5QixPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDL0I7SUFFRCxzRUFBc0U7SUFDdEUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQTtJQUV0RSxHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7UUFDbEIsR0FBRyxHQUFHLElBQUksQ0FBQTtJQUNkLENBQUMsQ0FBQyxDQUFBO0lBRUYsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtRQUMvQixpQkFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUU7WUFDdkIsSUFBSSxFQUFFLE9BQU87WUFDYixLQUFLLEVBQUUscUJBQXFCO1lBQzVCLE9BQU8sRUFBRSwwRUFBMEU7U0FDdEYsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUE7SUFFRixHQUFHLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7UUFDeEIsaUJBQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFO1lBQ3ZCLElBQUksRUFBRSxPQUFPO1lBQ2IsS0FBSyxFQUFFLHFCQUFxQjtZQUM1Qiw0Q0FBNEM7WUFDNUMsT0FBTyxFQUFFLDBHQUEwRztTQUN0SCxDQUFDLENBQUE7SUFDTixDQUFDLENBQUMsQ0FBQTtJQUVGLE1BQU0sSUFBSSxHQUFHLGVBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUNoQztZQUNJLEtBQUssRUFBRSxNQUFNO1lBQ2IsT0FBTyxFQUFFO2dCQUNMO29CQUNJLEtBQUssRUFBRSxNQUFNO29CQUNiLFdBQVcsRUFBRyxhQUFhO29CQUMzQixLQUFLO3dCQUNELGNBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtvQkFDZCxDQUFDO2lCQUNKO2FBQ0o7U0FDSjtLQUNKLENBQUMsQ0FBQTtJQUNGLGVBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUU3QixtQkFBbUI7SUFDbkIsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO1FBQ3ZDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLGNBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFBO0lBQzlELENBQUMsQ0FBQyxDQUFBO0lBRUYsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQ3hDLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtRQUNsQixPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUMvQyxDQUFDLENBQUMsQ0FBQTtBQUNOLENBQUMsQ0FBQTtBQUVELGNBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFBO0FBRTdCLGNBQUcsQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO0lBQzdCLElBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUU7UUFDL0IsY0FBRyxDQUFDLElBQUksRUFBRSxDQUFBO0tBQ2I7QUFDTCxDQUFDLENBQUMsQ0FBQTtBQUVGLGNBQUcsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtJQUNwQixJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7UUFDYixZQUFZLEVBQUUsQ0FBQTtLQUNqQjtBQUNMLENBQUMsQ0FBQyxDQUFBO0FBRUYsa0JBQUcsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUMsS0FBVSxFQUFFLEdBQVEsRUFBRSxHQUFRLEVBQUUsTUFBVyxFQUFFLFFBQWEsRUFBRSxFQUFFO0lBQ2xGLGlCQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRTtRQUN2QixJQUFJLEVBQUUsT0FBTztRQUNiLEtBQUssRUFBRSxxQkFBcUI7UUFDNUIsT0FBTyxFQUFFOzttQkFFRSxHQUFHO2VBQ1AsR0FBRzt1QkFDSyxNQUFNO3lCQUNKLFFBQVE7bURBQ2tCO0tBQzlDLENBQUMsQ0FBQTtBQUNOLENBQUMsQ0FBQyxDQUFBO0FBRUYsT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO0lBQ3BDLGlCQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRTtRQUN2QixJQUFJLEVBQUUsT0FBTztRQUNiLEtBQUssRUFBRSxxQkFBcUI7UUFDNUIsNENBQTRDO1FBQzVDLE9BQU8sRUFBRSxrSEFBa0gsR0FBRyxFQUFFO0tBQ25JLENBQUMsQ0FBQTtBQUNOLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthcHAsIEJyb3dzZXJXaW5kb3csIGRpYWxvZywgaXBjTWFpbiBhcyBpcGMsIE1lbnUgfSBmcm9tICdlbGVjdHJvbidcclxuaW1wb3J0IGlzRGV2IGZyb20gJ2VsZWN0cm9uLWlzLWRldidcclxuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnXHJcbmltcG9ydCB7IGZvcm1hdCBhcyBmb3JtYXR1cmwgfSBmcm9tICd1cmwnXHJcblxyXG5sZXQgd2luOiBCcm93c2VyV2luZG93XHJcblxyXG5jb25zdCBjcmVhdGVXaW5kb3cgPSAoKSA9PiB7XHJcbiAgICB3aW4gPSBuZXcgQnJvd3NlcldpbmRvdyh7XHJcbiAgICAgICAgdGl0bGU6ICdDUkcgVXBncmFkZSBVdGlsaXR5JyxcclxuICAgICAgIC8vIGljb246IGpvaW4oX19kaXJuYW1lLCAnLi4vYnVpbGQvZmxhbWluZ28td2hpdGUucG5nJyksXHJcbiAgICAgICAgd2lkdGg6IDgwMCxcclxuICAgICAgICBoZWlnaHQ6IDYwMCxcclxuICAgICAgICB3ZWJQcmVmZXJlbmNlczoge1xyXG4gICAgICAgICAgICBub2RlSW50ZWdyYXRpb246IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgIH0pXHJcblxyXG4gICAgd2luLmxvYWRVUkwoZm9ybWF0dXJsKHtcclxuICAgICAgICBwYXRobmFtZTogam9pbihfX2Rpcm5hbWUsICcuL2luZGV4Lmh0bWwnKSxcclxuICAgICAgICBwcm90b2NvbDogJ2ZpbGUnLFxyXG4gICAgICAgIHNsYXNoZXM6IHRydWUsXHJcbiAgICB9KSlcclxuXHJcbiAgICBpZiAoaXNEZXYpIHtcclxuICAgICAgICB3aW4ud2ViQ29udGVudHMub3BlbkRldlRvb2xzKClcclxuICAgICAgICByZXF1aXJlKCdkZXZ0cm9uJykuaW5zdGFsbCgpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJldmVudCBmaWxlcyBkcm9wcGVkIG91dHNpZGUgb2YgdGhlIGRyb3Agem9uZSBmcm9tIGRvaW5nIGFueXRoaW5nLlxyXG4gICAgd2luLndlYkNvbnRlbnRzLm9uKCd3aWxsLW5hdmlnYXRlJywgKGV2ZW50KSA9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpKVxyXG5cclxuICAgIHdpbi5vbignY2xvc2VkJywgKCkgPT4ge1xyXG4gICAgICAgIHdpbiA9IG51bGxcclxuICAgIH0pXHJcblxyXG4gICAgd2luLndlYkNvbnRlbnRzLm9uKCdjcmFzaGVkJywgKCkgPT4ge1xyXG4gICAgICAgIGRpYWxvZy5zaG93TWVzc2FnZUJveCh3aW4sIHtcclxuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcclxuICAgICAgICAgICAgdGl0bGU6ICdDUkcgVXBncmFkZSBVdGlsaXR5JyxcclxuICAgICAgICAgICAgbWVzc2FnZTogJ0NSRyBVcGdyYWRlIFV0aWxpdHkgaGFzIGNyYXNoZWQuICBUaGlzIHNob3VsZCBwcm9iYWJseSBub3Qgc3VycHJpc2UgeW91LicsXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcblxyXG4gICAgd2luLm9uKCd1bnJlc3BvbnNpdmUnLCAoKSA9PiB7XHJcbiAgICAgICAgZGlhbG9nLnNob3dNZXNzYWdlQm94KHdpbiwge1xyXG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxyXG4gICAgICAgICAgICB0aXRsZTogJ0NSRyBVcGdyYWRlIFV0aWxpdHknLFxyXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG1heC1saW5lLWxlbmd0aFxyXG4gICAgICAgICAgICBtZXNzYWdlOiAnQ1JHIFVwZ3JhZGUgVXRpbGl0eSBoYXMgYmVjb21lIHVucmVzcG9uc2l2ZS4gIFlvdSBzaG91bGQgcHJvYmFibHkgaGF2ZSBiZWVuIG1vcmUgZW1vdGlvbmFsbHkgc3VwcG9ydGl2ZS4nLFxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnN0IG1lbnUgPSBNZW51LmJ1aWxkRnJvbVRlbXBsYXRlKFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxhYmVsOiAnRmlsZScsXHJcbiAgICAgICAgICAgIHN1Ym1lbnU6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0V4aXQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAgJ0NtZE9yQ3RybCtRJyxcclxuICAgICAgICAgICAgICAgICAgICBjbGljaygpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLnF1aXQoKVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH0sXHJcbiAgICBdKVxyXG4gICAgTWVudS5zZXRBcHBsaWNhdGlvbk1lbnUobWVudSlcclxuXHJcbiAgICAvLyBEbyB2ZXJzaW9uIGNoZWNrXHJcbiAgICB3aW4ud2ViQ29udGVudHMub24oJ2RpZC1maW5pc2gtbG9hZCcsICgpID0+IHtcclxuICAgICAgICB3aW4ud2ViQ29udGVudHMuc2VuZCgnZG8tdmVyc2lvbi1jaGVjaycsIGFwcC5nZXRWZXJzaW9uKCkpXHJcbiAgICB9KVxyXG5cclxuICAgIHdpbi53ZWJDb250ZW50cy5vbignbmV3LXdpbmRvdycsIChlLCB1cmwpID0+IHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICByZXF1aXJlKCdlbGVjdHJvbicpLnNoZWxsLm9wZW5FeHRlcm5hbCh1cmwpXHJcbiAgICB9KVxyXG59XHJcblxyXG5hcHAub24oJ3JlYWR5JywgY3JlYXRlV2luZG93KVxyXG5cclxuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcclxuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnZGFyd2luJykge1xyXG4gICAgICAgIGFwcC5xdWl0KClcclxuICAgIH1cclxufSlcclxuXHJcbmFwcC5vbignYWN0aXZhdGUnLCAoKSA9PiB7XHJcbiAgICBpZiAod2luID09IG51bGwpIHtcclxuICAgICAgICBjcmVhdGVXaW5kb3coKVxyXG4gICAgfVxyXG59KVxyXG5cclxuaXBjLm9uKCdlcnJvci10aHJvd24nLCAoZXZlbnQ6IGFueSwgbXNnOiBhbnksIHVybDogYW55LCBsaW5lTm86IGFueSwgY29sdW1uTm86IGFueSkgPT4ge1xyXG4gICAgZGlhbG9nLnNob3dNZXNzYWdlQm94KHdpbiwge1xyXG4gICAgICAgIHR5cGU6ICdlcnJvcicsXHJcbiAgICAgICAgdGl0bGU6ICdDUkcgVXBncmFkZSBVdGlsaXR5JyxcclxuICAgICAgICBtZXNzYWdlOiBgQ1JHIFVwZ3JhZGUgVXRpbGl0eSBoYXMgZW5jb3VudGVyZWQgYW4gZXJyb3IuXHJcbiAgICAgICAgSGVyZSdzIHNvbWUgZGV0YWlsczpcclxuICAgICAgICBNZXNzYWdlOiAke21zZ31cclxuICAgICAgICBVUkw6ICR7dXJsfVxyXG4gICAgICAgIExpbmUgTnVtYmVyOiAke2xpbmVOb31cclxuICAgICAgICBDb2x1bW4gTnVtYmVyOiAke2NvbHVtbk5vfVxyXG4gICAgICAgIERvZXMgdGhpcyBoZWxwPyAgSXQgcHJvYmFibHkgZG9lc24ndCBoZWxwLmAsXHJcbiAgICB9KVxyXG59KVxyXG5cclxucHJvY2Vzcy5vbigndW5jYXVnaHRFeGNlcHRpb24nLCAoZXJyKSA9PiB7XHJcbiAgICBkaWFsb2cuc2hvd01lc3NhZ2VCb3god2luLCB7XHJcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcclxuICAgICAgICB0aXRsZTogJ0NSRyBVcGdyYWRlIFV0aWxpdHknLFxyXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbWF4LWxpbmUtbGVuZ3RoXHJcbiAgICAgICAgbWVzc2FnZTogYENSRyBVcGdyYWRlIFV0aWxpdHkgaGFzIGhhZCBhbiB1bmNhdWdodCBleGNlcHRpb24gaW4gbWFpbi5qcy4gIERvZXMgdGhpcyBoZWxwPyAoTm90ZTogd2lsbCBwcm9iYWJseSBub3QgaGVscC4pICR7ZXJyfWAsXHJcbiAgICB9KVxyXG59KVxyXG4iXX0=