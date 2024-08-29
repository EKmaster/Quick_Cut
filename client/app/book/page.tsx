'use client'
import React from 'react'
import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCsrfToken } from '../utils/csrfToken'
import styles from '../../styles/form.module.css'
import WithAuthorization from '../utils/withAuthorization'
import MapComponent from '../components/mapComponent'
import DropdownMenu from '../components/form/dropdownMenu'

function Book() {
    const router = useRouter()

    const [emptyFields, setEmptyFields] = useState({
        haircutDetails: false,
        timing: false,
        location: false,
    });

    const [isBeardTrimSelected, setIsBeardTrimSelected] = useState(false);
    const [price, setPrice] = useState(40)

    // this variable can be either new or default, new means the user chooses a location, default means a default location is set for the uesr
    const [locationSelectionType, setLocationSelectionType] = useState("new")
    const [defaultLocation, setDefaultLocation] = useState({ googlePlacesID: null, additionalDetails: null })
    const [warnNoDefaultLocationSet, SetWarnNoDefaultLocationSet] = useState(false)
    const [selectedLocationID, setSelectedLocationID] = useState<any>(null)
    const [selectedServiceID, setSelectedServiceID] = useState<any>(null)

    const servicesList = [
        { description: "Haircut - $20", id: "haircut" },
        { description: "Buzz - $15", id: "buzz" },
        { description: "Fade - $25", id: "fade" },
        { description: "Shave - $7", id: "shave" }
    ]
    const servicePrices = {
        haircut: 20,
        buzz: 15,
        fade: 25,
        shave: 7
    }
    const beardTrimPrice = 15

    // loading up default location if the user has it
    useEffect(() => {
        const loadDefaultLocation = async () => {
            try {
                const response = await fetch("/api/settings/defaultlocation", {
                    method: "GET",
                    credentials: "include"

                })
                if (response.ok) {
                    const data = await response.json()
                    if (data.locationID === null){
                        SetWarnNoDefaultLocationSet(true)
                    }
                    const loadedDefaultLocation = {
                        googlePlacesID: data.locationID,
                        additionalDetails: data.additionalDetails
                    }
                    setDefaultLocation(loadedDefaultLocation)
                } else {
                    throw new Error("Failed to fetch default location")
                }
            } catch (err) {
                // TODO: display something here if there is error getting default location
            }
        }
        loadDefaultLocation()
    }, [])

    useEffect(() => {
        let newPrice = 0
        if (selectedServiceID !== null) {
            newPrice += servicePrices[selectedServiceID as keyof typeof servicePrices]
        }
        if (isBeardTrimSelected) {
            newPrice += beardTrimPrice
        }
        setPrice(newPrice)
    }, [selectedServiceID, isBeardTrimSelected])

    function handleServiceChange(description: string, id: string | number) {
        setSelectedServiceID(id)
    }

    function handleBeardChange(event: React.ChangeEvent<HTMLInputElement>) {
        setIsBeardTrimSelected(event.target.checked)
    }

    function handleSelectionTypeChange(id: string) {
        setLocationSelectionType(id)
    }

    function getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    function getMaxDateTime() {
        const now = new Date();
        const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const year = oneWeekFromNow.getFullYear();
        const month = String(oneWeekFromNow.getMonth() + 1).padStart(2, '0');
        const day = String(oneWeekFromNow.getDate()).padStart(2, '0');
        const hours = String(oneWeekFromNow.getHours()).padStart(2, '0');
        const minutes = String(oneWeekFromNow.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    function validateInputs(haircutDetails: string, timing: string, location: any) {
        setEmptyFields({
            haircutDetails: haircutDetails.trim() === '',
            timing: timing.trim() === '',
            location: location === null
        });
        return haircutDetails.trim() !== '' && timing.trim() !== '' && location !== null;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        const data = {
            service: selectedServiceID,
            beard: isBeardTrimSelected,
            haircutDetails: formData.get('haircutDetails'),
            timing: formData.get('timing'),
            locationGooglePlacesID: selectedLocationID,
            locationDetails: formData.get('locationDetails')
        };

        if (!validateInputs(String(data.haircutDetails), String(data.timing), selectedLocationID)) {
            return;
        }

        const csrfToken = await getCsrfToken();
        const response = await fetch('/api/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });

        if (response.ok) {
            router.push('/');
        } else {
            alert('Error booking appointment');
        }
    }


    return (
        <WithAuthorization verificationRequired={true}>
            <div className={styles.container}>
                <form className={styles.form} onSubmit={handleSubmit}>

                    {/*Providing service*/}
                    <div className={styles.flexColumn}>
                        <label>Service</label>
                    </div>

                    <DropdownMenu optionsList={servicesList} onSelect={(description, id) => {
                        handleServiceChange(description, id)
                    }} />

                    <div className={styles.flexColumn}>
                        <label>Additional Requests</label>
                    </div>
                    <div className={styles.box}>
                        <input type="checkbox" id="beard" name="beard" value="beard" className={styles.checkbox} onChange={handleBeardChange}></input>
                        Beard Trim - $15
                    </div>

                    {/*Providing beard cut option*/}
                    <div className={styles.flexColumn}>
                        <label>Haircut Details</label>
                    </div>
                    <div className={styles.inputForm}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
                        <input name="haircutDetails" placeholder="Describe your haircut" className={styles.input} type="string" />
                    </div>

                    {/*Timing Selection*/}
                    <div className={styles.flexColumn}>
                        <label>Timing</label>
                    </div>
                    <div className={styles.inputForm}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline></svg>
                        <input name="timing" className={styles.input} type="datetime-local" min={getCurrentDateTime()} max={getMaxDateTime()} />
                    </div>

                    {/* Location Selection */}
                    <div className={styles.flexColumn}>
                        <label>Location</label>
                    </div>

                    <DropdownMenu
                        optionsList={[{ description: "Use Default", id: "default" }, { description: "Select New", id: "new" }]}
                        onSelect={(description, id) => {
                            handleSelectionTypeChange(id as string)
                        }
                        }
                        defaultSelection={{ description: "Select New", id: "new" }}
                    />
                    {(warnNoDefaultLocationSet && locationSelectionType === "default") ? (
                        <p>You do not have a default location set. You can set one up in settings.</p>
                    ) : null}
                    {/*Google maps API integration*/}
                    <MapComponent
                        disableInput={locationSelectionType === "new" ? false : true}
                        defaultLocationPlaceID={locationSelectionType === "new" ? null : defaultLocation.googlePlacesID}
                        inputToForm={setSelectedLocationID} />

                    {/*Additional details for arriving at location*/}
                    <div className={styles.flexColumn}>
                        <label>Additional Location Details (optional)</label>
                    </div>
                    <div className={styles.inputForm}>
                        <svg xmlns="http://www.w3.org/2000/svg" width='24' height='24' viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z" /></svg>

                        <input
                            name="locationDetails"
                            placeholder="Describe any additional details that may help your barber get to your location"
                            defaultValue={locationSelectionType === "new" ? "" :
                                defaultLocation.additionalDetails !== null ? defaultLocation.additionalDetails : ""}
                            readOnly={locationSelectionType === "new" ? false : true}
                            className={styles.input} type="string" />
                    </div>

                    {emptyFields.haircutDetails && <p className={styles.pWarning}>Haircut details are required</p>}
                    {emptyFields.timing && <p className={styles.pWarning}>Timing is required</p>}
                    {emptyFields.location && <p className={styles.pWarning}>Location is required</p>}
                    <div className={styles.flexColumn}>
                        <label>Price: ${price}</label>
                    </div>

                    <button className={styles.buttonSubmit} type="submit">Book</button>
                </form>
            </div>
        </WithAuthorization>
    )
}

export default Book