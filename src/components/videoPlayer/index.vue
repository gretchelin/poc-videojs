<template>
  <video-player ref="playerRefEl">
    <media-container class="player-skin">
      <slot name="player" v-bind="{src: normalizedSrc, videoProps}">
        <component
            ref="videoRefEl"
            :is="videoComp"
            :src="normalizedSrc"
            v-bind="{...videoCompProps, ...videoProps}"
        >
          <a href="https://videojs.org/help">Video player not working?</a>
          <track kind="metadata" label="thumbnails" :src="thumbnails" default/>
        </component>
      </slot>

      <media-poster class="player-poster">
        <slot name="poster">
          <img v-if="!!poster" :src="poster" alt="Poster"/>
        </slot>
      </media-poster>

      <media-controls
          class="player-controls"
      >
        <media-controls-content
            class="player-control-content"
        >
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
                      :seconds="control === PlayerControlType.SEEK_BW ? -seekDistance : (control === PlayerControlType.SEEK_FW ? seekDistance : undefined)"
                  >
                    <!-- Pass `media-ctrl-`-prefixed slots to <MediaControl /> recursively -->
                    <template
                        v-for="(_, slotName) in $slots"
                        :key="slotName"
                        v-slot:[`${slotName.slice(11)}`]="slotProps"
                    >
                      <slot
                          v-if="slotName.startsWith('media-ctrl-')"
                          :name="slotName"
                          v-bind="slotProps"
                      />
                    </template>
                  </MediaControl>
                </slot>
              </template>
            </media-controls-group>
          </template>
        </media-controls-content>
      </media-controls>

      <media-error-dialog class="player-error">
        <media-dialog-backdrop class="player-error__backdrop"></media-dialog-backdrop>
        <media-dialog-popup class="player-error__dialog">
          <slot name="error-prepend"/>
          <media-dialog-title class="player-error__title"></media-dialog-title>
          <media-dialog-description class="player-error__desc"></media-dialog-description>
          <media-dialog-close class="player-error__close"></media-dialog-close>

        </media-dialog-popup>
      </media-error-dialog>

    </media-container>
  </video-player>
</template>

<script setup>
import {computed, defineProps, ref, toRefs, useTemplateRef, watch} from 'vue';
import '@videojs/html/ui/container';
import '@videojs/html/ui/controls';
import '@videojs/html/ui/controls-content';
import '@videojs/html/ui/controls-group';
import '@videojs/html/ui/hotkey';
import '@videojs/html/ui/status-announcer';
import '@videojs/html/ui/dialog-backdrop';
import '@videojs/html/ui/error-dialog';
import '@videojs/html/ui/dialog-popup';
import '@videojs/html/ui/dialog-title';
import '@videojs/html/ui/dialog-description';
import '@videojs/html/ui/dialog-close';
import '@videojs/html/ui/poster';
import '@videojs/html/ui/seek-button';
import './videoPlayer.ce.js';
import MediaControl from './MediaControl.vue';
import {PlayerControlType} from './constants.js';
import {resolveAdapterType,} from '@videojs/html';

// A "player" for video player based on VideoJS library
/* Available slots:
| Slot                                | Type                                                            | Info |
| ----------------------------------- | --------------------------------------------------------------- | ---- |
| player                              | (props: {src: string, videoProps: Record<string, any>}) => any; | Pass custom video player. Useful when needing to use e.g. 'vimeo-player' specifically |
| control-<control_key>               | () => any;                                                      | Override render for given control. When using this slot, reinventing the wheel might be needed when overriding a built-in control |
| media-ctrl-<mediacontrol_slot_key>  | (props?: Record<string, any>) => any;                           | Override content render for given control. Media control is just a husk, with default CSS content when empty. Use this slot to give custom content like icons, text, etc without needing to reinvent the wheel |
 */

const props = defineProps({
  /** Video URL to be played */
  src: {
    type: String,
    default: '',
  },
  poster: {
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
  /** The amount of seconds to seek - apply to both forward and backward seek */
  seekDistance: {
    type: Number,
    default: 10,
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
        ([
          PlayerControlType.TIMESLIDER,
          PlayerControlType.PLAY,
          PlayerControlType.VOLUME,
        ]),
  },
});

const emit = defineEmits(['type', 'player']);


// The tag for each adapter type, and the module that registers it.
// Key is the return value of videojs `resolveAdapterType` fn.
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

const {src, controls} = toRefs(props);

const videoComp = ref('video');
const playerRef = useTemplateRef('videoRefEl');
const videoJSRef = useTemplateRef('playerRefEl');

const resolvedType = computed(() => {
  return resolveAdapterType(src.value);
})
const normalizedSrc = computed(() => {
  const resolved = resolvedType.value

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
const videoCompProps = computed(() => {
  if (resolvedType.value === 'youtube') {

  }
  return {}
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
    // Import the correct player dynamically
    await register?.();

    // Update the rendered player component with the correct player
    videoComp.value = tag;
  } catch (err) {
    // if for some reason the right player cannot be registered, fallback to native video
    videoComp.value = 'video';

    console.error(
        `Required dependency for videojs '${tag}' web component not found. Please make sure to install it from videoJS website. https://videojs.org/docs/guides/installation/html?media=hls#choose-your-media`
    );
  }
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

watch(resolvedType, (value) => {
  emit('type', value)
})

watch(playerRef, (value) => {
  console.log('emit player', value)
  emit('player', value);
}, {
  immediate: true,
})

defineExpose({
  player: playerRef,
  videoJS: videoJSRef,
})
</script>

<style scoped>
video-player {
  display: block;
}

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

.player-poster {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &:not([data-visible]) {
    opacity: 0;
  }

  > img {
    width: 100%;
    height: 100%;
    object-position: center;
    object-fit: cover;
  }
}

.player-error {
  .player-error__backdrop {
    position: absolute;
    inset: 0;
    background: rgb(3 7 18 / 92%);
    transition: opacity 150ms ease;
  }

  .player-error__dialog {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: grid;
    gap: 12px;
    place-content: center;
    padding: 32px;
    color: #fff;
    text-align: center;
    transition: opacity 150ms ease;
  }

  .player-error__backdrop:not([data-open]),
  .player-error__dialog:not([data-open]) {
    display: none;
  }

  .player-error__backdrop[data-starting-style],
  .player-error__backdrop[data-ending-style],
  .player-error__dialog[data-starting-style],
  .player-error__dialog[data-ending-style] {
    opacity: 0;
  }
}

.player-controls {
  /* Keep controls visible while something inside them has keyboard focus. */

  &:not([data-visible]):not(:has(:focus-visible)) {
    opacity: 0;
  }
}

.player-control-content {
  pointer-events: none;
  position: absolute;
  inset: 0;
  display: grid;
  place-content: end stretch;
  color: white;
  background: linear-gradient(to top, rgb(0 0 0 / 0.7), transparent);
  transition: opacity 0.25s;
}

.player-control-group {
  display: flex;
  gap: 8px;
  padding: 8px 10px;
  align-items: center;
  flex-wrap: wrap;
  pointer-events: auto;

  .player-control-item {
    flex-shrink: 0;
  }
}
</style>
