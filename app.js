function redirect(url) {
  url = sanitizeURL(url)
  window.location.href = url
}

function execute(script) {
  setBodyClasses(true, false)
  eval(script)
}

function display(src) {
  setBodyClasses(false, true)
  src = sanitizeURL(src)
  let el = document.createElement("iframe")
  el.src = src
  document.body.appendChild(el)
}

function setBodyHTML(html) {
  document.body.innerHTML = html
  document.querySelectorAll("body script").forEach(script => eval(script.text))
}

function setBodyText(text) {
  setBodyClasses(true, false)
  document.body.innerText = text
}

async function copyTextToClipboard(text) {
  try {
    await copyToClipboard(text)
    setTimeout(closeTab, 100)
  } catch (e) {
    if (query("textarea#text")) {
      alert("Copy failed. Please copy the text manually.")
      document.body.removeChild(query("input#copybutton"))
      query("p#t1").innerText = "Could not copy text to clipboard."
      query("p#t2").innerText = "Please copy the text manually."
      while (query("body br")) document.body.removeChild(query("body br"))
      query("textarea#text").focus()
      return
    }
    let html = "<p id=t1>Could not automatically copy text to clipboard.</p>"
    html += "<p id=t2>Click the button to try again, or manually copy the text below</p>"
    html += "<input id=copybutton type=button value=\"Copy to clipboard\" onclick=\"copyTextToClipboard(query('textarea#text').value)\"><br><br>"
    html += "<textarea id=text></textarea>"
    setBodyHTML(html)
    query("textarea#text").value = text
  }
}

function redirectGenerate() {
  window.location.href = "generate"
}

function setBodyClasses(black, margin) {
  document.body.classList[black ? "add" : "remove"]("black")
  document.body.classList[margin ? "add" : "remove"]("margin")
}

function sanitizeURL(url) {
  if (!url.includes("://")) {
    url = "https://" + url
  }
  return url
}

function closeTab() {
  window.close()
}

function process() {
  var type = getparam("t")
  var data = getparam("d")
  var title = getparam("h")

  if (data == null) {
    redirectGenerate()
    return
  }

  if (type.endsWith("b")) {
    data = atob(data)
    type = type.substring(0, type.length - 1)
    title = title ? title : "" //convert null to empty string
    title = atob(title)
  }

  if (title) {
    document.title = title
  }

  switch (type) {
    case "r":
      redirect(data)
      break
    case "s":
      execute(data)
      break
    case "i":
      display(data)
      break
    case "t":
      setBodyText(data)
      break
    case "h":
      setBodyHTML(data)
      break
    case "c":
      copyTextToClipboard(data)
      break
    default:
      redirectGenerate()
      return
  }
}

process()
