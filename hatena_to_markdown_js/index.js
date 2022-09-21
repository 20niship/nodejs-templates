const fs = require('fs');

const unicode_types ={"&gt;":">", "&lt;":"<", "&amp;":"&",
                "&#x3042;":"あ", "&#x3044;":"い", "&#x3046;":"う", "&#x3048;":"え", "&#x304A;":"お", "&#x304B;":"か", "&#x304C;":"が", "&#x304D;":"き", "&#x304E;":"ぎ", "&#x304F;":"く",
                "&#x3050;":"ぐ", "&#x3051;":"け", "&#x3052;":"げ", "&#x3053;":"こ", "&#x3054;":"ご", "&#x3055;":"さ", "&#x3056;":"ざ", "&#x3057;":"し", "&#x3058;":"じ", "&#x3059;":"す",
                "&#x305A;":"ず", "&#x305B;":"せ", "&#x305C;":"ぜ", "&#x305D;":"そ", "&#x305E;":"ぞ", "&#x305F;":"た", "&#x3060;":"だ", "&#x3061;":"ち", "&#x3062;":"ぢ", "&#x3063;":"っ",
                "&#x3064;":"つ", "&#x3065;":"づ", "&#x3066;":"て", "&#x3067;":"で", "&#x3068;":"と", "&#x3069;":"ど", "&#x306A;":"な", "&#x306B;":"に", "&#x306C;":"ぬ", "&#x306D;":"ね",
                "&#x306E;":"の", "&#x306F;":"は", "&#x3070;":"ば", "&#x3071;":"ぱ", "&#x3072;":"ひ", "&#x3073;":"び", "&#x3074;":"ぴ", "&#x3075;":"ふ", "&#x3076;":"ぶ", "&#x3077;":"ぷ",
                "&#x3078;":"へ", "&#x3079;":"べ", "&#x307A;":"ぺ", "&#x307B;":"ほ", "&#x307C;":"ぼ", "&#x307D;":"ぽ", "&#x307E;":"ま", "&#x307F;":"み", "&#x3080;":"む", "&#x3081;":"め",
                "&#x3082;":"も", "&#x3083;":"ゃ", "&#x3084;":"や", "&#x3085;":"ゅ", "&#x3086;":"ゆ", "&#x3087;":"ょ", "&#x3088;":"よ", "&#x3089;":"ら", "&#x308A;":"り", "&#x308B;":"る",
                "&#x308C;":"れ", "&#x308D;":"ろ", "&#x308E;":"ゎ", "&#x308F;":"わ", "&#x3090;":"ゐ", "&#x3091;":"ゑ", "&#x3092;":"を", "&#x3093;":"ん", "&#x3094;":"ゔ", "&#x3095;":"ゕ",
                "&#x3096;":"ゖ", "&#x30C6;":"テ", "&#x30C7;":"デ", "&#x30C8;":"ト", "&#x30C9;":"ド", "&#x30CA;":"ナ", "&#x30CB;":"ニ", "&#x30CC;":"ヌ", "&#x30CD;":"ネ", "&#x30CE;":"ノ",
                "&#x30CF;":"ハ", "&#x30D0;":"バ", "&#x30D1;":"パ", "&#x30D2;":"ヒ", "&#x30D3;":"ビ", "&#x30D4;":"ピ", "&#x30D5;":"フ", "&#x30D6;":"ブ", "&#x30D7;":"プ", "&#x30D8;":"ヘ",
                "&#x30D9;":"ベ", "&#x30DA;":"ペ", "&#x30DB;":"ホ", "&#x30DC;":"ボ", "&#x30DD;":"ポ", "&#x30DE;":"マ", "&#x30DF;":"ミ", "&#x30E0;":"ム", "&#x30E1;":"メ", "&#x30E2;":"モ",
                "&#x30E3;":"ャ", "&#x30E4;":"ヤ", "&#x30E5;":"ュ", "&#x30E6;":"ユ", "&#x30E7;":"ョ", "&#x30E8;":"ヨ", "&#x30E9;":"ラ", "&#x30EA;":"リ", "&#x30EB;":"ル", "&#x30EC;":"レ",
                "&#x30ED;":"ロ", "&#x30EE;":"ヮ", "&#x30EF;":"ワ", "&#x30F0;":"ヰ", "&#x30F1;":"ヱ", "&#x30F2;":"ヲ", "&#x30F3;":"ン", "&#x30F4;":"ヴ", "&#x30F5;":"30A1", "&#x30A2;":"ア",
                "&#x30A3;":"ィ", "&#x30A4;":"イ", "&#x30A5;":"ゥ", "&#x30A6;":"ウ", "&#x30A7;":"ェ", "&#x30A8;":"エ", "&#x30A9;":"ォ", "&#x30AA;":"オ", "&#x30AB;":"カ", "&#x30AC;":"ガ",
                "&#x30AD;":"キ", "&#x30AE;":"ギ", "&#x30AF;":"ク", "&#x30B0;":"グ", "&#x30B1;":"ケ", "&#x30B2;":"ゲ", "&#x30B3;":"コ", "&#x30B4;":"ゴ", "&#x30B5;":"サ", "&#x30B6;":"ザ",
                "&#x30B7;":"シ", "&#x30B8;":"ジ", "&#x30B9;":"ス", "&#x30BA;":"ズ", "&#x30BB;":"セ", "&#x30BC;":"ゼ", "&#x30BD;":"ソ", "&#x30BE;":"ゾ", "&#x30BF;":"タ", "&#x30C0;":"ダ",
                "&#x30C1;":"チ", "&#x30C2;":"ヂ", "&#x30C3;":"ッ", "&#x30C4;":"ツ", "&#x30C5;":"ヅ", "&nbsp;":" ", "&quot;":"\""}

