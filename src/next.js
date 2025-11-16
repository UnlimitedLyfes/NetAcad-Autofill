/**
 * get next element
 * @returns {Element}
 */
function getNext(){
  const beforeShadow = [
      'app-root',
      'page-view',
      'article-view[adaptive="true"]',
      'assessment-toolbar-view'
  ]; 
  const shadow = beforeShadow.reduce((a, v) => {
      return a.querySelector(v).shadowRoot;
  }, document);
  const next = shadow.getElementById('next') ?? shadow.querySelector('.submit');
  return next
}

window.getNext = getNext;