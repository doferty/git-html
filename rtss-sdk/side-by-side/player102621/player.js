const wowzarts = window.wowzarts
const streamName = window.streamName

class WowzaRTSPlayer {
  constructor () {
    const href = new URL(window.location.href)
    this.streamName = (href.searchParams.get('streamName')) ? href.searchParams.get('streamName') : streamName
    this.playing = false
    this.disableVideo = href.searchParams.get('disableVideo') === 'true'
    this.disableAudio = href.searchParams.get('disableAudio') === 'true'
    const tokenGenerator = () => wowzarts.Director.getSubscriber(this.streamName)
    this.wowzartsView = new wowzarts.View(this.streamName, tokenGenerator)
    this.tracks = []
  }

  async init () {
    this.subscribe()
  }

  async subscribe () {
    try {
      this.wowzartsView.on('track', (event) => {
        this.tracks.push(event)
        console.log('Event from newTrack: ', event)
        this.addStreamToVideoTag(event)
      })
      this.wowzartsView.on('broadcastEvent', (event) => {
        console.log('Event from broadcastEvent: ', event)
      })

      const options = {
        disableVideo: this.disableVideo,
        disableAudio: this.disableAudio
      }
      this.wowzartsView.on('connectionStateChange', (state) => {
        console.log('Event from connectionStateChange: ', state)
      })
      await this.wowzartsView.connect(options)
    } catch (error) {
      console.log('There was an error while trying to connect with the publisher')
      this.wowzartsView.reconnect()
    }
  }

  addStreamToVideoTag (event) {
    this.addStream(event.streams[0])
  }

  addStream (stream) {
    const player = document.getElementById('wowzarts-player')
    const video = document.querySelector('video')
    if (this.disableVideo) {
      player.removeChild(video)
      const audio = document.createElement('audio')
      player.appendChild(audio)
      audio.controls = true
      audio.autoplay = true
      audio.srcObject = stream
    } else {
      video.srcObject = stream
    }
    this.playing = true
  }
}

const wowzaRTSPlayer = new WowzaRTSPlayer()
wowzaRTSPlayer.init()
