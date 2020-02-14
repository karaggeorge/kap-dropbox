# kap-dropbox

> [Kap](https://github.com/wulkano/kap) plugin - Upload recordings to [Dropbox](https://dropbox.com)

## Install

In the `Kap` menu, go to `Preferences…`, select the `Plugins` pane, find this plugin, and toggle it.

## Usage

In the editor, after recording, select a format, and then `Upload to Dropbox`.

## Options

In the “Plugins” pane, click the pencil icon to edit the plugin options.

#### path

Type: `string`

When provided, uploads will be placed in that directory. For example, to upload recordings under a directory called `Kaptures`, set `path` to `/Kaptures`. If the directory doesn't exist it will be created.

#### autoRename

Type: `boolean`\
Default: `true`

If there is a conflict (the file already exists), the new upload will automatically be renamed in order to keep both.

#### mute

Type: `boolean`\
Default: `true`

The Dropbox app won't show a notification for this upload.

Used to avoid this:

![double](media/double.png)
