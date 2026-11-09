<template>
  <media-time-slider
    v-if="type === PlayerControlType.TIMESLIDER"
    class="video-skin-time-slider"
    v-bind="$attrs"
  >
    <media-slider-track class="video-skin-track">
      <media-slider-buffer class="video-skin-buffer"></media-slider-buffer>
      <media-slider-fill class="video-skin-fill"></media-slider-fill>
    </media-slider-track>
    <media-slider-thumb class="video-skin-thumb"></media-slider-thumb>
  </media-time-slider>

  <media-play-button
    v-else-if="type === PlayerControlType.PLAY"
    class="video-skin-play"
    v-bind="$attrs"
  >
    <span class="show-when-paused">Play</span>
    <span class="show-when-playing">Pause</span>
  </media-play-button>

  <media-time
    v-else-if="type === PlayerControlType.TIMESTAMP"
    class="player-control-item"
    v-bind="$attrs"
    type="current"
  ></media-time>

  <media-mute-button
    v-else-if="type === PlayerControlType.VOLUME"
    class="video-skin-mute"
    v-bind="$attrs"
  >
    <span class="show-when-muted">Unmute</span>
    <span class="show-when-unmuted">Mute</span>
  </media-mute-button>

  <media-fullscreen-button
    v-else-if="type === PlayerControlType.FULLSCREEN"
    class="video-skin-fullscreen"
    v-bind="$attrs"
  >
    <span class="show-when-fullscreen">Exit fullscreen</span>
    <span class="show-when-not-fullscreen">Fullscreen</span>
  </media-fullscreen-button>

  <slot v-else />
</template>

<script setup>
import { defineOptions, defineProps } from 'vue';
import '@videojs/html/ui/controls';
import '@videojs/html/ui/play-button';
import '@videojs/html/ui/time-slider';
import '@videojs/html/ui/slider-track';
import '@videojs/html/ui/slider-buffer';
import '@videojs/html/ui/slider-fill';
import '@videojs/html/ui/slider-thumb';
import '@videojs/html/ui/time';
import '@videojs/html/ui/mute-button';
import '@videojs/html/ui/fullscreen-button';
import { PlayerControlType } from './constants.js';

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  type: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
/* The slider sets its progress as CSS custom properties. */
.video-skin-time-slider {
  min-width: 40px;
  flex: 1;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  height: 20px;
  cursor: pointer;
}

.video-skin-track {
  position: relative;
  width: 100%;
  height: 4px;
  background: rgb(255 255 255 / 0.3);
  border-radius: 9999px;
}

.video-skin-buffer,
.video-skin-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  border-radius: inherit;
}

.video-skin-buffer {
  width: var(--media-slider-buffer);
  background: rgb(255 255 255 / 0.4);
}

.video-skin-fill {
  width: var(--media-slider-fill);
  background: white;
}

.video-skin-thumb {
  position: absolute;
  left: var(--media-slider-fill);
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  translate: -50% 0;
}

.video-skin-error {
  position: absolute;
  inset: 0;
  display: grid;
  gap: 12px;
  place-content: center;
  padding: 24px;
  background: rgb(0 0 0 / 0.85);
  color: white;
  text-align: center;
}

.video-skin-error:not([data-open]) {
  display: none;
}
</style>
