const { ref } = Vue
export function useSpeech() {

  const listening = ref(false)
  const rec = ref(null)
  const words = ref([])
  const text = ref('')
  
  const initListen = (options = {}) => {
    if(listening.value) return
    listen()
  }

  const onResult = (event) => {
    words.value = []
    for(let i = 0; i < event.results.length; i++) {
      let transcript = event.results[i][0].transcript
      words.value.push(transcript)
    }
    text.value = words.value.join('')
  }

  const stopListen = () => {
    if(!listening.value) return
    return new Promise((resolve) => {
      rec.value.stop()
      listening.value = false
      rec.value.removeEventListener('result', onResult)
      resolve()
    })
  }

  const listen = async () => {
    let rec = getSpeechRecorgnition()
    if(!rec) return
    rec.value.addEventListener('result', onResult)
    text.value = ''
    words.value = []
    rec.value.start()
    listening.value = true
  }

  const getSpeechRecorgnition = () => {

    window.SpeechRecognition = window.webkitSpeechRecognition || window.mozSpeechRecognition || window.SpeechRecognition

    if(! window.SpeechRecognition ) {
      alert('Error:\nYour browser does not supports web speech recognition API.')
      return null
    }
    rec.value = new SpeechRecognition()
    rec.value.lang = 'es-CO'
    rec.value.continuous = true
    rec.value.interim = false
    return rec
  }

  return {
    listening,
    initListen,
    stopListen,
    words,
    text
  }

}