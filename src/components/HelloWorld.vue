<script setup>
import {computed, reactive, ref, useTemplateRef, watch} from 'vue';
import {PlayerControlType, VideoPlayer as VideoJSPlayer} from '../components/videoPlayer';

const PLAYER_CONTROLS = {
  top: {
    controls: [PlayerControlType.TIMESLIDER, PlayerControlType.TIMESTAMP, 'divider', PlayerControlType.DURATION],
    groupProps: {
      'aria-label': 'Media progress',
      styles: 'position: absolute; inset: 0 0 auto;',
    },
  },
  bottom: {
    controls: [
      PlayerControlType.PLAY,
      PlayerControlType.SEEK_BW,
      PlayerControlType.SEEK_FW,
      PlayerControlType.VOLUME,
      PlayerControlType.VOLUME_SLIDER,
      PlayerControlType.SETTINGS,
      PlayerControlType.CAPTION,
      PlayerControlType.PIP,
      PlayerControlType.FULLSCREEN,
      PlayerControlType.QUALITY,
      PlayerControlType.LIVE,
    ],
    groupProps: {
      'aria-label': 'Playback Control',
      styles: 'position: absolute; inset: auto 0 0;'
    },
  },
};

const videoUrl = ref('');
const posterUrl = ref('https://picsum.photos/400/300');
const type = ref('');
const playerRef = useTemplateRef('playerRefEl');
const videoPlayer = ref();
const playerState = reactive({});

const isIframe = computed(() => {
  return ['youtube', 'vimeo'].includes(type.value)
});
const nativeVideoUrl = computed(() => {
  let id = '';
  let url;

  try {
    url = new URL(videoUrl.value);
  } catch (e) {
    return videoUrl.value;
  }

  // Normalize regular 3rd party links such as Youtube/Vimeo/etc to its embed link
  if (type.value === 'youtube') {
    id = url.searchParams.get('v');

    if (!id) {
      id = url.pathname?.split('/')?.at(-1)
    }

    return `https://www.youtube.com/embed/${id}?rel=0"`
  } else if (type.value === 'vimeo') {
    id = url.pathname?.split('/')?.at(-1);
    return `https://player.vimeo.com/video/${id}`;
  }

  return videoUrl.value;
});

watch(playerRef, (value, oldValue, onCleanup) => {
  console.log('playerRef', value);

  // VideoJS store is not attached at the actual player (e.g. <youtube-video />, <video />, etc),
  // but to the videoJS player instance (i.e. <video-player/>, <live-video-player />, etc. basically the "preset"
  // or the instance created by `createPlayer`).
  // So we need to attach "listener" to the store through videoJS player,
  // while native video events directly to its video tag.

  const store = value?.videoJS?.store;

  let unsubscribe;

  if (store) {
    unsubscribe = store.subscribe(() => {
      const {
        isFullscreen,
        isPictureInPicture,
        controlsVisible,
        remotePlaybackState,
        activeVideoRendition,
        audioTrackList,
        textTrackList,
        paused
      } = store;

      // TODO: Update local player state with latest
      // We can watch the local state if needed, to detect "onChange" event on the state
      playerState.isFullscreen = isFullscreen;
      playerState.isPictureInPicture = isPictureInPicture;
      playerState.controlsVisible = controlsVisible;
      playerState.remotePlaybackState = remotePlaybackState;
      playerState.activeVideoRendition = activeVideoRendition;
      playerState.audioTrackList = audioTrackList;
      playerState.audioTrackList = audioTrackList;
      playerState.textTrackList = textTrackList;
      playerState.paused = paused;
    });
  }

  onCleanup(() => {
    unsubscribe?.();
  })
}, {
  immediate: true,
})

watch(videoPlayer, (value, oldValue, onCleanup) => {
  const events = ['canplay', 'loadedmetadata', 'timeupdate', 'durationchange', 'volumechange', 'ratechange'];

  if (value) {
    // TODO: Register native listener.
    // Unlike vidstack, vime, and many players, videoJS does not emit a normalized events.
    // So we can listen to native <video /> events as usual, unless specific event regarding the player state is required
    // which can be implemented by subscribing to store: https://videojs.org/docs/framework/html/guides/migrate-from-vidstack#read-player-state

    events.forEach(event => {
      value.addEventListener(event, onPlayerEvent)
    });
  }
  //
  onCleanup(() => {
    // TODO: unregister listener
    events.forEach(event => {
      value?.removeEventListener(event, onPlayerEvent)
    });
  })
}, {
  immediate: true,
});

watch(playerState, (value, oldValue) => {
  console.log('[Player] on State update:', {value, oldValue})
}, {
  immediate: true,
})

function onPlayerEvent(evt, ...args) {
  console.log('[Player Event]: onPlayerEvent', evt, {args});
}

