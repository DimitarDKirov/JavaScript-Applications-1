let router = new Navigo(null, false);

router
    .on('/gallery', gallery)
    .on('/threads/:id', threadsById)
    .on('/threads', threads)
    .resolve();