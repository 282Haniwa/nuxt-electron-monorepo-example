import colors from 'vuetify/es5/util/colors'
import envList from './env'

const environment = process.env.NODE_ENV || 'development'
// @ts-ignore
const env = envList[environment]
const isProduction = env.NODE_ENV === 'production'
const isDev = env.NODE_ENV === 'development'
const isApp = env.TARGET === 'app'

const baseConfig = {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - web',
    title: 'web',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [],

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
}

const appConfig = {
  ...baseConfig,
  // ssr: false,
  // target: 'static',
  dev: isDev,
  server: {
    host: env.NUXT_HOST,
    port: env.NUXT_PORT,
  },
  /*
   ** Electronではhashモードじゃないとだめ
   ** https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/commonIssues.html#blank-screen-on-builds-but-works-fine-on-serve
   */
  router: {
    ...baseConfig.router,
    base: undefined,
    mode: 'hash',
  },
  build: {
    ...baseConfig.build,
    extend(config, ctx) {
      baseConfig.build?.extend && baseConfig.build?.extend(config, ctx)
      if (!isDev) {
        // absolute path to files on production (default value: '/_nuxt/')
        // @ts-ignore
        config.output.publicPath = '_nuxt/'
      }
      config.target = 'web'
      config.node = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        __dirname: !isProduction,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        __filename: !isProduction,
      }
    },
  },
  loaders: {
    ts: {
      loaderOptions: {
        compileOptions: {
          target: 'es5',
          module: 'commonjs',
        },
      },
    },
  },
  generate: {
    ...baseConfig.generate,
    dir: '../../packages/app/dist/nuxt-build',
  },
  telemetry: false,
}

const config = isApp ? appConfig : baseConfig

export default config
