module.exports = {
  presets: [
    ['babel-preset-expo'],
    ['module:metro-react-native-babel-preset', { useTransformReactJSXExperimental: true }],
  ],
  plugins: [
    ['react-native-reanimated/plugin'],
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic',
      },
    ],
  ],
}