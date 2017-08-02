const blogModule = (() => {
  // PRIVATE VARIABLES
  let _blogContainer,
      _useIsotope,
      _response

  // AJAX Call
  const _fetchData = (src, callback) => {
    let data = new XMLHttpRequest()
    data.open('GET', src, true)
    data.send()
    data.addEventListener('readystatechange', processRequest, false)
    function processRequest (e) {
      if (data.readyState === 4 && data.status === 200) {
        callback(JSON.parse(data.responseText))
      }
    }
  }

  // Blog post template
  const _buildPost = (title, date, author, views, content, img) => (
    '<article class="grid-item transition">' +
    '<h3>' + title + '</h3>' +
    '<ul class="tags"><li class="date">' + date + '</li>' +
    '<li class="author">' + author + '</li>' +
    '<li class="views">views: ' + views + '</li></ul>' +
    '<img src=' + img + ' class="blogImg" />' +
    '<p>' + content + '</p>' +
    '</article>'
  )

  const _populateBlog = data => {
    // Sort responseText by date & make available to entire module
    _response = data

    let postTemplate = ''
    for (let i = 0; i < _response.length; i++) {
      let author = _response[i].first_name + ' ' + _response[i].last_name
      postTemplate += _buildPost(_response[i].title, _response[i].date_created, author, _response[i].views, _response[i].content, _response[i].image)
    }
    _blogContainer.innerHTML = postTemplate
    if (_useIsotope) {
      _initIsotope()
    }
  }

  // Init Isotope Library
  const _initIsotope = function () {
    // Isotope VARIABLES
    let $container,
        iso,
        qsRegex,
        globalSortBy,
        globalSortAscending

    $container = $(_blogContainer)

    // Prevent layout issues by waiting for blog images to load
    $container.imagesLoaded(() => {
      globalSortBy = 'date'
      globalSortAscending = false
      iso = new Isotope(_blogContainer, {
        itemSelector: '.grid-item',
        filter: function () {
          return qsRegex ? $(this).text().match(qsRegex) : true
        },
        getSortData: {
          date: '.date',
          author: '.author',
          views: '.views'
        },
        sortBy: globalSortBy,
        sortAscending: globalSortAscending
      })

      // Bind sort button click
      $('#sorts').on('click', 'button', function () {
        globalSortBy = $(this).attr('data-sort-value')
        iso.arrange({
          sortBy: globalSortBy,
          globalSortAscending: globalSortAscending

        })
        $('.sortBy').removeClass('active')
        $(this).addClass('active')
      })

      // Ascending Descending toggle
      let btnCount = 0
      $('#direction').on('click', 'button', function () {
        console.log('START: globalSortAscending: ' + globalSortAscending)
        let newGlobalSortAscending = $(this).attr('data-option-value')
        console.log('newGlobalSortAscending: ' + newGlobalSortAscending)
        if (globalSortAscending !== newGlobalSortAscending) {
          console.log('New sort direction detected')
          iso.arrange({
            sortBy: globalSortBy,
            sortAscending: newGlobalSortAscending
          })
          globalSortAscending = newGlobalSortAscending
        } else {
          console.log('Already sorted')
        }
        console.log('END: globalSortAscending: ' + globalSortAscending)

        $('.sortDirection').removeClass('active')
        $(this).addClass('active')
      })

      // Debounce so filtering doesn't happen every millisecond
      const debounce = (fn, threshold) => {
        let timeout
        return function debounced () {
          if (timeout) {
            clearTimeout(timeout)
          }
          const delayed = () => {
            fn()
            timeout = null
          }
          timeout = setTimeout(delayed, threshold || 100)
        }
      }

      //Searh Box
      let $quicksearch = $('.quicksearch').keyup(debounce(function () {
        qsRegex = new RegExp($quicksearch.val(), 'gi')
        iso.arrange()
      }, 200))

      // Add active class to default sort buttons
      $('.sortBy[data-sort-value=' + globalSortBy + ']').addClass('active')
      $('.sortDirection[data-option-value=' + globalSortAscending + ']').addClass('active')
    })
  }

  // PUBLIC METHODS
  const getBlog = (blogWrapper, jsonURL, useIsotope) => {
    _blogContainer = document.getElementById(blogWrapper)
    _fetchData(jsonURL, _populateBlog)
    _useIsotope = useIsotope
  }

  // Expose public methods
  return {
    getBlog: getBlog
  }
})()
