// Set the default state for sections on page load
const is_collapsed = true;

// Inject styles programmatically
const style = document.createElement("style");
style.textContent = `
.collapsible-content {
  display: ${is_collapsed ? "none" : "block"};
}
.collapsible-header {
  cursor: pointer;
  position: relative;
}
.collapsible-header::before {
  content: "${is_collapsed ? "▶" : "▼"}";
  font-size: 70%;
  position: absolute;
  left: -1.25em;
  opacity: 0;
  transition: opacity 0.3s;
}
.collapsible-header:hover::before {
  opacity: 1;
}
.collapsible-header.expanded::before {
  content: "▼";
}
.toc button {
  margin-top: 1.5em;
  border-radius: 5px;
  background: none;
  border: 1px solid #aaa;
  outline: none;
  box-shadow: none;
  cursor: pointer;
  padding: 3px 10px;
}
.toc button:hover {
  color: var(--color-yellow-120);
}
`;

document.head.appendChild(style);
function onDOMReady() {
  const headers = document.querySelectorAll(".content-markdown h2");
  headers.forEach((header) => {
    header.classList.add("collapsible-header", is_collapsed ? "collapsed" : "expanded");
    let content = header.nextElementSibling;
    let nextHeader = getNextHeaderOrSibling(header);
    while (content && content !== nextHeader) {
      content.classList.add("collapsible-content");
      content.style.display = is_collapsed ? "none" : "block";
      content = content.nextElementSibling;
    }
    header.addEventListener("click", () => {
      let sibling = header.nextElementSibling;
      let nextSibling = getNextHeaderOrSibling(header);
      while (sibling && sibling !== nextSibling) {
        toggleCollapse(header, sibling);
        sibling = sibling.nextElementSibling;
      }
    });
  });
  if(location.hash) {
    const header = document.querySelector(location.hash);
    if(header.tagName === "H2") {
      let sibling = header.nextElementSibling;
      let nextSibling = getNextHeaderOrSibling(header);
      while (sibling && sibling !== nextSibling) {
        openCollapse(header, sibling);
        sibling = sibling.nextElementSibling;
      }
    } else {
      let previousHeader = getPreviousSibling(header, "h2")
      if(previousHeader) {
        let sibling = previousHeader.nextElementSibling;
        let nextSibling = getNextHeaderOrSibling(previousHeader);
        while (sibling && sibling !== nextSibling) {
          openCollapse(previousHeader, sibling);
          sibling = sibling.nextElementSibling;
        }
      }
    }
  }

  window.addEventListener("hashchange", () => {
    const header = document.querySelector(location.hash);
    if (header.tagName === "H2") {
      let sibling = header.nextElementSibling;
      let nextSibling = getNextHeaderOrSibling(header);
      while (sibling && sibling !== nextSibling) {
        openCollapse(header, sibling);
        sibling = sibling.nextElementSibling;
      }
    }
  });
  const collapseExpandBtn = document.createElement("button");
  collapseExpandBtn.textContent = is_collapsed ? "Expand All": "Collapse All";
  const toc = document.querySelector(".content-grid .toc");
  toc.appendChild(collapseExpandBtn);
  let allExpanded = !is_collapsed;
  collapseExpandBtn.addEventListener("click", () => {
    if (allExpanded) {
      collapseExpandBtn.textContent = 'Expand All';
    }
    else {
      collapseExpandBtn.textContent = 'Collapse All';
    }
    allExpanded = !allExpanded;
    headers.forEach((header) => {
      let sibling = header.nextElementSibling;
      let nextSibling = getNextHeaderOrSibling(header);
      while (sibling && sibling !== nextSibling) {
        if (allExpanded) {
          sibling.style.display = "block";
          header.classList.remove("collapsed");
          header.classList.add("expanded");
        } else {
          sibling.style.display = "none";
          header.classList.remove("expanded");
          header.classList.add("collapsed");
        }
        sibling = sibling.nextElementSibling;
      }
    });
  });
}
function openCollapse(header, content) {
  content.style.display = "block";
  header.classList.remove("collapsed");
  header.classList.add("expanded");
}
function toggleCollapse(header, content) {
  if (content.style.display === "none") {
    content.style.display = "block";
    header.classList.remove("collapsed");
    header.classList.add("expanded");
  } else {
    content.style.display = "none";
    header.classList.remove("expanded");
    header.classList.add("collapsed");
  }
}
function getNextHeaderOrSibling(element) {
  while (element.nextElementSibling && element.nextElementSibling.tagName !== "H2") {
    element = element.nextElementSibling;
  }
  return element.nextElementSibling;
}
function getPreviousSibling(elem, selector) {

	// Get the next sibling element
	var sibling = elem.previousElementSibling;

	// If there's no selector, return the first sibling
	if (!selector) return sibling;

	// If the sibling matches our selector, use it
	// If not, jump to the next sibling and continue the loop
	while (sibling) {
		if (sibling.matches(selector)) return sibling;
		sibling = sibling.previousElementSibling;
	}

};
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", onDOMReady);
} else {
  onDOMReady();
}