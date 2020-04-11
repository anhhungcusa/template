import { debounce } from '../utils/index.js'

const header = document.querySelector('header')
const search = document.querySelector('.search-wrap__content')
//const debounceWrapper = debounce(100)
const scrollMemoCreator = (pre = 0, preScrollDown = false) => event => {
    const { scrollTop } = document.documentElement;
    const isScrollDown = scrollTop > pre ? true : false
    pre = scrollTop
    if (isScrollDown === preScrollDown) {
        return
    }
    if (isScrollDown) {
        header.classList.add('header--fixed')
        search.placeholder = 'Tìm kiếm'
    } else {
        header.classList.remove('header--fixed')
        search.placeholder = 'Nhập tên bài hát, ca sĩ hoặc mv...'
    }
    preScrollDown = isScrollDown
}

document.addEventListener('scroll', scrollMemoCreator());
