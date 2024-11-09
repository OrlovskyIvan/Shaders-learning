import { getPluginsArr } from './plugins.js';

const mode = process.env.MODE || 'development';

const isDev = mode === 'development';
const isProd = mode === 'production';
const cleanDevServerFolder = process.env.CLEAN;
const devOutdir = './dev';
const buildOurdir = './build';

const config = {
	outdir: isDev ? devOutdir : buildOurdir,
	entryPoints: ['./src/index.js'],
	publicPath: '/',
	entryNames: '[dir]/bundle.[name]-[hash]',
	assetNames: '[dir]/[name]',
	bundle: true,
	metafile: true,
	minify: isProd,
	sourcemap: isDev,
	legalComments: 'none',
	jsx: 'automatic',
	write: true,
	jsxDev: isDev,
	loader: {
		'.js': 'jsx',
		'.png': 'file',
		'.svg': 'file',
		'.jpg': 'file',
		'.jpeg': 'file',
		'.avif': 'file',
		'.webp': 'file',
		'.gif': 'file',
		'.eot': 'file',
		'.ttf': 'file',
		'.woff': 'file',
		'.woff2': 'file',
		'.wasm': 'file',
		'.gltf': 'file',
		'.bin': 'file',
	},
	target: ['es2015', 'edge40', 'chrome58', 'firefox57', 'safari11', 'node12'],
	plugins: getPluginsArr(isDev, isProd, cleanDevServerFolder, devOutdir, buildOurdir)
}

export default config;

