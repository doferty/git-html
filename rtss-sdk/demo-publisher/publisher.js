const wowzarts = window.wowzarts
streamName = window.streamName
token = window.token

const tokenGenerator = () => wowzarts.Director.getPublisher({ token, streamName })

class WowzaRTSPublisher {
  constructor () {
    this.streamCount = null
  }

  async init () {
    this.media = window.media
    this.mediaStream = await this.media.getMedia()
    console.log('GetMedia response:', this.mediaStream)
    document.getElementById('wowzarts-media-video').srcObject = this.mediaStream
    this.setCodecOptions()
  }

  async loadCamera () {
    streamName = document.getElementById('sname').value
    token = document.getElementById('token').value
    this.wowzartsPublish = new wowzarts.Publish(streamName, tokenGenerator)
    console.log('GetMedia response:', this.mediaStream)
  }

  setCodecOptions () {
    const capabilities = wowzarts.PeerConnection.getCapabilities('video')
    const options = []
    
    for (const codec of capabilities.codecs) {
      options.push(`<option value='${codec.codec}'>${codec.codec}</option>`)
    }

    document.getElementById('codec-select').innerHTML = options.join('\n')

    this.selectedCodec = capabilities.codecs[0]?.codec

    if (capabilities.codecs[0]?.scalabilityModes) {
      const scalabilityOptions = []
      for (const scalability of capabilities.codecs[0].scalabilityModes) {
        scalabilityOptions.push(`<option value='${scalability}'>${scalability}</option>`)
      }
      scalabilityOptions.push('<option value=\'none\'>None</option>')
      document.getElementById('scalability-mode-select').innerHTML = scalabilityOptions.join('\n')
    } else {
      document.getElementById('scalability-mode-select').innerHTML = '<option value=\'none\'>None</option>'
    }
    this.selectedScalabilityMode = document.getElementById('scalability-mode-select').value

  }

  async start (options = undefined) {
    const bandwidth = Number.parseInt(document.getElementById('bitrate-select').value)
    this.loadCamera()
    try {
      const broadcastOptions = options ?? {
        mediaStream: this.mediaStream,
        bandwidth: bandwidth,
        simulcast: this.selectedCodec === 'h264' || this.selectedCodec === 'vp8' ? this.simulcast : false,
        codec: this.selectedCodec,
        scalabilityMode: this.selectedScalabilityMode === 'none' ? null : this.selectedScalabilityMode,
        record: false
      }
      this.wowzartsPublish.on('connectionStateChange', (state) => {
        if (state === 'connected') {
          const viewLink = window.location.origin + `/../demo-player/player.html/?streamName=${streamName}`
          console.log('Broadcast viewer link: ', viewLink)
          document.getElementById('broadcast-status-label').innerHTML = `LIVE!` //`
        }
      })
      await this.wowzartsPublish.connect(broadcastOptions)

      // On Peer stats
      this.wowzartsPublish.webRTCPeer.on('stats', (stats) => {
        this.stats = stats
        this.loadStatsInTable(stats)
      })

      // Subscribing to User Count Event.
      this.streamCount = await wowzarts.StreamEvents.init()
      this.streamCount.onUserCount(streamName, data => {
        document.getElementById('broadcast-viewers').innerHTML = `Viewers: ${data.count}`
      })

      document.getElementById('input-source-btn').disabled = true

      // Start Stats
      this.getStats()
    } catch (error) {
      console.log('There was an error while trying to broadcast: ', error)
    }
  }

  stop () {
    this.wowzartsPublish.stop()
    this.streamCount.stop()
    this.stopStats()
    console.log('Broadcast stopped')
    document.getElementById('broadcast-status-label').innerHTML = 'READY!'
    document.getElementById('broadcast-viewers').innerHTML = ''
    document.getElementById('input-source-btn').disabled = false
  }

