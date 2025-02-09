import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import path from 'node:path'
import { defineConfig, presetIcons, presetUno } from 'unocss'

const localIconPath = path.resolve(__dirname, 'src/assets/svg-icon')

export default defineConfig({
  rules: [
    // background login
    ['bg-login', { background: 'linear-gradient(60deg, rgba(84, 58, 183, 1) 0%, rgba(0, 172, 193, 1) 100%)' }],
    [/^align-\[([+-]?\d.+)\]$/, ([_, num]) => ({ 'vertical-align': num })],
  ],
  shortcuts: {
    'icon-wrapper': 'inline-block leading-0 h-1em w-1em text-inherit normal-case text-center align-[-0.125em] antialiased [&_svg]:inline-block [&_svg]:align-baseline',
    // background login waves
    'bg-login-waves': 'relative w-full h-20vh mb-[-7px] min-h-100px',
    'bg-login-wave-1': 'animate-wave-move animate-delay-[-2s] animate-duration-[7s]',
    'bg-login-wave-2': 'animate-wave-move animate-delay-[-3s] animate-duration-[10s]',
    'bg-login-wave-3': 'animate-wave-move animate-delay-[-4s] animate-duration-[13s]',
    'bg-login-wave-4': 'animate-wave-move animate-delay-[-5s] animate-duration-[20s]',
  },
  theme: {
    animation: {
      keyframes: {
        'wave-move': '{ 0% {transform: translate3d(-90px, 0, 0); } 100% {transform: translate3d(85px, 0, 0); }}',
      },
      durations: {
        'wave-move': '25s',
      },
      timingFns: {
        'wave-move': 'cubic-bezier(0.55, 0.5, 0.45, 0.5)',
      },
      counts: {
        'wave-move': 'infinite',
      },
    },
  },
  presets: [
    presetUno(),
    presetIcons({
      prefix: 'icon-',
      scale: 1,
      extraProperties: {
        display: 'inline-block',
      },
      collections: {
        local: FileSystemIconLoader(localIconPath),
      },
      warn: true,
    }),
  ],
})
