import { createPlayer, liveFeature, streamTypeFeature  } from '@videojs/html';
import '@videojs/html/background/video';
import '@videojs/html/ui/container';
import '@videojs/html/ui/play-button';
import { videoFeatures } from '@videojs/html/video';

// Since the default preset video-player does not include live features,
// we need to build a customize player. As of VideoJS 10.3.0, there is no way to add additional features to existing
// player presets provided by VideoJS.
// https://videojs.org/docs/framework/html/reference/api/preset-video
const { PlayerElement: MyPlayer } = createPlayer({
    features: [...videoFeatures, liveFeature, streamTypeFeature],
});

customElements.define('video-player', MyPlayer);