const convert_blockquote = (html) => {
  var r = html;
  //r = r.replace(/<(blockquote).*?>([\s\S]*?)<\/\1>/igm, blockquoteNestingDetector);
  var pat = /<blockquote>\n?([\s\S]*?)\n?<\/blockquote>/mi; //[\s\S] = dotall; ? = non-greedy match
  for (var mat; (mat = r.match(pat)) !== null;) {
    mat = mat[1].replace(/\n/gm, '\n> ').replace(/<p>/igm, '\n> ').replace(/<\/p>/igm, '\n> \n> ')
      .replace(/(\n> ?){3,}/gm, '\n> \n> ');
    r = r.replace(pat, '\n' + mat + '\n');
  }
  return r;
}

const convert_table = (html) => {
 const tables = html.match(/<table>(.+?)<\/table>/gm);
 if(!tables){ return html;}

 let converted = html;
 tables.forEach(e => {
    let output = e.replace(/<\/?table>/gm, "")
    .replace(/<td>(.+?)<\/td>/gm, ' $1 |')
    .replace(/<th>(.+?)<\/th>/gm, ' $1 |')
    .replace(/<tr>/gm, '\n|')
    .replace(/<\/tr>/gm, "")
    const rows = output.slice(1).split("\n")[0].split("|").length-2;
    output = "\n" + output.slice(1).replace("\n", `\n${"| --- ".repeat(rows)}|\n`) + "\n"
    converted = converted.replace(e, output);
 })
  return converted
}

const convert_list = (html) => {
  const regexp = /<li[^>]*?>([^<]+?)<\/li>/gm;
  let converted = html;
  while(true){
    const array = [...converted.matchAll(regexp)];
    if(array.length === 0) break; 
    const idx = array[0]["index"];
    const b = array[0][0];
    const bef = converted.slice(0, idx);
    const ul_start_n = [...bef.matchAll(/<ul.*?>/gm)].length;
    const ul_end_n = [...bef.matchAll(/<\/ul.*?>/gm)].length;
    const ol_start_n = [...bef.matchAll(/<ol.*?>/gm)].length;
    const ol_end_n = [...bef.matchAll(/<\/ol.*?>/gm)].length;
    const depth = ul_start_n + ol_start_n - ul_end_n - ol_end_n - 1;
    const is_ul = ul_start_n - ul_end_n > ol_start_n - ol_end_n;
    const after = "  ".repeat(depth) + (is_ul ? "* " : "1. ") + b.replace(regexp, '$1') + "\n";
    converted = converted.replace(b, after);
  }
  converted = converted.replace(/<li[^?]*?>/gm, "").replace(/<\/li>/gm, "")
    .replace(/<ol[^?]*?>/gm, "").replace(/<\/ol>/gm, "")
    .replace(/<ul[^?]*?>/gm, "").replace(/<\/ul>/gm, "")

  return converted.replace(/\n{2,}( +?)\- (.+?)\n/gm, '/n$1- $2')
}

