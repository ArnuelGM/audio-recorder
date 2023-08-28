const { ref } = Vue

export function useRecorder() {

  let audioChunks = [];
  let recording = ref(false);
  let mediaRecorder;
  let record = ref(null)

  const processRecord = async () => {
    const audioData = new Blob(audioChunks, {
      type: "audio/webm;codecs=opus",
    });
    audioChunks = [];
    record.value = audioData
    console.log({audioData})
    return audioData
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

  const saveAudioBuffer = (chunk) => {
    console.log({chunk})
    audioChunks.push(chunk);
  };

  const recordStream = (stream) => {
    mediaRecorder = new MediaRecorder(stream);
    //mediaRecorder.onstop = processRecord;
    mediaRecorder.ondataavailable = (event) => saveAudioBuffer(event.data);
    mediaRecorder.start(10000); // Guardamos el buffer cada 10 segundos
    recording.value = true;
  };

  const requestRecord = async (options) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          /* noiseSuppression: true, */
          /* echoCancellation: true, */
          ...options
        },
      });

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
    record
  }
}