const path = require('path')
const defaults = ['common']
module.exports = {
  defaults,
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    pages: {
      '*': defaults,
      '/': [...defaults, 'index'],
    },
  },
  localePath: path.resolve('./locales'),
}