async function readFile(file) {
  const reader = new FileReader();

  return new Promise((res) => {
    reader.addEventListener('load', () => {
      // convert image file to base64 string
      res(reader.result);
    });

    if (file) {
      reader.readAsDataURL(file);
    }
  });
}

const onFileChange = async (e) => {
  const file = e?.target?.files?.[0] || e.target?.files;

  videoUrl.value = await readFile(file);
};

async function onPosterChange(e) {
  const file = e?.target?.files?.[0] || e.target?.files;

  posterUrl.value = await readFile(file);
}

function onNativeClick(evt) {
  if (!evt?.target?.is_playing) {
    evt?.target?.play();
    evt.target.is_playing = true;
  } else {
    evt?.target?.pause();
    evt.target.is_playing = false;
  }
}

function changeVideoUrl(e) {
  const target = e?.target;
  const src = e?.target?.getAttribute('data-src');

  if (src) {
    videoUrl.value = src;
  }
}

const links = [
  ['HLS', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'],
  ['Dash', "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd"],
  ['YT Live Private', "https://www.youtube.com/live/yNKvkPJl-tg"],
  ['YT Live Public', "https://www.youtube.com/live/DOOrIxw5xOw"],
  ['YT Video', "https://www.youtube.com/watch?v=DjvKyUWbK6g"],
  ['Vimeo Embed', "https://player.vimeo.com/video/604344912?h=ec0f10410f"],
  ['Vimeo Video', "https://vimeo.com/449787858?fl=pl&fe="],
  // ['', ""],
]

function onPlayerChange(player) {
  console.log('onPlayerChange', player, player === videoPlayer.value)
  videoPlayer.value = player;
}
</script>

<template>
  <div class="wrapper">
    <h1>VideoJS Integration/Customization PoC</h1>

    <section id="config-form" style="display:flex; flex-direction: column;gap:8px;">
      <fieldset>
        <label> Insert video URL </label>
        <div style="display: flex; gap: 10px; align-items: center">
          <input
              v-model="videoUrl"
              class="poc-input"
              type="text"
              placeholder="Type or paste video URL here, or pick from the options below"
          />
        </div>

        <div>
          <input type="file" mime="video/*" @change="onFileChange"/>
          <button
              v-for="(link, idx) in links"
              :key="idx"
              :data-src="link[1]"
              @click="changeVideoUrl"
          >{{ link[0] }}
          </button>
        </div>
      </fieldset>

      <fieldset>
        <label>Insert poster</label>
        <div style="display: flex; gap: 10px; align-items: center">
          <input v-model="posterUrl" class="poc-input" type="text"/>
          <input type="file" mime="image/*" @change="onPosterChange"/>
        </div>
      </fieldset>

      <fieldset id="config-form-display">
        <label>Display</label>
        <label><input type="radio" name="display" value="grid" checked/>Grid</label>
        <label><input type="radio" name="display" value="block"/>Block</label>
      </fieldset>
    </section>

    <div id="display">
      <section>
        <h1>Native video/iframe</h1>

        <iframe
            v-if="isIframe"
            :src="nativeVideoUrl"
            width="640"
            height="360"
            frameborder="0"
            class="aspect-video native-video"
            allowfullscreen
            scrolling="no"
            allow="accelerometer *; clipboard-write *; encrypted-media *; gyroscope *; picture-in-picture *; web-share *; fullscreen; picture-in-picture; "
            referrerpolicy="strict-origin"
            no-cookie
        ></iframe>
        <video
            v-else
            class="aspect-video native-video"
            :src="nativeVideoUrl"
            playsinline
            @click="onNativeClick"
        ></video>
      </section>

      <section>
        <h1>Video.js Lib &nbsp;&nbsp; <span title="Open devtool console for event registration">ⓘ</span></h1>

        <VideoJSPlayer
            ref="playerRefEl"
            :src="videoUrl"
            :poster="posterUrl"
            class="videojs-video"
            :controls="PLAYER_CONTROLS"
            @type="type = $event"
            @player="onPlayerChange"
        >
          <!-- Override control -->
          <template #control-divider>
            /
          </template>

          <template #media-ctrl-live>
            <span>A Live</span>
          </template>
        </VideoJSPlayer>
      </section>
    </div>
  </div>
</template>

<style>
body {
  box-sizing: border-box;
}

body * {
  box-sizing: inherit;
}
</style>

<style scoped>
.wrapper {
  padding: 10px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.poc-input {
  width: 100%;
  border: solid 1px gainsboro;
  padding: 4px 8px;
}

.aspect-video {
  aspect-ratio: 16 / 9;
}

.native-video {
  width: 100%;
  border: solid 1px red;
}

.videojs-video {
  width: 100%;
  border: solid 1px blue;
}

section h1 {
  font-size: 1.25rem;
}

#config-form:has([value='grid']:checked) {
  & + #display {
    display: flex;
    flex-direction: row;
    overflow: hidden;
    gap: 10px;

    > * {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>
