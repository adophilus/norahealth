import '../../src/env'
import { defineConfig } from 'vitepress'
import d2 from 'vitepress-plugin-d2'
import { FileType, Layout, Theme } from 'vitepress-plugin-d2/dist/config'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'NoraHealth',
  description: 'AI Agent Wellness Partner - Multi-agent wellness system',
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: './docs' },
      { text: 'API Reference', link: './api' }
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
          { text: 'Agent System', link: '/architecture/agent-system' },
          { text: 'Feature Overview', link: '/architecture/feature-overview' },
          { text: 'Data Model', link: '/architecture/data-model' },
          { text: 'LLM Integration', link: '/architecture/llm-integration' }
        ]
      },
      {
        text: 'Features',
        items: [
          { text: 'Onboarding', link: '/features/onboarding' },
          { text: 'Safety Validation', link: '/features/safety-validation' },
          { text: 'Fridge Vision', link: '/features/fridge-vision' },
          { text: 'Recipe Generation', link: '/features/recipe-generation' },
          { text: 'Meal Plans', link: '/features/meal-plans' },
          { text: 'Workout Generation', link: '/features/workout-generation' },
          { text: 'Weather Adaptation', link: '/features/weather-adaptation' },
          {
            text: 'Ingredient Sourcing',
            link: '/features/ingredient-sourcing'
          },
          { text: 'Firebase Push', link: '/features/firebase-push' }
        ]
      },
      {
        text: 'Guides',
        items: [
          {
            text: 'Development Workflow',
            link: '/guides/development-workflow'
          },
          { text: 'Testing', link: '/guides/testing' },
          { text: 'Demo Preparation', link: '/guides/demo-preparation' }
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
