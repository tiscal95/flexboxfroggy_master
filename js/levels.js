var levels = [
  {
    name: 'Level 1 (justify-content 1)',
    instructions: {
      'en': '<p>Welcome to Flexbox Froggy, a game where you help Froggy and friends by writing CSS code! Guide this frog to the lilypad on the right by using the <code>justify-content</code> property, which aligns items horizontally and accepts the following values:</p><ul><li><code>flex-start</code>: Items align to the left side of the container.</li><li><code>flex-end</code>: Items align to the right side of the container.</li><li><code>center</code>: Items align at the center of the container.</li><li><code>space-between</code>: Items display with equal spacing between them.</li><li><code>space-around</code>: Items display with equal spacing around them.</li></ul><p>For example, <code>justify-content: flex-end;</code> will move the frog to the right. <img src="https://code.org/api/hour/begin_flexbox_froggy.png"></p>',
      'de': '<p>Willkommen bei Flexbox Froggy, einem Spiel, in dem du Froggy und seinen Freunden hilfst, indem du CSS-Code schreibst! Führe diesen Frosch zum Seerosenblatt auf der rechten Seite, indem du die <code>justify-content</code>-Eigenschaft verwendest, die Elemente horizontal ausrichtet und die folgenden Werte akzeptiert:</p><ul><li><code>flex-start</code>: Elemente an der linken Seite des Containers ausrichten.</li><li><code>flex-end</code>: Elemente an der rechten Seite des Containers ausrichten.</li><li><code>center</code>: Elemente an der Mitte des Containers ausrichten.</li><li><code>space-between</code>: Elemente mit gleichem Innenabstand ausrichten.</li><li><code>space-around</code>: Elemente mit gleichem Außenabstand ausrichten.</li></ul><p>Mit <code>justify-content: flex-end;</code> bewegst du den Frosch beispielsweise nach rechts.</p>',
    },
    maxPoints: 500,
    maxTime: 45000,
    maxTimeIntervals: [36000, 27000, 18000, 9000],
    lives: 3,
    board: 'g',
    style: {'justify-content': 'flex-end'},
    before: "#pond {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'Level 2 (justify-content 2)',
    instructions: {
      'en': '<p>Use <code>justify-content</code> again to help these frogs get to their lilypads. Remember that this CSS property aligns items horizontally and accepts the following values:</p><ul><li><code>flex-start</code>: Items align to the left side of the container.</li><li><code>flex-end</code>: Items align to the right side of the container.</li><li><code>center</code>: Items align at the center of the container.</li><li><code>space-between</code>: Items display with equal spacing between them.</li><li><code>space-around</code>: Items display with equal spacing around them.</li></ul>',
      'de': '<p>Benutze erneut <code>justify-content</code>, um diese Frösche zu ihren Seerosenblättern zu führen. Wie du weißt, richtet diese Eigenschaft die Elemente horizontal aus und akzeptiert die folgenden Werte:</p><ul><li><code>flex-start</code>: Elemente an der linken Seite des Containers ausrichten.</li><li><code>flex-end</code>: Elemente an der rechten Seite des Containers ausrichten.</li><li><code>center</code>: Elemente an der Mitte des Containers ausrichten.</li><li><code>space-between</code>: Elemente mit gleichem Innenabstand ausrichten.</li><li><code>space-around</code>: Elemente mit gleichem Außenabstand ausrichten.</li></ul>',
    },
    maxPoints: 500,
    maxTime: 45000,
    maxTimeIntervals: [36000, 27000, 18000, 9000],
    lives: 3,
    board: 'gy',
    style: {'justify-content': 'center'},
    before: "#pond {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'Level 3 (justify-content 3)',
    instructions: {
      'en': '<p>Help all three frogs find their lilypads just by using <code>justify-content</code>. This time, the lilypads have lots of space all around them.</p><p>If you find yourself forgetting the possible values for a property, you can click on the property name to view them. Try clicking on <code>justify-content</code>.</p>',
      'de': '<p>Hilf den drei Fröschen, ihre Seerosenblätter zu finden, indem du <code>justify-content</code> verwendest. Dieses Mal haben die Seerosenblätter einen großen Außenabstand.</p><p>Falls du die möglichen Werte einer Eigenschaft vergessen haben solltest, kannst du den Mauszeiger über den Namen einer Eigenschaft bewegen. Versuche es bei <code>justify-content</code>.</p>',
    },
    maxPoints: 500,
    maxTime: 40000,
    maxTimeIntervals: [32000, 24000, 16000, 8000],
    lives: 3,
    board: 'gyr',
    style: {'justify-content': 'space-around'},
    before: "#pond {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'Level 4 (justify-content 4)',
    instructions: {
      'en': '<p>Now the lilypads on the edges have drifted to the shore, increasing the space between them. Use <code>justify-content</code>. This time, the lilypads have equal spacing between them.</p>',
      'de': '<p>Inzwischen sind die äußeren Seerosenblätter weiter nach außen getrieben und haben so den Abstand noch weiter vergrößert. Benutze <code>justify-content</code>. Dieses Mal haben die Seerosenblätter einen gleichmäßigen Innenabstand.</p>',
    },
    maxPoints: 500,
    maxTime: 30000,
    maxTimeIntervals: [24000, 18000, 12000, 6000],
    lives: 3,
    board: 'gyr',
    style: {'justify-content': 'space-between'},
    before: "#pond {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'Level 5 (align-items 1)',
    instructions: {
      'en': '<p>Now use <code>align-items</code> to help the frogs get to the bottom of the pond. This CSS property aligns items vertically and accepts the following values:</p><ul><li><code>flex-start</code>: Items align to the top of the container.</li><li><code>flex-end</code>: Items align to the bottom of the container.</li><li><code>center</code>: Items align at the vertical center of the container.</li><li><code>baseline</code>: Items display at the baseline of the container.</li><li><code>stretch</code>: Items are stretched to fit the container.</li></ul>',
      'de': '<p>Verwende nun <code>align-items</code>, um den Fröschen zu helfen, das untere Ende des Teichs zu erreichen. Diese CSS-Eigenschaft richtet die Elemente vertikal aus und akzeptiert die folgenden Werte:</p><ul><li><code>flex-start</code>: Elemente oben am Container ausrichten.</li><li><code>flex-end</code>: Elemente unten am Container ausrichten.</li><li><code>center</code>: Elemente mittig im Container ausrichten.</li><li><code>baseline</code>: Elemente an der Grundlinie des Containers ausrichten.</li><li><code>stretch</code>: Elemente strecken, um den Container auszufüllen.</li></ul>',
    },
    maxPoints: 500,
    maxTime: 40000,
    maxTimeIntervals: [32000, 24000, 16000, 8000],
    lives: 3,
    board: 'gyr',
    style: {'align-items': 'flex-end'},
    before: "#pond {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'Level 6 (align-items 2)',
    instructions: {
      'en': '<p>Lead the frog to the center of the pond using a combination of <code>justify-content</code> and <code>align-items</code>.</p>',
      'de': '<p>Führe den Frosch zur Mitte des Teichs, indem du <code>justify-content</code> und <code>align-items</code> in kombinierst.</p>',
    },
    maxPoints: 1000,
    maxTime: 60000,
    maxTimeIntervals: [48000, 36000, 24000, 12000],
    lives: 4,
    board: 'g',
    style: {'justify-content': 'center', 'align-items': 'center'},
    before: "#pond {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'Level 7 (align-items 3)',
    instructions: {
      'en': '<p>The frogs need to cross the pond again, this time for some lilypads with plenty of space around them. Use a combination of <code>justify-content</code> and <code>align-items</code>.</p>',
      'de': '<p>Die Frösche müssen den Teich erneut überqueren. Dieses Mal haben die Seerosenblätter eine ganze Menge Abstand zueinander. Kombiniere <code>justify-content</code> und <code>align-items</code>.</p>',
    },
    maxPoints: 1000,
    maxTime: 50000,
    maxTimeIntervals: [40000, 30000, 20000, 10000],
    lives: 4,
    board: 'gyr',
    style: {'justify-content': 'space-around', 'align-items': 'flex-end'},
    before: "#pond {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'Level 8 (flex-direction 1)',
    instructions: {
      'en': '<p>The frogs need to get in the same order as their lilypads using <code>flex-direction</code>. This CSS property defines the direction items are placed in the container, and accepts the following values:</p><ul><li><code>row</code>: Items are placed the same as the text direction.</li><li><code>row-reverse</code>: Items are placed opposite to the text direction.</li><li><code>column</code>: Items are placed top to bottom.</li><li><code>column-reverse</code>: Items are placed bottom to top.</li></ul>',
      'de': '<p>Die Frösche müssen mit Hilfe von <code>flex-direction</code> in die Reihenfolge der Seerosenblätter gebracht werden. Diese CSS-Eigenschaft legt die Ausrichtung der Elemente in einem Container fest und akzeptiert die folgenden Werte:</p><ul><li><code>row</code>: Elemente in Textrichtung ausrichten.</li><li><code>row-reverse</code>: Elemente entgegen der Textrichtung ausrichten.</li><li><code>column</code>: Elemente von oben nach unten ausrichten.</li><li><code>column-reverse</code>: Elemente von unten nach oben ausrichten.</li></ul>',
    },
    maxPoints: 1000,
    maxTime: 50000,
    maxTimeIntervals: [40000, 30000, 20000, 10000],
    lives: 4,
    board: 'gyr',
    style: {'flex-direction': 'row-reverse'},
    before: "#pond {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'Level 9 (flex-direction 2)',
    instructions: {
      'en': '<p>Help the frogs find their column of lilypads using <code>flex-direction</code>. This CSS property defines the direction items are placed in the container, and accepts the following values:</p><ul><li><code>row</code>: Items are placed the same as the text direction.</li><li><code>row-reverse</code>: Items are placed opposite to the text direction.</li><li><code>column</code>: Items are placed top to bottom.</li><li><code>column-reverse</code>: Items are placed bottom to top.</li></ul>',
      'de': '<p>Hilf den Fröschen dabei, die Seerosenblätter zu erreichen, indem du <code>flex-direction</code> verwendest. Diese CSS-Eigenschaft legt die Richtung fest, in der die Elemente im Container platziert werden. Sie akzeptiert die folgenden Werte:</p><ul><li><code>row</code>: Elemente in Textrichtung ausrichten.</li><li><code>row-reverse</code>: Elemente entgegen der Textrichtung ausrichten.</li><li><code>column</code>: Elemente von oben nach unten ausrichten.</li><li><code>column-reverse</code>: Elemente von unten nach oben ausrichten.</li></ul>',
    },
    maxPoints: 1000,
    maxTime: 60000,
    maxTimeIntervals: [48000, 36000, 24000, 12000],
    lives: 4,
    board: 'gyr',
    style: {'flex-direction': 'column'},
    before: "#pond {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'Level 10 (flex-direction 3)',
    instructions: {
      'en': '<p>Help the frogs get to their own lilypads. Although they seem close, it will take both <code>flex-direction</code> and <code>justify-content</code> to get them there.</p><p>Notice that when you set the direction to a reversed row or column, start and end are also reversed.</p>',
      'de': '<p>Hilf den Fröschen, ihr Seerosenblatt zu erreichen. Obwohl sie nah dran sind, benötigst du sowohl <code>flex-direction</code>, als auch <code>justify-content</code>, um sie ans Ziel zu führen.</p><p>Hinweis: Wenn du eine umgekehrte Ausrichtung verwendest, sind Start und Ende auch umgedreht.</p>',
    },
    maxPoints: 1000,
    maxTime: 60000,
    maxTimeIntervals: [48000, 36000, 24000, 12000],
    lives: 4,
    board: 'gyr',
    style: {'flex-direction': 'row-reverse', 'justify-content': 'flex-end'},
    before: "#pond {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'Level 11 (flex-direction 4)',
    instructions: {
      'en': '<p>Help the frogs find their lilypads using <code>flex-direction</code> and <code>justify-content</code>.</p><p>Notice that when the flex direction is a column, <code>justify-content</code> changes to the vertical and <code>align-items</code> to the horizontal.</p>',
      'de': '<p>Hilf den Fröschen mit <code>flex-direction</code> und <code>justify-content</code>, ihr Seerosenblatt zu finden.</p><p>Hinweis: Wenn du eine vertikale Ausrichtung wählst, beeinflusst <code>justify-content</code> die vertikale Ausrichtung und <code>align-items</code> die horizontale.</p>',
    },
    maxPoints: 1000,
    maxTime: 60000,
    maxTimeIntervals: [48000, 36000, 24000, 12000],
    lives: 4,
    board: 'gyr',
    style: {'flex-direction': 'column', 'justify-content': 'flex-end'},
    before: "#pond {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'Level 12 (flex-direction 5)',
    instructions: {
      'en': '<p>Help the frogs find their lilypads using <code>flex-direction</code> and <code>justify-content</code>.</p>',
      'de': '<p>Hilf den Fröschen mit <code>flex-direction</code> und <code>justify-content</code>, ihr Seerosenblatt zu finden.</p>',
    },
    maxPoints: 1000,
    maxTime: 60000,
    maxTimeIntervals: [48000, 36000, 24000, 12000],
    lives: 4,
    board: 'gyr',
    style: {'flex-direction': 'column-reverse', 'justify-content': 'space-between'},
    before: "#pond {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'Level 13 (flex-direction 6)',
    instructions: {
      'en': '<p>Help the frogs find their lilypads using <code>flex-direction</code>, <code>justify-content</code>, and <code>align-items</code>.</p>',
      'de': '<p>Hilf den Fröschen mit <code>flex-direction</code>, <code>justify-content</code> und <code>align-items</code>, ihr Seerosenblatt zu finden.</p>',
    },
    maxPoints: 1500,
    maxTime: 80000,
    maxTimeIntervals: [64000, 48000, 32000, 16000],
    lives: 5,
    board: 'gyr',
    style: {'flex-direction': 'row-reverse', 'justify-content': 'center', 'align-items': 'flex-end'},
    before: "#pond {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'Level 14 (order 1)',
    instructions: {
      'en': '<p>Sometimes reversing the row or column order of a container is not enough. In these cases, we can apply the <code>order</code> property to individual items. By default, items have a value of 0, but we can use this property to also set it to a positive or negative integer value (-2, -1, 0, 1, 2).</p><p>Use the <code>order</code> property to reorder the frogs according to their lilypads.</p>',
      'de': '<p>Manchmal reicht es nicht aus, die horizontale oder vertikale Ausrichtung eines Containers umzukehren. In so einem Fall können wir die <code>order</code>-Eigenschaft für einzelne Elemente verwenden. Standardmäßig haben alle Elemente den Wert 0, aber wir können die Eigenschaft verwenden, um ihn auf eine positive oder negative ganze Zahl zu setzen.</p><p>Benutze die <code>order</code>-Eigenschaft, um die Frösche entsprechend ihrer Seerosenblätter anzuordnen.</p>',
    },
    maxPoints: 500,
    maxTime: 45000,
    maxTimeIntervals: [36000, 27000, 18000, 9000],
    lives: 3,
    board: 'gyr',
    selector: '> :nth-child(2)',
    classes: {'#pond, #background': 'wrap'},
    style: {'order': '2'},
    before: "#pond {\n  display: flex;\n}\n\n.yellow {\n",
    after: "}"
  },
  {
    name: 'Level 15 (order 2)',
    instructions: {
      'en': '<p>Use the <code>order</code> property to send the red frog to his lilypad.</p>',
      'de': '<p>Benutze die <code>order</code>-Eigenschaft, um den roten Frosch zu seinem Seerosenblatt zu führen.</p>',
    },
    maxPoints: 500,
    maxTime: 40000,
    maxTimeIntervals: [32000, 24000, 16000, 8000],
    lives: 3,
    board: 'gggrg',
    selector: '> :nth-child(4)',
    classes: {'#pond, #background': 'wrap'},
    style: {'order': '-1'},
    before: "#pond {\n  display: flex;\n}\n\n.red {\n",
    after: "}"
  },
  {
    name: 'Level 16 (align-self 1)',
    instructions: {
      'en': '<p>Another property you can apply to individual items is <code>align-self</code>. This property accepts the same values as <code>align-items</code> and its value for the specific item.</p>',
      'de': '<p><code>align-self</code> ist eine weitere Eigenschaft für einzelne Elemente. Sie akzeptiert die gleichen Werte wie <code>align-items</code>.</p>',
    },
    maxPoints: 500,
    maxTime: 45000,
    maxTimeIntervals: [36000, 27000, 18000, 9000],
    lives: 3,
    board: 'ggygg',
    selector: '> :nth-child(3)',
    style: {'align-self': 'flex-end'},
    before: "#pond {\n  display: flex;\n  align-items: flex-start;\n}\n\n.yellow {\n",
    after: "}"
  },
  {
    name: 'Level 17 (align-self 2)',
    instructions: {
      'en': '<p>Combine <code>order</code> with <code>align-self</code> to help the frogs to their destinations.</p>',
      'de': '<p>Kombiniere <code>order</code> mit <code>align-self</code>, um die Frösche zum Ziel zu bringen.</p>',
    },
    maxPoints: 1000,
    maxTime: 60000,
    maxTimeIntervals: [48000, 36000, 24000, 12000],
    lives: 4,
    board: 'ygygg',
    selector: '> .yellow',
    style: {'align-self': 'flex-end', 'order': '2'},
    before: "#pond {\n  display: flex;\n  align-items: flex-start;\n}\n\n.yellow {\n",
    after: "}"
  },
  {
    name: 'Level 18 (flex-wrap 1)',
    instructions: {
      'en': '<p>Oh no! The frogs are all squeezed onto a single row of lilypads. Spread them out using the <code>flex-wrap</code> property, which accepts the following values:</p><ul><li><code>nowrap</code>: Every item is fit to a single line.</li><li><code>wrap</code>: Items wrap around to additional lines.</li><li><code>wrap-reverse</code>: Items wrap around to additional lines in reverse.</li></ul>',
      'de': '<p>Oh nein! Alle Frösche sind in eine Reihe von Seerosenblättern gequetscht. Verteile sie mit der <code>flex-wrap</code>-Eigenschaft, welche die folgenden Werte akzeptiert:</p><ul><li><code>nowrap</code>: Alle Elemente in einer einzigen Zeile platzieren.</li><li><code>wrap</code>: Elemente auf zusätzliche Zeilen umbrechen.</li><li><code>wrap-reverse</code>: Elemente in umgekehrter Reihenfolge auf zusätzliche Zeilen umbrechen.</li></ul>',
    },
    maxPoints: 500,
    maxTime: 45000,
    maxTimeIntervals: [36000, 27000, 18000, 9000],
    lives: 3,
    board: 'ygggggr',
    style: {'flex-wrap': 'wrap'},
    before: "#pond {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'Level 19 (flex-wrap 2)',
    instructions: {
      'en': '<p>Help this army of frogs form three orderly columns using a combination of <code>flex-direction</code> and <code>flex-wrap</code>.</p>',
      'de': '<p>Hilf dieser Frosch-Armee, mit <code>flex-direction</code> und <code>flex-wrap</code> drei ordentliche Spalten zu formen.</p>',
    },
    maxPoints: 1000,
    maxTime: 50000,
    maxTimeIntervals: [40000, 30000, 20000, 10000],
    lives: 4,
    board: 'gggggrrrrryyyyy',
    style: {'flex-direction': 'column', 'flex-wrap': 'wrap'},
    before: "#pond {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'Level 20 (flex-flow 1)',
    instructions: {
      'en': '<p>The two properties <code>flex-direction</code> and <code>flex-wrap</code> are used so often together that the shorthand property <code>flex-flow</code> was created to combine them. This shorthand property accepts the value of the two properties separated by a space.</p><p>For example, you can use <code>flex-flow: row wrap</code> to set rows and wrap them.</p><p>Try using <code>flex-flow</code> to repeat the previous level.</p>',
      'de': '<p>Die beiden Eigenschaften <code>flex-direction</code> und <code>flex-wrap</code> werden so oft gemeinsam verwendet, dass sie über die Kurzschreibweise <code>flex-flow</code> kombiniert werden können. Diese akzeptiert, durch ein Leerzeichen getrennt, die Werte beider Eigenschaften.</p><p>Du kannst zum Beispiel <code>flex-flow: row wrap</code> benutzen, um umbrechende Zeilen zu verwenden.</p><p>Versuche das vorige Level einmal mit <code>flex-flow</code>.</p>',
    },
    maxPoints: 500,
    maxTime: 45000,
    maxTimeIntervals: [36000, 27000, 18000, 9000],
    lives: 3,
    board: 'gggggrrrrryyyyy',
    style: {'flex-flow': 'column wrap'},
    before: "#pond {\n  display: flex;\n",
    after: "}"
  },
  {
    name: 'Level 21 (align-content 1)',
    instructions: {
      'en': '<p>The frogs are spread all over the pond, but the lilypads are bunched at the top. You can use <code>align-content</code> to set how multiple lines are spaced apart from each other. This property takes the following values:</p><ul><li><code>flex-start</code>: Lines are packed at the top of the container.</li><li><code>flex-end</code>: Lines are packed at the bottom of the container.</li><li><code>center</code>: Lines are packed at the vertical center of the container.</li><li><code>space-between</code>: Lines display with equal spacing between them.</li><li><code>space-around</code>: Lines display with equal spacing around them.</li><li><code>stretch</code>: Lines are stretched to fit the container.</li></ul><p>This can be confusing, but <code>align-content</code> determines the spacing between lines, while <code>align-items</code> determines how the items as a whole are aligned within the container. When there is only one line, <code>align-content</code> has no effect.</p>',
      'de': '<p>Die Frösche sind über den gesamten Teich verteilt, aber die Seerosenblätter befinden sich alle am oberen Ende. Du kannst <code>align-content</code> verwenden, um festzulegen, wie der Abstand zwischen mehreren Zeilen aussehen soll. Diese Eigenschaft akzeptiert die folgenden Werte:</p><ul><li><code>flex-start</code>: Zeilen oben im Container ausrichten.</li><li><code>flex-end</code>: Zeilen unten im Container ausrichten.</li><li><code>center</code>: Zeilen in der Mitte des Containers ausrichten.</li><li><code>space-between</code>: Zeilen mit gleichmäßigem Innenabstand anordnen.</li><li><code>space-around</code>: Zeilen mit gleichmäßigem Außenabstand anordnen.</li><li><code>stretch</code>: Zeilen strecken, um den Container auszufüllen.</li></ul><p>Das kann etwas verwirrend sein, aber <code>align-content</code> beeinflusst den Abstand zwischen den Zeilen, wobei <code>align-items</code> festlegt, wie alle Elemente als Ganzes im Container angeordnet werden. Gibt es nur eine Zeile, so hat <code>align-content</code> keine Auswirkung.</p>',
    },
    maxPoints: 500,
    maxTime: 50000,
    maxTimeIntervals: [40000, 30000, 20000, 10000],
    lives: 3,
    board: 'ggggggggggggggg',
    classes: {'#pond, #background': 'wrap'},
    style: {'align-content': 'flex-start'},
    before: "#pond {\n  display: flex;\n  flex-wrap: wrap;\n",
    after: "}"
  },
  {
    name: 'Level 22 (align-content 2)',
    instructions: {
      'en': '<p>Now the current has bunched the lilypads at the bottom. Use <code>align-content</code> to guide the frogs there.</p>',
      'de': '<p>Der Strom hat die Seerosenblätter nach unten getrieben. Benutze <code>align-content</code>, um die Frösche dorthin zu führen.</p>',
    },
    maxPoints: 500,
    maxTime: 30000,
    maxTimeIntervals: [24000, 18000, 12000, 60000],
    lives: 3,
    board: 'ggggggggggggggg',
    classes: {'#pond, #background': 'wrap'},
    style: {'align-content': 'flex-end'},
    before: "#pond {\n  display: flex;\n  flex-wrap: wrap;\n",
    after: "}"
  },
  {
    name: 'Level 23 (align-content 3)',
    instructions: {
      'en': '<p>The frogs have had a party, but it is time to go home. Use a combination of <code>flex-direction</code> and <code>align-content</code> to get them to their lilypads.</p>',
      'de': '<p>Die Frösche haben eine Party gefeiert, aber nun ist es Zeit, nach Hause zu gehen. Benutze eine Kombination aus <code>flex-direction</code> und <code>align-content</code>, um sie zu ihren Seerosenblättern zu führen.</p>',
    },
    maxPoints: 1000,
    maxTime: 45000,
    maxTimeIntervals: [36000, 27000, 18000, 9000],
    lives: 4,
    board: 'rgggyrgggyrgggy',
    classes: {'#pond, #background': 'wrap'},
    style: {'flex-direction': 'column-reverse', 'align-content': 'center'},
    before: "#pond {\n  display: flex;\n  flex-wrap: wrap;\n",
    after: "}"
  },
  {
    name: 'Level 24 (align-content 4)',
    instructions: {
      'en': '<p>Bring the frogs home one last time by using the CSS properties you\'ve learned:</p><ul><li><code>justify-content</code></li><li><code>align-items</code></li><li><code>flex-direction</code></li><li><code>order</code></li><li><code>align-self</code></li><li><code>flex-wrap</code></li><li><code>flex-flow</code></li><li><code>align-content</code><img src="https://code.org/api/hour/finish_flexbox_froggy.png"></li></ul>',
      'de': '<p>Bringe die Frösche ein letztes Mal mit allen gelernten CSS-Eigenschaften nach Hause:</p><ul><li><code>justify-content</code></li><li><code>align-items</code></li><li><code>flex-direction</code></li><li><code>order</code></li><li><code>align-self</code></li><li><code>flex-wrap</code></li><li><code>flex-flow</code></li><li><code>align-content</code></li></ul>',
    },
    maxPoints: 4000,
    maxTime: 120000,
    maxTimeIntervals: [96000, 72000, 48000, 24000],
    lives: 5,
    board: 'rggggyy',
    style: {'flex-direction': 'column-reverse', 'flex-wrap': 'wrap-reverse', 'align-content': 'space-between', 'justify-content': 'center'},
    before: "#pond {\n  display: flex;\n",
    after: "}"
  }
];