  changeCodec (selectObject) {
    document.getElementById('scalability-mode-select').innerHTML = ''
    this.selectedCodec = selectObject.value

    const capabilities = wowzarts.PeerConnection.getCapabilities('video')
    const selectedCapability = capabilities.codecs.find(x => x.codec === this.selectedCodec)
    if (selectedCapability.scalabilityModes) {
      const scalabilityOptions = []
      for (const scalability of selectedCapability.scalabilityModes) {
        scalabilityOptions.push(`<option value='${scalability}'>${scalability}</option>`)
      }
      scalabilityOptions.push('<option value=\'none\'>None</option>')
      document.getElementById('scalability-mode-select').innerHTML = scalabilityOptions.join('\n')
    } else {
      document.getElementById('scalability-mode-select').innerHTML = '<option value=\'none\'>None</option>'
    }
    this.selectedScalabilityMode = document.getElementById('scalability-mode-select').value
  }

  changeScalability (selectObject) {
    this.selectedScalabilityMode = selectObject.value
  }

  setSimulcast (checkboxObject) {
    this.simulcast = checkboxObject.checked
  }

  async updateBitrate (selectObject) {
    if (this.wowzartsPublish.isActive()) {
      const bitrate = selectObject.value
      await this.wowzartsPublish.webRTCPeer.updateBitrate(bitrate)
      console.log('Bitrate updated')
    }
  }

  getStats () {
    this.wowzartsPublish.webRTCPeer.initStats()
    document.getElementById('stats').classList.add('show')
  }

  stopStats () {
    this.wowzartsPublish.webRTCPeer.stopStats()
    document.getElementById('stats').classList.remove('show')
    const candidateInfo = document.getElementById('candidate-info')
    const tracksInfo = document.getElementById('tracks-info')
    candidateInfo.innerHTML = tracksInfo.innerHTML = ''
  }

  loadStatsInTable (stats) {
    const candidateInfo = document.getElementById('candidate-info')
    candidateInfo.innerHTML = `
      <tr>
        <td>${stats.candidateType}</td>
        <td>${stats.availableOutgoingBitrate / 1000}</td>
        <td>${stats.currentRoundTripTime}</td>
        <td>${stats.totalRoundTripTime}</td>
      </tr>
    `

    const tracksInfo = document.getElementById('tracks-info')
    const tracks = []

    for (const track of stats.video.outbounds) {
      tracks.push(`
        <tr>
          <td>Video</td>
          <td>${track.id}</td>
          <td>${track.mimeType}</td>
          <td>${track.frameWidth}</td>
          <td>${track.frameHeight}</td>
          <td>${track.qualityLimitationReason}</td>
          <td>${track.framesPerSecond || '-'}</td>
          <td>${track.totalBytesSent}</td>
          <td>${track.bitrate / 1000}</td>
          <td>${new Date(track.timestamp).toISOString()}</td>
        </tr>
      `)
    }

    for (const track of stats.audio.outbounds) {
      tracks.push(`
        <tr>
          <td>Audio</td>
          <td>${track.id}</td>
          <td>${track.mimeType}</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>${track.totalBytesSent}</td>
          <td>${track.bitrate / 1000}</td>
          <td>${new Date(track.timestamp).toISOString()}</td>
        </tr>
      `)
    }

    tracksInfo.innerHTML = tracks.join(' ')
  }

  async changeVideoInputSource() {
    const button = document.getElementById('input-source-btn')
    const oldMediaStream = this.mediaStream
    try {
      if (button.innerHTML == 'Show Desktop') {
        this.mediaStream = await this.media.getDesktop()
        button.innerHTML = 'Show Camera'
      } else {
        this.mediaStream = await this.media.getMedia()
        button.innerHTML = 'Show Desktop'
      }
    } catch (e) {
    } finally {
      document.getElementById('wowzarts-media-video').srcObject = this.mediaStream
      if(oldMediaStream !== this.mediaStream)
        oldMediaStream.getTracks().forEach(track => track.stop())
    }
  }
}

const wowzartsPublisher = new WowzaRTSPublisher()
wowzartsPublisher.init()
