function search(request, sender, sendResponse) {

  var regex = new RegExp(request.regex , request.flags);
  var matches = [];
  var content = document.body.innerHTML;
  var match;

  // if its global means we have more than one result, we need to loop
  if ( regex.flags.includes("g") ){
    while (match = regex.exec(content)) {
      matches.push(formatTemplate(match , request.template));
    }
  } else {
    match = regex.exec(content);
    matches.push( formatTemplate(match ,  request.template) );
  }
  // send response to popup script
  sendResponse({results: matches });
  browser.runtime.onMessage.removeListener(search);

}
browser.runtime.onMessage.addListener(search);


// a function to use the provided template
function formatTemplate(match , template){
  if (template == ""){
    return match[0];
  }
  // replace every \d or $d with match[d] , its index in the match groups , \n or $n adds a new line :D
  return template.replace(/(\$|\\)(\d+|n)/gi , replacer );

  function replacer(x){
    if (x[1] == 'n'){
      return "\n";
    }else {
      return match[ x[1] ];
    }
  }
}