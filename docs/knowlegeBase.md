## Доп. материалы

### React Native

-  Внезапно [Документация](https://reactnative.dev/docs/getting-started)
-  [Примеры существующих проектов](https://github.com/ReactNativeNews/React-Native-Apps)
-  [Полезные материалы](https://github.com/jondot/awesome-react-native)
-  [Литература](https://drive.google.com/file/d/1BRbE4dNvEcHCIuRJWgA9OGUFmsRdMMMj/view?usp=sharing)
-  [Reddit](https://www.reddit.com/r/reactnative/)
-  [Группа в телеграме](https://t.me/reactnative_ru)

### TypeScript

-  [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
-  https://codewithstyle.info/?cs=miloszpiechocki
-  [Reddit](https://www.reddit.com/r/typescript/)
-  [Группа в телеграме](https://t.me/ts_ru)


## Где скачать иконки
-  https://fontawesome.com/download (free for web)
-  https://reactsvgicons.com/css.gg
-  https://www.flaticon.com/
-  https://ionicons.com/


## Гайдлайны по публикации
-  [Google Pay](https://developers.google.com/pay/api/android/guides/brand-guidelines)
-  [Apple Pay](https://developer.apple.com/design/human-interface-guidelines/apple-pay/overview/introduction/)
-  [App Store](https://developer.apple.com/app-store/review/guidelines/)
-  [Размеры скриншотов для App Store](https://appradar.com/blog/ios-app-screenshot-sizes-and-guidelines-for-the-apple-app-store) (Снимаем на 11-й и 8 plus)
-  Иконки для эпла генерируем через [Iconizer](https://stackoverflow.com/a/53521748/7313872)
-  Для Андроида: гуглим Android Asset Studio. Там генерим пачку квадратных и пачку круглых. К круглым добавляем постфикс _round и заменяем в соответствующих папках внутри `/res/**dpi`. Но этого недостаточно: для замены векторной иконки делаем, [Как в этом коммите](https://gitlab.com/Nasladdin/izipoint_mobile_rn/-/commit/4b319881d0e87b655b9ac58bbaa08e557d912a80). Берём иконку 108х108, импортируем в Android Studio через `add -> Vector Asset`, масштабим, редактируем `scaleX` и `scaleY`, пока она не уместится нормально по масштабу. `pivotX` и `pivotY` настраиваем в половину от размеров иконки. В данном случае 54х54.

## Где взять цвета
-  https://material-ui.com/ru/customization/palette/
-  https://material.io/resources/color/#!/?view.left=0&view.right=0
-  https://material.io/design/color/the-color-system.html#color-usage-and-palettes
