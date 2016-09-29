$(() => { // on document ready
  const GLYPH_UP = 'glyphicon-chevron-up',
    GLYPH_DOWN = 'glyphicon-chevron-down',
    root = $('#root'),
    navbar = root.find('nav.navbar'),
    mainNav = navbar.find('#main-nav'),
    contentContainer = $('#root #content'),
    loginForm = $('#login'),
    logoutForm = $('#logout'),
    usernameSpan = $('#span-username'),
    usernameInput = $('#login input'),
    alertTemplate = $($('#alert-template').text());

  (function checkForLoggedUser() {
    data.users.current()
      .then((user) => {
        if (user) {
          usernameSpan.text(user);
          loginForm.addClass('hidden');
          logoutForm.removeClass('hidden');
        }
      });
  })();

  function showMsg(msg, type, cssClass, delay) {
    let container = alertTemplate.clone(true)
      .addClass(cssClass).text(`${type}: ${msg}`)
      .appendTo(root);

    setTimeout(() => {
      container.remove();
    }, delay || 2000)
  }

  function loadGalleryContent(data) {
    let list = data.data.children,
      containerGallery = $($('#gallery-container-tempalte').text()),
      containerImgs = containerGallery.find('#gallery-imgs'),
      item = $($('#gallery-img-tempalte').text()),
      itemImg = item.find('img.gallery-item-img'),
      itemTitle = item.find('.gallery-item-title')

    list.forEach((el) => {
      itemTitle.text(el.data.title);
      itemImg.attr('src', el.data.thumbnail);

      containerImgs.append(item.clone(true));
    });

    contentContainer.html('').append(containerGallery);
  }

  navbar.on('click', 'li', (ev) => {
    let $target = $(ev.target);
    $target.parents('nav').find('li').removeClass('active');
    $target.parents('li').addClass('active');
  });

  navbar.on('click', '#btn-threads', (ev) => {
    // data.threads.get()
    //   .then((data) => {
    //     loadThreadsContent(data.result)
    //   })
  });

  contentContainer.on('click', '#btn-add-thread', (ev) => {
    let title = $(ev.target).parents('form').find('input#input-add-thread').val() || null;
    data.threads.add(title)
      .then(/* add to UI */)
      .then(showMsg('Successfuly added the new thread', 'Success', 'alert-success'))
      .catch((err) => showMsg(JSON.parse(err.responseText).err, 'Error', 'alert-danger'));
  })

  // contentContainer.on('click', 'a.thread-title', (ev) => {
  //   let $target = $(ev.target),
  //     threadId = $target.parents('.thread').attr('data-id');

  //   data.threads.getById(threadId)
  //     .then(loadMessagesContent)
  //     .catch((err) => showMsg(err, 'Error', 'alert-danger'))
  // })

  contentContainer.on('click', '.btn-add-message', (ev) => {
    let $target = $(ev.target),
      $container = $target.parents('.container-messages'),
      thId = $container.attr('data-thread-id'),
      msg = $container.find('.input-add-message').val();

    data.threads.addMessage(thId, msg)
      .then(/* add to UI */)
      .then(showMsg('Successfuly added the new mssagee', 'Success', 'alert-success'))
      .catch((err) => showMsg(JSON.parse(err.responseText).err, 'Error', 'alert-danger'));
  })

  contentContainer.on('click', '.btn-close-msg', (ev) => {
    let msgContainer = $(ev.target).parents('.container-messages').remove();
  });

  contentContainer.on('click', '.btn-collapse-msg', (ev) => {
    let $target = $(ev.target);
    if ($target.hasClass(GLYPH_UP)) {
      $target.removeClass(GLYPH_UP).addClass(GLYPH_DOWN);
    } else {
      $target.removeClass(GLYPH_DOWN).addClass(GLYPH_UP);
    }

    $target.parents('.container-messages').find('.messages').toggle();
  });
  // end threads


  // start login/logout
  navbar.on('click', '#btn-login', (ev) => {
    let username = usernameInput.val() || 'anonymous';
    data.users.login(username)
      .then((user) => {
        usernameInput.val('')
        usernameSpan.text(user);
        loginForm.addClass('hidden');
        logoutForm.removeClass('hidden');
      })
  });
  navbar.on('click', '#btn-logout', (ev) => {
    data.users.logout()
      .then(() => {
        usernameSpan.text('');
        loginForm.removeClass('hidden');
        logoutForm.addClass('hidden');
      })
  });
  // end login/logout
});

function gallery() {
  Promise
    .all([data.gallery.get(), loadTemplate('gallery')])
    .then(function ([data, template]) {
      let htmlTemplate = template(data);
      $('#content').html(htmlTemplate);
    })
    .catch(console.log);
}

function threads() {
  Promise
    .all([data.threads.get(), loadTemplate('threads')])
    .then(function ([data, template]) {
      let htmlTemplate = template(data);
      $('#content').html(htmlTemplate);
    })
    .catch(console.log);
}

function threadsById(params) {
  Promise
    .all([data.threads.getById(params.id), loadTemplate('messages')])
    .then(function ([data, template]) {
      let htmlTemplate = template(data.result);
      $('#content').append(htmlTemplate);
    })
    .catch(console.log);
}