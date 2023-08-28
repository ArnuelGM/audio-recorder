const { ref, watch } = Vue

export default {
  template: /* html */ `
    <article>
      <h4>{{date.toLocaleString()}}</h4>
      
      <div style="clear: both; overflow: hidden;">
        <button
          class="outline"
          style="float: left; margin-bottom: 1rem;"
          @click="playing ? pause() : play()"
        >
          {{ playing ? 'Pause' : 'Play' }}
        </button>
        <button
          @click="deleteRecord"
          class="outline secondary"
          style="float: right; margin-bottom: 1rem;"
        >
          Delete
        </button>
      </div>

      <input type="range" :min="0" :max="record.audio.duration" :value="currentTime">
    </article>
  `,

  props: [
    'record'
  ],

  setup(props, { emit }) {

    const { record } = props
    const { audio, date, id } = record
    const playing = ref(false)
    const currentTime = ref(0)

    audio.addEventListener('ended', () => playing.value = false)
    audio.addEventListener('timeupdate', () => {
      currentTime.value = audio.currentTime
    })

    const play = () => {
      record.audio.play()
      console.dir(record.audio)
      playing.value = true
    }

    const pause = () => {
      record.audio.pause()
      playing.value = false
    }

    const deleteRecord = () => emit('deleteRecord', id)

    return {
      date,
      play,
      pause,
      deleteRecord,
      playing,
      currentTime
    }
  }
}