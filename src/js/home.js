// Wait for the dom to load
$(document).ready(function() {
  // Cache DOM elements that are accessed multiple times
  var mainNav = $("#main-nav"),
      titleSVG; // Assigned at later point

  // Javascript is enabled. Conver static title to animated one.
  convertTitleToSVG();
  // Cache title svg element now that it has been created
  titleSVG = $("#title-svg");
  // Initial component sizing
  resizeComponents();

  // On window resize
  $(window).on("resize", function() {
    resizeComponents();
  });

  // ########### CUSTOM FUNCTIONS ###########

  // Size the various components for the window width/height
  function resizeComponents() {
    // Fit the title to the height
    fitTitle();
  }

  // Removes the original static title and replaces it with an animated SVG
  // title
  function convertTitleToSVG() {
    // Create the title-svg-container
    var titleContainer = $("<svg id='title-svg-container' xmlns='http://www.w3.org/2000/svg' onclick=\"location.href='about'\"></svg>");
    // Create the initial svg object for the title
    titleSVG = $("<text id='title-svg' text-anchor='middle'dominant-baseline='central'>Brian Schmoker</text>");

    // Remove the original title-container. We no longer need it.
    $("#title-container").remove();
    // Transform the main navigation panes to accompany the repositioning of
    // the title
    mainNav.css("top", "auto");
    mainNav.css("right", "0");
    mainNav.css("width", "95%");
    mainNav.css("height", "100%");

    // Append the title to its container to create one dom element
    $(titleContainer).append(titleSVG);
    // Convert our SVG xml into a DOM tree
    var parser = new DOMParser();
    var parsed = parser.parseFromString($(titleContainer)[0].outerHTML, "image/svg+xml");
    // Prepend our SVG DOM tree to the body
    $("body").prepend(parsed.documentElement);
  }

  // Fit the title text to the size of the document
  function fitTitle() {
    // Rotate the title text so that it's vertical and place it in the
    // middle of the title-svg-container
    titleSVG.attr("transform", "translate(" + ($(document).width()*.05)/2 + ", " + $(document).height()/2 + ") rotate(270)");

    // TODO: [5] See if the dynamic title sizing can be made cleaner
    // Resize the title text as a function of the document width
    var titleFontSize = $(document).width()/400;
    titleSVG.css("font-size", titleFontSize + "em");
    // Get the approximate length of the title based on the font size
    var titleTextInitialWidth = titleFontSize*110;
    // Space the title letters so that they mostly fill the height
    titleSVG.attr("letter-spacing", ($(document).height()-titleTextInitialWidth)/15);
  }
});
