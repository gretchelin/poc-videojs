import {
    UIElement,
    PlayerController,
    playerContext,
    selectTime,
    selectPlayback,
    type PropertyValues,
} from '@videojs/html';

class SeekButton extends UIElement {
    #time = new PlayerController(this, playerContext, selectTime);
    #playback = new PlayerController(this, playerContext, selectPlayback);
    #disconnect: AbortController | null = null;

    connectedCallback() {
        super.connectedCallback();
        this.#disconnect?.abort();
        this.#disconnect = new AbortController();
        const { signal } = this.#disconnect;

        this.setAttribute('role', 'button');
        this.setAttribute('aria-label', 'Seek');
        this.setAttribute('tabindex', '0');
        this.addEventListener('click', this.#handleActivate, { signal });
        this.addEventListener('keydown', this.#handleKeydown, { signal });
        this.addEventListener('keyup', this.#handleKeyup, { signal });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Removes all listeners registered with this signal
        this.#disconnect?.abort();
        this.#disconnect = null;
    }

    update(changed: PropertyValues) {
        super.update(changed);
        const time = this.#time.value;
        const playback = this.#playback.value;

        console.log('update', {time, playback})
        // Features are configured per-player, so a feature may not be available
        if (!time || !playback) return;

        const disabled = !time.duration;
        this.toggleAttribute('data-disabled', disabled);
        // this.setAttribute('tabindex', visible ? '0' : '-1');
    }

    #handleActivate = () => {
        const time = this.#time.value;

        if(!time) return;

        const dataSeek = this.getAttribute('data-seek') || 0;
        const seekAmount = Number(dataSeek) || 0;

        const currentTime = time.currentTime;
        const duration = time.duration;
        const rawSeekTarget = currentTime + seekAmount;
        const seekTarget = rawSeekTarget < 0 ? 0 : (rawSeekTarget > duration ? duration : undefined);

        if(seekTarget !== undefined) {
            this.#time.value?.seek(seekTarget);
        }
    };

    #handleKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.#handleActivate();
        } else if (event.key === ' ') {
            // Prevent Space from scrolling the page
            event.preventDefault();
        }
    };

    // ARIA button pattern: Space activates on keyup, not keydown
    #handleKeyup = (event: KeyboardEvent) => {
        if (event.key === ' ') {
            this.#handleActivate();
        }
    };
}

customElements.define('media-seek', SeekButton);

export function register() {
    customElements.define('media-seek', SeekButton);
}