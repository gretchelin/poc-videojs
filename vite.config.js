import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) =>
            [
              'video-player',
              'media-container',
              'media-controls-group',
              'media-controls-content',
              'media-controls',
              'media-slider-buffer',
              'media-slider-fill',
              'media-slider-track',
              'media-slider-thumb',
              'media-time-slider',
              'media-play-button',
              'media-time',
              'media-mute-button',
              'media-fullscreen-button',
            ].some((e) => tag.includes(e)),
        },
      },
    }),
  ],
});
