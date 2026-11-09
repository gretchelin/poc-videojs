import vue from '@vitejs/plugin-vue';
import {defineConfig} from 'vite';

const VideoJSComponents = [
    'video-player',
    'media-poster',
    'media-container',
    'media-controls-group',
    'media-controls-content',
    'media-controls',
    'media-slider-buffer',
    'media-slider-fill',
    'media-slider-track',
    'media-slider-thumb',
    'media-slider-value',
    'media-time-slider',
    'media-play-button',
    'media-time',
    'media-mute-button',
    'media-fullscreen-button',
    'media-captions-button',
    'media-pip-button',
    'media-menu',
    'media-menu-content',
    'media-quality-radio-group',
    'media-menu-radio-item',
    'media-error-dialog',
    'media-dialog-backdrop',
    'media-dialog-popup',
    'media-dialog-title',
    'media-dialog-description',
    'media-dialog-close',
    'media-seek-button',
    'media-live-button',
    'media-volume-popover',
    'media-volume-slider',
];

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    // treat all tags with a dash as custom elements
                    isCustomElement: (tag) =>
                        [
                            ...VideoJSComponents,
                            'media-seek',
                        ].some((e) => tag.includes(e)),
                },
            },
        }),
    ],
});
