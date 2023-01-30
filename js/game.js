const firebaseConfig = {
  apiKey: "AIzaSyAKqE7MdhOnRzXyjtP2wQxQ_iR73h0IAAs",
  authDomain: "flexboxfroggymaster.firebaseapp.com",
  projectId: "flexboxfroggymaster",
  storageBucket: "flexboxfroggymaster.appspot.com",
  messagingSenderId: "604293471792",
  appId: "1:604293471792:web:8f008684257e389b6b57f5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

var game = {
  //stopwatch
  intervalId: -1,
  levelMiliseconds: null,
  pageStartTimes: (localStorage.pageStartTimes && JSON.parse(localStorage.pageStartTimes)) || {},
  pageEndTimes: (localStorage.pageEndTimes && JSON.parse(localStorage.pageEndTimes)) || {},
  levelStartTimes: (localStorage.levelStartTimes && JSON.parse(localStorage.levelStartTimes)) || {},
  levelEndTimes: (localStorage.levelEndTimes && JSON.parse(localStorage.levelEndTimes)) || {},
  pageTimes: (localStorage.pageTimes && JSON.parse(localStorage.pageTimes)) || {},
  levelTimes: (localStorage.levelTimes && JSON.parse(localStorage.levelTimes)) || {},
  gameTimes: (localStorage.gameTimes && JSON.parse(localStorage.gameTimes)) || {},
  // additions
  lives: 0,
  remainingLives: (localStorage.remainingLives && JSON.parse(localStorage.remainingLives)) || {},
  points: (localStorage.points && JSON.parse(localStorage.points)) || {},
  badges: (localStorage.badges && JSON.parse(localStorage.badges)) || [],
  badgesProgress: {},
  gameWin: (localStorage.gameWin && JSON.parse(localStorage.gameWin)) || 'false',
  gameLose: (localStorage.gameLose && JSON.parse(localStorage.gameLose)) || 'false',
  gameQuit: (localStorage.gameQuit && JSON.parse(localStorage.gameQuit)) || 'false',
  tutorialFinish: (localStorage.tutorialFinish && JSON.parse(localStorage.tutorialFinish)) || 'false',
  nickname: (localStorage.nickname && JSON.parse(localStorage.nickname)) || '',
  nameSubmit: (localStorage.nameSubmit && JSON.parse(localStorage.nameSubmit)) || 'false',
  badgeTime: parseInt(localStorage.badgeTime, 10) || 0,
  badgeLives: parseInt(localStorage.badgeLives, 10) || 0,
  session: parseInt(localStorage.level, 10) || 0,
  //original
  colorblind: (localStorage.colorblind && JSON.parse(localStorage.colorblind)) || 'false',
  sound: (localStorage.sound && JSON.parse(localStorage.sound)) || 'true',
  language: window.location.hash.substring(1) || 'en',
  difficulty: 'easy',
  level: parseInt(localStorage.level, 10) || 0,
  levelData: null,
  answers: (localStorage.answers && JSON.parse(localStorage.answers)) || {},
  solved: (localStorage.solved && JSON.parse(localStorage.solved)) || [],
  user: localStorage.user || '',
  changed: false,
  clickedCode: null,

  start: function() {
    // navigator.language can include '-'
    // ref: https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/language
    var requestLang = 'en';
    if (window.location.hash === '' && requestLang !== 'en' && messages.languageActive.hasOwnProperty(requestLang)) {
      game.language = requestLang;
      window.location.hash = requestLang;
    }

    game.translate();
    $('#level-counter .total').text(levels.length);
    $('#editor').show();
    $('#share').hide();
    $('#language').val(game.language);
    $('input[value="' + game.colorblind + '"]', '#colorblind').prop('checked', true);
    $('input[value="' + game.sound + '"]', '#sound').prop('checked', true);

    if(game.sound == 'true') {
      sounds.shake.volume = 0.5;
      sounds.correct.volume = 0.5;
      sounds.start.volume = 0.5;
      sounds.lost.volume = 0.5;
      sounds.background.volume = 0.5;
      sounds.badge.volume = 0.5;
    } else {
      sounds.shake.volume = 0;
      sounds.correct.volume = 0;
      sounds.start.volume = 0;
      sounds.lost.volume = 0;
      sounds.background.volume = 0;
      sounds.badge.volume = 0;
    }

    this.setHandlers();
    this.loadMenu();

    if (!localStorage.user) {
      game.user = '' + (new Date()).toISOString();
      localStorage.setItem('user', game.user);
      game.loadHighscore();
    }

    if (this.tutorialFinish == 'false') {
      game.showIntroduction(true);
    } else {
      game.showIntroduction(false);
    }

    if (game.gameWin == 'true' || game.gameLose == 'true' || game.gameQuit == 'true') {
      game.gameWin == 'true' && game.gameFinish(1);
      game.gameLose == 'true' && game.gameFinish(2);
      game.gameQuit == 'true' && game.gameFinish(3);
      if (game.nameSubmit == 'true') {
        $('#highscore-form').hide();
        game.loadHighscoreFinish();
      }
      return;
    }

    game.loadLevel(levels[game.level]);
  },

  // set event handerls
  setHandlers: function() {
    $('#highscore-name-input').on('input', function() {
      if($('#highscore-name-input')[0].value.length > 0 && $('#highscore-name-input')[0].checkValidity()) {
        $('#highscore-form-submit').attr('disabled', false);
      } else {
        $('#highscore-form-submit').attr('disabled', true);
      }
    });

    $('#highscore-form-submit').on('click', function() {
      $('#highscore-name-input').attr('disabled', true);
      $('#highscore-form-submit').attr('disabled', true);
      $('#player-name').html($('#highscore-name-input')[0].value);
      game.nickname = $('#highscore-name-input')[0].value;
      game.nameSubmit = 'true';

      game.saveToDatabase();
      db.collection("highscore").add({
        name: $('#highscore-name-input')[0].value,
        points: game.totalPoints(),
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });

      setTimeout(function() {
        game.loadHighscoreFinish();
      }, 2000)
    });
    
    const tutorial = this.makeTutorial();
    $('#startGame').on('click', function() {
      sounds.background.loop = true;
      sounds.background.play();
      game.showIntroduction(false);
      tutorial();
    });

    $('#end').on('click', function() {
      const level = levels[game.level]
      game.gameFinish(3);
      game.levelEndTimer();
      game.pageEndTimes[level.name] = new Date();
      game.pageTimes[level.name] = new Date(game.pageEndTimes[level.name]) - new Date(game.pageStartTimes[level.name])
      game.saveToLocalStorage();
    });

    $('#nextTutorial7').on('click', function() {
      game.tutorialFinish = 'true';
    });

    $('.tutorial-next').on('click', function() {
      tutorial();
    });

    $('#start').on('click', function() {
      game.startGame();
    });

    $('#pause').on('click', function() {
      game.pauseGame();
    });

    $('#resume').on('click', function() {
      game.resumeGame();
    });

    $('.retry').on('click', function() {
      game.replayGame();
    })

    $('#check').on('click', function() {
      game.check();
      const level = levels[game.level];
      if ($('#check').hasClass('disabled')) {
        console.log('here')
        if (level.lives == game.lives) {
          game.badgeLives++;
        } else {
          game.badgeLives = 0;
        }
  
        if (game.levelMiliseconds > (level.maxTimeIntervals[0])) {
          game.badgeTime++;
        } else {
          game.badgeTime = 0;
        }
        game.checkBadges();
      }

      if ($('#next').hasClass('disabled')) {
        sounds.shake.play();
        game.lives--;
        game.saveLives();
        game.printLives();
        if(game.lives == 0) {
          game.levelEndTimer();
          game.levelEndTimes[level.name] = new Date();
          game.levelTimes[level.name] = new Date(game.levelEndTimes[level.name]) - new Date(game.levelStartTimes[level.name])
          game.gameFinish(2);
          game.saveToDatabase();
          sounds.background.pause();
          sounds.lost.play();
        }

        if (!$('.frog').hasClass('animated')) {
          game.tryagain();
        }
        return;
      }
      sounds.correct.play();
    });

    // next button in code field -> next level
    $('#next').on('click', function() {
      $('#code').focus();

      if ($('#next').hasClass('disabled')) {
        if (!$('.frog').hasClass('animated')) {
          game.tryagain();
        }

        return;
      }

      const level = levels[game.level];
      game.pageEndTimes[level.name] = new Date();
      game.pageTimes[level.name] = game.pageEndTimes[level.name] - game.pageStartTimes[level.name]
      $(this).removeClass('animated animation'); 
      $('.frog').addClass('animated bounceOutUp');

      setTimeout(function() {
        game.saveToDatabase();
        if (game.level >= levels.length - 1) {
          game.gameFinish(1);
        } else {
          game.levelMiliseconds = null;
          game.next();
        }
      }, 2000);
    });

    // press enter -> next button in code field -> next level
    $('#code').on('keydown', function(e) {
      if (e.keyCode === 13) {
        const level = levels[game.level]
        if(game.lives == 0) {
          return;
        }
        if ((e.ctrlKey || e.metaKey) && game.levelMiliseconds != level.maxTime) {
          e.preventDefault();
          game.check();
          $('#next').click();
          return;
        }
        // distinguish level submission or enter
        var max = $(this).data('lines');
        var code = $(this).val();
        var trim = code.trim();
        var codeLength = code.split('\n').length;
        var trimLength = trim.split('\n').length;

        if (codeLength >= max) {
          if (codeLength === trimLength && game.levelMiliseconds != level.maxTime) {
            e.preventDefault();
            $('#check').click();
          } else {
            $('#code').focus().val('').val(trim);
          }
        }
      }
    })
    .on('input', function() {
      game.changed = true;
      $('#next').removeClass('animated animation').addClass('disabled');
    });

    // ??
    $('#editor').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      $(this).removeClass();
    });

    // if game is reset
    $('#labelReset').on('click', function() {
      var warningReset = messages.warningReset[game.language] || messages.warningReset.en;
      var r = confirm(warningReset);

      if (r) {
        const level = levels[game.level]
        game.levelEndTimer();
        game.levelEndTimes[level.name] = new Date();
        game.levelTimes[level.name] = new Date(game.levelEndTimes[level.name]) - new Date(game.levelStartTimes[level.name])

        game.resetGameStats();
        $('#finish-screen-1').show();
        $('#finish-screen-2').hide();
        $('#highscore-name-input').attr('disabled', false);
        $('#highscore-form-submit').attr('disabled', false);

        game.showIntroduction(true);

        game.loadLevel(levels[0]);
        $('.level-marker').removeClass('solved');
      }
    });

    // if settings are opened/ close, show/ hide level submenu
    $('#labelSettings').on('click', function() {
      $('#levelsWrapper').hide();
      $('#settings .tooltip').toggle();
      $('#instructions .tooltip').remove();
    })

    // update link/ location when language is changed
    $('#language').on('change', function() {
      window.location.hash = $(this).val();
    });

    // change difficulty to the checked radio button when difficulty is changed
    $('#difficulty').on('change', function() {
      game.difficulty = $('input:checked', '#difficulty').val();

      // setting height will prevent a slight jump when the animation starts
      var $instructions = $('#instructions');
      var height = $instructions.height();
      $instructions.css('height', height);

      var $markers = $('.level-marker');

      if (game.difficulty == 'hard' || game.difficulty == 'medium') {
        $instructions.slideUp();

        $markers.each(function() {
          var $marker = $(this);
          if ($marker[0].hasAttribute('title')) {
            $marker.attr('data-title', $marker.attr('title'));
            $marker.removeAttr('title');
          }
        });
      } else {
        $instructions.css('height', '').slideDown();

        $markers.each(function() {
          var $marker = $(this);
          if ($marker[0].hasAttribute('data-title')) {
            $marker.attr('title', $marker.attr('data-title'));
            $marker.removeAttr('data-title');
          }
        });
      }
    });

    // change colorblind mode to the checked radio button when colorblind mode is changed
    $('#colorblind').on('change', function() {
      game.colorblind = $('input:checked', '#colorblind').val();

      if (game.colorblind == 'true') {
        $('.lilypad, .frog').addClass('cb-friendly');
      } else {
        $('.lilypad, .frog').removeClass('cb-friendly');
      }
    });

    $('#sound').on('change', function() {
      game.sound = $('input:checked', '#sound').val();

      if (game.sound == 'true') {
        sounds.shake.volume = 0.5;
        sounds.correct.volume = 0.5;
        sounds.start.volume = 0.5;
        sounds.lost.volume = 0.5;
        sounds.background.volume = 0.5;
        sounds.badge.volume = 0.5; 
      } else {
        sounds.shake.volume = 0;
        sounds.correct.volume = 0;
        sounds.start.volume = 0;
        sounds.lost.volume = 0;
        sounds.background.volume = 0;
        sounds.badge.volume = 0;
      }
    });

    // close tooltip (level or settings) when clicked outside of them
    $('body').on('click', function() {
      $('.tooltip').hide();
      game.clickedCode = null;
    });

    // stops further propagation when clicked on tooltip links
    $('.tooltip, .toggle, #level-indicator').on('click', function(e) {
      e.stopPropagation();
    });

    // save game stats before closing page
    $(window).on('beforeunload', function() {
      game.saveAnswer();
      game.saveLevelTime();
      game.saveToLocalStorage();
    }).on('hashchange', function() {
      game.language = window.location.hash.substring(1) || 'en';
      game.translate();

      $('#tweet iframe').remove();
      var html = '<a href="https://twitter.com/share" class="twitter-share-button"{count} data-url="https://flexboxfroggy.com" data-via="thomashpark">Tweet</a> ' +
                 '<a href="https://twitter.com/thomashpark" class="twitter-follow-button" data-show-count="false">Follow @thomashpark</a>';
      $('#tweet').html(html);

      if (typeof twttr !== 'undefined') {
        twttr.widgets.load();
      }

      if (game.language === 'en') {
        history.replaceState({}, document.title, './');
      }
    });
  },

  startGame: function() {
    sounds.background.loop = true;
    sounds.background.play();
    sounds.start.play();
    game.levelStartTimer();
    game.disableButtons(true, false, false);
    game.showStartScreen(false);
    game.showCodeLine(true);
    $('#code').focus();
  },

  pauseGame: function() {
    game.levelEndTimer();
    game.showPauseScreen(true);
    game.disableButtons(true, true, true);
    game.showCodeLine(false);
  },

  resumeGame: function() {
    sounds.background.loop = true;
    sounds.background.play();
    sounds.start.play();
    game.levelStartTimer();
    game.showPauseScreen(false);
    game.showStartScreen(false);
    game.disableButtons(true, false, false);
    game.showCodeLine(true);
    $('#code').focus();
  },

  replayGame: function() {
    game.showFinishScreen(false);
    game.showGameOverScreen(false);
    game.resetGameStats();
    game.loadLevel(levels[0])
    game.showCodeLine(false);
    $('#finish-screen-1').show();
    $('#finish-screen-2').hide();
    $('#highscore-name-input').attr('disabled', false);
    $('#highscore-form-submit').attr('disabled', false);
    $('.level-marker').removeClass('solved');
    game.checkBadges();
    sounds.background.currentTime = 0;
    sounds.background.play();
  },

  // navigate to previous level
  prev: function() {
    this.level--;
    this.loadLevel(this.level);
  },

  // navigate to next level
  next: function() {
    if (this.difficulty === "hard") {
      this.level = Math.floor(Math.random()* levels.length)
    } else {
      this.level++
    }
    this.loadLevel(levels[this.level]);
  },

  // load level menu
  loadMenu: function() {
    levels.forEach(function(level, i) {
      var levelMarker = $('<span/>').addClass('level-marker').attr({'data-level': i, 'title': level.name}).text(i+1);

      if (game.solved.includes(level.name)) {
        levelMarker.addClass('solved');
      }

      levelMarker.appendTo('#levels');
    });

    // open or close level menu when clicking on level indicator/ heading
    $('#level-indicator').on('click', function() {
      $('#settings .tooltip').hide();
      $('#levelsWrapper').toggle();
      $('#instructions .tooltip').remove();
    });

    $('#time-badge').on({mouseenter: function() {
      $('#info-time-badge').toggle();
    }, mouseleave: function() {
      $('#info-time-badge').toggle();
    }});

    $('#life-badge').on({mouseenter: function() {
      $('#info-life-badge').toggle();
    }, mouseleave: function() {
      $('#info-life-badge').toggle();
    }});

    $('#points-badge').on({mouseenter: function() {
      $('#info-points-badge').toggle();
    }, mouseleave: function() {
      $('#info-points-badge').toggle();
    }});

    $('#all-lessons-badge').on({mouseenter: function() {
      $('#info-all-lessons-badge').toggle();
    }, mouseleave: function() {
      $('#info-all-lessons-badge').toggle();
    }});

    $('#complete-badge').on({mouseenter: function() {
      $('#info-complete-badge').toggle();
    }, mouseleave: function() {
      $('#info-complete-badge').toggle();
    }});
  },

  // load and set up level
  loadLevel: function(level) {
    this.setTimers();
    this.setLives();
    this.setPoints();
    this.setGameScreen();
    this.setCodeBox();
    this.setLevelIndicator();
    game.setBadgeIndicators();
    game.showCodeLine(true);

    if(game.lives == 0) {
      game.showGameOverScreen(true);
      game.showStartScreen(false);
      game.showPauseScreen(false);
      game.disableButtons(true, false, true)
    } else if (game.level == 0) {
      if (game.levelMiliseconds < level.maxTime) {
        game.resumeGame();
      } else {
        game.showStartScreen(true);
        game.showPauseScreen(false);
        game.showCodeLine(false);
        game.disableButtons(true, false, false) 
      }
    } else {
      game.resumeGame();
    }

    // load instructions
    var instructions = level.instructions[game.language] || level.instructions.en;
    $('#instructions').html(instructions);

    // get answer if any and set focus on answer input
    var answer = game.answers[level.name];
    $('#code').val(answer).focus();

    this.loadDocs();

    var lines = Object.keys(level.style).length;
    $('#code').height(20 * lines).data("lines", lines);

    this.setUpBoard(level);

    game.changed = false;
    game.applyStyles();
    !game.levelSolved() && game.check();
  },

  setUpBoard: function(level) {
    var string = level.board;
    var markup = '';
    var colors = {
      'g': 'green',
      'r': 'red',
      'y': 'yellow'
    };

    // attribute lilypad and frogs their colors according to level board
    for (var i = 0; i < string.length; i++) {
      var c = string.charAt(i);
      var color = colors[c];

      var lilypad = $('<div/>').addClass('lilypad ' + color + (this.colorblind == 'true' ? ' cb-friendly' : '')).data('color', color);
      var frog = $('<div/>').addClass('frog ' + color + (this.colorblind == 'true' ? ' cb-friendly' : '')).data('color', color);

      $('<div/>').addClass('bg').css(game.transform()).appendTo(lilypad);
      $('<div/>').addClass('bg animated pulse infinite').appendTo(frog);

      $('#background').append(lilypad);
      $('#pond').append(frog);

      // add classes for levels
      var classes = level.classes;

      if (classes) {
        for (var rule in classes) {
        $(rule).addClass(classes[rule]);
      }
    }

    var selector = level.selector || '';
    $('#background ' + selector).css(level.style);
    }
  },

  loadDocs: function() {
    $('#instructions code').each(function() {
      var code = $(this);
      var text = code.text();

      if (text in docs) {
        code.addClass('help');
        code.on('click', function(e) {
          e.stopPropagation();

          // If click same code when tooltip already displayed, just remove current tooltip.
          if ($('#instructions .tooltip').length !== 0 && game.clickedCode === code){
            $('#instructions .tooltip').remove();
            return;
          }

          $('#levelsWrapper').hide();
          $('#settings .tooltip').hide();
          $('#instructions .tooltip').remove();
          var html = docs[text][game.language] || docs[text].en;
          var tooltipX = code.offset().left;
          var tooltipY = code.offset().top + code.height() + 13;
          $('<div class="tooltip"></div>').html(html).css({
            top: tooltipY,
            left: tooltipX
          }).appendTo($('#instructions'));

          var getDefaultPropVal = (pValue) => {
            if (pValue == '<integer>')
              return '0'
            else if (pValue == '<flex-direction>')
              return 'row nowrap'

            return pValue;
          }

          $('#instructions .tooltip code').on('click', function(event) {
            var pName = text
            var pValue = event.target.textContent.split(' ')[0];
            pValue = getDefaultPropVal(pValue);
            game.writeCSS(pName, pValue);

            game.check();
          });
          game.clickedCode = code;
        });
      }
    });
    $('#info-tutorial-intro .info-tutorial-text').html(tutorial_text["info-tutorial-intro"][game.language]);
    $('#info-tutorial-code .info-tutorial-text').html(tutorial_text["info-tutorial-code"][game.language]);
    $('#info-tutorial-badges .info-tutorial-text').html(tutorial_text["info-tutorial-badges"][game.language]);
    $('#info-tutorial-time .info-tutorial-text').html(tutorial_text["info-tutorial-time"][game.language]);
    $('#info-tutorial-lifes .info-tutorial-text').html(tutorial_text["info-tutorial-lifes"][game.language]);
    $('#info-tutorial-nextlevel .info-tutorial-text').html(tutorial_text["info-tutorial-nextlevel"][game.language]);
    $('#info-tutorial-check .info-tutorial-text').html(tutorial_text["info-tutorial-check"][game.language]);

    game.setBadgeIndicators();
  },

  // apply styles to elements (level setup)
  applyStyles: function() {
    const level = levels[game.level]
    var code = $('#code').val();
    var selector = level.selector || '';
    $('#pond ' +  selector).attr('style', code);
    game.saveAnswer();
  },

  // check if level successfully solved
  check: function() {
    game.applyStyles();

    var lilypads = {};
    var frogs = {};
    var correct = true;

    // save frog color on position
    $('.frog').each(function() {
      var position = $(this).position();
      position.top = Math.floor(position.top);
      position.left = Math.floor(position.left);

      var key = JSON.stringify(position);
      var val = $(this).data('color');
      frogs[key] = val;
    });

    // compare if lilypad color position is same as frog color position 
    $('.lilypad').each(function() {
      var position = $(this).position();
      position.top = Math.floor(position.top);
      position.left = Math.floor(position.left);

      var key = JSON.stringify(position);
      var val = $(this).data('color');

      if (!(key in frogs) || frogs[key] !== val) {
        correct = false;
      }
    });

    const level = levels[game.level]
    // if correct true -> level solved
    if (correct) {
      game.levelEndTimer();
      game.levelEndTimes[level.name] = new Date();
      game.levelTimes[level.name] = new Date(game.levelEndTimes[level.name]) - new Date(game.levelStartTimes[level.name])
      game.solved.push(level.name);
      game.savePoints();
      game.saveLives();        
      game.saveLevelTime();
      game.disableButtons(false, true, true);
      game.showCodeLine(false);

      game.saveToLocalStorage();
      game.saveToDatabase();
      game.setPoints();

      ga('send', {
        hitType: 'event',
        eventCategory: game.level.name,
        eventAction: 'correct',
        eventLabel: $('#code').val()
      });

      $('[data-level=' + game.level + ']').addClass('solved');
    } else {
      ga('send', {
        hitType: 'event',
        eventCategory: level.name,
        eventAction: 'incorrect',
        eventLabel: $('#code').val()
      });
      game.changed = true;
      $('#next').removeClass('animated animation').addClass('disabled');
    }
  },

  saveLives: function() {
    const level = levels[game.level]
    game.remainingLives[level.name] = game.lives;
  },

  savePoints: function() {
    const level = levels[game.level]
    let pointsTemp = level.maxPoints;
    const timePoints = function() {
      let timePointsTemp = pointsTemp/2;
      let remainingTime = game.levelMiliseconds;
      if(remainingTime > level.maxTimeIntervals[0]) {
        return timePointsTemp
      } else if (remainingTime > level.maxTimeIntervals[1]) {
        return timePointsTemp*0.8;
      } else if (remainingTime > level.maxTimeIntervals[2]) {
        return timePointsTemp*0.6;
      } else if (remainingTime > level.maxTimeIntervals[3]) {
        return timePointsTemp*0.4;
      } else {
        return timePointsTemp*0.2;
      };
    }

    const livesPoints = function() {
      let livesPointsTemp = pointsTemp/2;
      let pointsPerLive = livesPointsTemp/level.lives;
      return pointsPerLive*game.lives;
    }

    const totalLevelPoints = timePoints() + livesPoints();
    game.points[level.name] = Math.floor(totalLevelPoints*10)/10;
  },

  totalPoints: function() {
    const pointsLevels = Object.values(game.points).reduce((a, b) => a + b, 0);
    const pointsBronze = game.badges.filter(function (str) { return str.includes('bronze'); }).length * 500;
    const pointsSilver = game.badges.filter(function (str) { return str.includes('silver'); }).length * 1000;
    const pointsGold = game.badges.filter(function (str) { return str.includes('gold'); }).length * 2500;

    return Math.floor(pointsLevels + pointsBronze + pointsSilver + pointsGold);
  },

  // save answer in array
  saveAnswer: function() {
    const level = levels[game.level]
    game.answers[level.name] = $('#code').val();
  },

  levelStartTimer: function() {
    if(!game.levelSolved()) {
      game.intervalId = setInterval(game.timeCounting, 10);
    }
  },

  levelEndTimer: function() {
    if(!game.levelSolved()) {
      game.intervalId && clearInterval(game.intervalId);
      game.intervalId = -1;
    }
  },

  saveLevelTime: function() {
    const level = levels[game.level]
    game.gameTimes[level.name] = level.maxTime - game.levelMiliseconds;
  },

  // shake code field if wrong answer
  tryagain: function() {
    $('#editor').addClass('animated shake');
  },

  // when all game levels solved
  gameFinish: function(win = 3) {
    if(win == 1) {
      game.gameWin = 'true';
    } else if (win == 2) {
      game.gameLose = 'true';
    } else if (win == 3) {
      game.gameQuit = 'true';
    }

    this.setUpBoard(levelWin);
    $('.frog .bg').removeClass('pulse').addClass('bounce');
    $('.finish-points').html(this.totalPoints());
    $('#player-name').html(game.nickname);
    game.setBadges();

    if(game.gameWin == 'true') {
      game.showFinishScreen(true);
    }

    if(game.gameLose == 'true') {
      game.showLoseScreen(true);
    }

    if(game.gameQuit == 'true') {
      game.showQuitScreen(true);
    }
  },

  saveToDatabase: function() {
    //save to database
    db.collection("gamified-version").doc(game.user).get().then((doc) => {
      if(doc.data()) {
        let sessionsData = doc.data().sessions;
        sessionsData[game.session] = {
          nickname: game.nickname,
          points: game.points,
          remainingLives: game.remainingLives,
          gameTimes: game.gameTimes,
          levelTimes: game.levelTimes,
          pageTimes: game.pageTimes
        };
        db.collection("gamified-version").doc(game.user).set({ sessions: sessionsData })
        .then((docRef) => {
          console.log("Document written.");
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
      } else {
        db.collection("gamified-version").doc(game.user).set({ sessions: [{
          nickname: game.nickname,
          points: game.points,
          remainingLives: game.remainingLives,
          gameTimes: game.gameTimes,
          levelTimes: game.levelTimes,
          pageTimes: game.pageTimes
        }]})
        .then((docRef) => {
          console.log("Document written.");
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
      }
    });
  },

  transform: function() {
    var scale = 1 + ((Math.random() / 5) - 0.2);
    var rotate = 360 * Math.random();

    return {'transform': 'scale(' + scale + ') rotate(' + rotate + 'deg)'};
  },

  translate: function() {
    document.title = messages.title[game.language] || messages.title.en;
    $('html').attr('lang', game.language);

    var level = $('#editor').is(':visible') ? levels[game.level] : levelWin;
    var instructions = level.instructions[game.language] || level.instructions.en;
    $('#instructions').html(instructions);
    game.loadDocs();

    $('.translate').each(function() {
      var label = $(this).attr('id');
      if (messages[label]) {
        var text = messages[label][game.language] || messages[label].en;
	  }

      $('#' + label).text(text);
    });
  },

  debounce: function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },

  writeCSS: function(pName, pValue){
    var tokens = $('#code').val().trim().split(/[\n:;]+/).filter(i => i);
    var keywords = Object.keys(docs);
    var content = '';
    var filled = false;

    // Do nothing when click property name inside Tooltip
    if (keywords.includes(pValue)) return;

    tokens.forEach(function (token, i){
      var trimmedToken = token.trim();
      if (!keywords.includes(trimmedToken)){
        return;
      }

      var append = content !== '' ? '\n' : '';
      if (trimmedToken === pName && !filled)
      {
        filled = true;
        append += trimmedToken + ': ' + pValue + ';';
      }
      else if (i + 1 < tokens.length){
        var val = !keywords.includes(tokens[i + 1].trim()) ? tokens[i + 1].trim() : ''; // TODO: Maybe prop value validiation required
        append += trimmedToken + ': ' + val + ';';
      }

      content += append;
    });

    if (!filled){
      content += content !== '' ? '\n' : '';
      content += pName + ': ' + pValue + ';';
    }

    $('#code').val(content);
    $('#code').focus();
  },

  timeCounting: function() {
    if(game.levelMiliseconds > 0) {
      game.levelMiliseconds = game.levelMiliseconds - 10
      game.setTimeIndicator(game.levelMiliseconds);
    } else {
      game.levelEndTimer()
    }
  },

  setTimeIndicator: function(timeElapsed) {
    //color
    const level = levels[game.level]
    if(timeElapsed > level.maxTimeIntervals[0]) {
      $('#time-indicator').attr('style', 'background-color: rgba(255, 255, 255, 0.2);');
    } else if(timeElapsed > level.maxTimeIntervals[1]) {
      $('#time-indicator').attr('style', 'background-color: rgba(246, 255, 0, 0.2);');
    } else if (timeElapsed > level.maxTimeIntervals[2]) {
      $('#time-indicator').attr('style', 'background-color: rgba(255, 81, 0, 0.4);');
    } else if (timeElapsed > level.maxTimeIntervals[3]) {
      $('#time-indicator').attr('style', 'background-color: rgba(255, 0, 0, 0.6);');
    }

    let milisecondCounter = Math.floor((timeElapsed % 1000)/10);
    let secondCounter = Math.floor((timeElapsed / 1000) % 60);
    let minutesCounter = Math.floor(((timeElapsed / (1000*60)) % 60));
  
    if (milisecondCounter < 10) {
      $('#milisecond').html("0" + milisecondCounter);
    } else $('#milisecond').html(milisecondCounter);
  
    if (secondCounter < 10) {
      $('#second').html("0" + secondCounter);
    } else $('#second').html(secondCounter);
  
    if (minutesCounter < 10) {
      $('#minutes').html("0" + minutesCounter);
    } else $('#minutes').html(minutesCounter);
  },

  setTimers: function() {
    const level = levels[game.level]
    if (!game.pageStartTimes[level.name]) {
      game.pageStartTimes[level.name] = new Date();
    }
    if (!game.levelStartTimes[level.name]) {
      game.levelStartTimes[level.name] = new Date();
    }

    if (game.gameTimes[level.name] != null) {
      game.levelMiliseconds = level.maxTime - game.gameTimes[level.name];
      this.setTimeIndicator(game.levelMiliseconds);
    } else {
      game.levelMiliseconds = level.maxTime;
      this.setTimeIndicator(game.levelMiliseconds);
    };
  },
  
  setLives: function() {
    const level = levels[game.level]
    if (game.remainingLives[level.name] != null) {
      game.lives = game.remainingLives[level.name];
    } else {
      game.lives = level.lives;
    }
    game.printLives();
  },

  setPoints: function() {
    $('#points').html(game.totalPoints())
  },

  setCodeBox: function() {
    const level = levels[game.level]
    $('#editor').show();
    $('#before').text(level.before);
    $('#after').text(level.after);
  },

  setLevelIndicator: function() {
    $('.level-marker').removeClass('current').eq(this.level).addClass('current');
    $('#level-counter .current').text(this.level + 1);
  },

  setGameScreen: function() {
    $('#background, #pond').removeClass('wrap').attr('style', '').empty();
    $('#levelsWrapper').hide();
  },

  disableButtons: function(next, check, pause) {
    if(game.levelSolved()) {
      $('#check').addClass('disabled');
      $('#pause').addClass('disabled');
      $('#next').addClass('animated animation').removeClass('disabled');;
      return
    }
    next ? $('#next').removeClass('animated animation').addClass('disabled') : $('#next').addClass('animated animation').removeClass('disabled');
    check ? $('#check').addClass('disabled') : $('#check').removeClass('disabled');
    pause ? $('#pause').addClass('disabled') : $('#pause').removeClass('disabled');
  },

  showIntroduction: function(show) {
    if(show) {
      game.loadHighscore();
      $('#instructions-introduction').html(introduction_text.intro[game.language]);
      $('#sidebar-introduction').show();
      $('#sidebar').hide();
      $('#board-introduction').show();
      $('#board').addClass('v-collapse');
    } else {
      $('#sidebar-introduction').hide();
      $('#sidebar').show();
      $('#board-introduction').hide();
      $('#board').removeClass('v-collapse');
    }
  },
  
  showFinishScreen: function(show) {
    if(show) {
      $('#highscore-name-input').attr('placeholder', finish_text.placeholder[game.language])
      $('#highscore-form-submit').html(finish_text.button[game.language])
      $('#finish-text').html(finish_text.game_complete[game.language]);
      $('#sidebar-finish').show();
      $('#sidebar').hide();
      $('#highscore-form').show();
    } else {
      $('#sidebar-finish').hide();
      $('#sidebar').show();
    }
  },

  showLoseScreen: function(show) {
    if(show) {
      $('#highscore-name-input').attr('placeholder', finish_text.placeholder[game.language])
      $('#highscore-form-submit').html(finish_text.button[game.language])
      $('#finish-text').html(finish_text.game_lose[game.language]);
      $('#sidebar-finish').show();
      $('#sidebar').hide();
      $('#highscore-form').show();
    } else {
      $('#sidebar-finish').hide();
      $('#sidebar').show();
    }
  },

  showQuitScreen: function(show) {
    if(show) {
      $('#highscore-name-input').attr('placeholder', finish_text.placeholder[game.language])
      $('#highscore-form-submit').html(finish_text.button[game.language])
      $('#finish-text').html(finish_text.game_quit[game.language]);
      $('#sidebar-finish').show();
      $('#sidebar').hide();
      $('#highscore-form').show();
    } else {
      $('#sidebar-finish').hide();
      $('#sidebar').show();
    }
  },

  showPauseScreen: function(show) {
    if(game.levelSolved()) {
      $('#pause-screen').addClass('d-none');
      return;
    }
    show ? $('#pause-screen').removeClass('d-none') : $('#pause-screen').addClass('d-none');
  }, 
  
  showStartScreen: function(show) {
    if(game.levelSolved()) {
      $('#start-screen').addClass('d-none');
      return;
    }
    show ? $('#start-screen').removeClass('d-none') : $('#start-screen').addClass('d-none');
  },

  showGameOverScreen: function(show) {
    if(game.levelSolved()) {
      $('#game-over-screen').addClass('d-none');
      return;
    }
    show ? $('#game-over-screen').removeClass('d-none') : $('#game-over-screen').addClass('d-none');
  },

  showCodeLine: function(show) {
    if (game.levelSolved()) {
      $('#code').attr('disabled', true)
      return;
    }
    show ? $('#code').attr('disabled', false) : $('#code').attr('disabled', true);
  },

  levelSolved: function() {
    const level = levels[game.level]
    return $.inArray(level.name, game.solved) !== -1
  },

  printLives: function() {
    $('#lives-indicator').html('')
    for (let i = 0; i < game.lives; i++) {
      $('#lives-indicator').append(`<div id="frog-live-${i}"class="frog-lives red"><div class="bg animated pulse infinite"></div></div>`)
    };
  },

  hasBadge: function(badge) {
    return game.badges.includes(badge);
  },

  checkBadges: function() {
    const level = levels[game.level]
    if(!game.hasBadge('life-badge-gold') || !game.hasBadge('life-badge-silver') || !game.hasBadge('life-badge-bronze')) {
      if(game.badgeLives > 7 && !game.hasBadge('life-badge-gold')) {
        game.badges.push('life-badge-gold');
        game.badges = game.badges.filter(e => e !== 'life-badge-silver');
        game.badgeAnimation('life-badge-gold');
      } else if (game.badgeLives > 4 && !game.hasBadge('life-badge-silver') && !game.hasBadge('life-badge-gold')) {
        game.badges.push('life-badge-silver');
        game.badges = game.badges.filter(e => e !== 'life-badge-bronze');
        game.badgeAnimation('life-badge-silver');
      } else if (game.badgeLives > 2 && !game.hasBadge('life-badge-bronze') && !game.hasBadge('life-badge-silver') && !game.hasBadge('life-badge-gold')) {
        game.badges.push('life-badge-bronze');
        game.badgeAnimation('life-badge-bronze');
      }
    }

    if(!game.badges.includes('points-badge-gold') || !game.badges.includes('points-badge-silver') || !game.badges.includes('points-badge-bronze')) {
      if(this.totalPoints() > 21999.9 && !game.hasBadge('points-badge-gold')) {
        game.badges.push('points-badge-gold');
        game.badges = game.badges.filter(e => e !== 'points-badge-silver');
        game.badgeAnimation('points-badge-gold');
      } else if (this.totalPoints() > 14999.9 && !game.hasBadge('points-badge-silver') && !game.hasBadge('points-badge-gold')) {
        game.badges.push('points-badge-silver');
        game.badges = game.badges.filter(e => e !== 'points-badge-bronze');
        game.badgeAnimation('points-badge-silver');
      } else if (this.totalPoints() > 7999.9 && !game.hasBadge('points-badge-bronze') && !game.hasBadge('points-badge-silver') && !game.hasBadge('points-badge-gold')) {
        game.badges.push('points-badge-bronze');
        game.badgeAnimation('points-badge-bronze');
      }
    }

    if(!game.badges.includes('time-badge-gold') || !game.badges.includes('time-badge-silver') || !game.badges.includes('time-badge-bronze')) {
      if(game.badgeTime > 7 && !game.hasBadge('time-badge-gold')) {
        game.badges.push('time-badge-gold');
        game.badges = game.badges.filter(e => e !== 'time-badge-silver');
        game.badgeAnimation('time-badge-gold');
      } else if (game.badgeTime > 4 && !game.hasBadge('time-badge-silver') && !game.hasBadge('time-badge-gold')) {
        game.badges.push('time-badge-silver');
        game.badges = game.badges.filter(e => e !== 'time-badge-bronze');
        game.badgeAnimation('time-badge-silver');
      } else if (game.badgeTime > 2 && !game.hasBadge('time-badge-bronze') && !game.hasBadge('time-badge-silver') && !game.hasBadge('time-badge-gold')) {
        game.badges.push('time-badge-bronze');
        game.badgeAnimation('time-badge-bronze');
      }
    }

    if(!game.badges.includes('complete-badge-gold')) {
      if(levels.length == game.solved.length) {
        game.badges.push('complete-badge-gold');
        game.badgeAnimation('complete-badge-gold');
      }
    }

    if(!game.badges.includes('all-lessons-badge-gold')) {
      if(game.solved.length == 20) {
        game.badges.push('all-lessons-badge-gold');
        game.badgeAnimation('all-lessons-badge-gold');
      }
    }
    game.setBadges();
  },

  setBadges() {
    game.badges.includes('all-lessons-badge-gold') ? $('.all-lessons-badge .bg').addClass('gold') : $('.all-lessons-badge .bg').removeClass('gold');
    game.badges.includes('complete-badge-gold') ? $('.complete-badge .bg').addClass('gold') : $('.complete-badge .bg').removeClass('gold');
    game.badges.includes('time-badge-gold') ? $('.time-badge .bg').addClass('gold') : $('.time-badge .bg').removeClass('gold');
    game.badges.includes('points-badge-gold') ? $('.points-badge .bg').addClass('gold') : $('.points-badge .bg').removeClass('gold');
    game.badges.includes('life-badge-gold') ? $('.life-badge .bg').addClass('gold') : $('.life-badge .bg').removeClass('gold');
    game.badges.includes('time-badge-silver') ? $('.time-badge .bg').addClass('silver') : $('.time-badge .bg').removeClass('silver');
    game.badges.includes('points-badge-silver') ? $('.points-badge .bg').addClass('silver') : $('.points-badge .bg').removeClass('silver');
    game.badges.includes('life-badge-silver') ? $('.life-badge .bg').addClass('silver') : $('.life-badge .bg').removeClass('silver');
    game.badges.includes('time-badge-bronze') ? $('.time-badge .bg').addClass('bronze') : $('.time-badge .bg').removeClass('bronze');
    game.badges.includes('points-badge-bronze') ? $('.points-badge .bg').addClass('bronze') : $('.points-badge .bg').removeClass('bronze');
    game.badges.includes('life-badge-bronze') ? $('.life-badge .bg').addClass('bronze') : $('.life-badge .bg').removeClass('bronze');

    game.setBadgeIndicators();
  },

  setBadgeIndicators: function() {
    if(game.badges.includes('life-badge-gold')) {
      $('#info-life-badge-progress').hide();
      $('#info-life-badge-body').html(badges_info_text['life-badge-obtained'].body[game.language])
      $('#info-life-badge-header').html(badges_info_text['life-badge-obtained'].header[game.language])
    } else if(game.badges.includes('life-badge-silver')) {
      $('#info-life-badge-progress').show();
      $('#info-life-badge-progress').html(`<div id="progress-bar-border"><div id="progress-bar" style="width: ${game.badgeLives/badges_info_text['life-badge-gold'].divider*100}%"></div></div>`)
      $('#info-life-badge-body').html(badges_info_text['life-badge-gold'].body[game.language])
      $('#info-life-badge-header').html(badges_info_text['life-badge-gold'].header[game.language])
    } else if (game.badges.includes('life-badge-bronze')) {
      $('#info-life-badge-progress').show();
      $('#info-life-badge-progress').html(`<div id="progress-bar-border"><div id="progress-bar" style="width: ${game.badgeLives/badges_info_text['life-badge-silver'].divider*100}%"></div></div>`)
      $('#info-life-badge-body').html(badges_info_text['life-badge-silver'].body[game.language])
      $('#info-life-badge-header').html(badges_info_text['life-badge-silver'].header[game.language])
    } else {
      $('#info-life-badge-progress').show();
      $('#info-life-badge-progress').html(`<div id="progress-bar-border"><div id="progress-bar" style="width: ${game.badgeLives/badges_info_text['life-badge-bronze'].divider*100}%"></div></div>`)
      $('#info-life-badge-body').html(badges_info_text['life-badge-bronze'].body[game.language])
      $('#info-life-badge-header').html(badges_info_text['life-badge-bronze'].header[game.language])
    }

    if(game.badges.includes('time-badge-gold')) {
      $('#info-time-badge-progress').hide();
      $('#info-time-badge-body').html(badges_info_text['time-badge-obtained'].body[game.language])
      $('#info-time-badge-header').html(badges_info_text['time-badge-obtained'].header[game.language])
    } else if(game.badges.includes('time-badge-silver')) {
      $('#info-time-badge-progress').show();
      $('#info-time-badge-progress').html(`<div id="progress-bar-border"><div id="progress-bar" style="width: ${game.badgeTime/badges_info_text['time-badge-gold'].divider*100}%"></div></div>`)
      $('#info-time-badge-header').html(badges_info_text['time-badge-gold'].header[game.language])
      $('#info-time-badge-body').html(badges_info_text['time-badge-gold'].body[game.language])
    } else if (game.badges.includes('time-badge-bronze')) {
      $('#info-time-badge-progress').show();
      $('#info-time-badge-progress').html(`<div id="progress-bar-border"><div id="progress-bar" style="width: ${game.badgeTime/badges_info_text['time-badge-silver'].divider*100}%"></div></div>`)
      $('#info-time-badge-header').html(badges_info_text['time-badge-silver'].header[game.language])
      $('#info-time-badge-body').html(badges_info_text['time-badge-silver'].body[game.language])
    } else {
      $('#info-time-badge-progress').show();
      $('#info-time-badge-progress').html(`<div id="progress-bar-border"><div id="progress-bar" style="width: ${game.badgeTime/badges_info_text['time-badge-bronze'].divider*100}%"></div></div>`)
      $('#info-time-badge-header').html(badges_info_text['time-badge-bronze'].header[game.language])
      $('#info-time-badge-body').html(badges_info_text['time-badge-bronze'].body[game.language])
    }

    if(game.badges.includes('points-badge-gold')) {
      $('#info-points-badge-progress').hide();
      $('#info-points-badge-body').html(badges_info_text['points-badge-obtained'].body[game.language])
      $('#info-points-badge-header').html(badges_info_text['points-badge-obtained'].header[game.language])
    } else if(game.badges.includes('points-badge-silver')) {
      $('#info-points-badge-progress').show();
      $('#info-points-badge-progress').html(`<div id="progress-bar-border"><div id="progress-bar" style="width: ${game.totalPoints()/21999.9*100}%"></div></div>`)
      $('#info-points-badge-header').html(badges_info_text['points-badge-gold'].header[game.language])
      $('#info-points-badge-body').html(badges_info_text['points-badge-gold'].body[game.language])
    } else if (game.badges.includes('points-badge-bronze')) {
      $('#info-points-badge-progress').show();
      $('#info-points-badge-progress').html(`<div id="progress-bar-border"><div id="progress-bar" style="width: ${game.totalPoints()/14999.9*100}%"></div></div>`)
      $('#info-points-badge-header').html(badges_info_text['points-badge-silver'].header[game.language])
      $('#info-points-badge-body').html(badges_info_text['points-badge-silver'].body[game.language])
    } else {
      $('#info-points-badge-progress').show();
      $('#info-points-badge-progress').html(`<div id="progress-bar-border"><div id="progress-bar" style="width: ${game.totalPoints()/7999.9*100}%"></div></div>`)
      $('#info-points-badge-header').html(badges_info_text['points-badge-bronze'].header[game.language])
      $('#info-points-badge-body').html(badges_info_text['points-badge-bronze'].body[game.language])
    }

    if(game.badges.includes('all-lessons-badge-gold')) {
      $('#info-all-lessons-badge-progress').hide();
      $('#info-all-lessons-badge-body').html(badges_info_text['all-lessons-badge-obtained'].body[game.language])
      $('#info-all-lessons-badge-header').html(badges_info_text['all-lessons-badge-obtained'].header[game.language])
    } else {
      $('#info-all-lessons-badge-progress').show();
      $('#info-all-lessons-badge-progress').html(`<div id="progress-bar-border"><div id="progress-bar" style="width: ${game.solved.length/badges_info_text['all-lessons-badge-gold'].divider*100}%"></div></div>`)
      $('#info-all-lessons-badge-header').html(badges_info_text['all-lessons-badge-gold'].header[game.language])
      $('#info-all-lessons-badge-body').html(badges_info_text['all-lessons-badge-gold'].body[game.language])
    }

    if(game.badges.includes('complete-badge-gold')) {
      $('#info-complete-badge-progress').hide();
      $('#info-complete-badge-body').html(badges_info_text['complete-badge-obtained'].body[game.language])
      $('#info-complete-badge-header').html(badges_info_text['complete-badge-obtained'].header[game.language])
    } else {
      $('#info-complete-badge-progress').show();
      $('#info-complete-badge-progress').html(`<div id="progress-bar-border"><div id="progress-bar" style="width: ${game.solved.length/badges_info_text['complete-badge-gold'].divider*100}%"></div></div>`)
      $('#info-complete-badge-header').html(badges_info_text['complete-badge-gold'].header[game.language])
      $('#info-complete-badge-body').html(badges_info_text['complete-badge-gold'].body[game.language])
    }
  },

  saveToLocalStorage: function() {
    localStorage.setItem('level', game.level);
    localStorage.setItem('answers', JSON.stringify(game.answers));
    localStorage.setItem('solved', JSON.stringify(game.solved));
    localStorage.setItem('colorblind', JSON.stringify(game.colorblind));
    localStorage.setItem('sound', JSON.stringify(game.sound));
    // additional
    localStorage.setItem('session', JSON.stringify(game.session));
    localStorage.setItem('points', JSON.stringify(game.points));
    localStorage.setItem('gameWin', JSON.stringify(game.gameWin));
    localStorage.setItem('gameLose', JSON.stringify(game.gameLose));
    localStorage.setItem('gameQuit', JSON.stringify(game.gameQuit));
    localStorage.setItem('tutorialFinish', JSON.stringify(game.tutorialFinish));
    localStorage.setItem('nameSubmit', JSON.stringify(game.nameSubmit));
    localStorage.setItem('nickname', JSON.stringify(game.nickname));
    localStorage.setItem('badges', JSON.stringify(game.badges));
    localStorage.setItem('remainingLives', JSON.stringify(game.remainingLives));
    localStorage.setItem('levelTimes', JSON.stringify(game.levelTimes));
    localStorage.setItem('gameTimes', JSON.stringify(game.gameTimes));
    localStorage.setItem('pageTimes', JSON.stringify(game.pageTimes));
    localStorage.setItem('badgeTime', JSON.stringify(game.badgeTime));
    localStorage.setItem('badgeLives', JSON.stringify(game.badgeLives));
  },

  resetGameStats: function() {
    game.saveToDatabase();
    game.session++;
    localStorage.setItem('user', game.user);

    game.level = 0;
    game.answers = {};
    game.solved = [];
    // additions
    game.intervalId = null;
    game.levelMiliseconds = null;
    game.pageStartTimes = {};
    game.pageEndTimes = {};
    game.pageTimes = {};
    game.gameTimes = {};
    game.levelTimes = {};
    game.remainingLives = {};
    game.badges = [];
    game.points = {};
    game.gameWin = 'false';
    game.gameLose = 'false';
    game.gameQuit = 'false';
    game.nameSubmit = 'false';
    game.badgeLives = 0;
    game.badgeTime = 0;
  },

  loadHighscoreFinish: function() {
    $('#finish-screen-1').hide();
    $('#finish-screen-2').show();
    game.loadHighscore();
  },

  loadHighscore: async function() {
    const sortedByPoints = await db.collection('highscore').orderBy('points', 'desc').limit(10).get().then(querySnapshot => {
      game.printHighscore(querySnapshot.docs);
    });
  },

  printHighscore: function(data) {
    let cnt = 1;
    let tableData = ``;
    data.map(doc => {
      tableData += `<tr><td>${cnt}</td><td>${doc.data().name}</td><td>${doc.data().points}</td></tr>`;
      cnt++;
    });
    $('.highscore').show();
    $('.highscore-data').html(tableData);
  },

  badgeAnimation: function(badgeName) {
    $("#wrapper").append(
      `<div id="achievement-${badgeName}" class="achievement">
        <div class="text"><strong>Congratulations!</strong> You just unlocked a new badge!</div>
        <div class="icon-smiley"></div>
        <div class="ribbon"></div>
      </div>`
    )
    setTimeout(function() {
      $(`#achievement-${badgeName} .ribbon`).toggleClass("active");
      $(`#achievement-${badgeName} .icon-smiley`).toggleClass("active").addClass(badgeName);
      $(`#achievement-${badgeName}`).toggleClass("active");
      setTimeout(function() {
        $(`#achievement-${badgeName} .ribbon`).toggleClass("active");
        $(`#achievement-${badgeName} .icon-smiley`).toggleClass("active");
        $(`#achievement-${badgeName}`).toggleClass("active");
        setTimeout(function() {
          $(`#achievement-${badgeName}`).remove();
        }, 2000)
      }, 5000);
    }, 1000)
  },

  makeTutorial: function() {
    const popups = ['#info-tutorial-intro', '#info-tutorial-code', '#info-tutorial-check', '#info-tutorial-lifes', '#info-tutorial-nextlevel', '#info-tutorial-time', '#info-tutorial-badges'];
    const elements = ['#instructions', '#code', '#check', '#lives-indicator', '#next', '#time-indicator', '#badges-indicator'];
    let x = 0;

    function tutorial() {
      if(x == 0) {
        window.scrollTo(0, 0);
        $('#blur-screen').show();
      }

      if(x != 0) {
        $(popups[x - 1]).removeClass('show-tutorial');
        $(elements[x - 1]).removeClass('z-index-tutorial');
      }

      if(x > 6) {
        $('#blur-screen').hide();
        setTimeout(function() {
          x = 0;
        }, 2000);
      }
      $(popups[x]).addClass('show-tutorial');
      $(elements[x]).addClass('z-index-tutorial');
      x++;
    };
    return tutorial;
  }
};

$(document).ready(function() {
  game.start();
});
