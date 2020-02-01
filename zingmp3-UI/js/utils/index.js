export const debounce = (ms, timeout = null) => (callback) => () => {
    clearTimeout(timeout)
    timeout =  setTimeout(callback, ms)
}