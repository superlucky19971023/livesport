import React, { useState } from "react";
import './CountryCard.css';
import EachCountryCard from "../EachCountryCard";
interface CustomDropdownProps {
    label: string,
    count: number,
    competitions: any[],
    competitions_name: string,
    flag: string
}
const CountryCard: React.FC<CustomDropdownProps> = ({ label, flag, count, competitions, competitions_name }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="counryCard-contianer">
            <div className="countryCard-header" onClick={toggleDropdown} aria-expanded={isOpen}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={`flag/flag_${flag.toLowerCase()}.png`} width={"16px"} height={"16px"} style={{ marginLeft: "5px", marginRight: "5px" }}></img>
                    <span className="countryCard-header-label">
                        {`${label}   ${count}`}
                    </span>
                </div>
                <svg
                    className={`chevron-icon ${isOpen ? "rotated" : ""}`}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

            </div>
            {isOpen && competitions.length > 0 && (
                <div className="countryCard-content">
                    <div className="countryCard-title">
                        {competitions_name}
                    </div>
                    <div style={{ width: "100%" }}>
                        {
                            competitions.map((value, index) => {
                                return <EachCountryCard data={value} key={index + ""} />
                            })
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default CountryCard;