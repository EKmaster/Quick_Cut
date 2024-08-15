import React, { useEffect, useState } from 'react'
import styles from '../../styles/login.module.css'

interface DropdownSearchProps {
    onSearchChange: (value: string) => any;
    optionsList: {
        description: string
        id: string | number
    }[];
    selectOption: (description: string, id: (string | number)) => any;
}

function DropdownSearch({ onSearchChange, optionsList, selectOption }: DropdownSearchProps) {
    const [inputAvailabe, setInputAvailable] = useState(false)
    const [nullSelection, setNullSelection] = useState(true)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    useEffect(() => {
        setInputAvailable(!!document.getElementById('dropdown-search'));
    }, [])

    useEffect(() => {
        if (document.getElementById("dropdown-item")){
            setDropdownOpen(true)
        }else{
            setDropdownOpen(false)
        }
    })

    async function selectOptionHandler(description: string, id: string | number) {
        const element = document.getElementById("dropdown-search") as HTMLInputElement
        element.value = description
        setNullSelection(false)
        // calling function from argumemnt
        await selectOption(description, id)
    }

    return (
        <div style={{ position: "relative" }}>
            <div className={styles.inputForm} style={{
                borderRadius: dropdownOpen ? "10px 10px 0 0" : "10px"
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width='24' height='24' viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z" /></svg>
                <input
                    id="dropdown-search"
                    name="search"
                    placeholder="Search"
                    className={styles.input} type="string"
                    onChange={(e) => {
                        if (!nullSelection){
                            setNullSelection(true)
                        }
                        onSearchChange(e.target.value)
                    }}>
                </input>
            </div>


            {
                nullSelection && optionsList.length  !== 0 ? (
                    <ul className={styles.dropdownList}>
                        {
                            optionsList.map(({ description, id }) => (
                                <li id="dropdown-item" key={id}>
                                    <button type="button" onClick={async () => {
                                        await selectOptionHandler(description, id)
                                    }}>
                                        {description}
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                ) : (nullSelection && optionsList.length === 0 && (inputAvailabe && (document.getElementById("dropdown-search") as HTMLInputElement)!.value !== "")) ? (
                    <ul className={styles.dropdownList}>
                        <li>No results found</li>
                    </ul>
                ) : (null)
            }

        </div>
    )
}

export default DropdownSearch