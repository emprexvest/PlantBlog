// Import dependencies
const express = require('express');
const Plant = require('./../models/plant');
const router = express.Router();
const path = require('path');
// const uploadPath = path.join('public', ...Plant.plantImageBasePath.split('/'));
const uploadPath = path.join('public', Plant.plantImageBasePath);
const axios = require('axios');

// NO longer using mutlipart forms and uninstalled multer
// const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
// const multer = require('multer');
const fs = require('fs');
const { render } = require('ejs');


// // Multer configuration for handling file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, uploadPath);
//     },
//     filename: (req, file, callback) => {
//         const uniqueFilename = Date.now() + '-' + file.originalname;
//         callback(null, uniqueFilename);
//     }
// });

// // Multer configuration for temporary use
// const storageTemp = multer.diskStorage({
//     destination: (req, file, callback) => {
//         const destinationPath = path.join(__dirname, '..', 'public', 'uploads', 'plantImages');
//         callback(null, destinationPath);
//     },
//     filename: (req, file, callback) => {
//         const uniqueFilename = Date.now() + '-' + file.originalname;
//         callback(null, uniqueFilename);
//     }
// });

// const fileFilter = (req, file, callback) => {
//     if (imageMimeTypes.includes(file.mimetype)) {
//         callback(null, true);
//     } else {
//         callback(new Error('Invalid file type. Only JPEG, PNG, AND GIF images are allowed.'));
//     }
// }



// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: { fileSize: 10 * 1024 * 1024 }
// });


// Directory access check
const directoryPath = path.join(__dirname, '..', 'public', 'uploads', 'plantImages');

fs.access(directoryPath, fs.constants.W_OK, (error) => {
    if (error) {
        console.error('Directory is not writable or does not exist.');
    } else {
        console.log('Directory is writable.');
    }
});

// Alternative configuration for multer()
// const upload = multer({
//     dest: uploadPath,
//     fileFilter: (req, file, callback) => {
//         callback(null, imageMimeTypes.includes(file.mimetype));
//     }
// });


// This route is responsible for rendering the index page for plants
router.get('/plant', (req, res) => {
    console.log('Type of "article" in the index route', typeof article);

    res.render('plants/index');
});


// This route is responsible for rendering the form to create a new plant article
router.get('/new', (req, res) => {
    res.render('plants/_form_fields', { article: new Plant() });
 });


// This route is responsible for rendering the form to edit an existing plant article identified by `:id`
router.get('/edit/:id', async (req, res) => {
    try {
        const article = await Plant.findById(req.params.id);
        // console.log(typeof article);
        // console.log(article);

        res.render('plants/edit', { article: article });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
 });


//This route is responsible for handling the search
router.get('/search', async (req, res) => {
    const searchText = req.query.q;
    console.log(req.query.q);
    try {
        const articles = await Plant.find({ title: { $regex: searchText, $options: 'i' } })
        res.render('plants/search', { articles: articles });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});


// This route is responsible for rendering the details of a specific plant article identified by `:slug`
router.get('/:slug', async (req, res) => {
    try {
        const article = await Plant.findOne({ slug: req.params.slug });
        // console.log(typeof article);
        // console.log(article);

        if (article === null) {
            console.log('Article not found');
            res.redirect('/');
        } else {
            res.render('plants/show', { article: article });
        }
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});


// This route is responsible for handling the login partial
router.get('/login', async (req, res) => {
    res.render('plants/_login')
})

// This route is responsible for handling the submission of the form to create a new plant article
router.post('/', async (req, res) => {
    let article;
    
try {
    // console.log("Form Data:", req.body);
    // console.log("Uploaded File:", req.file);

    // const article = new Plant({
    article = new Plant({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        // location: {
        coordinates: [parseFloat(req.body.locationLng), parseFloat(req.body.locationLat)],
        // },
    });

    // Check the values of article.location and article.location.coordinates

    if (req.body.filepond) {
        const uploadedFileData = JSON.parse(req.body.filepond);

        imageBuffer = Buffer.from(uploadedFileData.data, 'base64');

        article.imageData = imageBuffer;
        article.imageType = uploadedFileData.type;
    }


    // Original if condition to save the files asynchronously
    // if (req.file) {
    //     // Read the image file asynchronously using readFile
    //     const image = await fs.promises.readFile(req.file.path, 'base64');

    //     article.imageData = image;
    // }
    
        await article.save();
        res.redirect(`/plants/${article.slug}`);
    } catch (error) {
        res.render('plants/_new_current', { article: article, error: error.message });
    }
});


router.post('/thumbs/:id', async (req, res) => {
    try {
        const article = await Plant.findById(req.params.id);

        if (req.body.action === 'thumbsUp') {
            article.thumbsUp += 1;
        } else if (req.body.action === 'thumbsDown') {
            article.thumbsDown += 1;
        }

        await article.save();

        // Log the article object and thumbs values
        // console.log("Article Object:", article);
        console.log("Thumbs Up:", article.thumbsUp);
        console.log("Thumbs Down:", article.thumbsDown);

        res.json({ success: true, newThumbsUpCount: article.thumbsUp, newThumbsDownCount: article.thumbsDown });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


// THIS IS A BACKUP OF THE ORGINAL ROUTE
// This route is responsible for handling the submission of the form to create a new plant article
// router.post('/', upload.single('filepond'), async (req, res) => {
//     console.log("Form Data:", req.body);
//     console.log("Uploaded File:", req.file);

//     const article = new Plant({
//         title: req.body.title,
//         description: req.body.description,
//         markdown: req.body.markdown
//     });

//     if (req.file) {
//         article.imagePath = path.join(Plant.plantImageBasePath, req.file.filename);
//     }
    
//     try {
//         await article.save();
//         res.redirect(`/plants/${article.slug}`);
//     } catch (error) {
//         res.render('plants/new', { article: article, error: error.message });
//     }
// });



// Alternative POST route
// router.post('/', async (req, res, next) => {
//     req.article = new Plant();
//     next();
// }, saveArticleAndRedirect('new'));


// This route is responsible for handling the submission of the form to update an existing plant article identified by `:id`
router.put('/:id', async (req, res) => {
    // console.log("Form Data:", req.body);
    // console.log("Uploaded File:", req.file);
    try {
        const article = await Plant.findById(req.params.id);
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;

        if (req.file) {
            article.imagePath = path.join(Plant.plantImageBasePath, req.file.filename);
        }

        await article.save();
        res.redirect(`/plants/${article.slug}`);
    } catch (error) {
        console.log(error);
        res.render('plants/edit', { article: article });
    }
});


//  Alternative PUT route
// router.put('/:id', async (req, res, next) => {
//     req.article = await Plant.findById(req.params.id);
//     next();
// }, saveArticleAndRedirect('edit'));


// This route is responsible for handling the deletion of an existing plant article identified by `:id`
router.delete('/:id', async (req, res) => {
    await Plant.findByIdAndDelete(req.params.id);
    res.redirect('/');
});


// Save Article and Redirect
// function saveArticleAndRedirect(path) {
//     return async (req, res) => {
//         let article = req.article;
//         article.title = req.body.title;
//         article.description = req.body.description;
//         article.markdown = req.body.markdown;
//         try {
//             article = await article.save();
//             res.redirect(`/plants/${ article.slug }`);
//         } catch (e) {
//             res.render(`plants/${ path }`, { article: article });
//         }
//     }
// }


// Exports the router module for use in other files
module.exports = router;