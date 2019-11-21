// 发布阶段需要用到的插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  // 处于产品发布阶段
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  'presets': [
    '@vue/cli-plugin-babel/preset'
  ],
  'plugins': [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ],
    // 发布产品模式下的插件数组
    ...prodPlugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}
