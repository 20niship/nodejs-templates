var http = require('http');

const ogs = require('open-graph-scraper');



const createLinkCard = async (targetUrl, shortenURL=false) => {
  console.log("aaaaaa");
  console.log(targetUrl);

  const ogResult = await ogs({ url: targetUrl, timeout: 1000 });
  if(ogResult.error){
    return `<a href=\"${targetUrl}\">${targetUrl}</a> `
  }

  const result = ogResult.result;

  // console.log(result)
  console.log("bbbb");

  const parsedUrl = new URL(targetUrl);

  const data = {
    title       : (result && result.ogTitle) || parsedUrl.hostname,
    description : (result && result.ogDescription) || '',
    faviconSrc  : `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}`,
    ogImageSrc  : result && result.ogImage && result.ogImage.url || "",
    ogImageAlt  : result && result.ogImage && result.ogImage.alt || ((result && result.ogTitle) || parsedUrl.hostname),
    displayUrl  : decodeURI(shortenURL ? parsedUrl.hostname : targetUrl),
    url: targetUrl,
  };

  console.log(data)

  const faviconElement = data.faviconSrc
    ? `<img class="rlc-favicon" src="${data.faviconSrc}" alt="${data.title} favicon" width="16" height="16">`.trim()
    : '';

  // create description element
  const descriptionElement = data.description
    ? `<div class="rlc-description">${data.description}</div>`
    : '';

  // create image element
  const imageElement = data.ogImageSrc
    ? `<div class="rlc-image-container">
      <img class="rlc-image" src="${data.ogImageSrc}" alt="${data.ogImageAlt}" />
    </div>`.trim()
    : '';

  // create output HTML
  const outputHTML = `
      <a class="rlc-container" href="${data.url}">
        <div class="rlc-info">
          <div class="rlc-title">${data.title}</div>
          ${descriptionElement}
          <div class="rlc-url-container">
            ${faviconElement}
            <span class="rlc-url">${data.displayUrl}</span>
          </div>
        </div>
        ${imageElement}
      </a>
      `.trim();

  return outputHTML;
};

const hoge = async () => {
  const html = await createLinkCard("https://shizenkarasuzon.hatenablog.com/entry/2021/08/05/134110");
  console.log(html);
}

hoge()

