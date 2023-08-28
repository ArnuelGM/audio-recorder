const {createApp, ref} = Vue
import Recorder from "./components/Recorder.js"
import Record from "./components/Record.js"

createApp({
  components: {
    Recorder,
    Record
  },
  setup(props, context) {

    const records = ref([]);

    const addRecord = (record) => {
      records.value.push(record)
    };

    const deleteRecord = (recordID) => records.value = records.value.filter((rec) => rec.id !== recordID)

    return {
      records,
      addRecord,
      deleteRecord
    };
  }
}).mount("#app");
