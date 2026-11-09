<template>
  <media-time-slider
      v-if="type === PlayerControlType.TIMESLIDER"
      class="media-ctrl media-ctrl-time-slider"
      v-bind="$attrs"
  >
    <media-slider-track class="media-ctrl-time-slider-track">
      <media-slider-buffer class="media-ctrl-time-slider-buffer"></media-slider-buffer>
      <media-slider-fill class="media-ctrl-time-slider-fill"></media-slider-fill>
    </media-slider-track>
    <media-slider-thumb class="media-ctrl-time-slider-thumb"></media-slider-thumb>
  </media-time-slider>

  <media-play-button
      v-else-if="type === PlayerControlType.PLAY"
      class="media-ctrl media-ctrl-play"
      v-bind="$attrs"
  >
    <span class="on-active"><slot name="play"/></span>
    <span class="on-inactive"><slot name="pause"/></span>
  </media-play-button>

  <media-time
      v-else-if="type === PlayerControlType.TIMESTAMP"
      class="media-ctrl media-ctrl-timestamp"
      v-bind="$attrs"
      type="current"
  ></media-time>

  <media-time
      v-else-if="type === PlayerControlType.DURATION"
      class="media-ctrl media-ctrl-duration"
      v-bind="$attrs"
      type="duration"
  ></media-time>

  <template v-else-if="type === PlayerControlType.VOLUME">
    <media-mute-button
        class="media-ctrl media-ctrl-volume"
        v-bind="$attrs"
        :commandfor="volumeLevel ? volumeBarId : undefined"
    >
      <span class="on-active"><slot name="unmute"/></span>
      <span class="on-inactive"><slot name="mute"/></span>
    </media-mute-button>

    <media-volume-popover
        v-if="volumeLevel"
        :id="volumeBarId"
        side="top"
        open-on-hover
        class="media-ctrl-volume__popup"
    >
      <media-volume-slider orientation="vertical" class="media-ctrl-volume__slider">
        <media-slider-track class="media-ctrl-volume__track">
          <media-slider-fill class="media-ctrl-volume__fill"></media-slider-fill>
        </media-slider-track>
        <media-slider-thumb class="media-ctrl-volume__thumb"></media-slider-thumb>
        <media-slider-value type="current" class="media-ctrl-volume__value"></media-slider-value>
      </media-volume-slider>
    </media-volume-popover>
  </template>

  <media-volume-slider
      v-else-if="type === PlayerControlType.VOLUME_SLIDER"
      class="media-ctrl-volume-slider"
      v-bind="$attrs"
  >
    <media-slider-track class="media-ctrl-volume-slider-track">
      <media-slider-fill class="media-ctrl-volume-slider-fill"></media-slider-fill>
    </media-slider-track>
    <media-slider-thumb class="media-ctrl-volume-slider-thumb"></media-slider-thumb>
    <media-slider-value type="pointer" class="media-ctrl-volume-slider-value"></media-slider-value>
  </media-volume-slider>

  <media-fullscreen-button
      v-else-if="type === PlayerControlType.FULLSCREEN"
      class="media-ctrl media-ctrl-fullscreen"
      v-bind="$attrs"
  >
    <span class="on-active"><slot name="fs-on"/></span>
    <span class="on-inactive"><slot name="fs-off"/></span>
  </media-fullscreen-button>

  <media-captions-button
      v-else-if="type === PlayerControlType.CAPTION"
      class="media-ctrl media-ctrl-caption"
      v-bind="$attrs"
  >
    <span class="on-active"><slot name="cc-on"/></span>
    <span class="on-inactive"><slot name="cc-off"/></span>
  </media-captions-button>

  <media-pip-button
      v-else-if="type === PlayerControlType.PIP"
      class="media-ctrl media-ctrl-pip"
      v-bind="$attrs"
  >
    <span class="on-active"><slot name="pip-on"/></span>
    <span class="on-inactive"><slot name="pip-off"/></span>
  </media-pip-button>

  <div
      class="media-ctrl media-ctrl-quality"
      v-else-if="type === PlayerControlType.QUALITY"
      v-bind="$attrs"
  >
    <button type="button" :commandfor="qualityId" class="media-ctrl media-ctrl-quality-cta">Quality</button>
    <media-menu
        :id="qualityId"
        class="media-ctrl media-ctrl-quality-menu"
        side="top" align="end"
    >
      <media-menu-content>
        <media-quality-radio-group class="media-ctrl-quality-menu-group" label="Quality">
          <template>
            <media-menu-radio-item class="media-ctrl-quality-menu-item">
                <span>
                  <span data-part="label"></span>
                  <sup data-part="tier" class="media-ctrl-quality-menu-tier"></sup>
                </span>
              <span data-part="badge" class="media-ctrl-quality-menu-badge"></span>
              <media-menu-item-indicator force-mount class="media-ctrl-quality-menu-indicator">✓
              </media-menu-item-indicator>
            </media-menu-radio-item>
          </template>
        </media-quality-radio-group>
      </media-menu-content>
    </media-menu>
  </div>

  <media-seek-button
      v-else-if="type === PlayerControlType.SEEK_BW"
      class="media-ctrl media-ctrl-seek-bw"
      v-bind="$attrs"
  >
    <slot name="seek-bw"/>
  </media-seek-button>

  <media-seek-button
      v-else-if="type === PlayerControlType.SEEK_FW"
      class="media-ctrl media-ctrl-seek-fw"
      v-bind="$attrs"
  >
    <slot name="seek-fw"/>
  </media-seek-button>

  <template
      v-else-if="type === PlayerControlType.LIVE"
  >
    <media-live-button
        v-if="type === PlayerControlType.LIVE"
        class="media-ctrl media-ctrl-live"
        v-bind="$attrs"
    >
      <slot name="live">
        <span class="media-ctrl-live-indicator"></span>
        <span class="media-ctrl-live-label">Live</span>
      </slot>
    </media-live-button>
  </template>


  <slot v-else/>
