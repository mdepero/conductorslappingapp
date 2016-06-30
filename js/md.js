// Markdown-Pad Extension
// ```js a=x b=y
// var a=1
// ```
//
// to
//
// <div class='jsblock' a=x b=y>
//   <pre class='jsinput'>
//     <code>
// var a=1
//     </code>
//   </pre>
//   <div class = 'jsresult'></div>
// </div>
//

(function(){
    var md = function(converter) {
        return [
            {
              type    : 'lang',
              filter  : function(text) {
                  text = text.replace(/(?:^|\n)```\{?\.?(js|yaml|emblem|slim|text) *(?:\n *#\:|\n *\\\:|\n *\/\/\:)? *([^\}\n]*)\}?\n([\s\S]*?)\n```/g,
                    function(wholeMatch,m1,m2,m3) {
                        var blockname = m1;
                        var extras = m2;
                        var codeblock = m3;
                        codeblock = codeblock.replace(/^\n+/g,""); // trim leading newlines
                        codeblock = codeblock.replace(/\n+$/g,""); // trim trailing whitespace

                        // add class="" if it's not there
                        if (!/class=/.test(extras)) extras = extras + ' class=""';
                        // add the class
                        extras = extras.replace(/(.*class=".*)(.*".*)/,"$1mdblock$2");
                        // add default run mode if it's not specified
                        if (!/run=/.test(extras)) extras = extras + ' run="' + (blockname == "js" ? "normal" : "init") + '"';
                        extras = extras + ' lang="' + blockname + '"';
                        codeblock = "<div " + extras + "><pre class='mdinput'><code>" +
                            codeblock + "\n</code></pre><div class = 'mdresult'></div></div>";

                        return codeblock;
                    }
                );
                return text;
              }
            },
            {
              type    : 'lang',
              filter  : function(text) {
                text = text.replace(/(\w[\w \t\-]*(\*)?)[ \t]*=[ \t]*___(\(.*\))?(\[\d+\])?/g, function(wholeMatch, lhs, required, value, size) {
	            	var cleaned = lhs.replace(/\*/g, '').trim().replace(/\t/g, ' ');
	            	var inputName = cleaned.replace(/[ \t]/g, '-'); // convert spaces to hyphens
	            	value = value ? value.replace(/\(/, "").replace(/\)/, "") : "";
	            	return '<input type="text" name="' + inputName +  '" size="' + size + '" value="' + value + '"/>';
	            });
                return text;
              }
            }
        ];
    };

    // Client-side export
    if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) { window.Showdown.extensions.md = md; }
    // Server-side export
    if (typeof module !== 'undefined') module.exports = md;
}());
