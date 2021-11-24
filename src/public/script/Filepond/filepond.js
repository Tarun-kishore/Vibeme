FilePond.registerPlugin(
  FilePondPluginFileEncode,
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginImageTransform
);
FilePond.parse(document.body);

const inputElement = document.querySelector('input[type="file"]');
const pond = FilePond.create(inputElement);

FilePond.setOptions({
  stylePanelAspectRatio: 100 / 150,
  // stylePanelLayout:'circle',
  //imageResizeTargetWidth: 1,
  //imageResizeTargetHeight: 550,
  imageTransformOutputMimeType: "image/png",
});
