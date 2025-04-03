import React from "react";

const DocsSection = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Kom igång</h2>
        <p className="mb-4">
          Välkommen till 2-of-us, en applikation för att hantera uppgifter och
          listor. Så här kommer du igång:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Använd "Lägg till uppgift" för att skapa nya uppgifter</li>
          <li>
            Klicka på en uppgift för att expandera och se/redigera detaljer
          </li>
          <li>
            Använd flikarna för att växla mellan aktiva uppgifter, arkiverade
            uppgifter och listor
          </li>
          <li>
            Filtrera uppgifter efter etiketter, slutförandestatus eller deadline
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Tangentbordsgenvägar</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Skapa uppgifter</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <kbd className="px-2 py-1 bg-black rounded">Cmd/Ctrl</kbd> +{" "}
                <kbd className="px-2 py-1 bg-black rounded">Space</kbd> - Skapa
                en ny uppgift
              </li>
              <li>
                <kbd className="px-2 py-1 bg-black rounded">Cmd/Ctrl</kbd> +{" "}
                <kbd className="px-2 py-1 bg-black rounded">Space</kbd> (med
                uppgift expanderad) - Skapa en deluppgift
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Hantera uppgifter</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <kbd className="px-2 py-1 bg-black rounded">Cmd/Ctrl</kbd> +{" "}
                <kbd className="px-2 py-1 bg-black rounded">M</kbd> -
                Expandera/minimera alla uppgifter
              </li>
              <li>
                <kbd className="px-2 py-1 bg-black rounded">Cmd/Ctrl</kbd> +{" "}
                <kbd className="px-2 py-1 bg-black rounded">0-9</kbd> -
                Minimera/maximera uppgift 1-10
              </li>
              <li>
                <kbd className="px-2 py-1 bg-black rounded">Cmd/Ctrl</kbd> +{" "}
                <kbd className="px-2 py-1 bg-black rounded">Enter</kbd> - Öppna
                redigeringsläge för expanderad uppgift
              </li>
              <li>
                <kbd className="px-2 py-1 bg-black rounded">Enter</kbd> - Spara
                ändringar i redigeringsläge
              </li>
              <li>
                <kbd className="px-2 py-1 bg-black rounded">Esc</kbd> - Stäng
                paneler och dialoger
              </li>
              <li>
                <kbd className="px-2 py-1 bg-black rounded">Cmd/Ctrl</kbd> +{" "}
                <kbd className="px-2 py-1 bg-black rounded">Backspace</kbd> - Ta
                bort expanderad uppgift
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Funktioner</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Uppgifter</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Skapa uppgifter med titel, beskrivning och deadline</li>
              <li>
                Lägg till deluppgifter för att bryta ner komplexa uppgifter
              </li>
              <li>Ändra prioritet genom att dra och släppa</li>
              <li>Lägg till etiketter för att kategorisera uppgifter</li>
              <li>Arkivera slutförda uppgifter</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Listor</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Skapa ordnade eller oordnade listor</li>
              <li>Lägg till objekt i listor</li>
              <li>Konvertera listor till uppgifter med deluppgifter</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Organisation</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Filtrera uppgifter efter etiketter, slutförandestatus eller
                deadline
              </li>
              <li>Sortera uppgifter efter olika kriterier</li>
              <li>Sök bland alla uppgifter och listor</li>
              <li>Expandera/minimera alla uppgifter samtidigt</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DocsSection;