</template>

<script setup>
import {defineOptions, defineProps, useId} from 'vue';
import '@videojs/html/ui/controls';
import '@videojs/html/ui/play-button';
import '@videojs/html/ui/time-slider';
import '@videojs/html/ui/slider-track';
import '@videojs/html/ui/slider-buffer';
import '@videojs/html/ui/slider-fill';
import '@videojs/html/ui/slider-thumb';
import '@videojs/html/ui/slider-value';
import '@videojs/html/ui/time';
import '@videojs/html/ui/mute-button';
import '@videojs/html/ui/fullscreen-button';
import '@videojs/html/ui/captions-button';
import '@videojs/html/ui/pip-button';
import '@videojs/html/ui/menu';
import '@videojs/html/ui/menu-content';
import '@videojs/html/ui/menu-radio-item';
import '@videojs/html/ui/menu-item-indicator';
import '@videojs/html/ui/quality-radio-group';
import '@videojs/html/ui/live-button';
import '@videojs/html/ui/volume-popover';
import '@videojs/html/ui/volume-slider';
import {PlayerControlType} from './constants.js';

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  /** Control type to render based on `PlayerControlType` when exist, otherwise, default slot is provided */
  type: {
    type: String,
    default: '',
  },
  /**
   * Enable volume level slider when `type` matches PlayerControlType.VOLUME
   */
  volumeLevel: {
    type: Boolean,
    default: false,
  }
});

const id = useId();
const qualityId = `media-ctrl-quality-menu-${id}`;
const volumeBarId = `media-ctrl-volume-menu-${id}`;
</script>