var levelWin = {
  name: 'win',
  instructions: {
    'en': '<p>You win! Thanks to your mastery of flexbox, you were able to help all of the frogs to their lilypads. Just look how hoppy they are!</p><p>If you found this ribbeting, be sure to visit <a href="https://codepip.com/games/grid-garden/">Grid Garden</a> to learn about another powerful new feature of CSS layout. You can also find other coding games over at <a href="https://codepip.com/">Codepip</a>. And be sure to share Flexbox Froggy with your friends!</p>',
    'de': '<p>Gewonnen! Dank deines flexbox-Könnens warst du in der Lage, alle Frösche zu ihrem Seerosenblatt zu führen. Sieh dir an, wie glücklich sie sind!</p><p>Wenn dir das gefallen hat, schau dir meine anderen Projekte auf meinem <a href="https://thomaspark.co">Blog</a> oder <a href="https://twitter.com/thomashpark">Twitter</a> an und teile Flexbox Froggy mit deinen Freunden!</p>',
  },
  maxPoints: 500,
  maxTimeIntervals: [15000, 30000, 45000, 60000, 120],
  board: 'gyrgyrgyrgyrgyrgyrgyrgyrg',
  classes: {'#pond, #background': 'wrap'},
  style: {},
  before: "#pond {\n  display: flex;\n",
  after: "}"
};
