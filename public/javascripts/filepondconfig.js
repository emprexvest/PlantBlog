document.addEventListener("DOMContentLoaded", function(){
    const inputElement = document.querySelector("input.filepond");
    const pond = FilePond.create(inputElement, {
        allowFileTypeValidation: true,
        acceptedFileTypes: ["image/jpeg", "image/png", "image/gif"],
        allowImagePreview: true
    });
});