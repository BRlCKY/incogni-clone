import { useEffect, useMemo, useState } from "react";
import GlassComp from "../GlassComp";
import InputComp from "../InputComp";
import SearchbarComp from "../SearchbarComp";
import { getAccessibleClickProps } from "../../utils/accessibility";
import { Broker, BrokerStatus } from "../../../../shared/types";

type SortKey = "name" | "email" | "website" | "locale";
type SortDirection = "asc" | "desc";

const BrokerListComp = () => {
    const [brokers, setBrokers] = useState<Broker[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [isCreatingBroker, setIsCreatingBroker] = useState(false);
    const [draftBroker, setDraftBroker] = useState<Omit<Broker, "id">>({
        name: "",
        email: "",
        website: "",
        locale: "",
        status: BrokerStatus.NEW,
        latestLog: "",
        latestLogTimestamp: new Date(0).toISOString(),
    });

    useEffect(() => {
        fetch("http://localhost:3000/brokers")
            .then((response) => response.json())
            .then((data) => setBrokers(data))
            .catch((error) => {
                console.error("Error fetching brokers:", error);
            });
    }, []);

    const setDraftBrokerField = (field: keyof Omit<Broker, "id">, value: string) => {
        setDraftBroker((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection((previous) => (previous === "asc" ? "desc" : "asc"));
            return;
        }

        setSortKey(key);
        setSortDirection("asc");
    };

    const openDraftBrokerRow = () => {
        setDraftBroker({
            name: "",
            email: "",
            website: "",
            locale: "",
            status: BrokerStatus.NEW,
            latestLog: "",
            latestLogTimestamp: new Date(0).toISOString(),
        });
        setIsCreatingBroker(true);
    };

    const closeDraftBrokerRow = () => {
        setIsCreatingBroker(false);
        setDraftBroker({
            name: "",
            email: "",
            website: "",
            locale: "",
            status: BrokerStatus.NEW,
            latestLog: "",
            latestLogTimestamp: new Date(0).toISOString(),
        });
    };

    const handleSaveDraftBroker = () => {
        const name = draftBroker.name.trim();
        const email = draftBroker.email.trim();
        const website = draftBroker.website.trim();
        const locale = draftBroker.locale.trim();

        if (!name || !email) {
            return;
        }

        fetch("http://localhost:3000/brokers/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, website, locale }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add broker");
                }
                return response.json();
            })
            .then((newBroker: Broker) => {
                setBrokers((previous) => [...previous, newBroker]);
                closeDraftBrokerRow();
            })
            .catch((error) => {
                console.error("Error adding broker:", error);
            });
    };

    const handleRemoveBroker = (id: number) => {
        fetch(`http://localhost:3000/brokers/${id}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to remove broker");
                }
                return response.json();
            })
            .then(() => {
                setBrokers((previous) => previous.filter((broker) => broker.id !== id));
            })
            .catch((error) => {
                console.error("Error removing broker:", error);
            });
    };

    const displayedBrokers = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();
        const filtered = normalizedQuery
            ? brokers.filter((broker) =>
                  [broker.name, broker.email, broker.website, broker.locale]
                      .join(" ")
                      .toLowerCase()
                      .includes(normalizedQuery),
              )
            : brokers;

        return [...filtered].sort((brokerA, brokerB) => {
            const valueA = brokerA[sortKey].toLowerCase();
            const valueB = brokerB[sortKey].toLowerCase();
            const comparison = valueA.localeCompare(valueB);

            return sortDirection === "asc" ? comparison : comparison * -1;
        });
    }, [brokers, searchQuery, sortDirection, sortKey]);

    const renderSortLabel = (label: string, key: SortKey) => {
        if (sortKey !== key) {
            return `${label} <>`;
        }

        return `${label} ${sortDirection === "asc" ? "↑" : "↓"}`;
    };

    const getAriaSort = (key: SortKey) =>
        sortKey === key ? (sortDirection === "asc" ? "ascending" : "descending") : "none";

    const isDraftComplete = draftBroker.name.trim().length > 0 && draftBroker.email.trim().length > 0;

    return (
        <div className="h-full-respect-nav w-full overflow-y-auto p-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 pb-24">
                <GlassComp
                    width="100%"
                    height="auto"
                    tintOpacity={0.5}
                    className="rounded-3xl border border-gray-700 p-6"
                >
                    <div className="w-full">
                        <div className="mb-5">
                            <h1 className="text-xl font-semibold text-white">Broker-Verwaltung</h1>
                            <p className="mt-1 text-sm text-gray-400">
                                Broker direkt in der Tabelle hinzufügen, sortieren und entfernen.
                            </p>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <div className="text-sm text-gray-300">
                                Zeige {displayedBrokers.length} von {brokers.length} Brokern
                            </div>
                            <div className="flex min-w-[560px] items-center justify-end gap-3">
                                <GlassComp
                                  width={128}
                                  height={40}
                                  borderRadius={999}
                                  tintOpacity={0.52}
                                  className={`border border-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                                      isCreatingBroker
                                          ? "cursor-not-allowed opacity-60"
                                          : "cursor-pointer hover:bg-gray-800/50"
                                  }`}
                                  onClick={isCreatingBroker ? undefined : openDraftBrokerRow}
                                  isHoverable={isCreatingBroker ? false : true}
                                  {...getAccessibleClickProps(isCreatingBroker ? undefined : openDraftBrokerRow, {
                                      label: "Neuen Broker hinzufuegen",
                                      disabled: isCreatingBroker,
                                  })}
                                >
                                    <p className="text-sm font-semibold text-white">+ Broker</p>
                                </GlassComp>
                                <div className="w-[380px]">
                                    <SearchbarComp
                                      value={searchQuery}
                                      onChange={(event) => setSearchQuery(event.target.value)}
                                      placeholder="Broker suchen"
                                      aria-label="Broker suchen"
                                      containerClassName="w-full"
                                      height={40}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-700 bg-black/30">
                            <table className="min-w-full text-left text-sm text-gray-200">
                                <thead className="bg-gray-900/80 text-xs uppercase tracking-wide text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3" aria-sort={getAriaSort("name")}>
                                            <button
                                                type="button"
                                                className="font-semibold hover:text-white"
                                                onClick={() => handleSort("name")}
                                                aria-label="Broker nach Name sortieren"
                                            >
                                                {renderSortLabel("Name", "name")}
                                            </button>
                                        </th>
                                        <th className="px-4 py-3" aria-sort={getAriaSort("email")}>
                                            <button
                                                type="button"
                                                className="font-semibold hover:text-white"
                                                onClick={() => handleSort("email")}
                                                aria-label="Broker nach E-Mail sortieren"
                                            >
                                                {renderSortLabel("E-Mail", "email")}
                                            </button>
                                        </th>
                                        <th className="px-4 py-3" aria-sort={getAriaSort("website")}>
                                            <button
                                                type="button"
                                                className="font-semibold hover:text-white"
                                                onClick={() => handleSort("website")}
                                                aria-label="Broker nach Webseite sortieren"
                                            >
                                                {renderSortLabel("Webseite", "website")}
                                            </button>
                                        </th>
                                        <th className="px-4 py-3" aria-sort={getAriaSort("locale")}>
                                            <button
                                                type="button"
                                                className="font-semibold hover:text-white"
                                                onClick={() => handleSort("locale")}
                                                aria-label="Broker nach Sprache oder Land sortieren"
                                            >
                                                {renderSortLabel("Sprache / Land", "locale")}
                                            </button>
                                        </th>
                                        <th className="px-4 py-3 text-right">Aktionen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isCreatingBroker && (
                                        <tr className="border-t border-gray-700/60 bg-gray-900/20">
                                            <td className="px-4 py-3 align-top">
                                                <InputComp
                                                  height={30}
                                                  placeholder="Broker-Name *"
                                                  aria-label="Broker-Name"
                                                  value={draftBroker.name}
                                                  onChange={(event) => setDraftBrokerField("name", event.target.value)}
                                                  className="h-[34px] px-3 text-xs"
                                                />
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <InputComp
                                                  height={30}
                                                  type="email"
                                                  placeholder="E-Mail *"
                                                  aria-label="Broker E-Mail"
                                                  value={draftBroker.email}
                                                  onChange={(event) => setDraftBrokerField("email", event.target.value)}
                                                  className="h-[34px] px-3 text-xs"
                                                />
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <InputComp
                                                  height={30}
                                                  type="url"
                                                  placeholder="https://..."
                                                  aria-label="Broker Webseite"
                                                  value={draftBroker.website}
                                                  onChange={(event) => setDraftBrokerField("website", event.target.value)}
                                                  className="h-[34px] px-3 text-xs"
                                                />
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <InputComp
                                                  height={30}
                                                  placeholder="Sprache / Land"
                                                  aria-label="Broker Sprache oder Land"
                                                  value={draftBroker.locale}
                                                  onChange={(event) => setDraftBrokerField("locale", event.target.value)}
                                                  className="h-[34px] px-3 text-xs"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right align-center">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                      type="button"
                                                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                                                          isDraftComplete
                                                              ? "bg-emerald-700 text-white hover:bg-emerald-600"
                                                              : "cursor-not-allowed bg-emerald-900/40 text-emerald-200/50"
                                                      }`}
                                                      onClick={handleSaveDraftBroker}
                                                      disabled={!isDraftComplete}
                                                      aria-label="Neuen Broker speichern"
                                                    >
                                                        Speichern
                                                    </button>
                                                    <button
                                                      type="button"
                                                      className="rounded-full bg-gray-700 px-3 py-1 text-xs font-semibold text-white hover:bg-gray-600"
                                                      onClick={closeDraftBrokerRow}
                                                      aria-label="Neuen Broker verwerfen"
                                                    >
                                                        Abbrechen
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {displayedBrokers.map((broker) => (
                                        <tr key={broker.id} className="border-t border-gray-700/60">
                                            <td className="px-4 py-3 font-medium text-white">{broker.name}</td>
                                            <td className="px-4 py-3 text-gray-300">{broker.email}</td>
                                            <td className="px-4 py-3">
                                                <a
                                                    className="text-blue-300 underline-offset-2 hover:underline"
                                                    href={broker.website}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    aria-label={`Broker-Webseite oeffnen: ${broker.name}`}
                                                >
                                                    {broker.website}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3 text-gray-300">{broker.locale}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    type="button"
                                                    className="rounded-full bg-red-800/70 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                                                    onClick={() => handleRemoveBroker(broker.id)}
                                                    aria-label={`Broker entfernen: ${broker.name}`}
                                                >
                                                    Entfernen
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {displayedBrokers.length === 0 && (
                                        <tr className="border-t border-gray-700/60">
                                            <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                                                Keine Broker gefunden.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </GlassComp>
            </div>
        </div>
    );
};

export default BrokerListComp;
