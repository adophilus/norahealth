import '../../src/env'
import { defineConfig } from 'vitepress'
import d2 from 'vitepress-plugin-d2'
import { FileType, Layout, Theme } from 'vitepress-plugin-d2/dist/config'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Onscript',
  description: 'The official Onscript documentation',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: './docs' },
      { text: 'API Reference', link: './api' }
    ],

    socialLinks: [
      {
        icon: 'farcaster',
        link: 'https://farcaster.xyz/onscript'
      }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [{ text: 'Documentation', link: '/docs' }]
      },
      {
        text: 'Architecture',
        items: [
          { text: 'Overview', link: '/architecture/overview' },
          { text: 'Domain Layer', link: '/architecture/domain-layer' },
          {
            text: 'OAuth Integration',
            link: '/architecture/domain-models-oauth'
          }
        ]
      }
    ]
  },
  markdown: {
    config: (md) => {
      // Use D2 diagram plugin with optional configuration
      md.use(d2, {
        forceAppendix: false,
        layout: Layout.ELK,
        theme: Theme.VANILLA_NITRO_COLA,
        darkTheme: Theme.DARK_MUAVE,
        padding: 100,
        animatedInterval: 0,
        timeout: 120,
        sketch: true,
        center: false,
        scale: -1,
        target: '*',
        fontItalic: null,
        fontBold: null,
        fontSemiBold: null,
        fileType: FileType.SVG,
        directory: 'd2-diagrams'
      })
    }
  }
})
