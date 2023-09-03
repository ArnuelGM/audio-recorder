const { ref, watch } = Vue
import { useRecorder } from "../composables/useRecorder.js";
import { useSpeech } from "../composables/useSpeech.js";

export default {
  template: /* html */ `
    <section>
      <div style="display: flex; justify-content: space-between;">
        <button @click="toggleRecord" :disabled="listening">
          <img src="microphone.svg" v-if="!recording">
          {{
              recording
                ? 'Stop Recording...'
                : 'Init Record'
          }}
        </button>
        <button @click="toggleListen" :disabled="recording">
          <svg v-if="!listening" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M18 8a3 3 0 0 1 0 6"></path>
            <path d="M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5"></path>
            <path d="M12 8h0l4.524 -3.77a.9 .9 0 0 1 1.476 .692v12.156a.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h8"></path>
          </svg>
          {{
              listening
                ? 'Listening...'
                : 'Listen'
          }}
        </button>
      </div>
      <label>
        <input type="checkbox" v-model="video" name="capture_screen">
        Screen Capture
      </label>
    </section>
  `,
  
  // Events
  emits: ['record', 'speech', 'initSpeaking', 'stopSpeaking'],

  setup(props, { emit }) {
    
    const video = ref(false)
    const dataSpeeching = ref({})
    const { initRecord, stopRecording, recording, recordType } = useRecorder()
    const { initListen, stopListen, listening, text } = useSpeech()

    watch(() => text.value, (newValue) => {
      emit('speech', newValue)
    })

    const toggleListen = () => {
      if(listening.value) {
        getSpeechToText() 
      }
      else {
        initListen()
        dataSpeeching.value = {
          type: 'text',
          text: '',
          id: '',
          date: new Date(),
        }
        emit('initSpeaking', dataSpeeching.value)
      }
    }

    const toggleRecord = () => recording.value ? getRecord(): initRecord({video: video.value});
    
    const getSpeechToText = async () => {
      await stopListen()
      dataSpeeching.value.id = crypto.randomUUID()
      emit('record', dataSpeeching.value)
    }

    const getRecord = async () => {
      const record = await stopRecording()
  
      const src = URL.createObjectURL(record)

      let audio = null;
      if(recordType.value === 'audio') audio = new Audio(src)
  
      const data = {
        id: crypto.randomUUID().toString(),
        audio,
        record,
        type: recordType.value,
        src,
        date: new Date()
      }
      emit('record', data)
    }

    return {
      toggleRecord,
      recording,
      video,

      toggleListen,
      listening,
      text
    }
  }
}