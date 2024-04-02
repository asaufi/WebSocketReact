import isDef from './is-def'

var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

export default (random) => {
    random = isDef(random) ? random : Math.random;
    return  colors[Math.floor(Math.random() * colors.length)]
}