<style scoped>
.media-ctrl {
  --play-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82'/%3E%3C/svg%3E");
  --pause-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2m6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2'/%3E%3C/svg%3E");
  --mute-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M7 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L11 9H8c-.55 0-1 .45-1 1'/%3E%3C/svg%3E");
  --unmute-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1m13.5 2A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02M14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85'/%3E%3C/svg%3E");
  --fs-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M6 14c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1H7v-2c0-.55-.45-1-1-1m0-4c.55 0 1-.45 1-1V7h2c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1m11 7h-2c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1s-1 .45-1 1zM14 6c0 .55.45 1 1 1h2v2c0 .55.45 1 1 1s1-.45 1-1V6c0-.55-.45-1-1-1h-3c-.55 0-1 .45-1 1'/%3E%3C/svg%3E");
  --exit-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M6 16h2v2c0 .55.45 1 1 1s1-.45 1-1v-3c0-.55-.45-1-1-1H6c-.55 0-1 .45-1 1s.45 1 1 1m2-8H6c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1s-1 .45-1 1zm7 11c.55 0 1-.45 1-1v-2h2c.55 0 1-.45 1-1s-.45-1-1-1h-3c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1m1-11V6c0-.55-.45-1-1-1s-1 .45-1 1v3c0 .55.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1z'/%3E%3C/svg%3E");
  --cc-on-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m-8 6.5c0 .28-.22.5-.5.5H10c-.28 0-.5-.22-.5-.5h-2v3h2c0-.28.22-.5.5-.5h.5c.28 0 .5.22.5.5v.5c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1zm7 0c0 .28-.22.5-.5.5H17c-.28 0-.5-.22-.5-.5h-2v3h2c0-.28.22-.5.5-.5h.5c.28 0 .5.22.5.5v.5c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1z'/%3E%3C/svg%3E");
  --cc-off-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M19.5 5.5v13h-15v-13zM19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1z'/%3E%3C/svg%3E");
  --pip-on-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M11.308 16.962H19v-5.693h-7.692zM4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h14.77q.69 0 1.152.463T21 6.616v10.769q0 .69-.463 1.153T19.385 19z'/%3E%3C/svg%3E");
  --pip-off-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M18 11h-6c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1m5 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2m-3 .02H4c-.55 0-1-.45-1-1V5.97c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v12.05c0 .55-.45 1-1 1'/%3E%3C/svg%3E");
  --seek-bw-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M11.99 5V2.21c0-.45-.54-.67-.85-.35L7.35 5.65c-.2.2-.2.51 0 .71l3.79 3.79a.5.5 0 0 0 .85-.35V7c3.73 0 6.68 3.42 5.86 7.29c-.47 2.27-2.31 4.1-4.57 4.57c-3.57.75-6.75-1.7-7.23-5.01a.984.984 0 0 0-.98-.85c-.6 0-1.08.53-1 1.13c.62 4.39 4.8 7.64 9.53 6.72c3.12-.61 5.63-3.12 6.24-6.24c.99-5.13-2.9-9.61-7.85-9.61m-1.1 11h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09zm4.28-1.76c0 .32-.03.6-.1.82s-.17.42-.29.57s-.28.26-.45.33s-.37.1-.59.1s-.41-.03-.59-.1s-.33-.18-.46-.33s-.23-.34-.3-.57s-.11-.5-.11-.82v-.74c0-.32.03-.6.1-.82s.17-.42.29-.57s.28-.26.45-.33s.37-.1.59-.1s.41.03.59.1s.33.18.46.33s.23.34.3.57s.11.5.11.82zm-.85-.86c0-.19-.01-.35-.04-.48s-.07-.23-.12-.31s-.11-.14-.19-.17s-.16-.05-.25-.05s-.18.02-.25.05s-.14.09-.19.17s-.09.18-.12.31s-.04.29-.04.48v.97c0 .19.01.35.04.48s.07.24.12.32s.11.14.19.17s.16.05.25.05s.18-.02.25-.05s.14-.09.19-.17s.09-.19.11-.32s.04-.29.04-.48v-.97z'/%3E%3C/svg%3E");
  --seek-fw-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M18.92 13c-.5 0-.91.37-.98.86a6.006 6.006 0 0 1-7.42 4.96c-2.25-.54-3.91-2.27-4.39-4.53A6.014 6.014 0 0 1 12 7v2.79c0 .45.54.67.85.35l3.79-3.79c.2-.2.2-.51 0-.71l-3.79-3.79a.5.5 0 0 0-.85.36V5c-4.94 0-8.84 4.48-7.84 9.6c.6 3.11 2.9 5.5 5.99 6.19c4.83 1.08 9.15-2.2 9.77-6.67c.09-.59-.4-1.12-1-1.12m-8.02 3v-4.27h-.09l-1.77.63v.69l1.01-.31V16zm3.42-4.22c-.18-.07-.37-.1-.59-.1s-.41.03-.59.1s-.33.18-.45.33s-.23.34-.29.57s-.1.5-.1.82v.74c0 .32.04.6.11.82s.17.42.3.57s.28.26.46.33s.37.1.59.1s.41-.03.59-.1s.33-.18.45-.33s.22-.34.29-.57s.1-.5.1-.82v-.74c0-.32-.04-.6-.11-.82s-.17-.42-.3-.57s-.29-.26-.46-.33m.01 2.57c0 .19-.01.35-.04.48s-.06.24-.11.32s-.11.14-.19.17s-.16.05-.25.05s-.18-.02-.25-.05s-.14-.09-.19-.17s-.09-.19-.12-.32s-.04-.29-.04-.48v-.97c0-.19.01-.35.04-.48s.06-.23.12-.31s.11-.14.19-.17s.16-.05.25-.05s.18.02.25.05s.14.09.19.17s.09.18.12.31s.04.29.04.48v.97z'/%3E%3C/svg%3E");
  --settings-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 0 0-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.3 7.3 0 0 0 0 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68m-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5'/%3E%3C/svg%3E");
  --live-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='8' fill='black'/%3E%3C/svg%3E");
}

