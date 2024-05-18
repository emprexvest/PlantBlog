function thumbsUp(articleId) {
    axios.post(`/plants/thumbs/${articleId}`, { action: 'thumbsUp' }).then(response => {
        if (response.data.success) {
            const thumbsUpButton = document.querySelector(`button[data-article-id="${articleId}"].btn-success`);
            thumbsUpButton.innerHTML = `Thumbs Up &#128077; ${response.data.newThumbsUpCount}`;
        } else {
            console.error('Thumbs-up failed');
        }
    }).catch(error => {
        console.error(error);
    });
}

function thumbsDown(articleId) {
    axios.post(`/plants/thumbs/${articleId}`, { action: 'thumbsDown' }).then(response => {
        if(response.data.success) {
            const thumbsDownButton = document.querySelector(`button[data-article-id="${articleId}"].btn-danger`);
            thumbsDownButton.innerHTML = `Thumbs Up &#128078; ${response.data.newThumbsDownCount}`;
        } else {
            console.error('Thumbs-down failed');
        }
    }).catch(error => {
        console.error(error);
    });
}