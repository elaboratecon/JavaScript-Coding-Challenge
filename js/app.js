$(() => {

  // HTML - LOAD ORDER FOR JAVASCRIPT:
  // 1. jQuery
  // 2. bootstrap
  // 3. Isotope Pkgs *optional*
  // 4. blogModule
  // 5. app.js

  // blogModule - API PARAMETERS:
  // 1. Blog container element ID
  // 2. Blog data source (JSON URL)
  // 3. Utilize Isotope JS Library (true or false)

  blogModule.getBlog('grid', 'data.json', true)
})
