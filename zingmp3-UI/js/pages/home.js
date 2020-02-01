import { debounce } from '../utils/index.js'
import { stopAutoEvent, playAutoEvent, toPageEvent } from '../constant/index.js'
import { goNextPage, goPrevPage, onInitializedAlbumSlider, trackingIndexAlbumSlider, createConfig } from '../utils/owl-carousel.js';
// slider main
const slick_auto = $('.slick-auto')
const slide_thumb_link = document.getElementsByClassName('slide-thumb__link')

// tracking banner active
const onTranslate = preIndex => (event) => {
    const page = event.page.index;     // Position of the current page

    const preLink = slide_thumb_link[preIndex]
    preLink.classList.remove('slide-thumb__link--active') // remove active previous link

    const currLink = slide_thumb_link[page]
    currLink.classList.add('slide-thumb__link--active') // add active for current link

    preIndex = page // save preIndex
}
// init auto carsousel
slick_auto.owlCarousel({
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 2000,
    smartSpeed: 1000,
    autoplayHoverPause: true,
    mouseDrag: false,
    onTranslate: onTranslate(0)
});
// deplay 1s
const debounceWrapper = debounce(1000)

const stopAutoSlick = debounceWrapper(() => {
    slick_auto.trigger(stopAutoEvent)
})
const playAutoSlick = debounceWrapper(() => {
    slick_auto.trigger(playAutoEvent, [2000, 1000])
})

// add stop auto when user hover onto banner
for (const element of slide_thumb_link) {
    const index = element.dataset.index
    element.onmouseover = () => {
        slick_auto.trigger(toPageEvent, [index - 1, 1000])
        stopAutoSlick()
    }
    element.onmouseout = playAutoSlick

}

// add carousel for mulpti album
const albumSliderCollection = document.getElementsByClassName('slick-slider')
const slideControllerCollection = document.getElementsByClassName('slide-controller')
const albumSliders = Array.from(albumSliderCollection)

albumSliders.forEach((e, index) => {
    setTimeout(() => {
        const albumSliderSize = +e.dataset.size
        let config = createConfig(albumSliderSize)
        const albumSlider = $(e)
        const controller = slideControllerCollection[index]
        const { 0: prevControl, 1: nextControl } = controller && controller.children || {}
        const margin =  e.dataset.margin ? +e.dataset.margin : 20
        let addition = {}
        if (e.dataset.auto == '1') {
            addition = {
                loop: true,
                autoplay: true,
                autoplayTimeout: 2000,
            }
        }

        // init carousel
        albumSlider.owlCarousel({
            items: albumSliderSize,
            lazyLoad: true,
            margin: margin,
            mouseDrag: false,
            startPosition: 0,
            onInitialized: onInitializedAlbumSlider(config, prevControl, nextControl, 'slide-controller--disable'),
            onTranslate: trackingIndexAlbumSlider(config, prevControl, nextControl, 'slide-controller--disable'),
            ...addition
        })
        if (prevControl && nextControl) {
            // add event for 2 button: next and prev page 
            prevControl.onclick = goPrevPage(config, albumSlider, 150)
            nextControl.onclick = goNextPage(config, albumSlider, 150)
        }
    }, 0)

})


