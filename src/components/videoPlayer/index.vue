<template>
  <video-player>
    <media-container class="player-skin">
      <component :is="videoComp" :src="normalizedSrc" v-bind="videoProps">
        <a href="https://videojs.org/help">Video player not working?</a>

        <track kind="metadata" label="thumbnails" :src="thumbnails" default />
      </component>

      <media-controls>
        <media-controls-content class="video-skin-controls">
          <template v-if="Object.keys(normalizedControls)?.length">
            <media-controls-group
              v-for="(groups, key) in normalizedControls"
              :key="key"
              class="player-control-group"
              :class="{
                [`player-control-group--${key}`]: !!key,
              }"
              aria-label="Playback controls"
              v-bind="groups?.groupProps"
            >
              <template
                v-for="(control, idx) in groups?.controls"
                :key="control || idx"
              >
                <slot :name="`control-${control?.toLowerCase()}`">
                  <MediaControl
                    :type="control"
                    class="player-control-item"
                    :class="{
                      [`player-control__${control?.toLowerCase()}`]: true,
                    }"
                  />
                </slot>
              </template>
            </media-controls-group>
          </template>
        </media-controls-content>
      </media-controls>
    </media-container>
  </video-player>
</template>

<script setup>
import { computed, defineProps, ref, toRefs, watch } from 'vue';
import '@videojs/html/video/player';
import '@videojs/html/ui/container';
import '@videojs/html/ui/controls';
import '@videojs/html/ui/controls-content';
import '@videojs/html/ui/controls-group';
import '@videojs/html/ui/hotkey';
import '@videojs/html/ui/status-announcer';
import '@videojs/html/ui/error-dialog';
import '@videojs/html/ui/dialog-popup';
import '@videojs/html/ui/dialog-title';
import '@videojs/html/ui/dialog-description';
import '@videojs/html/ui/dialog-close';
import MediaControl from './MediaControl.vue';
import { PlayerControlType } from './constants.js';
import { resolveAdapterType } from '@videojs/html';

const props = defineProps({
  /** Video URL to be played */
  src: {
    type: String,
    default: '',
  },
  thumbnails: {
    type: [String, Array],
    default: '',
  },
  /** Properties passed to native <video /> tag */
  videoProps: {
    type: Object,
    default: undefined,
  },
  /**
   * Customize control to render.
   *
   * Accept regular array of media controls (for example: ['play', 'volume']), or an object of groups of controls. For example:
   * {
   *  default: {
   *    controls: ['play', 'pause'],
   *    groupProps: {'aria-label': 'Playback Controls'}
   *  },
   *  top: { controls: 'fullscreen', groupProps: {'aria-label': 'Screen control'}, }
   * }
   * where each keys will be rendered as different control-group, and `groupProps` key will be passed as the control-group's props as-is. Values defined under `control` key will be rendered as actual control (if valid) within the control-group
   */
  controls: {
    type: [Array, Object],
    default: () =>
      ({
        top: {
          controls: [PlayerControlType.TIMESLIDER, PlayerControlType.TIMESTAMP],
          groupProps: {
            'aria-label': 'Media progress',
          },
        },
        bottom: {
          controls: [
            PlayerControlType.PLAY,
            PlayerControlType.SEEK_BW,
            PlayerControlType.SEEK_FW,
            PlayerControlType.VOLUME,
            PlayerControlType.SETTINGS,
            PlayerControlType.PIP,
            PlayerControlType.FULLSCREEN,
          ],
          groupProps: {
            'aria-label': 'Playback Control',
          },
        },
      } || [
        PlayerControlType.TIMESLIDER,
        PlayerControlType.PLAY,
        PlayerControlType.VOLUME,
      ]),
  },
});

// The tag for each adapter type, and the module that registers it.
const MEDIA = {
  // Dependency installed
  youtube: ['youtube-video', () => import('@videojs/html/media/youtube-video')],
  hls: ['hlsjs-video', () => import('@videojs/html/media/hlsjs-video')],
  dash: ['dash-video', () => import('@videojs/html/media/dash-video')],

  // Dependency not installed
  vimeo: ['vimeo-video', () => import('@videojs/html/media/vimeo-video')],
  tiktok: ['tiktok-video', () => import('@videojs/html/media/tiktok-video')],
  twitch: ['twitch-video', () => import('@videojs/html/media/twitch-video')],
  cloudflare: [
    'cloudflare-video',
    () => import('@videojs/html/media/cloudflare-video'),
  ],
};

const { src, controls } = toRefs(props);

const videoComp = ref('video');

const normalizedSrc = computed(() => {
  const resolved = resolveAdapterType(src.value);

  if (resolved === 'youtube') {
    try {
      const url = new URL(src.value);
      url.searchParams.append('origin', window?.location?.origin || '');

      return url.toString();
    } catch (err) {
      console.warn('Youtube link not a valid URL');
    }
  }

  return src.value;
});

/** Normalize `controls` prop to object notation */
const normalizedControls = computed(() => {
  if (!controls.value) {
    return {};
  }

  // check if array first since typeof array **is** "object"
  if (Array.isArray(controls.value)) {
    return {
      default: controls.value,
    };
  } else if (typeof controls.value === 'object') {
    return controls.value || {};
  }

  return {};
});

async function load(src) {
  const [tag, register] = MEDIA[resolveAdapterType(src)] ?? ['video'];

  try {
    await register?.();

    videoComp.value = tag;
  } catch (err) {
    console.error(
      `Required dependency for videojs '${tag}' web component not found. Please install it from videoJS website. https://videojs.org/docs/guides/installation/html?media=hls#choose-your-media`
    );
  }
  /*
  const next = document.createElement(tag);
  next.setAttribute('src', src);
  next.setAttribute('playsinline', '');
  media.replaceWith(next);
  media = next;
  */
}

watch(
  src,
  (value) => {
    if (!!value && value?.trim()?.length) {
      load(value);
    }
  },
  {
    immediate: true,
  }
);
</script>

<style scoped>
.player-skin {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;

  > video,
  > youtube-video,
  > vimeo-video,
  > twitch-video,
  > tiktok-video {
    width: inherit;
    height: inherit;
    aspect-ratio: inherit;
  }
}

.video-skin-controls {
  position: absolute;
  inset: auto 0 0;
  padding: 12px;
  background: linear-gradient(to top, rgb(0 0 0 / 0.7), transparent);
  color: white;
  transition: opacity 0.25s;
}

/* Keep controls visible while something inside them has keyboard focus. */
.video-skin-controls:not([data-visible]):not(:has(:focus-visible)) {
  opacity: 0;
}

.player-control-group {
  display: flex;
  gap: 8px;
  align-items: center;
  overflow: hidden;
  flex-wrap: wrap;

  .player-control-item {
    flex-shrink: 0;
  }
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
