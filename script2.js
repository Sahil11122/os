function calculate() {
  var numPages = parseInt(document.getElementById("num-pages").value);
  var pagesString = document.getElementById("pages").value;
  var pages = pagesString.split(',').map(Number);
  var capacity = parseInt(document.getElementById("capacity").value);

  var pageFaults = 0;
  var pageHits = 0;
  var frameSet = new Set();
  var frameQueue = [];

  var outputContainer = document.getElementById("output");
  outputContainer.innerHTML = ""; // Clear previous output

  // Process pages and track hits and misses
  var output = "<p><strong>Page&nbsp;&nbsp;&nbsp;&nbsp;Status</strong></p>";
  for (var i = 0; i < numPages; ++i) {
      var page = pages[i];
      output += "<p>" + page + "&nbsp;&nbsp;&nbsp;&nbsp;";

      // If page is not present in frame, add it and increment pageFaults
      if (!frameSet.has(page)) {
          pageFaults++;

          // If frames are full, determine the page to replace based on future references
          if (frameQueue.length === capacity) {
              var idxToRemove = -1;
              var farthest = -1;
              for (var j = 0; j < frameQueue.length; ++j) {
                  var nextPageIdx = i + 1;
                  while (nextPageIdx < numPages && pages[nextPageIdx] !== frameQueue[j]) {
                      nextPageIdx++;
                  }
                  if (nextPageIdx === numPages) {
                      idxToRemove = j;
                      break;
                  }
                  if (nextPageIdx > farthest) {
                      farthest = nextPageIdx;
                      idxToRemove = j;
                  }
              }
              frameSet.delete(frameQueue[idxToRemove]);
              frameQueue[idxToRemove] = page;
          } else {
              // If frames are not full, simply add the new page
              frameQueue.push(page);
          }
          frameSet.add(page);
          output += "MISS</p>";
      } else {
          // If page is present in frame, update its frequency
          pageHits++;
          output += "HIT</p>";
      }
  }

  // Calculate ratios
  var hitRatio = (pageHits / numPages).toFixed(2);
  var missRatio = (pageFaults / numPages).toFixed(2);

  // Display results
  output += "<p><strong>Number of hits:</strong> " + pageHits + "</p>";
  output += "<p><strong>Number of misses:</strong> " + pageFaults + "</p>";
  output += "<p><strong>Hit ratio:</strong> " + hitRatio + "</p>";
  output += "<p><strong>Miss ratio:</strong> " + missRatio + "</p>";

  outputContainer.innerHTML = output;
}
