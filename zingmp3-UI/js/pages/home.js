const slick_auto = $('.slick-auto')
const slide_thumb_link = document.getElementsByClassName('slide-thumb__link')

const onTranslate = preIndex => (event) => {
    const page      = event.page.index;     // Position of the current page
    
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
// slick_auto.on('changed.owl.carousel', function (event) {
//     console.log(event.item, event.property)
// })

for (const element of slide_thumb_link) {
    const index = element.dataset.index
    element.onmouseover = () => {
        slick_auto.trigger('to.owl.carousel', [index - 1, 1000])
        slick_auto.trigger('stop.owl.autoplay')
    }
    element.onmouseout = () => {
        slick_auto.trigger('play.owl.autoplay', [2000, 1000])
    }
    
}