function calculate() {
  var numPages = parseInt(document.getElementById("num-pages").value);
  var pagesString = document.getElementById("pages").value;
  var pages = pagesString.split(',').map(Number);
  var capacity = parseInt(document.getElementById("capacity").value);

  var pageFaults = 0;
  var pageHits = 0;
  var pageFrequency = new Map();
  var pageLastUsed = new Map();
  var frequencyPages = new Map();
  var frameSet = new Set();

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

          // If frames are full, remove the least frequently used page
          if (frameSet.size === capacity) {
              var leastFreq = Array.from(frequencyPages.keys())[0];
              var pageToRemove = Array.from(frequencyPages.get(leastFreq))[0];
              frameSet.delete(pageToRemove);
              frequencyPages.get(leastFreq).delete(pageToRemove);
              if (frequencyPages.get(leastFreq).size === 0) {
                  frequencyPages.delete(leastFreq);
              }
              pageFrequency.delete(pageToRemove);
              pageLastUsed.delete(pageToRemove);
          }

          // Add the new page to the frame
          frameSet.add(page);
          pageFrequency.set(page, (pageFrequency.get(page) || 0) + 1);
          pageLastUsed.set(page, i);
          if (!frequencyPages.has(pageFrequency.get(page))) {
              frequencyPages.set(pageFrequency.get(page), new Set());
          }
          frequencyPages.get(pageFrequency.get(page)).add(page);
          output += "MISS</p>";
      } else {
          // If page is present in frame, update its frequency
          pageHits++;
          pageFrequency.set(page, pageFrequency.get(page) + 1);
          frequencyPages.get(pageFrequency.get(page) - 1).delete(page);
          if (frequencyPages.get(pageFrequency.get(page) - 1).size === 0) {
              frequencyPages.delete(pageFrequency.get(page) - 1);
          }
          if (!frequencyPages.has(pageFrequency.get(page))) {
              frequencyPages.set(pageFrequency.get(page), new Set());
          }
          frequencyPages.get(pageFrequency.get(page)).add(page);
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
