"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const downloadjs_1 = __importDefault(require("downloadjs"));
const electron_1 = require("electron");
const mousetrap_1 = __importDefault(require("mousetrap"));
const xml2js_1 = require("xml2js");
const exportJson_1 = require("./crg/exportJson");
const importXml_1 = require("./crg/importXml");
const outBox = document.getElementById('output-box');
const fileInfoBox = document.getElementById('file-info-box');
const refreshButton = document.getElementById('refresh');
const downloadButton = document.getElementById('download');
let crgFile;
setupEventHandlers();
function setupEventHandlers() {
    const holder = document.getElementById('drag-file');
    const fileSelect = document.getElementById('file-select');
    window.onerror = (msg, url, lineNo, columnNo) => {
        electron_1.ipcRenderer.send('error-thrown', msg, url, lineNo, columnNo);
        return false;
    };
    fileSelect.onchange = (e) => {
        // Fires if a file is selected by clicking "select file."
        // tslint:disable-next-line: triple-equals
        if (e.target.value == undefined) {
            return false;
        }
        e.preventDefault();
        e.stopPropagation();
        if (e.target.files.length > 1) {
            fileInfoBox.innerHTML = 'Error: Multiple Files Selected.';
            return false;
        }
        crgFile = e.target.files[0];
        readFile();
        return false;
    };
    holder.ondrop = (e) => {
        // Fires if a file is dropped into the box
        holder.classList.remove('box__ondragover');
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files.length > 1) {
            fileInfoBox.innerText = 'Error: Multiple Files Selected.';
            return false;
        }
        crgFile = e.dataTransfer.files[0];
        readFile();
        return false;
    };
    // Change appearance of input box on file dragover
    holder.ondragover = () => {
        holder.classList.add('box__ondragover');
        return false;
    };
    holder.ondragleave = () => {
        holder.classList.remove('box__ondragover');
        return false;
    };
    holder.ondragend = () => {
        return false;
    };
}
function readFile() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            outBox.innerText = '';
            fileInfoBox.innerHTML = '';
            downloadButton.classList.add('hidden');
            refreshButton.classList.add('hidden');
            const data = yield makeReader();
            return processData(data);
        }
        catch (err) {
            fileInfoBox.innerText = `Error: ${err}`;
        }
    });
}
function makeReader() {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            }
            else {
                reject('Reader loaded as ArrayBuffer, configure correctly');
            }
        };
        reader.onerror = () => {
            reject('Unable to read file');
        };
        reader.readAsText(crgFile, 'UTF-8');
    });
}
function processData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const parser = new xml2js_1.Parser( /* options */);
        const result = yield parser.parseStringPromise(data);
        const teams = importXml_1.importXml(result);
        const json = JSON.stringify(exportJson_1.exportJson(teams), null, ' ');
        updateFileInfo();
        updateData(json);
    });
}
function updateFileInfo() {
    fileInfoBox.innerHTML = `<strong>Filename:</strong>  ${crgFile.name}<br>`;
    fileInfoBox.innerHTML += `<strong>File Read:</strong> ${date_fns_1.format(new Date(), 'PPpp')}`;
    updateRefreshButton();
}
function updateRefreshButton() {
    refreshButton.classList.remove('hidden');
    refreshButton.onclick = () => {
        readFile();
    };
    mousetrap_1.default.unbind('f5');
    mousetrap_1.default.bind('f5', () => {
        readFile();
    });
}
function updateData(json) {
    outBox.innerText = json;
    downloadButton.classList.remove('hidden');
    downloadButton.onclick = () => {
        const blob = new Blob([json], { type: 'application/json' });
        downloadjs_1.default(blob, crgFile.name.split('.')[0] + '.json');
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1Q0FBaUM7QUFDakMsNERBQWlDO0FBQ2pDLHVDQUFzQztBQUN0QywwREFBaUM7QUFDakMsbUNBQStCO0FBQy9CLGlEQUE2QztBQUM3QywrQ0FBMkM7QUFNM0MsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUNwRCxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBQzVELE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDeEQsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUUxRCxJQUFJLE9BQWEsQ0FBQTtBQUVqQixrQkFBa0IsRUFBRSxDQUFBO0FBRXBCLFNBQVMsa0JBQWtCO0lBQ3ZCLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDbkQsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUV6RCxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUU7UUFDNUMsc0JBQVcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBQzVELE9BQU8sS0FBSyxDQUFBO0lBQ2hCLENBQUMsQ0FBQTtJQUVELFVBQVUsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFtQixFQUFFLEVBQUU7UUFDMUMseURBQXlEO1FBQ3pELDBDQUEwQztRQUMxQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMs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R0FBRyxFQUFFO1FBQ3RCLFFBQVEsRUFBRSxDQUFBO0lBQ2QsQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDO0FBRUQsU0FBUyxVQUFVLENBQUMsSUFBWTtJQUM1QixNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTtJQUV2QixjQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUN6QyxjQUFjLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtRQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBRSxDQUFFLElBQUksQ0FBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLENBQUMsQ0FBQTtRQUM5RCxvQkFBUSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQTtJQUN4RCxDQUFDLENBQUE7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZm9ybWF0IH0gZnJvbSAnZGF0ZS1mbnMnXHJcbmltcG9ydCBkb3dubG9hZCBmcm9tICdkb3dubG9hZGpzJ1xyXG5pbXBvcnQgeyBpcGNSZW5kZXJlciB9IGZyb20gJ2VsZWN0cm9uJ1xyXG5pbXBvcnQgbW91c2V0cmFwIGZyb20gJ21vdXNldHJhcCdcclxuaW1wb3J0IHsgUGFyc2VyIH0gZnJvbSAneG1sMmpzJ1xyXG5pbXBvcnQgeyBleHBvcnRKc29uIH0gZnJvbSAnLi9jcmcvZXhwb3J0SnNvbidcclxuaW1wb3J0IHsgaW1wb3J0WG1sIH0gZnJvbSAnLi9jcmcvaW1wb3J0WG1sJ1xyXG5cclxuaW50ZXJmYWNlIElIVE1MSW5wdXRFdmVudCBleHRlbmRzIEV2ZW50IHtcclxuICAgIHRhcmdldDogSFRNTElucHV0RWxlbWVudCAmIEV2ZW50VGFyZ2V0XHJcbn1cclxuXHJcbmNvbnN0IG91dEJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdXRwdXQtYm94JylcclxuY29uc3QgZmlsZUluZm9Cb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZS1pbmZvLWJveCcpXHJcbmNvbnN0IHJlZnJlc2hCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVmcmVzaCcpXHJcbmNvbnN0IGRvd25sb2FkQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rvd25sb2FkJylcclxuXHJcbmxldCBjcmdGaWxlOiBGaWxlXHJcblxyXG5zZXR1cEV2ZW50SGFuZGxlcnMoKVxyXG5cclxuZnVuY3Rpb24gc2V0dXBFdmVudEhhbmRsZXJzKCkge1xyXG4gICAgY29uc3QgaG9sZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RyYWctZmlsZScpXHJcbiAgICBjb25zdCBmaWxlU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGUtc2VsZWN0JylcclxuXHJcbiAgICB3aW5kb3cub25lcnJvciA9IChtc2csIHVybCwgbGluZU5vLCBjb2x1bW5ObykgPT4ge1xyXG4gICAgICAgIGlwY1JlbmRlcmVyLnNlbmQoJ2Vycm9yLXRocm93bicsIG1zZywgdXJsLCBsaW5lTm8sIGNvbHVtbk5vKVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIGZpbGVTZWxlY3Qub25jaGFuZ2UgPSAoZT86IElIVE1MSW5wdXRFdmVudCkgPT4ge1xyXG4gICAgICAgIC8vIEZpcmVzIGlmIGEgZmlsZSBpcyBzZWxlY3RlZCBieSBjbGlja2luZyBcInNlbGVjdCBmaWxlLlwiXHJcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiB0cmlwbGUtZXF1YWxzXHJcbiAgICAgICAgaWYgKGUudGFyZ2V0LnZhbHVlID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgICAgICBpZiAoZS50YXJnZXQuZmlsZXMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICBmaWxlSW5mb0JveC5pbm5lckhUTUwgPSAnRXJyb3I6IE11bHRpcGxlIEZpbGVzIFNlbGVjdGVkLidcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjcmdGaWxlID0gZS50YXJnZXQuZmlsZXNbMF1cclxuXHJcbiAgICAgICAgcmVhZEZpbGUoKVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIGhvbGRlci5vbmRyb3AgPSAoZSkgPT4ge1xyXG4gICAgICAgIC8vIEZpcmVzIGlmIGEgZmlsZSBpcyBkcm9wcGVkIGludG8gdGhlIGJveFxyXG4gICAgICAgIGhvbGRlci5jbGFzc0xpc3QucmVtb3ZlKCdib3hfX29uZHJhZ292ZXInKVxyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICAgICAgaWYgKGUuZGF0YVRyYW5zZmVyLmZpbGVzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgZmlsZUluZm9Cb3guaW5uZXJUZXh0ID0gJ0Vycm9yOiBNdWx0aXBsZSBGaWxlcyBTZWxlY3RlZC4nXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3JnRmlsZSA9IGUuZGF0YVRyYW5zZmVyLmZpbGVzWzBdXHJcblxyXG4gICAgICAgIHJlYWRGaWxlKClcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGFuZ2UgYXBwZWFyYW5jZSBvZiBpbnB1dCBib3ggb24gZmlsZSBkcmFnb3ZlclxyXG4gICAgaG9sZGVyLm9uZHJhZ292ZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgaG9sZGVyLmNsYXNzTGlzdC5hZGQoJ2JveF9fb25kcmFnb3ZlcicpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcblxyXG4gICAgaG9sZGVyLm9uZHJhZ2xlYXZlID0gKCkgPT4ge1xyXG4gICAgICAgIGhvbGRlci5jbGFzc0xpc3QucmVtb3ZlKCdib3hfX29uZHJhZ292ZXInKVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIGhvbGRlci5vbmRyYWdlbmQgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHJlYWRGaWxlKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBvdXRCb3guaW5uZXJUZXh0ID0gJydcclxuICAgICAgICBmaWxlSW5mb0JveC5pbm5lckhUTUwgPSAnJ1xyXG4gICAgICAgIGRvd25sb2FkQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXHJcbiAgICAgICAgcmVmcmVzaEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxyXG5cclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgbWFrZVJlYWRlcigpXHJcbiAgICAgICAgcmV0dXJuIHByb2Nlc3NEYXRhKGRhdGEpXHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBmaWxlSW5mb0JveC5pbm5lclRleHQgPSBgRXJyb3I6ICR7ZXJyfWBcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbWFrZVJlYWRlcigpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXHJcblxyXG4gICAgICAgIHJlYWRlci5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVhZGVyLnJlc3VsdCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdCgnUmVhZGVyIGxvYWRlZCBhcyBBcnJheUJ1ZmZlciwgY29uZmlndXJlIGNvcnJlY3RseScpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICByZWplY3QoJ1VuYWJsZSB0byByZWFkIGZpbGUnKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQoY3JnRmlsZSwgJ1VURi04JylcclxuICAgIH0pXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHByb2Nlc3NEYXRhKGRhdGE6IHN0cmluZykge1xyXG4gICAgY29uc3QgcGFyc2VyID0gbmV3IFBhcnNlcigvKiBvcHRpb25zICovKVxyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcGFyc2VyLnBhcnNlU3RyaW5nUHJvbWlzZShkYXRhKVxyXG4gICAgY29uc3QgdGVhbXMgPSBpbXBvcnRYbWwocmVzdWx0KVxyXG4gICAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KGV4cG9ydEpzb24odGVhbXMpLCBudWxsLCAnICcpXHJcblxyXG4gICAgdXBkYXRlRmlsZUluZm8oKVxyXG4gICAgdXBkYXRlRGF0YShqc29uKVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVGaWxlSW5mbygpIHtcclxuICAgIGZpbGVJbmZvQm94LmlubmVySFRNTCA9IGA8c3Ryb25nPkZpbGVuYW1lOjwvc3Ryb25nPiAgJHtjcmdGaWxlLm5hbWV9PGJyPmBcclxuICAgIGZpbGVJbmZvQm94LmlubmVySFRNTCArPSBgPHN0cm9uZz5GaWxlIFJlYWQ6PC9zdHJvbmc+ICR7Zm9ybWF0KG5ldyBEYXRlKCksICdQUHBwJyl9YFxyXG5cclxuICAgIHVwZGF0ZVJlZnJlc2hCdXR0b24oKVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVSZWZyZXNoQnV0dG9uKCkge1xyXG4gICAgcmVmcmVzaEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxyXG5cclxuICAgIHJlZnJlc2hCdXR0b24ub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICByZWFkRmlsZSgpXHJcbiAgICB9XHJcblxyXG4gICAgbW91c2V0cmFwLnVuYmluZCgnZjUnKVxyXG4gICAgbW91c2V0cmFwLmJpbmQoJ2Y1JywgKCkgPT4ge1xyXG4gICAgICAgIHJlYWRGaWxlKClcclxuICAgIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZURhdGEoanNvbjogc3RyaW5nKSB7XHJcbiAgICBvdXRCb3guaW5uZXJUZXh0ID0ganNvblxyXG5cclxuICAgIGRvd25sb2FkQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXHJcbiAgICBkb3dubG9hZEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYiggWyBqc29uIF0sIHsgdHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nIH0pXHJcbiAgICAgICAgZG93bmxvYWQoYmxvYiwgY3JnRmlsZS5uYW1lLnNwbGl0KCcuJylbMF0gKyAnLmpzb24nKVxyXG4gICAgfVxyXG59XHJcbiJdfQ==