module.exports = {
  transpileDependencies: ["vuetify"],
  pwa: {
    name: "Kahoot Rocks",
    themeColor: "#3f51b5",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "#121212",
    manifestOptions: {
      name: "Kahoot Rocks",
      short_name: "Kahoot.rocks",
      start_url: ".",
      display: "standalone",
      themeColor: "#3f51b5"
    },
    iconPaths: {
      favicon32: "img/icons/favicon-32x32.png",
      favicon16: "img/icons/favicon-16x16.png",
      appleTouchIcon: "img/icons/apple-touch-icon-152x152.png",
      maskIcon: "img/icons/safari-pinned-tab.svg",
      msTileImage: "img/icons/msapplication-icon-144x144.png"
    }
  }
};
