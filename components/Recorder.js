import { useRecorder } from "../composables/useRecorder.js";

export default {
  template: /* html */ `
    <section>
      <button @click="toggleRecord">
        <img src="microphone.svg" v-if="!recording">
        {{
            recording 
              ? 'Stop Recording...' 
              : 'Init Record' 
        }}
      </button>
    </section>
  `,
  
  // Events
  emits: ['record'],

  setup(props, { emit }) {
    
    let { initRecord, stopRecording, recording } = useRecorder()

    const toggleRecord = () => recording.value ? getRecord(): initRecord();
    
    const getRecord = async () => {
      const record = await stopRecording()
  
      const audioSrc = URL.createObjectURL(record)
      const audio = new Audio(audioSrc)
  
      const data = {
        id: crypto.randomUUID().toString(),
        audio,
        audioSrc,
        date: new Date()
      }
      emit('record', data)
    }

    return {
      toggleRecord,
      recording
    }
  }
}