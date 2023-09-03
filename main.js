const {createApp, ref} = Vue
import Recorder from "./components/Recorder.js"
import Record from "./components/Record.js"

createApp({
  components: {
    Recorder,
    Record
  },
  setup(props, context) {

    const capturingSpeech = ref(false)
    const records = ref([]);

    const addRecord = (record) => {
      if( capturingSpeech.value ) {
        capturingSpeech.value = false
        records.value[0].text = record.text
        records.value[0].id = record.id
      }
      else {
        records.value.unshift(record)
      }
    };

    const deleteRecord = (recordID) => records.value = records.value.filter((rec) => rec.id !== recordID)

    const onSpeech = (text) => {
      let r = records.value[0]
      r.text = text
      r.id = text
      records.value[0] = r
    }

    const captureSpeech = (speechRecord) => {
      if(!speechRecord.text) speechRecord.text = '...'
      addRecord(speechRecord)
      capturingSpeech.value = true
      //records.value.unshift(speecRecord)
    }

    return {
      records,
      addRecord,
      deleteRecord,
      onSpeech,
      captureSpeech
    };
  }
}).mount("#app");
