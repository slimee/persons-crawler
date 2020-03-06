const fs = require('fs')
const parseEncadre = require('../services/parsers/parseEncadre')
const parsePerson = require('../services/parsers/makeParsePerson')()
const parseName = require('../services/parsers/parseName')
const parseIntro = require('../services/parsers/parseIntro')
const { makeParseLinks, makeParseTag, makeParseWikiDate } = require('../services/parsers/parseAny')
const { extractText } = require('../services/utils/extractText')


describe('parse', () => {
  test('extract text from html', () => {
    const html = '<b>Aristote</b> (<time class="nowrap date-lien bday" datetime="U-0383" data-sort-value="U-0383"><a href="/wiki/384_av._J.-C." title="384 av. J.-C.">384 <abbr class="abbr" title="384 avant Jésus-Christ">av. J.-C.</abbr></a></time><sup id="cite_ref-Pellegrin2014p9_1-0" class="reference"><a href="#cite_note-Pellegrin2014p9-1"><span class="cite_crochet">[</span>1<span class="cite_crochet">]</span></a></sup> - <time class="nowrap date-lien dday" datetime="U-0321" data-sort-value="U-0321"><a href="/wiki/322_av._J.-C." title="322 av. J.-C.">322 <abbr class="abbr" title="322 avant Jésus-Christ">av. J.-C.</abbr></a></time>) (en <a href="/wiki/Grec_ancien" title="Grec ancien">grec ancien</a>&#160;:&#160;<span class="lang-grc" lang="grc"><i>Ἀριστοτέλης</i></span> <span class="API nowrap" title="Alphabet phonétique international" style="font-family:&#39;Segoe UI&#39;,&#39;DejaVu Sans&#39;,&#39;Lucida Grande&#39;,&#39;Lucida Sans Unicode&#39;,&#39;Arial Unicode MS&#39;,&#39;Hiragino Kaku Gothic Pro&#39;,sans-serif;">&#91;<a href="/wiki/API_a" class="mw-redirect" title="API a"><span title="&#91;a&#93; «&#32;a&#32;» dans «&#32;patte&#32;».">a</span></a><a href="/wiki/API_r" class="mw-redirect" title="API r"><span title="&#91;r&#93; «&#32;r&#32;» roulé.">r</span></a><a href="/wiki/API_i" class="mw-redirect" title="API i"><span title="&#91;i&#93; «&#32;i&#32;» dans «&#32;si&#32;».">i</span></a><a href="/wiki/API_s" class="mw-redirect" title="API s"><span title="&#91;s&#93; en français «&#32;s&#32;» dans «&#32;sa&#32;»&#32;; ailleurs avec la langue un peu plus en arrière. En basque, «&#32;s&#32;» dans «&#32;euskara&#32;».">s</span></a><a href="/wiki/API_t" class="mw-redirect" title="API t"><span title="&#91;t&#93; en français «&#32;t&#32;» dans «&#32;tous&#32;»&#32;; ailleurs avec la langue un peu plus en arrière.">t</span></a><a href="/wiki/API_o" class="mw-redirect" title="API o"><span title="&#91;o&#93; «&#32;o&#32;» dans «&#32;sot&#32;».">o</span></a><a href="/wiki/API_t" class="mw-redirect" title="API t"><span title="&#91;t&#93; en français «&#32;t&#32;» dans «&#32;tous&#32;»&#32;; ailleurs avec la langue un peu plus en arrière.">t</span></a><a href="/wiki/API_e" class="mw-redirect" title="API e"><span title="&#91;e&#93; «&#32;é&#32;» dans «&#32;clé&#32;».">e</span></a><a href="/wiki/API_l" class="mw-redirect" title="API l"><span title="&#91;l&#93; «&#32;l&#32;» dans «&#32;loup&#32;».">l</span></a><a href="/wiki/API_%C9%9B" class="mw-redirect" title="API ɛ"><span title="&#91;ɛ&#93; «&#32;è&#32;» dans «&#32;mère&#32;».">ɛ</span></a><a href="/wiki/API_%CB%90" class="mw-redirect" title="API ː"><span title="&#91;ː&#93; indique que le son précédent est allongé/géminé.">ː</span></a><a href="/wiki/API_s" class="mw-redirect" title="API s"><span title="&#91;s&#93; en français «&#32;s&#32;» dans «&#32;sa&#32;»&#32;; ailleurs avec la langue un peu plus en arrière. En basque, «&#32;s&#32;» dans «&#32;euskara&#32;».">s</span></a>&#93;</span><sup id="cite_ref-2" class="reference"><a href="#cite_note-2"><span class="cite_crochet">[</span>2<span class="cite_crochet">]</span></a></sup>) est un <a href="/wiki/Philosophe" title="Philosophe">philosophe</a> <a href="/wiki/Gr%C3%A8ce_antique" title="Grèce antique">grec de l\'Antiquité</a>. Avec <a href="/wiki/Platon" title="Platon">Platon</a>, dont il fut le disciple à l\'<a href="/wiki/Acad%C3%A9mie_de_Platon" title="Académie de Platon">Académie</a>, il est l\'un des penseurs les plus influents que le monde occidental ait connu. Il est aussi l\'un des rares à avoir abordé presque tous les domaines de connaissance de son temps&#160;: <a href="/wiki/Biologie" title="Biologie">biologie</a>, <a href="/wiki/Physique" title="Physique">physique</a>, <a href="/wiki/M%C3%A9taphysique" title="Métaphysique">métaphysique</a>, <a href="/wiki/Logique" title="Logique">logique</a>, <a href="/wiki/Po%C3%A9tique_(discipline)" title="Poétique (discipline)">poétique</a>, <a href="/wiki/Politique" title="Politique">politique</a>, <a href="/wiki/Rh%C3%A9torique" title="Rhétorique">rhétorique</a> et de façon ponctuelle l\'<a href="/wiki/%C3%89conomie_(discipline)" title="Économie (discipline)">économie</a>. Chez Aristote, la philosophie est comprise dans un sens plus large&#160;: elle est à la fois recherche du savoir pour lui-même, interrogation sur le monde et science des sciences.'
    const expectedText = 'Aristote (384 av. J.-C. - 322 av. J.-C.) (en grec ancien&#160;:&#160;Ἀριστοτέλης &#91;aristotelɛːs&#93;) est un philosophe grec de l\'Antiquité. Avec Platon, dont il fut le disciple à l\'Académie, il est l\'un des penseurs les plus influents que le monde occidental ait connu. Il est aussi l\'un des rares à avoir abordé presque tous les domaines de connaissance de son temps&#160;: biologie, physique, métaphysique, logique, poétique, politique, rhétorique et de façon ponctuelle l\'économie. Chez Aristote, la philosophie est comprise dans un sens plus large&#160;: elle est à la fois recherche du savoir pour lui-même, interrogation sur le monde et science des sciences.'
    expect(extractText(html)).toEqual(expectedText)
  })

  test('extract text from rembrant', ()=>{
    const html = '<p><b>Rembrandt Harmenszoon van Rijn</b> (en <a href="/wiki/N%C3%A9erlandais" title="Néerlandais">néerlandais</a> <style data-mw-deduplicate="TemplateStyles:r151431917">.mw-parser-output .prononciation>a{background:url("//upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Loudspeaker.svg/11px-Loudspeaker.svg.png")center left no-repeat;padding-left:15px;font-size:smaller}</style><sup class="prononciation noprint"><a href="/wiki/Fichier:Rembrandtvanrijn.ogg" title="Fichier:Rembrandtvanrijn.ogg">Écouter</a></sup><sup id="cite_ref-2" class="reference"><a href="#cite_note-2"><span class="cite_crochet">[</span>1<span class="cite_crochet">]</span></a></sup>), habituellement désigné sous son seul prénom de <b>Rembrandt</b>, né à <a href="/wiki/Leyde" title="Leyde">Leyde</a> le <time class="nowrap date-lien" datetime="1606-07-15" data-sort-value="1606-07-15"><a href="/wiki/15_juillet" title="15 juillet">15 juillet</a> <a href="/wiki/1606_en_arts_plastiques" title="1606 en arts plastiques">1606</a></time> ou 1607<sup id="cite_ref-3" class="reference"><a href="#cite_note-3"><span class="cite_crochet">[</span>note 2<span class="cite_crochet">]</span></a></sup> et mort à <a href="/wiki/Amsterdam" title="Amsterdam">Amsterdam</a> le <time class="nowrap date-lien" datetime="1669-10-04" data-sort-value="1669-10-04"><a href="/wiki/4_octobre" title="4 octobre">4 octobre</a> <a href="/wiki/1669_en_arts_plastiques" title="1669 en arts plastiques">1669</a></time>, est généralement considéré comme l\'un des plus grands <a href="/wiki/Artiste_peintre" title="Artiste peintre">peintres</a> de l\'<a href="/wiki/Histoire_de_la_peinture" title="Histoire de la peinture">histoire de la peinture</a>, notamment de la <a href="/wiki/Peinture_baroque" title="Peinture baroque">peinture baroque</a>, et l\'un des plus importants peintres de l\'<a href="/wiki/%C3%89cole_hollandaise" title="École hollandaise">École hollandaise</a> du <a href="/wiki/XVIIe_si%C3%A8cle" title="XVIIe siècle"><abbr class="abbr" title="17ᵉ siècle"><span class="romain">XVII</span><sup style="font-size:72%">e</sup></abbr>&nbsp;siècle</a>. Rembrandt a également réalisé des <a href="/wiki/Gravure" title="Gravure">gravures</a> et des <a href="/wiki/Dessin" title="Dessin">dessins</a> et est l\'un des plus importants <a href="/wiki/Aquafortiste" class="mw-redirect" title="Aquafortiste">aquafortistes</a> de l\'histoire. Il a vécu pendant ce que les historiens appellent le <a href="/wiki/Si%C3%A8cle_d%27or_n%C3%A9erlandais" title="Siècle d\'or néerlandais">siècle d\'or néerlandais</a> (approximativement le <abbr class="abbr" title="17ᵉ siècle"><span class="romain">XVII</span><sup style="font-size:72%">e</sup></abbr>&nbsp;siècle), durant lequel culture, sciences, commerce et influence politique des Pays-Bas ont atteint leur apogée.</p>'
    const expectedText = 'Rembrandt Harmenszoon van Rijn (en néerlandais Écouter),' +
      ' habituellement désigné sous son seul prénom de Rembrandt, né à Leyde le 15 juillet 1606 ou 1607[note 2] et mort à Amsterdam le 4 octobre 1669, est généralement considéré comme l\'un des plus grands peintres de l\'histoire de la peinture, notamment de la peinture baroque, et l\'un des plus importants peintres de l\'École hollandaise du XVIIe&nbsp;siècle. Rembrandt a également réalisé des gravures et des dessins et est l\'un des plus importants aquafortistes de l\'histoire. Il a vécu pendant ce que les historiens appellent le siècle d\'or néerlandais (approximativement le XVIIe&nbsp;siècle), durant lequel culture, sciences, commerce et influence politique des Pays-Bas ont atteint leur apogée.'
    expect(extractText(html)).toEqual(expectedText)
  })

  test('<p>hello</p> intro is Hello', () => {
    expect(parseIntro('<p>hello</p>')).toBeTruthy()
  })
  test('<p>Si vous</p><p>Hello</p> intro is Hello', () => {
    expect(parseIntro('<p>Si vous</p><p>Hello</p>')).toBeTruthy()
  })
  test('parseIntro with <p> in excludeRange', () => {
    const excludeRange = { startIndex: 0, endIndex: 25 }
    expect(parseIntro('dsdsd<p>infobox</p>fgergrgrgrg<p>Super</p>', excludeRange)).toEqual('Super')
  })
  test('find encadre', () => {
    const fixtures = [
      {
        page: fs.readFileSync('./test/fixtures/einstein.page.html', 'utf-8'),
        encadre: fs.readFileSync('./test/fixtures/einstein.encadre.html', 'utf-8'),
      },
      {
        page: fs.readFileSync('./test/fixtures/kant.page.html', 'utf-8'),
        encadre: fs.readFileSync('./test/fixtures/kant.encadre.html', 'utf-8'),
      },
      {
        page: fs.readFileSync('./test/fixtures/turing.page.html', 'utf-8'),
        encadre: fs.readFileSync('./test/fixtures/turing.encadre.html', 'utf-8'),
      },
      {
        page: fs.readFileSync('./test/fixtures/obama.page.html', 'utf-8'),
        encadre: fs.readFileSync('./test/fixtures/obama.encadre.html', 'utf-8'),
      },
      {
        page: fs.readFileSync('./test/fixtures/newton.page.html', 'utf-8'),
        encadre: fs.readFileSync('./test/fixtures/newton.encadre.html', 'utf-8'),
      },
    ]

    fixtures.forEach(({ page, encadre }) => expect(parseEncadre(page).encadre).toStrictEqual(encadre))
  })

  test('parseAny', () => {
    const fixtures = [

      {
        encadre: fs.readFileSync('./test/fixtures/kant.encadre.html', 'utf-8'),
        lines: [
          {
            key: 'Domaines', expected: null,
          },
          {
            key: 'Influencé par', expected: [
              {
                'href': '/wiki/Platon',
                'title': 'Platon',
                'type': 'Influencé par',
              },
              {
                'href': '/wiki/René_Descartes',
                'title': 'René Descartes',
                'type': 'Influencé par',
              },
              {
                'href': '/wiki/John_Locke',
                'title': 'John Locke',
                'type': 'Influencé par',
              },
              {
                'href': '/wiki/Baruch_Spinoza',
                'title': 'Baruch Spinoza',
                'type': 'Influencé par',
              },
              {
                'href': '/wiki/Isaac_Newton',
                'title': 'Isaac Newton',
                'type': 'Influencé par',
              },
              {
                'href': '/wiki/Gottfried_Wilhelm_Leibniz',
                'title': 'Gottfried Wilhelm Leibniz',
                'type': 'Influencé par',
              },
              {
                'href': '/wiki/Christian_Wolff_(philosophe)',
                'title': 'Christian Wolff',
                'type': 'Influencé par',
              },
              {
                'href': '/wiki/George_Berkeley',
                'title': 'George Berkeley',
                'type': 'Influencé par',
              },
              {
                'href': '/wiki/Francis_Hutcheson_(philosophe)',
                'title': 'Francis Hutcheson',
                'type': 'Influencé par',
              },
              {
                'href': '/wiki/David_Hume',
                'title': 'David Hume',
                'type': 'Influencé par',
              },
              {
                'href': '/wiki/Jean-Jacques_Rousseau',
                'title': 'Jean-Jacques Rousseau',
                'type': 'Influencé par',
              },
              {
                'href': '/wiki/Moses_Mendelssohn',
                'title': 'Moses Mendelssohn',
                'type': 'Influencé par',
              },
            ],
          },
          {
            key: 'A influencé', expected: [
              {
                'href': '/wiki/Johann_Gottlieb_Fichte',
                'title': 'Johann Gottlieb Fichte',
                'type': 'A influencé',
              },
              {
                'href': '/wiki/Georg_Wilhelm_Friedrich_Hegel',
                'title': 'Georg Wilhelm Friedrich Hegel',
                'type': 'A influencé',
              },
              {
                'href': '/wiki/Friedrich_Schelling',
                'title': 'Friedrich Schelling',
                'type': 'A influencé',
              },
              {
                'href': '/wiki/Arthur_Schopenhauer',
                'title': 'Arthur Schopenhauer',
                'type': 'A influencé',
              },
              {
                'href': '/wiki/Wilhelm_Dilthey',
                'title': 'Wilhelm Dilthey',
                'type': 'A influencé',
              },
              {
                'href': '/wiki/Charles_Sanders_Peirce',
                'title': 'Charles Sanders Peirce',
                'type': 'A influencé',
              },
              {
                'href': '/wiki/Hermann_Cohen_(philosophe)',
                'title': 'Hermann Cohen',
                'type': 'A influencé',
              },
              {
                'href': '/wiki/Antoine_Charma',
                'title': 'Antoine Charma',
                'type': 'A influencé',
              },
              {
                'href': '/wiki/Wilhelm_Windelband',
                'title': 'Wilhelm Windelband',
                'type': 'A influencé',
              },
              {
                'href': '/wiki/Paul_Natorp',
                'title': 'Paul Natorp',
                'type': 'A influencé',
              },
              {
                'href': '/wiki/Edmund_Husserl',
                'title': 'Edmund Husserl',
                'type': 'A influencé',
              },
              {
                'href': '/wiki/Heinrich_Rickert',
                'title': 'Heinrich Rickert',
                'type': 'A influencé',
              },
              {
                'href': '/wiki/Ernst_Cassirer',
                'title': 'Ernst Cassirer',
                'type': 'A influencé',
              },
              {
                'href': '/wiki/Martin_Heidegger',
                'title': 'Martin Heidegger',
                'type': 'A influencé',
              },
              {
                'href': '/wiki/Jean-Paul_Sartre',
                'title': 'Jean-Paul Sartre',
                'type': 'A influencé',
              },
              {
                'href': '/wiki/Hannah_Arendt',
                'title': 'Hannah Arendt',
                'type': 'A influencé',
              },
              {
                'href': '/wiki/John_Rawls',
                'title': 'John Rawls',
                'type': 'A influencé',
              },
              {
                'href': '/wiki/Jürgen_Habermas',
                'title': 'Jürgen Habermas',
                'type': 'A influencé',
              },
              {
                'href': '/wiki/Simone_Weil',
                'title': 'Simone Weil',
                'type': 'A influencé',
              },
              {
                'href': '/wiki/Émile_Durkheim',
                'title': 'Émile Durkheim',
                'type': 'A influencé',
              },
            ],
          },
          {
            key: 'Œuvres principales', expected: [
              {
                'href': '/wiki/Critique_de_la_raison_pure',
                'title': 'Critique de la raison pure',
                'type': 'Œuvres principales',
              },
              {
                'href': '/wiki/Critique_de_la_raison_pratique',
                'title': 'Critique de la raison pratique',
                'type': 'Œuvres principales',
              },
              {
                'href': '/wiki/Critique_de_la_faculté_de_juger',
                'title': 'Critique de la faculté de juger',
                'type': 'Œuvres principales',
              },
            ],
          },
          {
            key: 'École/tradition', expected: [
              {
                'href': '/wiki/Piétisme',
                'title': 'Piétisme',
                'type': 'École/tradition',
              },
              {
                'href': '/wiki/Lumières_(philosophie)',
                'title': 'Lumières',
                'type': 'École/tradition',
              },
              {
                'href': '/wiki/Idéalisme_allemand',
                'title': 'Idéalisme allemand',
                'type': 'École/tradition',
              },
            ],
          },
          {
            key: 'Principaux intérêts', expected: [
              {
                'href': '/wiki/Logique',
                'title': 'Logique',
                'type': 'Principaux intérêts',
              },
              {
                'href': '/wiki/Métaphysique',
                'title': 'Métaphysique',
                'type': 'Principaux intérêts',
              },
              {
                'href': '/wiki/Épistémologie',
                'title': 'Épistémologie',
                'type': 'Principaux intérêts',
              },
              {
                'href': '/wiki/Morale',
                'title': 'Morale',
                'type': 'Principaux intérêts',
              },
              {
                'href': '/wiki/Esthétique',
                'title': 'Esthétique',
                'type': 'Principaux intérêts',
              },
              {
                'href': '/wiki/Anthropologie',
                'title': 'Anthropologie',
                'type': 'Principaux intérêts',
              },
              {
                'href': '/wiki/Politique',
                'title': 'Politique',
                'type': 'Principaux intérêts',
              },
            ],
          },
          {
            key: 'Idées remarquables', expected: [
              {
                'href': '/wiki/Criticisme',
                'title': 'Criticisme',
                'type': 'Idées remarquables',
              },
              {
                'href': '/wiki/Jugement_synthétique_a_priori',
                'title': 'Jugement synthétique a priori',
                'type': 'Idées remarquables',
              },
              {
                'href': '/wiki/Chose_en_soi',
                'title': 'Chose en soi',
                'type': 'Idées remarquables',
              },
              {
                'href': '/wiki/Impératif_catégorique',
                'title': 'Impératif catégorique',
                'type': 'Idées remarquables',
              },
              {
                'href': '/wiki/Progrès',
                'title': 'Progrès',
                'type': 'Idées remarquables',
              },
            ],
          },
        ],
      },
    ]

    fixtures.forEach(({ encadre, lines }) => {
      lines.forEach(line =>
        expect(makeParseLinks(line.key)(encadre)).toEqual(line.expected),
      )
    })
  })

  test('parseCitation', () => {
    const encadre = fs.readFileSync('./test/fixtures/descartes.encadre.html', 'utf-8')
    const parseCitation = makeParseTag('Citation', 'i')
    expect(parseCitation(encadre)).toBe('Je pense, donc je suis')
  })

  test('parseBirth', () => {
    const encadre = fs.readFileSync('./test/fixtures/descartes.encadre.html', 'utf-8')
    const parseBirth = makeParseWikiDate('Naissance')
    expect(parseBirth(encadre)).toStrictEqual(new Date('1596-03-31T00:00:00.000Z'))
  })

  test('find one encadre', () => {
    const page = fs.readFileSync('./test/fixtures/corbellini.page.html', 'utf-8')
    const encadre = fs.readFileSync('./test/fixtures/corbellini.encadre.html', 'utf-8')

    expect(parseEncadre(page).encadre).toStrictEqual(encadre)
  })

  test('parsePerson table', () => {
    const page = fs.readFileSync('./test/fixtures/corbellini.page.html', 'utf-8')
    const expected = {
      'birth': new Date('1947-04-20T00:00:00.000Z'),
      'death': new Date('2019-11-13T00:00:00.000Z'),
      'intro': 'Giorgio Corbellini, né le 20 avril 1947 à Travo en Italie et mort le 13 novembre' +
        ' 2019 à Parme, est un prélat italien au service du Saint-Siège en tant que président du' +
        ' bureau central du travail du Siège apostolique du 3 juillet 2009 à sa mort. A ce titre, il gère donc les relations avec les travailleurs laïcs de la curie romaine.\n',
      'properties': [],
      'name': 'Giorgio Corbellini',
      'url': 'https://fr.wikipedia.org/wiki/Giorgio_Corbellini',
    }
    expect(parsePerson({
      body: page,
      url: 'https://fr.wikipedia.org/wiki/Giorgio_Corbellini',
    })).toStrictEqual(expected)
  })

  test('parsePerson moricone', () => {
    const page = fs.readFileSync('./test/fixtures/moricone.page.html', 'utf-8')
    const person = parsePerson({ body: page, url: 'moricone url' })
    expect(person.intro).toContain('<b>Ennio Morricone</b>')
  })

  test('parseIntro moricone', () => {
    const page = fs.readFileSync('./test/fixtures/moricone.page.html', 'utf-8')
    const intro = parseIntro(page, { startIndex: 9194, endIndex: 16352 })
    expect(intro).toContain('<b>Ennio Morricone</b>')
  })

  test('parsePerson div einstein', () => {
    const page = fs.readFileSync('./test/fixtures/einstein.page.html', 'utf-8')
    const expected = {
      'birth': new Date('1879-03-14T00:00:00.000Z'),
      'death': new Date('1955-04-18T00:00:00.000Z'),
      'intro': 'Albert Einstein (prononcé en allemand &#91;ˈalbɐt ˈaɪnʃtaɪn&#93; Écouter) né le 14 mars 1879[N 1] à Ulm, dans le Wurtemberg (Empire allemand), et mort le 18 avril 1955 à Princeton, dans le New Jersey (États-Unis), est un physicien théoricien. Il fut successivement allemand, apatride (1896), suisse (1901) et de double nationalité helvético-américaine (1940). Il épousa Mileva Marić, puis sa cousine Elsa Einstein.',
      'imgUrl': '//upload.wikimedia.org/wikipedia/commons/thumb/1/14/Albert_Einstein_1947.jpg/220px-Albert_Einstein_1947.jpg',
      'name': 'Albert Einstein',
      'url': 'https://fr.wikipedia.org/wiki/Albert_Einstein',
      'properties': [
        {
          'href': '/wiki/Physique',
          'title': 'Physique',
          'type': 'Domaine',
        },
        {
          'href': '/wiki/Effet_photo-électrique',
          'title': 'Effet photo-électrique',
          'type': 'Renommé pour',
        },
        {
          'href': '/wiki/Mouvement_brownien',
          'title': 'Mouvement brownien',
          'type': 'Renommé pour',
        },
        {
          'href': '/wiki/Relativité_restreinte',
          'title': 'Relativité restreinte',
          'type': 'Renommé pour',
        },
        {
          'href': '/wiki/Relativité_générale',
          'title': 'Relativité générale',
          'type': 'Renommé pour',
        },
        {
          'href': '/wiki/Prix_Nobel_de_physique',
          'title': 'Prix Nobel de physique',
          'type': 'Distinction',
        },
        {
          'href': '/wiki/Médaille_Copley',
          'title': 'Médaille Copley',
          'type': 'Distinction',
        },
        {
          'href': '/wiki/Médaille_Max-Planck',
          'title': 'Médaille Max-Planck',
          'type': 'Distinction',
        },
        {
          'href': '/wiki/Empire_allemand',
          'title': 'Empire allemand',
          'type': 'Nationalité',
        },
        {
          'href': '/wiki/Fichier:Flag_Blank.svg',
          'title': 'Apatride',
          'type': 'Nationalité',
        },
        {
          'href': '/wiki/Suisse',
          'title': 'Suisse',
          'type': 'Nationalité',
        },
        {
          'href': '/wiki/Autriche-Hongrie',
          'title': 'Autriche-Hongrie',
          'type': 'Nationalité',
        },
        {
          'href': '/wiki/États-Unis',
          'title': 'États-Unis',
          'type': 'Nationalité',
        },
        {
          'href': '/wiki/Apatride',
          'title': 'Apatride',
          'type': 'Nationalité',
        },
      ],
    }

    const t1 = new Date().getTime()
    let person = parsePerson({ body: page, url: 'https://fr.wikipedia.org/wiki/Albert_Einstein' })
    const t2 = new Date().getTime()
    expect(person).toStrictEqual(expected)
    expect(t2 - t1).toBeLessThan(10)
  })

  test('parsePerson théophraste', () => {
    const page = fs.readFileSync('./test/fixtures/theophraste.page.html', 'utf-8')
    const expected = {
      'birth': new Date('-000371-12-31T23:50:39.000Z'),
      'death': new Date('-000288-12-31T23:50:39.000Z'),
      'intro': '<b>Théophraste</b> (en <a href="/wiki/Grec_ancien" title="Grec ancien">grec ancien</a> <span class="lang-grc" lang="grc">Θεόφραστος</span> / <i>Théophrastos</i>) est un <a href="/wiki/Philosophe" title="Philosophe">philosophe</a> de la <a href="/wiki/Gr%C3%A8ce_antique" title="Grèce antique">Grèce antique</a> né vers <a href="/wiki/-371" class="mw-redirect" title="-371">-371</a> à <a href="/wiki/Eres%C3%B3s" title="Eresós">Eresós</a><sup id="cite_ref-a_1-0" class="reference"><a href="#cite_note-a-1"><span class="cite_crochet">[</span>1<span class="cite_crochet">]</span></a></sup> (<a href="/wiki/Lesbos" title="Lesbos">Lesbos</a>) et mort vers <a href="/wiki/-288" class="mw-redirect" title="-288">-288</a><sup id="cite_ref-2" class="reference"><a href="#cite_note-2"><span class="cite_crochet">[</span>2<span class="cite_crochet">]</span></a></sup> à <a href="/wiki/Ath%C3%A8nes" title="Athènes">Athènes</a>. Élève d’<a href="/wiki/Aristote" title="Aristote">Aristote</a>, il fut le premier <a href="/wiki/Scholarque" title="Scholarque">scholarque</a> du <a href="/wiki/Lyc%C3%A9e_(%C3%A9cole_philosophique)" title="Lycée (école philosophique)">Lycée</a>, de -322 à sa mort&#160;; <a href="/wiki/Botanique" title="Botanique">botaniste</a> et <a href="/wiki/Naturaliste" title="Naturaliste">naturaliste</a>, <a href="/wiki/Polygraphe_(auteur)" title="Polygraphe (auteur)">polygraphe</a> ou encore <a href="/wiki/Alchimiste" class="mw-redirect" title="Alchimiste">alchimiste</a>.\r\n      ',
      'imgUrl': '//upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Teofrasto_Orto_botanico_detail.jpg/260px-Teofrasto_Orto_botanico_detail.jpg',
      'name': 'Théophraste (',
      'properties': [
        {
          'href': '/wiki/École_péripatéticienne',
          'title': 'École péripatéticienne',
          'type': 'Formation',
        },
        {
          'href': '/wiki/Aristote',
          'title': 'Aristote',
          'type': 'Influencé par',
        },
        {
          'href': '/wiki/Platon',
          'title': 'Platon',
          'type': 'Influencé par',
        },
        {
          'href': '/wiki/Ménandre',
          'title': 'Ménandre',
          'type': 'A influencé',
        },
        {
          'href': '/wiki/Jean_de_La_Bruyère',
          'title': 'Jean de La Bruyère',
          'type': 'A influencé',
        },
        {
          'href': '/wiki/Les_Caractères_(Théophraste)',
          'title': 'Les Caractères',
          'type': 'Œuvres principales',
        },
        {
          'href': '/wiki/Aristotélisme',
          'title': 'Aristotélisme',
          'type': 'École/tradition',
        },
        {
          'href': '/wiki/Péripatétisme',
          'title': 'Péripatétisme',
          'type': 'École/tradition',
        },
        {
          'href': '/wiki/Métaphysique',
          'title': 'Métaphysique',
          'type': 'Principaux intérêts',
        },
        {
          'href': '/wiki/Botanique',
          'title': 'Botanique',
          'type': 'Principaux intérêts',
        },
        {
          'href': '/wiki/Science_de_la_nature',
          'title': 'Science de la nature',
          'type': 'Principaux intérêts',
        },
        {
          'href': '/wiki/Rhétorique',
          'title': 'Rhétorique',
          'type': 'Principaux intérêts',
        },
        {
          'href': '/wiki/Physique',
          'title': 'Physique',
          'type': 'Principaux intérêts',
        },
        {
          'href': 'https://en.wikipedia.org/wiki/Classical_Athens',
          'title': 'en:Classical Athens',
          'type': 'Nationalité',
        },
      ],
      'url': 'https://fr.wikipedia.org/wiki/Théophraste',
    }

    const t1 = new Date().getTime()
    let person = parsePerson({ body: page, url: 'https://fr.wikipedia.org/wiki/Th%C3%A9ophraste' })
    const t2 = new Date().getTime()
    expect(person).toStrictEqual(expected)
    expect(t2 - t1).toBeLessThan(40)
  })

  test('parseName div', () => {
    const encadre = fs.readFileSync('./test/fixtures/einstein.encadre.html', 'utf-8')
    const expected = 'Albert Einstein'
    expect(parseName(encadre)).toBe(expected)
  })
  test('parseName table', () => {
    const encadre = fs.readFileSync('./test/fixtures/corbellini.encadre.html', 'utf-8')
    const expected = 'Giorgio Corbellini'
    expect(parseName(encadre)).toBe(expected)
  })

  test('parseBirth table', () => {
    const encadre = fs.readFileSync('./test/fixtures/corbellini.encadre.html', 'utf-8')
    const expected = new Date('1947-04-20T00:00:00.000Z')
    const parseBirth = makeParseWikiDate('Naissance')
    expect(parseBirth(encadre)).toStrictEqual(expected)
  })

  test('parseBirth div', () => {
    const encadre = fs.readFileSync('./test/fixtures/einstein.encadre.html', 'utf-8')
    const expected = new Date('1879-03-14T00:00:00.000Z')
    const parseBirth = makeParseWikiDate('Naissance')
    expect(parseBirth(encadre)).toStrictEqual(expected)
  })
})