const html2md = (html) => {
  let converted = html; 
  converted = converted.replace(/<span([^>]*?)>/gm, "").replace(/<\/span>/gm, "");

  converted = converted.replace(/<pre([^>]+?)>([\s\S]+?)<\/pre>/gm, (str, p, code, offset, s) => {
    // <pre class="code" data-lang="" data-unlink>
    const lang = p.match(/data\-lang="(.*?)"/)[1];
    const code_f = code.replaceAll("\n", "<br/>").replaceAll(" ", "&nbsp;"); 
    return `<br />\`\`\`${lang}<br/>${code_f}<br/>\`\`\`<br/>`;
  })

  converted = converted.replaceAll("\n", "")
  converted = converted.replace(/<p([^[>|pre]*?)>/gm, "").replace(/<\/p>/gm, "\n");

  converted = converted.replace(/<h1(.*?)>(.*?)<\/h1>/gm, '\n# &nbsp;$2\n');
  converted = converted.replace(/<h2(.*?)>(.*?)<\/h2>/gm, '\n## &nbsp;$2\n');
  converted = converted.replace(/<h3(.*?)>(.*?)<\/h3>/gm, '\n### &nbsp;$2\n');
  converted = converted.replace(/<h4(.*?)>(.*?)<\/h4>/gm, '\n#### &nbsp;$2\n');
  converted = converted.replace(/<h5(.*?)>(.*?)<\/h5>/gm, '\n##### &nbsp;$2\n');
  converted = converted.replace(/<h6(.*?)>(.*?)<\/h6>/gm, '\n###### &nbsp;$2\n');
  converted = converted.replace(/<h7(.*?)>(.*?)<\/h7>/gm, '\n####### &nbsp;$2\n');

  // link
  converted = converted.replace(/<a class="keyword" href="([^"]+?)">([^<]+)<\/a>/igm, '$2')
  converted = converted.replace(/<a href="([^"]+?)">([^<]+)<\/a>/igm, '[$2]($1)')
  converted = converted.replace(/<a href="([^"]+?)" title="([^"]+?)">([^<]+)<\/a>/igm, '[$3]($1 "$2")')
  converted = converted.replace(/<img ([^>]+?)>/gm,(str, a, offset, s)=> {
    const l = a.match(/([a-z]*?)=\"[^"]+?\"/gm);
    const info = {};
    l.forEach(m => {const [k, v] = m.split("="); info[k] = v.replace(/\"(.+?)\"/, '$1'); })
    return ("alt" in info) ? `![${info?.alt}](${info?.src})` : `![${info?.src}](${info?.src})`
  })
// <img src="https://cdn-ak.f.st-hatena.com/images/fotolife/p/pythonjacascript/20190809/20190809011343.jpg" alt="f:id:pythonjacascript:20190809011343j:plain" title="f:id:pythonjacascript:20190809011343j:plain" class="hatena-fotolife" itemprop="image">
  // em and i and bold
  converted = converted.replaceAll(" ", "");
  converted = converted.replace(/<(strong|b)>(.*?)<\/\1>/igm, '*$2*');
  converted = converted.replace(/<(em|i)>(.*?)<\/\1>/igm, '**$2**');

  converted = converted.replace(/<hr ?\/?>/, '\n- - -\n')

  converted = convert_list(converted);
  converted = convert_table(converted);
  converted = convert_blockquote(converted);
  
  // not used
  converted = converted.replace(/<[\/]?[font|div]([^>]*?)>/igm, "")

  converted = converted.replace(/<br\/>/igm, ' \n');
  converted = converted.replace(/\n{3,}/gm, '\n\n');
  for (let k in unicode_types) { converted = converted.replaceAll(k, unicode_types[k]); }
  // converted = converted.replaceAll("&nbsp;", " ").replaceAll("&gt;", ">").replaceAll("&lt;", "<")
  return converted;
}


const parse = (str) => {
  const matches = str.match(/^([a-zA-Z ]*?):(.*?)+?$/gm)
  const result = {}
  if(!matches){
  }
  matches.forEach(match => {
    const [key, value] = match.split(': ')
    result[key] = value
  })
  const b = str.match(/-----\nBODY:\n([\s\S]*?)\n-----/gm);
  if(!b){
    console.log("B === 0")
    console.log(str);
  }
  result["BODY"] = b[0].substring(12, b[0].length - 5);

  const markdown = html2md(result["BODY"]);
  result["markdown"] = markdown;
  const formatted_title = "output/" + result["TITLE"].replace(/[\/|\\]/gm, "") + ".txt";
  fs.writeFileSync(formatted_title, markdown);
  return {
    title : result?.TITLE || "NO TITLE",
    content : result?.markdown || "",
    tag : [result?.CATEGORY || ""],
    create_time : new Date(result.DATE),
    update_time : new Date(result.DATE),
    icon : result?.IMAGE || "",
    user : result?.AUTHOR || "",
  };
}

const main = async () => {
  let raw_string = "";
  try {
    raw_string = fs.readFileSync('./export_raw.txt', 'utf8')
  } catch (err) { console.error(err); }

  contents = raw_string.split("\n--------\n");
  console.log(contents.length);

  let result_json = { page : [], date: Date.now() };
  for (i = 0; i < contents.length; i++) {
    const valid = contents[i].match(/^([a-zA-Z ]*?):(.*?)+?$/gm);
    if(!valid){ break; }
    result_json.page.push(parse(contents[i]));
  }
  fs.writeFileSync('output.json', JSON.stringify(result_json));
}

main();

