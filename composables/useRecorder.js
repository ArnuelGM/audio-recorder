const { ref } = Vue

export function useRecorder() {

  let recordChunks = [];
  let recording = ref(false);
  let mediaRecorder;
  let record = ref(null)
  let recordType = ref('audio')

  const processRecord = async () => {
    const recordData = new Blob(recordChunks, {
      type: "video/webm;codecs=vp8,opus",
    });
    recordChunks = [];
    record.value = recordData
    return recordData
  };

  const stopRecording = async () => {
    mediaRecorder.stop();
    return new Promise((r) => {
      setTimeout(async () => {
        await processRecord()
        recording.value = false;
        r(record.value)
      })
    })
  };

  const saveBuffer = (chunk) => {
    recordChunks.push(chunk);
  };

  const recordStream = (stream) => {
    mediaRecorder = new MediaRecorder(stream);
    //mediaRecorder.onstop = processRecord;
    mediaRecorder.ondataavailable = (event) => saveBuffer(event.data);
    mediaRecorder.start(10000); // Guardamos el buffer cada 10 segundos
    recording.value = true;
  };

  const requestRecord = async (options) => {
    try {

      recordType.value = !!options?.video ? 'video' : 'audio'

      let stream;

      if(recordType.value === 'video') {
        stream = await navigator.mediaDevices.getDisplayMedia({
          audio: true,
          ...options
        });
      }
      else {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          ...options
        });
      }

      recordStream(stream);
    } catch (error) {
      console.log({ error });
      alert("Error:\nNo es posible iniciar la grabación.");
    }
  };

  const initRecord = (options = {}) => {
    if( ! recording.value ) requestRecord(options)
  }

  return {
    initRecord,
    stopRecording,
    recording,
    record,
    recordType
  }
}