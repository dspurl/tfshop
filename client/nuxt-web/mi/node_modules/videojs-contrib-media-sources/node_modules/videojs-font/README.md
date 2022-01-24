# Video.js Icon Font

This project contains all of the tooling necessary to generate a new icon font for Video.js. The icons themselves are from
Google's [Material Design Icons](https://github.com/google/material-design-icons).

## Usage

```sh
$ npm install grunt-cli // only if you don't already have grunt installed
$ npm install
$ grunt
```

### Custom icons

You can add custom icons by calling grunt with the `--custom-json` option. It takes a comma delimited list of paths to JSON files of the same format as below and merges it with the default icons file.

Example:
```sh
$ grunt --custom-json=custom.json,custom2.json
```

## Making changes to the font

To make changes to the font, simply edit the `icons.json` file. You can add or remove icons, either by just selecting new
SVGs from the [Material Design set](https://www.google.com/design/icons/), or pulling in new SVGs altogether.

```json
{
  "font-name": "VideoJS",
  "root-dir": "./node_modules/material-design-icons/",
  "icons": [
    {
      "name": "play",
      "svg": "av/svg/production/ic_play_arrow_48px.svg"
    },
    {
      "name": "pause",
      "svg": "av/svg/production/ic_pause_48px.svg"
    },
    {
      "name": "cool-custom-icon",
      "svg": "neato-icon.svg",
      "root-dir": "./custom-icons/neato-icon.svg"
    }
  ]
}
```

Once you're done, simply run `grunt` again to regenerate the fonts and scss partial. To edit the `_icons.scss` partial,
update `templates/scss.hbs`.
