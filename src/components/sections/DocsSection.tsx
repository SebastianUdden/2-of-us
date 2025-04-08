const DocsSection = () => {
  return (
    <div className="space-y-8 mb-20">
      <section>
        <h2 className="text-2xl font-bold mb-4">Kom igång</h2>
        <p className="mb-4">
          Välkommen till ToDuo, en applikation för att hantera vardagliga
          uppgifter tillsammans. Så här kommer du igång:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Logga in med ditt google konto i bottenmenyn.</li>
          <li>Använd "Lägg till uppgift" för att skapa nya uppgifter.</li>
          <li>
            Klicka på en uppgift för att expandera och se/redigera detaljer.
          </li>
          <li>
            Använd flikarna för att växla mellan aktiva uppgifter, arkiverade
            uppgifter och dokumentationen.
          </li>
          <li>
            Filtrera uppgifter efter etiketter, slutförandestatus eller
            deadline.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Tangentbordsgenvägar</h2>
        <div>
          <h3 className="text-lg font-semibold mb-2">Navigera</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <kbd className="px-2 py-1 bg-black rounded">Cmd/Ctrl</kbd> +{" "}
              <kbd className="px-2 py-1 bg-black rounded">↑</kbd> - Scrolla till
              toppen av sidan
            </li>
            <li>
              <kbd className="px-2 py-1 bg-black rounded">Cmd/Ctrl</kbd> +{" "}
              <kbd className="px-2 py-1 bg-black rounded">↓</kbd> - Scrolla till
              botten av sidan
            </li>
            <li>
              <kbd className="px-2 py-1 bg-black rounded">Cmd/Ctrl</kbd> +{" "}
              <kbd className="px-2 py-1 bg-black rounded">←</kbd> - Gå till
              föregående flik
            </li>
            <li>
              <kbd className="px-2 py-1 bg-black rounded">Cmd/Ctrl</kbd> +{" "}
              <kbd className="px-2 py-1 bg-black rounded">→</kbd> - Gå till
              nästa flik
            </li>
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
              <kbd className="px-2 py-1 bg-black rounded">↑</kbd> - Navigera
              till föregående uppgift
            </li>
            <li>
              <kbd className="px-2 py-1 bg-black rounded">↓</kbd> - Navigera
              till nästa uppgift
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Skapa uppgifter</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <kbd className="px-2 py-1 bg-black rounded">Cmd/Ctrl/Alt</kbd> +{" "}
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
            <h3 className="text-lg font-semibold mb-2">Ta bort uppgifter</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <kbd className="px-2 py-1 bg-black rounded">Cmd/Ctrl</kbd> +{" "}
                <kbd className="px-2 py-1 bg-black rounded">Backspace</kbd> - Ta
                bort expanderad uppgift
              </li>
              <li>
                <kbd className="px-2 py-1 bg-black rounded">Alt</kbd> +{" "}
                <kbd className="px-2 py-1 bg-black rounded">Backspace</kbd> - Ta
                bort sista deluppgiften i expanderad uppgift
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Hantera uppgifter</h3>
            <ul className="list-disc pl-6 space-y-2">
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
                <kbd className="px-2 py-1 bg-black rounded">Alt</kbd> +{" "}
                <kbd className="px-2 py-1 bg-black rounded">↑</kbd> - Flytta
                uppgift upp
              </li>
              <li>
                <kbd className="px-2 py-1 bg-black rounded">Alt</kbd> +{" "}
                <kbd className="px-2 py-1 bg-black rounded">↓</kbd> - Flytta
                uppgift ner
              </li>
              <li>
                <kbd className="px-2 py-1 bg-black rounded">Alt</kbd> +{" "}
                <kbd className="px-2 py-1 bg-black rounded">←</kbd> - Flytta
                uppgift högst upp
              </li>
              <li>
                <kbd className="px-2 py-1 bg-black rounded">Alt</kbd> +{" "}
                <kbd className="px-2 py-1 bg-black rounded">→</kbd> - Flytta
                uppgift längst ned
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

          {/* <div>
            <h3 className="text-lg font-semibold mb-2">Listor</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Skapa ordnade eller oordnade listor</li>
              <li>Lägg till objekt i listor</li>
              <li>Konvertera listor till uppgifter med deluppgifter</li>
            </ul>
          </div> */}

          <div>
            <h3 className="text-lg font-semibold mb-2">Organisation</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Filtrera uppgifter efter etiketter, slutförandestatus eller
                deadline
              </li>
              <li>Sortera uppgifter efter olika kriterier</li>
              <li>Sök bland alla uppgifter</li>
              <li>Expandera/minimera alla uppgifter samtidigt</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DocsSection;
