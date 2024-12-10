
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('file-upload').addEventListener('change', handleFileUpload);
document.getElementById('remove-file').addEventListener('click', removeFile);
document.getElementById('input-field').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

let uploadedFile = null;

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        uploadedFile = file;
        const filePreview = document.getElementById('file-preview');
        const fileNameElement = filePreview.querySelector('.file-name');

        if (file.type.startsWith('image/')) {
            const imgElement = document.createElement('img');
            imgElement.src = URL.createObjectURL(file);
            filePreview.insertBefore(imgElement, fileNameElement);
        } else {
            fileNameElement.textContent = file.name;
        }
        filePreview.style.display = 'flex';
    }
}

function removeFile() {
    uploadedFile = null;
    const filePreview = document.getElementById('file-preview');
    filePreview.style.display = 'none';
    filePreview.querySelector('.file-name').textContent = '';
    const imgElement = filePreview.querySelector('img');
    if (imgElement) {
        filePreview.removeChild(imgElement);
    }
    document.getElementById('file-upload').value = '';
}

function sendMessage() {
    const messageText = document.getElementById('input-field').value.trim();
    const messagesContainer = document.getElementById('messages');

    if (messageText || uploadedFile) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');

        if (uploadedFile) {
            const fileElement = document.createElement('div');
            fileElement.classList.add('message-file');

            if (uploadedFile.type.startsWith('image/')) {
                const imgElement = document.createElement('img');
                imgElement.src = URL.createObjectURL(uploadedFile);
                fileElement.appendChild(imgElement);
            } else {
                const fileIcon = document.createElement('div');
                fileIcon.textContent = '📄';
                fileIcon.style.marginRight = '10px';
                fileElement.appendChild(fileIcon);
            }

            const fileNameElement = document.createElement('span');
            fileNameElement.classList.add('file-name');
            fileNameElement.textContent = uploadedFile.name;
            fileElement.appendChild(fileNameElement);

            messageElement.appendChild(fileElement);
        }

        if (messageText) {
            const textElement = document.createElement('div');
            textElement.classList.add('content');
            textElement.textContent = messageText;
            messageElement.appendChild(textElement);
        }

        const timeElement = document.createElement('div');
        timeElement.classList.add('time');
        timeElement.textContent = new Date().toLocaleTimeString();
        messageElement.appendChild(timeElement);

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Clear input and file
        document.getElementById('input-field').value = '';
        removeFile();
    }
}

function skipMessage() {
    let skipMessage = false;

    // Add an event listener to the "Skip Message" button
    document.getElementById('skip-button').addEventListener('click', () => {
        skipMessage = true;
        console.log("Next message will be skipped.");
    });
    
    function sendMessage() {
        const messageText = document.getElementById('input-field').value.trim();
        const messagesContainer = document.getElementById('messages');
    
        // Check if the message should be skipped
        if (skipMessage) {
            console.log("Message skipped:", messageText || (uploadedFile ? uploadedFile.name : ""));
            skipMessage = false; // Reset the skip flag
            document.getElementById('input-field').value = ''; // Clear the input
            removeFile(); // Clear uploaded file, if any
            return; // Do not proceed with sending the message
        }
    
        if (messageText || uploadedFile) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
    
            if (uploadedFile) {
                const fileElement = document.createElement('div');
                fileElement.classList.add('message-file');
    
                if (uploadedFile.type.startsWith('image/')) {
                    const imgElement = document.createElement('img');
                    imgElement.src = URL.createObjectURL(uploadedFile);
                    fileElement.appendChild(imgElement);
                } else {
                    const fileIcon = document.createElement('div');
                    fileIcon.textContent = '📄';
                    fileIcon.style.marginRight = '10px';
                    fileElement.appendChild(fileIcon);
                }
    
                const fileNameElement = document.createElement('span');
                fileNameElement.classList.add('file-name');
                fileNameElement.textContent = uploadedFile.name;
                fileElement.appendChild(fileNameElement);
    
                messageElement.appendChild(fileElement);
            }
    
            if (messageText) {
                const textElement = document.createElement('div');
                textElement.classList.add('content');
                textElement.textContent = messageText;
                messageElement.appendChild(textElement);
            }
    
            const timeElement = document.createElement('div');
            timeElement.classList.add('time');
            timeElement.textContent = new Date().toLocaleTimeString();
            messageElement.appendChild(timeElement);
    
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
            // Clear input and file
            document.getElementById('input-field').value = '';
            removeFile();
        }
    }
    
    function removeFile() {
        uploadedFile = null; // Assuming 'uploadedFile' is defined elsewhere in your code
    }
}






    






























const display = document.querySelector('.display')
const controllerWrapper = document.querySelector('.controllers')

const State = ['Initial', 'Record', 'Download']
let stateIndex = 0
let mediaRecorder, chunks = [], audioURL = ''

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    console.log('mediaDevices supported..')

    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(stream => {
        mediaRecorder = new MediaRecorder(stream)

        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data)
        }

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, {'type': 'audio/ogg; codecs=opus'})
            chunks = []
            audioURL = window.URL.createObjectURL(blob)
            document.querySelector('audio').src = audioURL

        }
    }).catch(error => {
        console.log('Following error has occured : ',error)
    })
}else{
    stateIndex = ''
    application(stateIndex)
}

const clearDisplay = () => {
    display.textContent = ''
}

const clearControls = () => {
    controllerWrapper.textContent = ''
}

const record = () => {
    stateIndex = 1
    mediaRecorder.start()
    application(stateIndex)
}

const stopRecording = () => {
    stateIndex = 2
    mediaRecorder.stop()
    application(stateIndex)
}

const downloadAudio = () => {
    const downloadLink = document.createElement('a')
    downloadLink.href = audioURL
    downloadLink.setAttribute('download', 'audio')
    downloadLink.click()
}

const addButton = (id, funString, text) => {
    const btn = document.createElement('button')
    btn.id = id
    btn.setAttribute('onclick', funString)
    btn.textContent = text
    controllerWrapper.append(btn)
}

const addMessage = (text) => {
    const msg = document.createElement('p')
    msg.textContent = text
    display.append(msg)
}

const addAudio = () => {
    const audio = document.createElement('audio')
    audio.controls = true
    audio.src = audioURL
    display.append(audio)
}

const application = (index) => {
    switch (State[index]) {
        case 'Initial':
            clearDisplay()
            clearControls()

            addButton('record', 'record()', 'Start Recording')
            break;

        case 'Record':
            clearDisplay()
            clearControls()

            addMessage('Recording...')
            addButton('stop', 'stopRecording()', 'Stop Recording')
            break

        case 'Download':
            clearControls()
            clearDisplay()

            addAudio()
            addButton('record', 'record()', 'Record Again')
            break

        default:
            clearControls()
            clearDisplay()

            addMessage('Your browser does not support mediaDevices')
            break;
    }

}

application(stateIndex)






