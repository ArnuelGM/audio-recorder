const { ref } = Vue
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
      <label>
        <input type="checkbox" v-model="video" name="capture_screen"></input>
        Screen Capture
      </label>
    </section>
  `,
  
  // Events
  emits: ['record'],

  setup(props, { emit }) {
    
    let video = ref(false)
    let { initRecord, stopRecording, recording, recordType } = useRecorder()

    const toggleRecord = () => recording.value ? getRecord(): initRecord({video: video.value});
    
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
      video
    }
  }
}