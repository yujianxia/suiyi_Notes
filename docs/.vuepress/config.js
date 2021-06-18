module.exports = {
    base: '/notes/',
    dest: 'dist',
    title: '前端 学习',
    port: 666,
    markdown: {
        lineNumbers: true
    },
    head: [
        ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.slim.min.js' }],
        ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.2/jquery.fancybox.min.js' }],
        ['link', { rel: 'stylesheet', type: 'text/css', href: 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.2/jquery.fancybox.min.css' }],
        ['link', { rel: 'icon', href: '/favicon.ico' }]
    ],
    plugins: [
        ['vuepress-plugin-code-copy', true],
    ],
    serviceWorker: false,
    themeConfig: {
        repo: '',
        editLinks: true,
        docsDir: 'docs',
        lastUpdated: '上次更新',
        nav: require('./configs/navbar/index'),
        sidebar: require('./configs/sidebar/index'),
        sidebarDepth: 4
    }
}