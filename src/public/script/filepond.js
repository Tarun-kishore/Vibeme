FilePond.registerPlugin(FilePondPluginFileEncode);

FilePond.registerPlugin(FilePondPluginImagePreview);

FilePond.registerPlugin(FilePondPluginImageResize);

FilePond.registerPlugin(FilePondPluginImageTransform);

FilePond.setOptions({
    stylePanelAspectRatio : 20/30,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 75,
    imageTransformOutputMimeType: 'image/png'
})

FilePond.parse(document.body)