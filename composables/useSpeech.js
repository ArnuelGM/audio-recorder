const { ref } = Vue
export function useSpeech() {

  const listening = ref(false)
  const rec = ref(null);
  const words = ref([]);
  const text = ref('')
  
  const initListen = (options = {}) => {
    if(listening.value) return
    listen()
  }

  const stopListen = () => {
    if(!listening.value) return
    return new Promise((resolve, reject) => {
      listening.value = false
      rec.value.onresult = (event) => {
        onResult(event)
        resolve(text.value)
      }
      rec.value.stop()
    })
  }

  // http://localhost:5500/

  const onResult = (event) => {
    words.value = []
    for(let i = 0; i < event.results.length; i++) {
      let transcript = event.results[i][0].transcript
      words.value.push(transcript)
    }
    text.value = words.value.join('')
  }

  const listen = async () => {

    window.SpeechRecognition = window.webkitSpeechRecognition || window.mozSpeechRecognition || window.SpeechRecognition

    if(! window.SpeechRecognition ) {
      alert('Error:\nYour browser does not supports web speech recognition API.')
      return
    }

    rec.value = new SpeechRecognition()
    rec.value.lang = 'es-CO'
    rec.value.continuous = true
    rec.value.interim = true
    /* rec.value.addEventListener('result', (event) => {
      onResult(event)
    }) */
    rec.value.onresult = onResult
    text.value = ''
    words.value = []
    rec.value.start()
    listening.value = true
  }

  return {
    listening,
    initListen,
    stopListen,
    words,
    text
  }

}