import { useState } from "react";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean; 
}

interface Broker {
  id: string | number;
  name: string;
  subject?: string;
  messages: ChatMessage[]; 
}

// Das sind die Broker, die du aktuell links in deiner Ansicht hast
const initialBrokers: Broker[] = [
  { id: "1", name: "Broker1", subject: "Rückfrage zu Vertrag #1234", messages: [] },
  { id: "2", name: "Broker2", subject: "Neue Konditionen ab sofort", messages: [] }, 
  { id: "3", name: "Broker3", subject: "Ihre Anfrage vom Dienstag", messages: [] },
  { id: "4", name: "Broker4", subject: "Wichtige Dokumente fehlen noch", messages: [] }, 
  { id: "5", name: "Broker5", subject: "Terminbestätigung für nächste Woche", messages: [] },  
  { id: "6", name: "Broker6", subject: "Jahresabrechnung 2025", messages: [] }
];

// Simulierte "Datenbank" von Brokern, die existieren, aber vielleicht noch nicht in der Liste links sind
const systemBrokers = [
  { id: "sys1", name: "Global Finance Broker" },
  { id: "sys2", name: "TradeRepublica" },
  { id: "sys3", name: "Scalable Investments" },
  { id: "sys4", name: "Immo Trust GmbH" }
];

