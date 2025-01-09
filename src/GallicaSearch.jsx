import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { xmlToJson } from "./xmlToJson";

const API_RECHERCHE_GALLICA = "http://localhost:3001/api/SRU";

const GallicaSearch = ({ query }) => {

    // const [searchTerm, setSearchTerm] = useState("");
    // const [url, setUrl] = useState();

    const fetchDocuments = async () => {
        console.log("fetchDocuments");
        const params = {
            operation: "searchRetrieve",
            version: "1.2",
            query: query//`(dc.title any "${searchTerm}")`,
        };
        const url = `${API_RECHERCHE_GALLICA}?${new URLSearchParams(params).toString()}`;
        const response = await axios.get(url, {
            headers: {
              'Content-Type': 'application/xml;charset=UTF-8',
              'Access-Control-Allow-Origin': '*'
            },
        });
        const parser = new DOMParser();
        const records = xmlToJson(parser.parseFromString(response.data, "text/xml"));
        console.log(records);
        
        return records;
    };

    const { data, isLoading, error } = useQuery({queryKey: ["fetchDocuments", query], queryFn: fetchDocuments, enabled: !!query});

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     const params = {
    //         operation: "searchRetrieve",
    //         version: "1.2",
    //         query: `(dc.title any "${searchTerm}")`,
    //     };
    //     console.log(`${API_RECHERCHE_GALLICA}?${new URLSearchParams(params).toString()}`);
    //     setUrl(`${API_RECHERCHE_GALLICA}?${new URLSearchParams(params).toString()}`);
        
    //     // setUrl(`http://localhost:3001/api/SRU?operation=searchRetrieve&version=1.2&query=dc.title%20any%20%22Hugo%22`);
    // };

  return (
    <div className="container mt-4">
        {/* <form className="p-4 shadow text-xl rounded-xl" onSubmit={handleSubmit}>
            <label className="">Titre</label>
            <input 
                className="border rounded-xl p-2 w-1/2 ml-2" 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <br/>
            <button 
                onClick={handleSubmit}
                disabled={isLoading || searchTerm === ''}
                type="button" 
                className="btn-primary"
            >
                {isLoading ? <>
                <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                Recherche en cours...
                </> : "Chercher"}
            </button>
        </form> */}

        <div className="mt-4">
            {isLoading && <div>Chargement des données...</div>}
            {error && <div>Erreur : {error.message}</div>}
            {data && (
                <div>
                    <h2>Résultats :</h2>
                    <ul className="divide-y divide-gray-100">
                        {data.map((record) => (
                            <li key={record.identifier} className="flex justify-between gap-x-6 py-5">
                                <GallicaSearchItem record={record}/>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </div>
  )
};

const GallicaSearchItem = ({ record }) => {
    const [manifestExists, setManifestExists] = useState(false);

    const regex = /ark:\/\d+\/[a-zA-Z0-9]+/;
    const match = record.identifier.match(regex);
    let ark = "";
    if(match) {
        ark = match[0];
    }
    const urlManifest = `https://gallica.bnf.fr/iiif/${ark}/manifest.json`

    const checkLinkExists = async () => {
        const response = await axios.head(urlManifest);
        setManifestExists(response.status >= 200 && response.status < 300);
        return response.status >= 200 && response.status < 300;
    }

    const { data, refetch, isLoading, error } = useQuery({queryKey: ["checkLinkExists", urlManifest], queryFn: checkLinkExists, enabled: false});

    const handleClickLink = (event) => {
        // event.preventDefault();
        refetch();
    };
    
  return (
    <div className="flex min-w-0 gap-x-4">
        <img className="w-20 flex-none rounded-lg bg-gray-50" src={record.thumbnail}></img>
        <div className="min-w-0 flex-auto text-left ">
            <h4>{record.title}</h4>
            <p>
                <a className="text-lg underline text-blue-500" href={urlManifest} target="_blank" onClick={handleClickLink}>manifest.json</a>
                {manifestExists ? (
                    <span>🟢</span>
                ) : (
                    <span>🔴</span>
                )}
            </p>
        </div>
    </div>
  )
}

export default GallicaSearch;