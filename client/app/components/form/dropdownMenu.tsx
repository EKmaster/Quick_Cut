import React, { useState } from 'react'
import styles from '../../../styles/form.module.css'


interface DropdownMenuProps {
    optionsList: {
        description: string
        id: number | string
    }[];
    onSelect: (description: string, id: string | number) => any
}

function DropdownMenu({ optionsList, onSelect }: DropdownMenuProps) {
    const [inputAvailabe, setInputAvailable] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    async function selectionOptionHandler(description: string, id: string | number) {
        setDropdownOpen(false)
        const element = document.getElementById("selected-option")
        element!.innerHTML = description
        await onSelect(description, id)
    }

    return (
        <div style={{ position: "relative" }}>
            <button
                type="button"
                className={styles.inputForm}
                style={{
                    borderRadius: (dropdownOpen) ? "10px 10px 0 0" : "10px",
                    width: "100%"
                }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={"#000000"} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>

                <div id="selected-option" style={{
                    marginLeft: "10px",
                    width: "100%",
                    textAlign: "left"
                }}>
                    No selection
                </div>
                {
                    dropdownOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={"#000000"} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={"#000000"} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                    )
                }
            </button>

            {
                !dropdownOpen ? (
                    null
                ) : (dropdownOpen && optionsList.length !== 0) ? (
                    <ul className={styles.dropdownList}>
                        {
                            optionsList.map(({ description, id }) => (
                                <li id="dropdown-item" key={id}>
                                    <button
                                        type="button"
                                        style={{
                                            minWidth: "100%",
                                            width: "auto",
                                            textAlign: "left"
                                        }}
                                        onClick={async () => {
                                            await selectionOptionHandler(description, id)
                                        }}>
                                        {description}
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                ) : (
                    <ul className={styles.dropdownList}>
                        {
                            optionsList.map(({ description, id }) => (
                                <li id="dropdown-item" key={id}>
                                    No options available
                                </li>
                            ))
                        }
                    </ul>
                )
            }

        </div>
    )
}

export default DropdownMenu