const MailComp = () => {
  const [brokerList, setBrokerList] = useState<Broker[]>(initialBrokers);
  const [selectedBrokerId, setSelectedBrokerId] = useState<string>(String(initialBrokers[0].id));
  const [message, setMessage] = useState("");

  // --- NEUE STATES FÜR DAS MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addMode, setAddMode] = useState<"existing" | "new">("existing");
  const [selectedSystemBrokerId, setSelectedSystemBrokerId] = useState<string>(systemBrokers[0].id);
  const [newBrokerName, setNewBrokerName] = useState("");

  const selectedBroker = brokerList.find(b => String(b.id) === selectedBrokerId) || brokerList[0];

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSubject = e.target.value;
    setBrokerList(prevList => 
      prevList.map(broker => 
        String(broker.id) === selectedBrokerId 
          ? { ...broker, subject: newSubject } 
          : broker
      )
    );
  };

  const handleSend = () => {
    if (!message.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(), 
      text: message,
      isUser: true, 
    };

    setBrokerList(prevList => 
      prevList.map(broker => 
        String(broker.id) === selectedBrokerId 
          ? { ...broker, messages: [...broker.messages, newMessage] } 
          : broker
      )
    );

    setMessage("");
  };

  // --- FUNKTION ZUM HINZUFÜGEN EINES BROKERS ---
  const handleAddBroker = () => {
    let newBroker: Broker;

    if (addMode === "existing") {
      const sysBroker = systemBrokers.find(b => b.id === selectedSystemBrokerId);
      if (!sysBroker) return;
      
      // Prüfen, ob Broker schon in der Liste ist
      if (brokerList.find(b => String(b.id) === sysBroker.id)) {
        alert("Dieser Broker ist bereits in deiner Liste!");
        return;
      }
      
      newBroker = { id: sysBroker.id, name: sysBroker.name, subject: "", messages: [] };
    } else {
      if (!newBrokerName.trim()) return;
      // Neuen benutzerdefinierten Broker anlegen
      newBroker = { id: "custom_" + Date.now(), name: newBrokerName, subject: "", messages: [] };
    }

    // Broker zur Liste hinzufügen, direkt auswählen und Modal schließen
    setBrokerList([...brokerList, newBroker]);
    setSelectedBrokerId(String(newBroker.id));
    setIsModalOpen(false);
    setNewBrokerName("");
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-full-respect-nav w-full bg-transparent p-4 gap-4 overflow-hidden">
        
        {/* LINKE BOX */}
        <div className="w-full md:w-1/3 md:min-w-[250px] h-auto md:h-full bg-gray-800 rounded-2xl flex flex-row md:flex-col border border-gray-700 overflow-hidden shrink-0">
          <div className="hidden md:flex p-4 border-b border-gray-700 justify-between items-center">
            <h2 className="text-xl font-bold text-white">Brokers</h2>
            <button 
              onClick={() => setIsModalOpen(true)} // HIER GEÄNDERT: Öffnet das Modal
              className="p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Broker hinzufügen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex md:block overflow-x-auto md:overflow-y-auto md:overflow-x-hidden p-3 md:p-2 gap-3 md:space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {brokerList.map((broker) => (
              <button
                key={broker.id}
                onClick={() => setSelectedBrokerId(String(broker.id))}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 min-w-[140px] md:min-w-0 w-auto md:w-full border md:border-transparent text-left
                  ${
                    selectedBrokerId === String(broker.id)
                      ? "bg-gray-700 text-white shadow-md border-gray-600"
                      : "bg-gray-800/50 md:bg-transparent text-gray-400 hover:bg-gray-700/50 border-gray-700 md:border-transparent"
                  }`}
              >
                <div className="flex-1 overflow-hidden">
                  <div className="font-semibold text-sm md:text-base truncate">{broker.name}</div>
                  <div className="text-xs truncate mt-0.5 opacity-70">
                    {broker.subject || "Kein Betreff..."}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RECHTE BOX */}
        <div className="flex-1 bg-gray-800 rounded-2xl flex flex-col border border-gray-700 overflow-hidden min-h-0">
          
          <div className="p-3 md:p-4 border-b border-gray-700 flex flex-col gap-1 bg-gray-800/50 backdrop-blur-sm">
             <input
               type="text"
               value={selectedBroker.subject || ""} 
               onChange={handleSubjectChange}
               placeholder="Betreff eingeben..."
               className="w-full text-lg md:text-xl font-bold text-white bg-transparent border-b border-transparent focus:border-gray-600 focus:outline-none transition-colors px-1 -ml-1 placeholder-gray-500"
             />
             <div className="text-sm text-gray-400 flex items-center gap-1.5 px-1">
               <span>Broker:</span>
               <span className="font-medium text-gray-300">{selectedBroker.name}</span>
             </div>
          </div>

          <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-900/30 flex flex-col gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {selectedBroker.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
                 <span className="text-sm">Noch keine Nachrichten...</span>
              </div>
            ) : (
              selectedBroker.messages.map((msg) => (
                <div key={msg.id} className="flex w-full justify-start">
                  <div className="max-w-[85%] md:max-w-[75%] px-4 py-2.5 rounded-2xl text-sm md:text-base bg-blue-600 text-white rounded-bl-sm">
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 md:p-4 bg-gray-800 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nachricht..."
                className="flex-1 bg-gray-900 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 placeholder-gray-500 text-sm md:text-base"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={!message.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold px-4 md:px-6 py-2 rounded-xl transition-colors text-sm md:text-base"
              >
                Send
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* --- MODAL OVERLAY: BROKER HINZUFÜGEN --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md p-6 shadow-2xl flex flex-col gap-5">
            
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Broker hinzufügen</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* TABS ZUM UMSCHALTEN */}
            <div className="flex bg-gray-900 p-1 rounded-xl">
              <button 
                onClick={() => setAddMode("existing")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${addMode === "existing" ? "bg-gray-700 text-white shadow" : "text-gray-400 hover:text-gray-200"}`}
              >
                Vorhandenen wählen
              </button>
              <button 
                onClick={() => setAddMode("new")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${addMode === "new" ? "bg-gray-700 text-white shadow" : "text-gray-400 hover:text-gray-200"}`}
              >
                Neuen erstellen
              </button>
            </div>

            {/* TAB INHALT */}
            <div className="flex flex-col gap-2">
              {addMode === "existing" ? (
                <>
                  <label className="text-sm font-medium text-gray-300">Broker aus Datenbank:</label>
                  <select 
                    value={selectedSystemBrokerId}
                    onChange={(e) => setSelectedSystemBrokerId(e.target.value)}
                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {systemBrokers.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <label className="text-sm font-medium text-gray-300">Name des neuen Brokers:</label>
                  <input 
                    type="text" 
                    value={newBrokerName}
                    onChange={(e) => setNewBrokerName(e.target.value)}
                    placeholder="z.B. Finance Group..."
                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                    autoFocus
                  />
                </>
              )}
            </div>

            {/* BUTTONS UNTEN */}
            <div className="flex gap-3 mt-2">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 rounded-xl transition-colors"
              >
                Abbrechen
              </button>
              <button 
                onClick={handleAddBroker}
                disabled={addMode === "new" && !newBrokerName.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-2.5 rounded-xl transition-colors"
              >
                Hinzufügen
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );
};

export default MailComp;