/* The slider sets its progress as CSS custom properties. */
.media-ctrl-time-slider {
  min-width: 40px;
  flex: 1;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  height: 20px;
  cursor: pointer;

  .media-ctrl-time-slider-track {
    position: relative;
    width: 100%;
    height: 4px;
    background: var(--media-slider-track, rgb(255 255 255 / 0.3));
    border-radius: 9999px;
  }

  .media-ctrl-time-slider-buffer,
  .media-ctrl-time-slider-fill {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border-radius: inherit;
  }

  .media-ctrl-time-slider-buffer {
    width: var(--media-slider-buffer);
    background: rgb(255 255 255 / 0.4);
  }

  .media-ctrl-time-slider-fill {
    width: var(--media-slider-fill);
    background: white;
  }

  .media-ctrl-time-slider-thumb {
    position: absolute;
    left: var(--media-slider-fill);
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    translate: -50% 0;
  }
}

.media-ctrl-timestamp {
  font-size: 1em;
}

.media-ctrl-play,
.media-ctrl-volume,
.media-ctrl-fullscreen,
.media-ctrl-caption,
.media-ctrl-pip {
  cursor: pointer;

  .on-active, .on-inactive {
    display: none;
  }

  .on-active:empty:before,
  .on-inactive:empty:before {
    content: '';
    display: block;
    width: 1em;
    height: 1em;
    mask-size: 100% 100%;
    mask-repeat: no-repeat;
    mask-position: center;
    background: currentColor;
  }
}

.media-ctrl-play {
  &[data-paused] .on-active {
    display: block;
  }

  &:not([data-paused]) .on-inactive {
    display: block;
  }

  .on-active:empty:before {
    mask-image: var(--play-svg);
  }

  .on-inactive:empty:before {
    mask-image: var(--pause-svg);
  }
}

