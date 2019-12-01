import { format } from 'date-fns'
import download from 'downloadjs'
import { ipcRenderer } from 'electron'
import mousetrap from 'mousetrap'
import { Parser } from 'xml2js'
import { exportJson } from './crg/exportJson'
import { importXml } from './crg/importXml'

interface IHTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget
}

const outBox = document.getElementById('output-box')
const fileInfoBox = document.getElementById('file-info-box')
const refreshButton = document.getElementById('refresh')
const downloadButton = document.getElementById('download')

let crgFile: File

setupEventHandlers()

function setupEventHandlers() {
    const holder = document.getElementById('drag-file')
    const fileSelect = document.getElementById('file-select')

    window.onerror = (msg, url, lineNo, columnNo) => {
        ipcRenderer.send('error-thrown', msg, url, lineNo, columnNo)
        return false
    }

    fileSelect.onchange = (e?: IHTMLInputEvent) => {
        // Fires if a file is selected by clicking "select file."
        // tslint:disable-next-line: triple-equals
        if (e.target.value == undefined) {
            return false
        }
        e.preventDefault()
        e.stopPropagation()

        if (e.target.files.length > 1) {
            fileInfoBox.innerHTML = 'Error: Multiple Files Selected.'
            return false
        }

        crgFile = e.target.files[0]

        readFile()
        return false
    }

    holder.ondrop = (e) => {
        // Fires if a file is dropped into the box
        holder.classList.remove('box__ondragover')
        e.preventDefault()
        e.stopPropagation()

        if (e.dataTransfer.files.length > 1) {
            fileInfoBox.innerText = 'Error: Multiple Files Selected.'
            return false
        }

        crgFile = e.dataTransfer.files[0]

        readFile()
        return false
    }

    // Change appearance of input box on file dragover
    holder.ondragover = () => {
        holder.classList.add('box__ondragover')
        return false
    }

    holder.ondragleave = () => {
        holder.classList.remove('box__ondragover')
        return false
    }

    holder.ondragend = () => {
        return false
    }
}

async function readFile() {
    try {
        outBox.innerText = ''
        fileInfoBox.innerHTML = ''
        downloadButton.classList.add('hidden')
        refreshButton.classList.add('hidden')

        const data = await makeReader()
        return processData(data)
    } catch (err) {
        fileInfoBox.innerText = `Error: ${err}`
    }
}

function makeReader(): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result)
            } else {
                reject('Reader loaded as ArrayBuffer, configure correctly')
            }
        }

        reader.onerror = () => {
            reject('Unable to read file')
        }

        reader.readAsText(crgFile, 'UTF-8')
    })
}

async function processData(data: string) {
    const parser = new Parser(/* options */)
    const result = await parser.parseStringPromise(data)
    const teams = importXml(result)
    const json = JSON.stringify(exportJson(teams), null, ' ')

    updateFileInfo()
    updateData(json)
}

function updateFileInfo() {
    fileInfoBox.innerHTML = `<strong>Filename:</strong>  ${crgFile.name}<br>`
    fileInfoBox.innerHTML += `<strong>File Read:</strong> ${format(new Date(), 'PPpp')}`

    updateRefreshButton()
}

function updateRefreshButton() {
    refreshButton.classList.remove('hidden')

    refreshButton.onclick = () => {
        readFile()
    }

    mousetrap.unbind('f5')
    mousetrap.bind('f5', () => {
        readFile()
    })
}

function updateData(json: string) {
    outBox.innerText = json

    downloadButton.classList.remove('hidden')
    downloadButton.onclick = () => {
        const blob = new Blob( [ json ], { type: 'application/json' })
        download(blob, crgFile.name.split('.')[0] + '.json')
    }
}
