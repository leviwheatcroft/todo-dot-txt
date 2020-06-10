// const feather = require('feather-icons')
//
// module.exports = {
//   square: feather.icons.square.toSvg(),
//   checkSquare: feather.icons['check-square'].toSvg()
// }

module.exports = function icons (icon) {
  return `
    <svg class="feather">
      <use xlink:href="/feather-sprite.svg#${icon}"/>
    </svg>
  `
}
