import { toPageEvent } from "../constant/index.js"

export const createConfig = (albumSliderSize) => ({
    items: 0,
    pages: 0,
    pageIndex: 0,
    size: albumSliderSize
})

export const goNextPage = (config, carousel, speed = 250) => () => {
    if (config.pageIndex < config.pages - 1) {
        const index = config.pageIndex + 1
        carousel.trigger(toPageEvent, [index, speed])
    }
}

export const goPrevPage = (config, carousel, speed = 250) => () => {
    if (config.pageIndex != 0) {
        const index = config.pageIndex - 1
        carousel.trigger(toPageEvent, [index, speed])
    }
}

export const onInitializedAlbumSlider = (config, prevControl, nextControl, disableClass = 'disable') => event => {
    if (prevControl && nextControl && config) {
        config.items = event.item.count
        config.pages = Math.ceil(config.items / config.size)
        if (config.pages === 1) {
            nextControl.classList.add(disableClass)
        }
        // disable prev control
        prevControl.classList.add(disableClass)

    }
}

export const trackingIndexAlbumSlider = (config, prevControl, nextControl, disableClass) => event => {
    if (prevControl && nextControl && config) {
        config.pageIndex = event.page.index
        // disable control
        config.pageIndex === config.pages - 1 ? nextControl.classList.add(disableClass) : nextControl.classList.remove(disableClass)
        config.pageIndex === 0 ? prevControl.classList.add(disableClass) : prevControl.classList.remove(disableClass)
    }
}