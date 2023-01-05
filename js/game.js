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
  levelMiliseconds: 0,
  pageStartTimes: (localStorage.pageStartTimes && JSON.parse(localStorage.pageStartTimes)) || {},
  pageEndTimes: (localStorage.pageEndTimes && JSON.parse(localStorage.pageEndTimes)) || {},
  pageTimes: (localStorage.pageTimes && JSON.parse(localStorage.pageTimes)) || {},
  levelTimes: (localStorage.levelTimes && JSON.parse(localStorage.levelTimes)) || {},
  // additions
  attempts: (localStorage.attempts && JSON.parse(localStorage.attempts)) || {},
  points: (localStorage.points && JSON.parse(localStorage.points)) || {},
  //original
  colorblind: (localStorage.colorblind && JSON.parse(localStorage.colorblind)) || 'false',
  language: window.location.hash.substring(1) || 'en',
  difficulty: 'easy',
  level: parseInt(localStorage.level, 10) || 0,
  answers: (localStorage.answers && JSON.parse(localStorage.answers)) || {},
  solved: (localStorage.solved && JSON.parse(localStorage.solved)) || [],
  user: localStorage.user || '',
  changed: false,
  clickedCode: null,

  start: function() {
    // navigator.language can include '-'
    // ref: https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/language
    var requestLang = window.navigator.language.split('-')[0];
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

    if (!localStorage.user) {
      game.user = '' + (new Date()).getTime() + Math.random().toString(36).slice(1);
      localStorage.setItem('user', game.user);
    }
    this.setHandlers();
    this.loadMenu();
    game.loadLevel(levels[game.level]);
  },

  // set event handerls
  setHandlers: function() {
    $('#start').on('click', function() {
      var level = levels[game.level];
      game.levelMiliseconds = level.maxTime * 1000;
      game.intervalId == -1 && game.levelStartTimer();
    });

    $('.pause').on('click', function() {
      game.intervalId != -1 ? game.levelEndTimer() : game.levelStartTimer();
    });

    $('#check').on('click', function() {
      game.makeAttempt()
      game.check();
      if ($('#next').hasClass('disabled')) {
        if (!$('.frog').hasClass('animated')) {
          game.tryagain();
        }
        return;
      }
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

      var level = levels[game.level];
      game.pageEndTimes[level.name] = new Date();
      game.pageTimes[level.name] = game.pageEndTimes[level.name] - game.pageStartTimes[level.name]
      $(this).removeClass('animated animation'); 
      $('.frog').addClass('animated bounceOutUp');
      $('#next').addClass('disabled');

      setTimeout(function() {
        if (game.level >= levels.length - 1) {
          game.win();
        } else {
          game.next();
        }
      }, 2000);
    });

    // press enter -> next button in code field -> next level
    $('#code').on('keydown', function(e) {
      if (e.keyCode === 13) {

        if (e.ctrlKey || e.metaKey) {
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

          if (codeLength === trimLength) {
            e.preventDefault();
            $('#next').click();
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
        game.level = 0;
        game.answers = {};
        game.solved = [];
        // additions
        game.intervalId = null;
        game.levelMiliseconds = 0;
        game.pageStartTimes = {};
        game.pageEndTimes = {};
        game.pageTimes = {};
        game.levelTimes = {};
        game.attempts = {};
        game.points = {};

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
      localStorage.setItem('level', game.level);
      localStorage.setItem('answers', JSON.stringify(game.answers));
      localStorage.setItem('solved', JSON.stringify(game.solved));
      localStorage.setItem('colorblind', JSON.stringify(game.colorblind));
      // additional
      localStorage.setItem('points', JSON.stringify(game.points));
      localStorage.setItem('attempts', JSON.stringify(game.attempts));
      localStorage.setItem('levelTimes', JSON.stringify(game.levelTimes));
      localStorage.setItem('pageTimes', JSON.stringify(game.pageTimes));
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

  // navigate to previous level
  prev: function() {
    this.level--;

    var levelData = levels[this.level];
    this.loadLevel(levelData);
  },

  // navigate to next level
  next: function() {
    if (this.difficulty === "hard") {
      this.level = Math.floor(Math.random()* levels.length)
    } else {
      this.level++
    }

    var levelData = levels[this.level];
    this.loadLevel(levelData);
    game.levelMiliseconds = 0;
  },

  // load level menu
  loadMenu: function() {
    levels.forEach(function(level, i) {
      var levelMarker = $('<span/>').addClass('level-marker').attr({'data-level': i, 'title': level.name}).text(i+1);

      if ($.inArray(level.name, game.solved) !== -1) {
        levelMarker.addClass('solved');
      }

      levelMarker.appendTo('#levels');
    });

    // save answer when clicking on level in level menu and load clicked level
    $('.level-marker').on('click', function() {
      game.saveAnswer();

      var level = $(this).attr('data-level');
      game.level = parseInt(level, 10);
      game.loadLevel(levels[level]);
    });

    // open or close level menu when clicking on level indicator/ heading
    $('#level-indicator').on('click', function() {
      $('#settings .tooltip').hide();
      $('#levelsWrapper').toggle();
      $('#instructions .tooltip').remove();
    });
  },

  // load and set up level
  loadLevel: function(level) {
    $('#editor').show();
    $('#share').hide();
    $('#background, #pond').removeClass('wrap').attr('style', '').empty();
    $('#levelsWrapper').hide();
    $('.level-marker').removeClass('current').eq(this.level).addClass('current');
    $('#level-counter .current').text(this.level + 1);
    $('#before').text(level.before);
    $('#after').text(level.after);
    $('#next').removeClass('animated animation').addClass('disabled');
    $('#code').attr('disabled', false)
    $('#pause').removeClass('disabled');

    // load instructions
    var instructions = level.instructions[game.language] || level.instructions.en;
    $('#instructions').html(instructions);

    // get answer if any and set focus on answer input
    var answer = game.answers[level.name];
    $('#code').val(answer).focus();

    // get points if any
    var level = levels[game.level];
    $('#points').html(game.totalPoints())
    if (game.levelTimes[level.name]) {
      game.levelMiliseconds = game.levelTimes[level.name];
      this.setTimer(game.levelMiliseconds);
    };


    this.loadDocs();

    var lines = Object.keys(level.style).length;
    $('#code').height(20 * lines).data("lines", lines);

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
    }

    // add classes for levels
    var classes = level.classes;

    if (classes) {
      for (var rule in classes) {
        $(rule).addClass(classes[rule]);
      }
    }

    var selector = level.selector || '';
    $('#background ' + selector).css(level.style);

    game.changed = false;
    game.applyStyles();
    game.check();

    var level = levels[this.level];
    if (!game.pageStartTimes[level.name]) {
      game.pageStartTimes[level.name] = new Date();
    }

    if ($.inArray(level.name, game.solved) !== -1) {
      $('#next').addClass('animated animation').removeClass('disabled');
      $('#check').addClass('disabled');
      $('#code').attr('disabled', true)
      $('#pause').addClass('disabled');
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
            game.writeCSS(pName, pValue)

            game.check();
          });
          game.clickedCode = code;
        });
      }
    });
  },

  // apply styles to elements (level setup)
  applyStyles: function() {
    var level = levels[game.level];
    var code = $('#code').val();
    var selector = level.selector || '';
    $('#pond ' +  selector).attr('style', code);
    game.saveAnswer();
  },

  // check if level successfully solved
  check: function() {
    game.applyStyles();

    var level = levels[game.level];
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

    // if correct true -> level solved
    if (correct) {
      game.levelEndTimer();
      $('#pause').addClass('disabled');

      ga('send', {
        hitType: 'event',
        eventCategory: level.name,
        eventAction: 'correct',
        eventLabel: $('#code').val()
      });

      // if level not previously solved, save in solved array
      if ($.inArray(level.name, game.solved) === -1) {
        game.solved.push(level.name);
        game.savePoints();
        game.saveLevelTime();
      }

      $('[data-level=' + game.level + ']').addClass('solved');
      $('#next').removeClass('disabled').addClass('animated animation');
      $('#check').addClass('disabled')

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

  savePoints: function() {
    var level = levels[this.level];
    let pointsTemp = level.maxPoints;
    const timePoints = function() {
      let timePointsTemp = pointsTemp/2;
      let elapsedTimeSeconds = game.levelMiliseconds/ 1000;
      if(elapsedTimeSeconds < level.maxTimeIntervals[0]) {
        return timePointsTemp
      } else if (elapsedTimeSeconds > level.maxTimeIntervals[0] && elapsedTimeSeconds < level.maxTimeIntervals[1]) {
        return timePointsTemp*0.75;
      } else if (elapsedTimeSeconds > level.maxTimeIntervals[1] && elapsedTimeSeconds < level.maxTimeIntervals[2]) {
        return timePointsTemp*0.5;
      } else if (elapsedTimeSeconds > level.maxTimeIntervals[2] && elapsedTimeSeconds < level.maxTimeIntervals[3]) {
        return timePointsTemp*0.25;
      } else {
        return 0;
      };
    }
    const attemptsPoints = function() {
      let attemptsPointsTemp = pointsTemp/2;
      let attemptsTemp = game.attempts[level.name];
      if(attemptsTemp < 5) {
        return attemptsPointsTemp/(attemptsTemp%5)
      } else {
        return 0;
      }
    }
    const totalLevelPoints = timePoints() + attemptsPoints();
    game.points[level.name] = Math.floor(totalLevelPoints*10)/10;
    $('#points').html(game.totalPoints())
  },

  totalPoints: function() {
    return Object.values(game.points).reduce((a, b) => a + b, 0);
  },

  // save answer in array
  saveAnswer: function() {
    var level = levels[this.level];
    game.answers[level.name] = $('#code').val();
  },

  makeAttempt: function() {
    var level = levels[this.level];
    game.attempts[level.name] = game.attempts[level.name] && (game.attempts[level.name] + 1) || 1;
  },

  levelStartTimer: function() {
    var level = levels[this.level];

    if ($.inArray(level.name, game.solved) === -1) {
      game.intervalId = setInterval(game.timeCounting, 10);
      $('#code').attr('disabled', false);
      $('#check').removeClass('disabled');
      $('#pause').removeClass('disabled');
      $('#pause-screen').addClass('d-none');
      $('#start-screen').addClass('d-none');

    }
  },

  levelEndTimer: function() {
    var level = levels[this.level];
    if ($.inArray(level.name, game.solved) === -1) {
      game.intervalId && clearInterval(game.intervalId);
      game.intervalId = -1;
      $('#code').attr('disabled', true);
      $('#check').addClass('disabled');
      $('#pause').addClass('disabled');
      $('#pause-screen').removeClass('d-none');
    }
    return;
  },

  saveLevelTime: function() {
    var level = levels[this.level];
    game.levelTimes[level.name] = game.levelMiliseconds;
    game.levelStartTime = null;
    game.levelEndTime = null;
  },

  // shake code field if wrong answer
  tryagain: function() {
    $('#editor').addClass('animated shake');
  },

  // when all game levels solved
  win: function() {
    var solution = $('#code').val();

    this.loadLevel(levelWin);

    $('#editor').hide();
    $('#code').val(solution);
    $('#share').show();
    $('.frog .bg').removeClass('pulse').addClass('bounce');

    // save to database
    db.collection("games").add({
      points: game.points,
      attempts: game.attempts,
      levelTimes: game.levelTimes,
      pageTimes: game.pageTimes
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
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
      game.setTimer(game.levelMiliseconds);
    } else {
      game.levelEndTimer()
    }
  },

  setTimer: function(timeElapsed) {
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
  }
};

$(document).ready(function() {
  game.start();
});