/*
Команды:
npm run build - собрать пакет для продакшена в папку build
npm run start - запустить сервер разработки
npm run serve - запустить сервер, чтобы проверить production build
npm run clean-dev - удалить лишние файлы в папке сервера разработки
и пересобрать development build
    
Без дополнительных плагинов работает:
1) Изменение кода под версию языка es6
2) распознование jsx в коде
3) Сбор подключаемых стилей через import в один файл с минификацией.
(Сбор стилей из styled-components не работает.)

Свойства:
1) bundle - собирает код из импортируемых зависимостей в конечный бандл
и меняет под версию языка, установленного в target.
2) minify - минифицирует js и css бандл.
3) loader: { '.js': 'jsx' } - добавляет возможность писать jsx в js файлах
'.png': 'file', - добавляет возможность использовать картини в проекте,
при сборе проекта они копируются в папку build
'.eot': 'file', - добавляет возможность копировать шрифты из css файла,
импортируемого в компонент, в бандл.
4) sourcemap: isDev - генерирует в dev моде карту компонентов, по которой
понятно, где происходят ошибки: Uncaught Error at onBtnClick (App.js:8:9)
5) metafile: true - генерирует, виртуальный файл, который
содержит информацию о билде. Необходим для работы @craftamap/esbuild-plugin-html
6) target: ['es2015', 'edge40', 'chrome58', 'firefox57', 'safari11', 'node12']
- Свойство 'es2015' изменяет JavaScript код под версию языка es2015, он же es6.
Чтобы ESBuild изменял CSS, нужно дополнительно прописывать версии браузеров,
для которых нужно добавить префиксы. При этом ESBuild не может добавить префиксы
в JavaScript код styled-components, поэтому их нужно прописывать в ручную.
Здесь прописаны версии браузеров, которые вышли примерно в то же время,
когда был принят es2015.
7) jsx: 'automatic' - позволяет не прописывать в каждом файле import react.
8) jsxDev: isDev - добавляет название файла и места в каждый jsx элемент.
Должен быть проставлен jsx: 'automatic'. Если minify: true, выдаст ошибку.
9) publicPath: '/' - добавляет путь, который прибавляется в начале пути каждого
импортируемого файла.

Плагины:
1) cross-env - установка переменных окружения.
2) Каждый раз, когда используется npm run build, в зависимости от того, какой файл
был изменен - css или js, создается новый файл с хешем в имени. Хеш нужен для того,
чтобы в случае загрузки файлов в продакшн, у пользователя сбросился кэш
в браузере и обновления заработали. Поэтому установлен плагин esbuild-plugin-clean,
который очищает всю папку перед новым билдом.
Когда запускается dev сервер, esbuild-plugin-clean не работает, поэтому в папке
dev, которую транслирует сервер, будут накапливаться мусорные файлы.
Если бы esbuild-plugin-clean работал, то, если бы проект весил 300+ mb, каждый раз,
когда бы мы изменяли хоть 1 переменную и сохраняли этот файл, пересобирался
и перезаписывался бы весь проект. Без быстрого жесткого диска это не имеет смысла,
а также это вредно для его работы.
Чтобы очистить папку dev от мусорных файлов, нужно использовать команду clean-dev.
Также здесь работает сложная взаимосвязь между плагинами.
В сборщике установлен плагин esbuild-minify-templates, который минифицирует css
стили в js бандле, которые находятся в шаблонных строках styled-components.
Из него экспортируются 2 функции minifyTemplates() и writeFiles(), обе нужно
использовать. writeFiles нужно располагать в списке плагинов после тех,
которые меняют содержимое js бандла в процессе билда. Этот плагин также требует,
чтобы свойство write было установлено в false. Из-за того, что write выставлено
в false, каждый раз когда изменяется переменная или css свойство, новые js и css
бандлы пересоздаются и записываются в html файл, а старые остаются. Без этого плагина,
такого поведения не было бы, лишний файл создавался бы только тогда, когда
изменение файлов происходит при выключенном сервере. Тем не менее он необходим,
чтобы лучше оптимизировать js бандл. Также этот плагин только минифицирует
js бандл, но не добавляет префиксы для поддержки браузерами новых css свойств.
3) rollupPluginLicense
Плагин, который позволяет сгенерировать файл с лицензиями пакетов, которые включены
в билд. Встроенное в ESBuild свойство legalComments позволяет сгенерировать такой,
файл, но не позволяет добавить в него текст лицензий.
4) esbuild-plugin-styled-components - немного уменьшает размер styled-components.
5) @craftamap/esbuild-plugin-html - создает html файл из шаблона.
6) esbuild-plugin-copy - копирует файл esbuild-live-reload.js из папки config
в папку dev, который отвечает за hot reload. 

Заметки:
1) Нельзя использовать:
1. substr
2. Tail call
3. Прямой вызов eval(‘x’)
4. toString вместе с eval
5. this в функциях модулей, которые ссылаются на другой метод модуля.
То есть, если в модуле используется this, который ссылается на другой метод объекта exports,
то при импорте метода с this, значение this может измениться.
6. ESBuild не транспилирует RegExp выражения. Поэтому нужно самостоятельно смотреть,
чтобы в них не использовались символы, которые пока что не поддерживаются
в браузере.
2) Особенности сборщика:
1. По-умолчанию, сервер ESBuild работает на http протоколе. Некоторые современные
возможности в веб-разработке недоступны для http. Чтобы настроить https на сервере
ESBuild нужно сгенерировать сертификат на своей машине. Чтобы не генерировать сертификат,
можно использовать прокси-сервер, как это сделано в esbuild-dev-server.js. Этот https
сервер нужено только, чтобы работали какие-то современные возможности в веб-разработке,
он не обеспечивает безопасность. Работать нужно все равно с http://localhost.
Чтобы работал live-reload в папку dev добавляется файл esbuild-live-reload.js.
live-reload реализован с помощью класса EventSource, который работает только на клиенте.
2. В плагине @craftamap/esbuild-plugin-html, который генерирует шаблон html файла,
в адресе подключаемого скрипта esbuild-live-reload.js нужно обязательно указывать
абсолютный путь вот так src="esbuild-live-reload.js", иначе при переходе на внутренние
страницы сайта он будет изменен.
2. В папке config должен присутствовать файл package.json со свойством "type": "module",
чтобы работали модули mjs и в одном файле можно было использовать import и require.
3. Не работает сбор стилей из styled-components в отдельный css файл. Тоже самое
было в create-react-app.
4. Не работает копирование картинок из url() адреса в styled-components. Их нужно
импортировать в компонент как и в create-react-app.
5. Если шрифты подключаются внутри styled-components, то они копируются в папки сборки
dev или build плагином esbuild-plugin-copy. Для того, чтобы он работал, шрифты обязательно
должны быть размещены в директории /src/assets/fonts. Если положить скрипты в другую директорию,
то нужно также менять настройки плагина esbuild-plugin-copy, просто заменив в нем директорию,
где лежат шрифты.
6. У шрифтов также есть лицензии, которые часто требуют копирования месте с файлами шрифтов,
при распространении. Чтобы шрифты скопировались в папку build, нужно расположить их в директории
/src/assets/fonts/licenses/<название_шрифта>/<файл_лицензии>.
За копирование отвечает плагин esbuild-plugin-copy.
7. В консоли Firefox при подгрузке файлов может возникать ошибка NS_BINDING_ABORTED. Она может
возникать во многих случаях, например когда идет прирывание загрузки файла. В данном случае
она возникает из-за кеша. Если просто обновить сайт с помощью f5 и дождаться полной
прогрузки файлов, то ошибки не будет. Если обновлять быстро, то может появиться. Ошибка
возникает всегда, когда происходит обновление без кэша, то есть с помощью ctrl + f5.
Браузер отправляет серверу запрос с датой файлов в кэше, а браузер должен ответить статусом
304 и нужными заголовками. В данном случае сервер не настроен на отправку нужных заголовков,
более того, был найден ответ, что когда поисходит загрузка без кэша, браузер игнорирует
заголовки, поэтому, возможно от ошибки невозможно избавиться на данный момент или нужно
найти какое-то другое решение.
8. Не работает сбор стилей расположенных в шаблонах строк js (styled-components) в отдельный
css файл, как и в cra. Не работает автоматическая расстановка префиксов в стилях, написанных
в css файлах. Возможно, можно найти плагин, но по идеи нужно также подключать препроцессор
и брать плагин для препроцессора.
*/
