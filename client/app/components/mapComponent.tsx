import React, { useState, useCallback, useEffect, useRef } from 'react';
import styles from '../../styles/login.module.css'


function MapComponent({ inputToForm }: { inputToForm: (value: any) => void }) {
    const [inputAvailabe, setInputAvailable] = useState(false)

    let mapRef = useRef<any>(null)

    let autocompleteTokenRef = useRef<any>(null)
    let CreateAutocompleteSessionTokenRef = useRef<any>(null)
    let AutocompleteSuggestionsRef = useRef<any>(null)
    let [autocompleteList, setAutocompleteList] = useState([])

    let PlaceRef = useRef<any>(null)
    let AdvancedMarkerElementRef = useRef<any>(null)
    let selectionMarkerRef = useRef<any>(null)


    useEffect(() => {
        setInputAvailable(!!document.getElementById('location-search'));

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCOQCgLuH--tP2bcugABVQagBhS8QE1EfY&loading=async&callback=initMap`;
        script.async = true;
        document.head.appendChild(script);

        async function initMap(): Promise<void> {
            const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
            const { Place, AutocompleteSessionToken, AutocompleteSuggestion } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

            autocompleteTokenRef.current = new AutocompleteSessionToken();
            CreateAutocompleteSessionTokenRef.current = AutocompleteSessionToken
            AutocompleteSuggestionsRef.current = AutocompleteSuggestion

            PlaceRef.current = Place
            AdvancedMarkerElementRef.current = AdvancedMarkerElement

            // creating map
            mapRef.current = new Map(document.getElementById('map') as HTMLElement, {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
                mapId: 'DEMO_MAP_ID'
            });
        };
        (window as any).initMap = initMap;
    }, []);

    async function updateAutocomplete(text: string) {
        if (text === '') {
            setAutocompleteList([])
        } else {
            if (!autocompleteTokenRef.current) {
                autocompleteTokenRef.current = new CreateAutocompleteSessionTokenRef.current()
            }
            let request = {
                input: text,
                language: "en-US",
                sessionToken: autocompleteTokenRef.current
            };
            const { suggestions } = await AutocompleteSuggestionsRef.current.fetchAutocompleteSuggestions(request);
            setAutocompleteList(
                suggestions.map((suggestion: any) => (
                    { description: suggestion.placePrediction.text.toString(), id: suggestion.placePrediction.placeId.toString() }
                )))
        }
    }

    async function selectLocation(description: string, place_id: string) {
        autocompleteTokenRef.current = null //discard token
        // auto complete to this on the search input
        const element = document.getElementById('location-search') as HTMLInputElement
        element.value = description
        // set a marker for this location on the map
        const place = new PlaceRef.current({ id: place_id })
        await place.fetchFields({ fields: ["location"] })
        if (selectionMarkerRef.current) {
            selectionMarkerRef.current.position = place.location
        } else {
            selectionMarkerRef.current = new AdvancedMarkerElementRef.current({
                map: mapRef.current,
                position: place.location,
                title: "Selected Location"
            })
        }
        mapRef.current.setCenter(place.location)// move map to view this new location
        inputToForm(place_id) // update form input info
    }

    return (
        <>

            <div id="map" style={{ width: '100%', height: '500px' }} />

            <div className={styles.inputForm}>
                <svg xmlns="http://www.w3.org/2000/svg" width='24' height='24' viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z" /></svg>


                <input
                    id="location-search"
                    name="location"
                    placeholder="Search"
                    className={styles.input} type="string"
                    onChange={(e) => updateAutocomplete(e.target.value)}
                />
            </div>
            {autocompleteList.length !== 0 ? (
                <ul className={styles.dropdownList}>
                    {
                        autocompleteList.map(({ description, id }) => (
                            <li key={id}>
                                <button type="button" onClick={async () => await selectLocation(description, id)}>{description}</button>
                            </li>
                        ))
                    }
                </ul>
            ) : (inputAvailabe && !document.getElementById("location-search")) ? (
                (null)
            ) : inputAvailabe && (document.getElementById("location-search") as HTMLInputElement).value !== '' ? (
                <ul className={styles.dropdownList}>
                {
                    <li>No results found</li>
                }
            </ul>
            ) : (null)
            }

        </>
    );
}

export default MapComponent