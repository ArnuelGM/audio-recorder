const { ref, watch } = Vue

export default {
  template: /* html */ `
    <article>
      <h4>{{date.toLocaleString()}}</h4>
      
      <video v-if="record.type === 'video'" :src="record.src" controls style="width: 100%; margin-bottom: 1rem;"></video>
      <p v-if="text">{{ text }}</p>
      <div style="clear: both; overflow: hidden;">
        <button
          class="outline"
          style="float: left; margin-bottom: 1rem;"
          @click="playing ? pause() : play()"
          v-if="record.type === 'audio'"
        >
          <svg v-if="playing" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" stroke-width="0" fill="currentColor"></path>
            <path d="M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" stroke-width="0" fill="currentColor"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" stroke-width="0" fill="currentColor"></path>
          </svg>
        </button>
        <button
          @click="deleteRecord"
          class="outline secondary"
          style="float: right; margin-bottom: 1rem;"
        >
          Delete
        </button>
      </div>
    </article>
  `,

  props: [
    'record'
  ],

  setup(props, { emit }) {

    const { record } = props
    const { audio, date, id, text } = record
    const playing = ref(false)

    if(record.type === 'audio') audio.addEventListener('ended', () => playing.value = false)

    const play = () => {
      audio.play()
      playing.value = true
    }

    const pause = () => {
      audio.pause()
      playing.value = false
    }

    const deleteRecord = () => emit('deleteRecord', id)

    return {
      date,
      play,
      pause,
      deleteRecord,
      playing,
      text
    }
  }
}