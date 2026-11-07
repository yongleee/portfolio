import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void) {
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
}

/** The location hash without its leading '#', re-rendering on every hashchange. */
export function useHash() {
    return useSyncExternalStore(subscribe, () => window.location.hash.slice(1))
}
