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
// init auto carousel
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
// delay 1s
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

// add carousel for multi album
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
        const margin = e.dataset.margin ? +e.dataset.margin : 20
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

// real-time chart [highcharts]
document.addEventListener('DOMContentLoaded', function () {
    var myChart = Highcharts.chart('chart-container', {
        chart: {
            type: 'line',
            width: 600,
            height: 350,
            backgroundColor: null,
            className: 'chart-container',
            marginLeft: 20,
        },
        title: {
            text: ''
        },
        legend: {
            enabled: false
        },
        xAxis: {
            // categories: [9, 11, 13, 15, 17, 19, 21, 23, 1, 3, 5, 7],
            tickInterval: 3, // one week
            tickWidth: 0,
            lineColor: 'transparent',
            crosshair: {
                width: 1,
            },
            labels: {
                style: {
                    color: '#a2a2a2',
                    fontSize: '12px'
                }
            }
        },
        yAxis: {
            visible: false,
            title: {
                text: ''
            },

            // type: 'linear',
            gridLineWidth: 0
        },
        plotOptions: {
            series: {
                cursor: 'pointer',
                marker: {
                    fillColor: '#fff',
                    symbol: 'circle',
                    lineWidth: 2,
                    enabled: false
                },
                events: {
                    mouseOver: function () {
                        // console.log('mouseOver', this.options.data)
                        
                        this.update({ marker: { enabled: true } })
                        const color = arguments[0].target.color;
                        this.chart.update({
                            xAxis: {crosshair: {color}},
                            tooltip: {backgroundColor: color}
                        })
                        const t = document.querySelector(`#${this.name}`)
                        t.classList.add('active')
                    },
                    mouseOut: function () {
                        // this.options.marker.enabled = false
                        this.update({ marker: { enabled: false } })
                        const t = document.querySelector(`#${this.name}`)
                        t.classList.remove('active')
                    }
                }
            }
        },
        tooltip: {
            formatter: function () {
                return `Thời gian: ${('0'+this.x).slice(-2)}:00`
            },
            padding: 5,
            style: {
                color: '#fff',
            }
        },
        series: [{
            name: 't1',
            marker: {
                lineColor: '#4a8fe1',
            },
            color: '#4a8fe1',
            data: [31, 14, 27, 22, 39, 0, 35, 22, 30, 22, 34, 20, 4, 11, 22, 34, 40, 32, 31, 32, 41, 10, 3, 48]
        }, {
            name: 't2',
            marker: {
                lineColor: '#d94d4f',
            },
            color: '#d94d4f',
            data: [41, 39, 57, 34, 57, 98, 60, 60, 28, 43, 58, 42, 96, 57, 37, 46, 50, 47, 43, 45, 17, 90, 82, 37]
        },{
            name: 't3',
            marker: {
                lineColor: '#4ed7ba',
            },
            color: '#4ed7ba',
            data: [28, 47, 16, 44, 4, 2, 5, 18, 42, 35, 8, 38, 0, 32, 41, 20, 10, 21, 26, 23, 42, 0, 15, 15],
        }, 
        ]
    });

    const tCollections = document.getElementsByClassName('t')
    const onMouseEnter = (e) => {
        const id = e.target.id
        myChart.series[id.slice(-1) - 1 ].update({ marker: { enabled: true } })
    }

    const onMouseLeave = (e) => {
        const id = e.target.id
        myChart.series[id.slice(-1) - 1 ].update({ marker: { enabled: false } })
    }
    for (const element of tCollections) {
        element.addEventListener('mouseenter', onMouseEnter)
        element.addEventListener('mouseleave', onMouseLeave)
        
    }
});