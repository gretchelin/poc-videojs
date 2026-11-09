<script setup>
import { ref } from 'vue';
import VideoJSPlayer from '../components/videoPlayer/index.vue';

const videoUrl = ref('');
const thumbnailUrl = ref(''); //'https://picsum.photos/400/300'

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

async function onThumbnailChange(e) {
  const file = e?.target?.files?.[0] || e.target?.files;

  thumbnailUrl.value = await readFile(file);
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

  if(src) {
    videoUrl.value = src;
  }
}
</script>

<template>
  <div class="wrapper">
    <label> Insert video URL </label>
    <div style="display: flex; gap: 10px; align-items: center">
      <input v-model="videoUrl" class="poc-input" type="text" />
      <input type="file" mime="video/*" @change="onFileChange" />
    </div>
    <div>
      <button data-src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" @click="changeVideoUrl">HLS</button>
      <button data-src="https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd" @click="changeVideoUrl">Dash</button>
      <button data-src="https://www.youtube.com/live/yNKvkPJl-tg" @click="changeVideoUrl">Youtube Live Link</button>
      <button data-src="https://www.youtube.com/watch?v=DjvKyUWbK6g" @click="changeVideoUrl">Youtube Video Link</button>
    </div>

    <label>Insert thumbnail preview</label>
    <div style="display: flex; gap: 10px; align-items: center">
      <input v-model="thumbnailUrl" class="poc-input" type="text" />
      <input type="file" mime="image/*" @change="onThumbnailChange" />
    </div>

    <section>
      <h1>Native video</h1>

      <video
        class="aspect-video native-video"
        :src="videoUrl"
        playsinline
        @click="onNativeClick"
      >
        <a href="https://videojs.org/help">Video player not working?</a>
        <track kind="metadata" label="thumbnails" :src="thumbnailUrl" default />
      </video>
    </section>

    <section>
      <h1>Video.js Lib</h1>

      <VideoJSPlayer :src="videoUrl" :thumbnails="thumbnailUrl" class="videojs-video" />
    </section>
  </div>
</template>

<style scoped>
.wrapper {
  padding: 10px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.poc-input {
  width: 100;
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
</style>
