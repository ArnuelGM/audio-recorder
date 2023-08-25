// @ts-check

/**
 * @type MediaRecorder
 */
let mediaRecorder

let recording = false

let audioChunks = []

const recordBtn = document.querySelector('#recordBtn')
recordBtn?.addEventListener('click', toggleRecording)

function toggleRecording() {
  recording 
    ? stopRecording()
    : requestRecord()
}

async function requestRecord() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio: {
      noiseSuppression: true,
      echoCancellation: true
    }})
    recordStream(stream);
  }
  catch(error) {
    console.log({error})
    alert('Error:\nNo es posible iniciar la grabación.')
  }
}

function stopRecording() {
  mediaRecorder.onstop = presentRecord
  mediaRecorder.stop()
  recording = false
  updateUI(recording)
}

function recordStream(stream) {
  mediaRecorder = new MediaRecorder(stream)
  mediaRecorder.ondataavailable = (event) => saveAudioBuffer(event.data)
  mediaRecorder.start(5000)
  recording = true
  updateUI(recording)
}

function saveAudioBuffer(chunk) {
  audioChunks.push(chunk)
  console.log({chunk})
}

function presentRecord() {

  const audioData = new Blob(audioChunks, {type: "audio/webm;codecs=opus"})
  audioChunks = []
  const audioSrc = window.URL.createObjectURL(audioData)

  const audioElement = document.createElement('audio')
  audioElement.setAttribute("controls", "");
  audioElement.src = audioSrc

  const article = document.createElement('article')
  
  const btnDelete = document.createElement('button')
  btnDelete.innerText = 'Delete Record'
  btnDelete.setAttribute('role', 'button')
  btnDelete.classList.add('outline')
  btnDelete.classList.add('secondary')
  btnDelete.onclick = () => article.remove()
  
  article.appendChild(audioElement)
  article.appendChild(btnDelete)

  document.querySelector('main')?.appendChild(article)

  audioElement.onerror = (error) => {
    console.log({error})
  }

  audioElement.onload = function () {
    console.log('Audio listo.')
  }
}

function updateUI(recording) {

  if ( recording ) {
    // @ts-ignore
    recordBtn.innerHTML = 'Recording...'
    // @ts-ignore
    recordBtn?.setAttribute('aria-busy', 'true')
  }
  else {
    recordBtn?.removeAttribute('aria-busy')
    // @ts-ignore
    recordBtn.innerHTML = '<img src="microphone.svg"> Init Record'
  }

}