.media-ctrl-volume {
  &[data-muted] .on-active {
    display: block;
  }

  &:not([data-muted]) .on-inactive {
    display: block;
  }

  .on-active:empty:before {
    mask-image: var(--mute-svg);
  }

  .on-inactive:empty:before {
    mask-image: var(--unmute-svg);
  }
}

.media-ctrl-fullscreen {
  &[data-fullscreen] .on-active {
    display: block;
  }

  &:not([data-fullscreen]) .on-inactive {
    display: block;
  }

  .on-active:empty:before {
    mask-image: var(--exit-svg);
  }

  .on-inactive:empty:before {
    mask-image: var(--fs-svg);
  }
}

.media-ctrl-caption {
  &[data-active] .on-active {
    display: block;
  }

  &:not([data-active]) .on-inactive {
    display: block;
  }

  .on-active:empty:before {
    mask-image: var(--cc-on-svg);
  }

  .on-inactive:empty:before {
    mask-image: var(--cc-off-svg);
  }
}

.media-ctrl-pip {
  &[data-pip] .on-active {
    display: block;
  }

  &:not([data-pip]) .on-inactive {
    display: block;
  }

  .on-active:empty:before {
    mask-image: var(--pip-on-svg);
  }

  .on-inactive:empty:before {
    mask-image: var(--pip-off-svg);
  }
}

.media-ctrl-seek-bw,
.media-ctrl-seek-fw,
.media-ctrl-live,
.media-ctrl-settings {
  display: block;
  appearance: none;
  border: 0;
  background: transparent;
  color: inherit;
  padding: 0;
  margin: 0;
  font-size: inherit;
  cursor: pointer;

  &:empty:before {
    content: '';
    display: block;
    width: 1em;
    height: 1em;
    font-size: 1em;
    mask-size: 100% 100%;
    mask-repeat: no-repeat;
    mask-position: center;
    background: currentColor;
  }
}

.media-ctrl-seek-bw {
  &:empty:before {
    mask-image: var(--seek-bw-svg);
  }
}

.media-ctrl-seek-fw {
  &:empty:before {
    mask-image: var(--seek-fw-svg);
  }
}

.media-ctrl-live {
  display: flex;
  align-items: center;
  gap: calc(1em * 0.25);

  .media-ctrl-live-indicator {
    display: block;
    width: 1em;

    &:empty:before {
      content: '';
      display: block;
      width: 1em;
      height: 1em;
      font-size: 1em;
      mask-size: 100% 100%;
      mask-repeat: no-repeat;
      mask-position: center;
      background: currentColor;
      mask-image: var(--live-svg);
    }
  }

  &[data-disabled] {
    opacity: 0.5;
  }

  &[data-live-edge] {
    color: var(--media-live-active-color, red);
  }
}

.media-ctrl-volume__popup {
  --media-popover-side-offset: 0px;
  width: 54px;
  height: 160px;
  padding: 1rem 0 0;
  margin: 0;
  color: var(--media-menu-color, white);
  background: var(--media-menu-bg, rgb(0 0 0 / 85%));
  border: 0;
  border-radius: 9999px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &:not([data-open]) {
    display: none;
    opacity: 0;
  }

  .media-ctrl-volume__slider {
    position: relative;
    display: block;
    width: 100%;
    height: 120px;
    margin: auto;
    cursor: pointer;
  }

  .media-ctrl-volume__track {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 4px;
    background: var(--media-slider-track, rgb(255 255 255 / 30%));
    border-radius: 9999px;
    transform: translateX(-50%);
  }

  .media-ctrl-volume__fill {
    position: absolute;
    bottom: 0;
    left: 50%;
    height: var(--media-slider-fill);
    background: currentColor;
    border-radius: inherit;
    transform: translateX(-50%);
  }

  .media-ctrl-volume__thumb {
    position: absolute;
    bottom: var(--media-slider-fill);
    left: 50%;
    width: 14px;
    height: 14px;
    background: currentColor;
    border-radius: 50%;
    transform: translateX(-50%) translateY(50%);
  }

  .media-ctrl-volume__value {
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: calc(100% + 0.25em);
    font-size: 0.725em;
  }
}

