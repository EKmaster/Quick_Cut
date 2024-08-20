import React, { useState, useCallback, useEffect, useRef } from 'react';
import styles from '../../styles/form.module.css'
import DropdownSearch from './form/dropdownSearch';

function MapComponent({ defaultLocationPlaceID = null, disableInput = false, inputToForm }: {
    defaultLocationPlaceID?: string | null,
    disableInput?: boolean,
    inputToForm: (value: any) => void
}) {
    const autocompleteTimeoutRef = useRef<any>(null)

    let mapRef = useRef<any>(null)

    let autocompleteTokenRef = useRef<any>(null)
    let CreateAutocompleteSessionTokenRef = useRef<any>(null)
    let AutocompleteSuggestionsRef = useRef<any>(null)
    let [autocompleteList, setAutocompleteList] = useState([])

    let PlaceRef = useRef<any>(null)
    let AdvancedMarkerElementRef = useRef<any>(null)
    let selectionMarkerRef = useRef<any>(null)

    const [errorLoadingLocation, setErrorLoadingLocation] = useState(false)

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCOQCgLuH--tP2bcugABVQagBhS8QE1EfY&loading=async&callback=initMap`;
        script.async = true;
        document.head.appendChild(script);

        // initializing the map
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

    useEffect(() => {
        // loading in default location to map if applicable
        if (defaultLocationPlaceID !== null) {
            selectLocation("", defaultLocationPlaceID)
        }
    }, [defaultLocationPlaceID])

    async function updateAutocomplete(text: string) {

        if (autocompleteTimeoutRef.current !== null) {
            clearTimeout(autocompleteTimeoutRef.current)
        }

        autocompleteTimeoutRef.current = setTimeout(async () => {
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
            autocompleteTimeoutRef.current = null
        }, 1000)
    }

    async function selectLocation(description: string, place_id: string | number
    ) {
        autocompleteTokenRef.current = null //discard auto complete session token
        setAutocompleteList([]) //emptying the auto complete list, effectively closing the drop down
        // set a marker for this location on the map
        try{
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
            setErrorLoadingLocation(false)
        }catch(err){
            setErrorLoadingLocation(true)
        }
    }

    return (
        <>
            <div id="map" style={{ width: '100%', height: '500px', borderRadius: "10px" }} />
            {errorLoadingLocation ? <p className={styles.pWarning}>Error loading selected location</p> : null}
            {
                disableInput ? (null) :
                    <DropdownSearch onSearchChange={updateAutocomplete} optionsList={autocompleteList} selectOption={selectLocation} />
            }

        </>
    );
}

export default MapComponent