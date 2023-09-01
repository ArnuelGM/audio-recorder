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
    rec.value.stop()
    return new Promise((resolve, reject) => setTimeout(() => {
      listening.value = false
      resolve(text.value)
    }, 1000))
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
    rec.value.addEventListener('result', (event) => {
      words.value = []
      for(let i = 0; i < event.results.length; i++) {
        let transcript = event.results[i][0].transcript
        words.value.push(transcript)
      }
      text.value = words.value.join('')
    })
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