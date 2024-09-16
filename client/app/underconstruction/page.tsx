import React from 'react'
import styles from "../../styles/form.module.css"

const PageUnderConstruction = () => {
    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <div className={styles.flexColumn}>
                    <label>Under Construction</label>
                </div>
                <p>Sorry, Quick Cut is still in development so this page is not yet available :(
                </p>
            </div>
        </div>
    )
}

export default PageUnderConstruction