.media-ctrl-volume-slider {
  position: relative;
  display: flex;
  align-items: center;
  width: 100px;
  height: 20px;
  cursor: pointer;

  .media-ctrl-volume-slider-track {
    position: absolute;
    right: 0;
    left: 0;
    height: 4px;
    background: var(--media-slider-track, rgba(255, 255, 255, 0.3));
    border-radius: 9999px;
    backdrop-filter: blur(10px);
    transition: height 150ms ease;
  }

  &[data-interactive] .media-ctrl-volume-slider-track {
    height: 6px;
  }

  .media-ctrl-volume-slider-fill {
    position: absolute;
    top: 0;
    left: 0;
    width: var(--media-slider-fill);
    height: 100%;
    background: currentColor;
    border-radius: 9999px;
  }

  .media-ctrl-volume-slider-thumb {
    position: absolute;
    left: var(--media-slider-fill);
    width: 14px;
    height: 14px;
    background: currentColor;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    transform: translateX(-50%) scale(0);
    transition: transform 150ms ease;
  }


  &[data-interactive] .media-ctrl-volume-slider-thumb {
    transform: translateX(-50%) scale(1);
  }

  &[data-dragging] .media-ctrl-volume-slider-thumb {
    transform: translateX(-50%) scale(1.1);
  }

  .media-ctrl-volume-slider-value {
    position: absolute;
    bottom: 100%;
    left: var(--media-slider-pointer);
    padding: 2px 6px;
    margin-bottom: 6px;
    font-size: 12px;
    color: var(--media-menu-color, white);
    white-space: nowrap;
    pointer-events: none;
    background: var(--media-menu-bg, rgba(0, 0, 0, 0.8));
    border-radius: 4px;
    opacity: 0;
    transform: translateX(-50%);
    transition: opacity 150ms ease;
  }

  &[data-pointing] .media-ctrl-volume-slider-value {
    opacity: 1;
  }
}

.media-ctrl-settings {
  &:empty:before {
    mask-image: var(--settings-svg);
  }
}

.media-ctrl-quality {
  font-size: 1rem;

  .media-ctrl-quality-menu {
    --media-menu-side-offset: 8px;
    box-sizing: border-box;
    min-width: 180px;
    max-width: var(--media-menu-available-width, var(--media-popover-available-width, none));
    max-height: var(--media-menu-available-height, var(--media-popover-available-height, none));
    padding: 6px;
    overflow: auto;
    overscroll-behavior: none;
    font-size: 0.875em;
    line-height: 1.43;
    color: var(--media-menu-color, white);
    background: var(--media-menu-bg, rgba(0, 0, 0, 0.88));
    border: 0 solid transparent;
    border-radius: 8px;
    backdrop-filter: blur(10px);
  }

  .media-ctrl-quality-menu-group {
    display: grid;
    gap: 2px;
  }

  .media-ctrl-quality-menu-item {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    font: inherit;
    color: inherit;
    cursor: pointer;
    background: none;
    border: 0;
    border-radius: 6px;
  }

  .media-ctrl-quality-menu-item[data-highlighted] {
    background: rgba(255, 255, 255, 0.16);
  }

  .media-ctrl-quality-menu-tier {
    margin-left: 2px;
    font-size: 10px;
  }

  .media-ctrl-quality-menu-badge {
    margin-left: auto;
    color: rgba(255, 255, 255, 0.72);
  }

  .media-ctrl-quality-menu-indicator {
    opacity: 0;
  }

  :deep(media-menu-radio-item[aria-checked="true"]) .media-ctrl-quality-menu-indicator {
    opacity: 1;
  }
}

.media-ctrl-error {
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

.media-ctrl-error:not([data-open]) {
  display: none;
}
</style>
